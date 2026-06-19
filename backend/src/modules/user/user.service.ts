import mongoose from 'mongoose';
import User from './user.model';
import Store from '../store/store.model';
import Rating from '../rating/rating.model';
import { UserRole } from '../../types';
import bcrypt from 'bcryptjs';

export class UserService {
  static async getAllUsers(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: string = 'ASC',
    filters: any = {}
  ) {
    const offset = (page - 1) * limit;
    const where: any = {};

    if (filters.name) {
      where.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.email) {
      where.email = { $regex: filters.email, $options: 'i' };
    }
    if (filters.address) {
      where.address = { $regex: filters.address, $options: 'i' };
    }
    if (filters.role) {
      where.role = filters.role;
    }

    const total = await User.countDocuments(where);
    const users = await User.find(where)
      .select('-password')
      .sort({ [sortBy]: sortOrder === 'ASC' ? 1 : -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const storeOwners = users.filter((u: any) => u.role === UserRole.STORE_OWNER);
    const ratingsMap: Record<string, number[]> = {};
    if (storeOwners.length > 0) {
      const stores = await Store.find({ ownerId: { $in: storeOwners.map((u: any) => u._id) } }).lean();
      if (stores.length > 0) {
        const ratings = await Rating.find({ storeId: { $in: stores.map((s: any) => s._id) } }).lean();
        for (const r of ratings) {
          const store = stores.find((s: any) => s._id.toString() === r.storeId.toString());
          if (store) {
            const ownerId = store.ownerId.toString();
            if (!ratingsMap[ownerId]) ratingsMap[ownerId] = [];
            ratingsMap[ownerId].push(r.rating);
          }
        }
      }
    }

    const mapped = users.map((u: any) => {
      const { _id, ...rest } = u;
      const avg = ratingsMap[_id.toString()] || null;
      const averageRating = avg && avg.length > 0
        ? Math.round((avg.reduce((s: number, v: number) => s + v, 0) / avg.length) * 10) / 10
        : null;
      return { id: _id.toString(), ...rest, averageRating };
    });
    return {
      users: mapped,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getUserById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('User not found');
    }

    const user = await User.findById(id).select('-password').lean();
    if (!user) {
      throw new Error('User not found');
    }

    let avgRating = null;
    if (user.role === UserRole.STORE_OWNER) {
      const store = await Store.findOne({ ownerId: user._id }).lean();
      if (store) {
        const ratings = await Rating.find({ storeId: store._id }).lean();
        if (ratings.length > 0) {
          avgRating =
            ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
        }
      }
    }

    return { ...user, averageRating: avgRating };
  }

  static async createUser(
    name: string,
    email: string,
    password: string,
    address: string,
    role: UserRole
  ) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      role,
    });

    const userObj = user.toObject();
    const { password: _pw, ...rest } = userObj;
    return rest as any;
  }

  static async updateUser(
    id: string,
    data: Partial<{ name: string; email: string; address: string; role: UserRole }>
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('User not found');
    }

    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: 'query',
    }).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user.toObject();
  }

  static async deleteUser(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('User not found');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  static async getUserStats() {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    const result = await Rating.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const avgRating = result.length > 0 ? result[0].avgRating : 0;

    return {
      totalUsers,
      totalStores,
      totalRatings,
      avgRating,
    };
  }
}

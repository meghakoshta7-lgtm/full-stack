import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import User from '../user/user.model';
import { config } from '../../config/database';
import { EmailService } from '../../services/email.service';
import { UserRole, IJwtPayload } from '../../types';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async register(
    name: string,
    email: string,
    password: string,
    address: string,
    role: UserRole = UserRole.USER
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

    return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  }

  static async login(email: string, password: string) {
    let user = await User.findOne({ email });

    if (!user) {
      const domain = email.split('@')[1] || '';
      const role = domain.includes('owner') ? UserRole.STORE_OWNER : UserRole.USER;
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        address: '.',
        role,
      });
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
    }

    const tokenPayload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload as object, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as jwt.SignOptions);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }

  static async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password updated successfully' };
  }

  static async forgotPassword(email: string) {
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(Math.random().toString(), 10);
      const domain = email.split('@')[1] || '';
      const role = domain.includes('owner') ? UserRole.STORE_OWNER : UserRole.USER;
      user = await User.create({
        name: email.split('@')[0],
        email,
        password: hashedPassword,
        address: '.',
        role,
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    user.resetToken = hashedToken;
    user.resetTokenExpiry = expiry;
    await user.save();

    console.log('[ForgotPassword] About to send email to:', email, 'token:', rawToken.substring(0, 8) + '...');
    try {
      await EmailService.sendPasswordResetEmail(email, rawToken);
      console.log('[ForgotPassword] Email sent successfully to:', email);
    } catch (err: any) {
      console.log('[ForgotPassword] Email send FAILED:', err.message);
      throw err;
    }

    return { message: 'If that email exists, a reset link has been sent' };
  }

  static async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  static async googleLogin(credential: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token');
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const domain = email.split('@')[1] || '';
      const role = domain.includes('owner') ? UserRole.STORE_OWNER : UserRole.USER;
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: await bcrypt.hash(googleId, 10),
        address: '.',
        role,
      });
    }

    const tokenPayload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload as object, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as jwt.SignOptions);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  }
}

import api from '../../../services/api';
import { AuthResponse, LoginCredentials, RegisterData } from '../types';

export const authApi = {
  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', credentials).then(r => r.data);
  },
  googleLogin(credential: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/google', { credential }).then(r => r.data);
  },
  register(data: RegisterData): Promise<any> {
    return api.post('/auth/register', data).then(r => r.data);
  },
  changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return api.put('/auth/change-password', { oldPassword, newPassword }).then(r => r.data);
  },
  forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return api.post('/auth/forgot-password', { email }).then(r => r.data);
  },
  resetPassword(token: string, password: string): Promise<{ message: string }> {
    return api.post('/auth/reset-password', { token, password }).then(r => r.data);
  },
};

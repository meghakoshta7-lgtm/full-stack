import { Router, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginValidation, userValidation } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { AuthRequest } from '../../types';

const router = Router();

router.post('/register', userValidation, async (req: Request, res: Response) => {
  try {
    const { name, email, password, address } = req.body;
    const user = await AuthService.register(name, email, password, address);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', loginValidation, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Attempt:', { email, passwordLength: password?.length });
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    console.log('[LOGIN] Error:', error.message);
    res.status(401).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log('[ForgotPassword] Request for:', email);
    const result = await AuthService.forgotPassword(email);
    console.log('[ForgotPassword] Success for:', email);
    res.json(result);
  } catch (error: any) {
    console.log('[ForgotPassword] Error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const result = await AuthService.resetPassword(token, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.put(
  '/change-password',
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(
        req.user!.userId,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const result = await AuthService.googleLogin(credential);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Google authentication failed' });
  }
});

export default router;

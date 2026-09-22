import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const RegisterOrgSchema = z.object({
  org_name: z.string().min(2, 'Organization name must be at least 2 characters'),
  org_domain: z.string().min(3, 'Domain must be at least 3 characters'),
  industry: z.string().optional(),
  size_range: z.string().optional(),
  admin_name: z.string().min(2, 'Administrator name is required'),
  admin_email: z.string().email('Invalid administrator email address'),
  admin_password: z.string().min(8, 'Password must be at least 8 characters')
});

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Register Organization + Admin
router.post('/register-org', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = RegisterOrgSchema.parse(req.body);
    const result = await AuthService.registerOrganization(validated);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const result = await AuthService.login({
      ...validated,
      ip_address: ip,
      user_agent: userAgent
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get Current User Profile
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.json({
      user: req.user
    });
  } catch (err) {
    next(err);
  }
});

// Employee Requests Password Reset
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Please provide your registered corporate email address.' });
      return;
    }
    const result = await AuthService.requestPasswordReset(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Admin Lists Pending Password Reset Requests
router.get('/password-requests', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const requests = await AuthService.listPasswordRequests(req.user!.organization_id!);
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// Admin Sets / Resets Employee Password
router.post('/admin-reset-password', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { request_id, user_id, email, new_password } = req.body;
    if (!new_password || new_password.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      return;
    }
    const result = await AuthService.adminResetPassword(req.user!.organization_id!, {
      request_id,
      user_id,
      email,
      new_password
    }, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

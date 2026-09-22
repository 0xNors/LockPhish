import { Router, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Organization Overview Analytics
router.get('/overview', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const overview = await AnalyticsService.getOrganizationOverview(req.user!.organization_id!);
    res.json(overview);
  } catch (err) {
    next(err);
  }
});

// Channel Performance Analytics
router.get('/channels', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const channels = await AnalyticsService.getChannelAnalytics(req.user!.organization_id!);
    res.json(channels);
  } catch (err) {
    next(err);
  }
});

// Department Risk Matrix Analytics
router.get('/departments', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const departments = await AnalyticsService.getDepartmentAnalytics(req.user!.organization_id!);
    res.json(departments);
  } catch (err) {
    next(err);
  }
});

// 30/90-day Risk Trends
router.get('/trends', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
    const trends = await AnalyticsService.getRiskTrends(req.user!.organization_id!, days);
    res.json(trends);
  } catch (err) {
    next(err);
  }
});

export default router;

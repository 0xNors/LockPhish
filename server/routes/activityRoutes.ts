import { Router, Response, NextFunction } from 'express';
import { ActivityService } from '../services/activityService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Live Unified Activity Stream
router.get('/stream', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { category, employee_id, severity, search, limit, offset } = req.query;

    const result = await ActivityService.getActivityStream(req.user!.organization_id!, {
      category: category as string,
      employee_id: employee_id as string,
      severity: severity as string,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Live Activity Dashboard Summary Stats
router.get('/stats', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await ActivityService.getActivityStats(req.user!.organization_id!);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;

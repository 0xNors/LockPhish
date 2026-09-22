import { Router, Response, NextFunction } from 'express';
import { AuditService } from '../services/auditService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get Audit Logs
router.get('/logs', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { action, resource, search, limit, offset } = req.query;
    const orgId = req.user!.role === 'SUPER_ADMIN' ? undefined : req.user!.organization_id;

    const result = await AuditService.getLogs({
      organization_id: orgId,
      action: action as string,
      resource: resource as string,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

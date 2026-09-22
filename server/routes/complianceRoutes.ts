import { Router, Response, NextFunction } from 'express';
import { ComplianceService } from '../services/complianceService.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get Compliance Status & Evidence Scores
router.get('/status', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const status = await ComplianceService.getComplianceStatus(req.user!.organization_id!);
    res.json(status);
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Response, NextFunction } from 'express';
import { RiskEngine } from '../services/riskEngine.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Organization Risk Overview
router.get('/organization', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const risk = await RiskEngine.getOrganizationRisk(req.user!.organization_id!);
    res.json(risk);
  } catch (err) {
    next(err);
  }
});

// Recalculate Risk for specific employee
router.post('/recalculate', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employee_id } = req.body;
    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required.' });
      return;
    }
    const result = await RiskEngine.recalculateEmployeeRisk(req.user!.organization_id!, employee_id, 'MANUAL_ADMIN_RECALC');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

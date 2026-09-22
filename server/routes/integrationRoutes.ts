import { Router, Response, NextFunction } from 'express';
import { MSSPService, InsuranceEvidenceService, EmailSecurityAdapter } from '../services/integrations/integrationServices.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// MSSP Managed Tenants (Super Admin / MSSP role)
router.get('/mssp/tenants', authenticate, requireRole(['SUPER_ADMIN', 'ORG_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const tenants = await MSSPService.listManagedTenants();
    res.json(tenants);
  } catch (err) {
    next(err);
  }
});

// Insurance Human-Risk Underwriting Package
router.get('/insurance/underwriting', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const pkg = await InsuranceEvidenceService.generateUnderwritingPackage(req.user!.organization_id!);
    res.json(pkg);
  } catch (err) {
    next(err);
  }
});

// Email Security Provider Connection Test
router.post('/email-security/test', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await EmailSecurityAdapter.testConnection(req.user!.organization_id!, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

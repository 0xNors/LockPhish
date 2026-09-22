import { Router, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

const router = Router();

// Export CSV
router.get('/csv', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const type = (req.query.type as string)?.toUpperCase() || 'SIMULATIONS';
    if (!['EMPLOYEES', 'CAMPAIGNS', 'SIMULATIONS', 'TRAINING', 'AUDIT_LOGS'].includes(type)) {
      res.status(400).json({ error: 'Invalid CSV export type.' });
      return;
    }

    const csvData = await ReportService.generateCSV(req.user!.organization_id!, type as any);

    await AuditService.log({
      organization_id: req.user!.organization_id,
      actor_id: req.user!.id,
      actor_name: req.user!.full_name,
      actor_role: req.user!.role,
      action: 'CSV_REPORT_GENERATED',
      resource: 'REPORT',
      details: { export_type: type }
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=lockphish_${type.toLowerCase()}_${Date.now()}.csv`);
    res.send(csvData);
  } catch (err) {
    next(err);
  }
});

// Export PDF Executive Report
router.get('/pdf', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await ReportService.generatePDF(req.user!.organization_id!);

    await AuditService.log({
      organization_id: req.user!.organization_id,
      actor_id: req.user!.id,
      actor_name: req.user!.full_name,
      actor_role: req.user!.role,
      action: 'PDF_REPORT_GENERATED',
      resource: 'REPORT',
      details: { report_name: 'Executive Human Risk & Compliance Assessment' }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=lockphish_executive_report_${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

export default router;

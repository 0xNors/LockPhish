import { Router, Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaignService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const CreateCampaignSchema = z.object({
  name: z.string().min(2, 'Campaign name must be at least 2 characters'),
  description: z.string().optional(),
  channel: z.enum(['EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE']),
  target_type: z.enum(['ALL', 'DEPARTMENT', 'GROUP', 'CUSTOM']),
  target_filter: z.object({
    department_ids: z.array(z.string()).optional(),
    group_ids: z.array(z.string()).optional(),
    employee_ids: z.array(z.string()).optional()
  }).optional(),
  scenario_ids: z.array(z.string()).min(1, 'Please select at least one scenario'),
  difficulty: z.string().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  training_auto_assign: z.boolean().optional(),
  risk_policy: z.record(z.any()).optional()
});

// List campaigns
router.get('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, channel, limit, offset } = req.query;
    const campaigns = await CampaignService.listCampaigns(req.user!.organization_id!, {
      status: status as string,
      channel: channel as string,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0
    });
    res.json(campaigns);
  } catch (err) {
    next(err);
  }
});

// Create campaign
router.post('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = CreateCampaignSchema.parse(req.body);
    const campaign = await CampaignService.createCampaign(req.user!.organization_id!, validated, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(campaign);
  } catch (err) {
    next(err);
  }
});

// Get campaign detail
router.get('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.getCampaignById(req.user!.organization_id!, id);
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Validate campaign pre-flight safety
router.post('/:id/validate', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const result = await CampaignService.validateCampaign(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Launch campaign
router.post('/:id/launch', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.launchCampaign(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Complete Campaign
router.post('/:id/complete', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.completeCampaign(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Pause campaign
router.post('/:id/pause', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.pauseCampaign(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Resume campaign
router.post('/:id/resume', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.resumeCampaign(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// EMERGENCY STOP (Kill Switch)
router.post('/:id/emergency-stop', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.emergencyStop(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Update / Edit campaign
router.put('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const campaign = await CampaignService.updateCampaign(req.user!.organization_id!, id, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(campaign);
  } catch (err) {
    next(err);
  }
});

// Delete campaign
router.delete('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const result = await CampaignService.deleteCampaign(req.user!.organization_id!, id, {
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

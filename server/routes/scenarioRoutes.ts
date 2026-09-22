import { Router, Response, NextFunction } from 'express';
import { ScenarioService } from '../services/scenarioService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// List Scenarios
router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { channel, category, difficulty, search } = req.query;
    const scenarios = await ScenarioService.listScenarios({
      organization_id: req.user?.organization_id || undefined,
      channel: channel as string,
      category: category as string,
      difficulty: difficulty as string,
      search: search as string
    });
    res.json(scenarios);
  } catch (err) {
    next(err);
  }
});

// Get Scenario by ID
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const scenario = await ScenarioService.getScenarioById(id);
    res.json(scenario);
  } catch (err) {
    next(err);
  }
});

// Create Custom Scenario
router.post('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const scenario = await ScenarioService.createScenario(req.user!.organization_id!, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(scenario);
  } catch (err) {
    next(err);
  }
});

// Delete Custom Scenario
router.delete('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const result = await ScenarioService.deleteScenario(req.user!.organization_id!, id, {
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

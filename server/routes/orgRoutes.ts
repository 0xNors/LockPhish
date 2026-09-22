import { Router, Response, NextFunction } from 'express';
import { OrganizationService } from '../services/organizationService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get Current Organization
router.get('/current', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.organization_id) {
      res.status(400).json({ error: 'User does not belong to an organization.' });
      return;
    }
    const org = await OrganizationService.getOrganization(req.user.organization_id);
    res.json(org);
  } catch (err) {
    next(err);
  }
});

// Update Organization Settings
router.put('/current', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const org = await OrganizationService.updateSettings(req.user!.organization_id!, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(org);
  } catch (err) {
    next(err);
  }
});

// Departments
router.get('/departments', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const depts = await OrganizationService.getDepartments(req.user!.organization_id!);
    res.json(depts);
  } catch (err) {
    next(err);
  }
});

router.post('/departments', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, manager_name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Department name is required.' });
      return;
    }
    const dept = await OrganizationService.createDepartment(req.user!.organization_id!, { name, description, manager_name }, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(dept);
  } catch (err) {
    next(err);
  }
});

router.put('/departments/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deptId = String(req.params.id);
    const dept = await OrganizationService.updateDepartment(req.user!.organization_id!, deptId, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(dept);
  } catch (err) {
    next(err);
  }
});

router.delete('/departments/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const deptId = String(req.params.id);
    const result = await OrganizationService.deleteDepartment(req.user!.organization_id!, deptId, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Groups
router.get('/groups', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const groups = await OrganizationService.getGroups(req.user!.organization_id!);
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

router.post('/groups', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Group name is required.' });
      return;
    }
    const group = await OrganizationService.createGroup(req.user!.organization_id!, { name, description }, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
});

export default router;

import { Router, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employeeService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const CreateEmployeeSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  department_id: z.string().optional(),
  job_title: z.string().optional(),
  phone_number: z.string().optional(),
  role: z.enum(['EMPLOYEE', 'TRAINER', 'CAMPAIGN_MANAGER', 'ORG_ADMIN']).optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional()
});

// List employees
router.get('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { department_id, status, risk_level, search, limit, offset } = req.query;
    const result = await EmployeeService.listEmployees(req.user!.organization_id!, {
      department_id: department_id as string,
      status: status as string,
      risk_level: risk_level as string,
      search: search as string,
      limit: limit ? parseInt(limit as string, 10) : 200,
      offset: offset ? parseInt(offset as string, 10) : 0
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Create employee
router.post('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = CreateEmployeeSchema.parse(req.body);
    const employee = await EmployeeService.createEmployee(req.user!.organization_id!, validated, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// Seed sample staff into department
router.post('/seed-department', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { department_id } = req.body;
    if (!department_id) {
      res.status(400).json({ error: 'Department ID is required.' });
      return;
    }
    const employees = await EmployeeService.seedSampleDepartmentEmployees(req.user!.organization_id!, department_id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json({ success: true, count: employees.length, employees });
  } catch (err) {
    next(err);
  }
});

// Get employee detail
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const empId = String(req.params.id);
    if (req.user!.role === 'EMPLOYEE' && req.user!.employee_id !== empId) {
      res.status(403).json({ error: 'Access denied. You can only view your own profile.', code: 'FORBIDDEN' });
      return;
    }

    const employee = await EmployeeService.getEmployeeDetail(req.user!.organization_id!, empId);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// Update employee
router.put('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const empId = String(req.params.id);
    const employee = await EmployeeService.updateEmployee(req.user!.organization_id!, empId, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// Permanently Delete employee
router.delete('/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const empId = String(req.params.id);
    const result = await EmployeeService.deleteEmployee(req.user!.organization_id!, empId, {
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

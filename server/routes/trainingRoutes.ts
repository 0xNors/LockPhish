import { Router, Response, NextFunction } from 'express';
import { TrainingService } from '../services/trainingService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// List Training Courses
router.get('/courses', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const courses = await TrainingService.listCourses(req.user!.organization_id!);
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

// Get Course Details
router.get('/courses/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const course = await TrainingService.getCourseById(id);
    res.json(course);
  } catch (err) {
    next(err);
  }
});

// Create Custom Training Course with Assessment (Admin Built)
router.post('/courses', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const course = await TrainingService.createCourse(req.user!.organization_id!, req.body, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
});

// Assign Course (Admin/Trainer)
router.post('/assign', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { course_id, target_type, target_id } = req.body;
    if (!course_id || !target_type) {
      res.status(400).json({ error: 'course_id and target_type are required.' });
      return;
    }
    const result = await TrainingService.assignCourse(req.user!.organization_id!, {
      course_id,
      target_type,
      target_id
    }, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// List all Organization Training Assignments (Admin / Trainer Management)
router.get('/assignments', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { status, course_id, limit } = req.query;
    const assignments = await TrainingService.listOrganizationAssignments(req.user!.organization_id!, {
      status: status as string,
      course_id: course_id as string,
      limit: limit ? parseInt(limit as string, 10) : 300
    });
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

// Delete Training Assignment
router.delete('/assignments/:id', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const result = await TrainingService.deleteAssignment(req.user!.organization_id!, id, {
      id: req.user!.id,
      name: req.user!.full_name,
      role: req.user!.role
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Employee Training Assignments
router.get('/my-assignments', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.json([]);
      return;
    }
    const assignments = await TrainingService.getEmployeeAssignments(employeeId);
    res.json(assignments);
  } catch (err) {
    next(err);
  }
});

// Update Assignment Progress
router.post('/assignments/:id/progress', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { progress_percent } = req.body;
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.status(400).json({ error: 'Employee context missing.' });
      return;
    }
    const result = await TrainingService.updateProgress(id, employeeId, progress_percent);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Submit Assessment Attempt
router.post('/assessments/submit', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { assessment_id, assignment_id, attempt_type, answers } = req.body;
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.status(400).json({ error: 'Employee context missing.' });
      return;
    }
    if (!assessment_id || !attempt_type || !answers) {
      res.status(400).json({ error: 'assessment_id, attempt_type, and answers are required.' });
      return;
    }
    const result = await TrainingService.submitAssessment({
      assessment_id,
      assignment_id,
      employee_id: employeeId,
      attempt_type,
      answers
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Learning Paths (Visual Learning Journeys)
router.get('/learning-paths', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const paths = await TrainingService.getLearningPaths(req.user!.organization_id!, req.user?.employee_id);
    res.json(paths);
  } catch (err) {
    next(err);
  }
});

// Employee Certificates
router.get('/certificates', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.json([]);
      return;
    }
    const certs = await TrainingService.getEmployeeCertificates(employeeId);
    res.json(certs);
  } catch (err) {
    next(err);
  }
});

// Security Champions / Achievements
router.get('/achievements', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.json([]);
      return;
    }
    const badges = await TrainingService.getEmployeeAchievements(employeeId);
    res.json(badges);
  } catch (err) {
    next(err);
  }
});

// External Curated Guidance Resources
router.get('/resources', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const resources = await TrainingService.getExternalResources();
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

// Training Analytics & Effectiveness
router.get('/analytics', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await TrainingService.getTrainingAnalytics(req.user!.organization_id!);
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;

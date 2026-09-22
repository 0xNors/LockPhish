import { Router, Response, NextFunction } from 'express';
import { SimulationService } from '../services/simulationService.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { all } from '../database/db.js';

const router = Router();

// Employee Missions (Assigned Simulations)
router.get('/my-missions', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const employeeId = req.user?.employee_id;
    if (!employeeId) {
      res.json([]);
      return;
    }
    const missions = await SimulationService.getEmployeeMissions(employeeId);
    res.json(missions);
  } catch (err) {
    next(err);
  }
});

// Admin All Simulation Results
router.get('/', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { campaign_id, channel, status, department_id } = req.query;
    let query = `
      SELECT 
        s.*,
        c.name as campaign_name,
        sc.name as scenario_name,
        sc.category as scenario_category,
        e.first_name, e.last_name, e.email,
        d.name as department_name
      FROM simulations s
      JOIN campaigns c ON c.id = s.campaign_id
      JOIN scenarios sc ON sc.id = s.scenario_id
      JOIN employees e ON e.id = s.employee_id
      LEFT JOIN departments d ON d.id = e.department_id
      WHERE s.organization_id = ?
    `;
    const params: any[] = [req.user!.organization_id];

    if (campaign_id) {
      query += ' AND s.campaign_id = ?';
      params.push(campaign_id);
    }
    if (channel) {
      query += ' AND s.channel = ?';
      params.push(channel);
    }
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }
    if (department_id) {
      query += ' AND e.department_id = ?';
      params.push(department_id);
    }

    query += ' ORDER BY s.created_at DESC LIMIT 100';
    const rows = await all<any>(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Get Simulation Detail
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const sim = await SimulationService.getSimulationById(id);

    if (req.user!.role === 'EMPLOYEE' && sim.employee_id !== req.user!.employee_id) {
      res.status(403).json({ error: 'Access denied to this simulation mission.', code: 'FORBIDDEN' });
      return;
    }

    res.json(sim);
  } catch (err) {
    next(err);
  }
});

// Record Simulation Event
router.post('/:id/event', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { event_type, raw_payload } = req.body;
    if (!event_type) {
      res.status(400).json({ error: 'Event type is required.' });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const result = await SimulationService.recordSimulationEvent({
      simulation_id: id,
      event_type,
      raw_payload,
      client_ip: ip
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Get Simulation Replay
router.get('/:id/replay', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const replay = await SimulationService.getSimulationReplay(id);
    res.json(replay);
  } catch (err) {
    next(err);
  }
});

// Launch Simulation for an Employee
router.post('/launch-employee', authenticate, requireRole(['ORG_ADMIN', 'SUPER_ADMIN', 'CAMPAIGN_MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { employee_id, scenario_id } = req.body;
    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required.' });
      return;
    }
    const sim = await SimulationService.launchEmployeeSimulation(req.user!.organization_id!, employee_id, scenario_id);
    res.status(201).json(sim);
  } catch (err) {
    next(err);
  }
});

export default router;

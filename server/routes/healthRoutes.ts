import { Router, Request, Response } from 'express';
import { get } from '../database/db.js';
import { RELEASE_TAG } from '../../src/release';

const router = Router();

// Liveness probe
router.get('/health', async (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LockPhish Core Security Platform',
    version: '1.0.0',
    release: RELEASE_TAG
  });
});

// Readiness probe (checks database connection)
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const result = await get<{ test: number }>('SELECT 1 as test');
    if (result && result.test === 1) {
      res.json({
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({ status: 'unready', database: 'error' });
    }
  } catch (err: any) {
    res.status(503).json({ status: 'unready', database: err.message });
  }
});

export default router;

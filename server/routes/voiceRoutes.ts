import { Router, Response, NextFunction } from 'express';
import { VoiceStateMachine } from '../services/voiceStateMachine.js';
import { authenticate, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Start Voice Session
router.post('/session/start', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { simulation_id } = req.body;
    if (!simulation_id) {
      res.status(400).json({ error: 'simulation_id is required to start a voice call.' });
      return;
    }
    const session = await VoiceStateMachine.startSession(simulation_id);
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// Process Employee Voice Utterance
router.post('/session/:id/utterance', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { utterance } = req.body;
    if (!utterance || typeof utterance !== 'string') {
      res.status(400).json({ error: 'utterance text is required.' });
      return;
    }
    const result = await VoiceStateMachine.processUtterance(id, utterance);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Safely Terminate / Hang Up Voice Call
router.post('/session/:id/terminate', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { reason } = req.body;
    const result = await VoiceStateMachine.terminateCall(id, reason || 'EMPLOYEE_HUNG_UP');
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Decline incoming call before answering
router.post('/decline', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { simulation_id } = req.body;
    if (!simulation_id) {
      res.status(400).json({ error: 'simulation_id is required to decline incoming call.' });
      return;
    }
    const result = await VoiceStateMachine.declineIncomingCall(simulation_id);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

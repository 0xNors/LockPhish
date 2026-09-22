import { v4 as uuidv4 } from 'uuid';
import { run, get, all, transaction } from '../database/db.js';
import { SimulationService } from './simulationService.js';
import { RiskEngine } from './riskEngine.js';

export interface VoiceMessage {
  speaker: 'AI_AGENT' | 'EMPLOYEE' | 'SYSTEM';
  text: string;
  timestamp: string;
  state: string;
  safe_flag?: boolean;
}

export class VoiceStateMachine {
  /**
   * Start a controlled voice simulation session
   */
  static async startSession(simulationId: string) {
    const sim = await SimulationService.getSimulationById(simulationId);
    if (sim.channel !== 'VOICE' && sim.channel !== 'MULTI_STAGE') {
      throw new Error('Simulation is not a voice-enabled mission.');
    }

    const sessionId = uuidv4();
    const openingText = sim.payload_config?.voice_opening || `Hello ${sim.first_name || 'there'}, this is IT Infrastructure following up on a priority router update. Can you hear me clearly?`;

    const initialTranscript: VoiceMessage[] = [
      {
        speaker: 'AI_AGENT',
        text: openingText,
        timestamp: new Date().toISOString(),
        state: 'INTRODUCTION'
      }
    ];

    await run(`
      INSERT INTO voice_sessions (id, simulation_id, organization_id, employee_id, scenario_id, current_state, transcript, verification_passed, secret_disclosed, duration_seconds, status, started_at)
      VALUES (?, ?, ?, ?, ?, 'INTRODUCTION', ?, 0, 0, 0, 'IN_PROGRESS', DATETIME('now'))
    `, [
      sessionId,
      sim.id,
      sim.organization_id,
      sim.employee_id,
      sim.scenario_id,
      JSON.stringify(initialTranscript)
    ]);

    // Record Call Answered Event (Initial engagement)
    await run(`
      INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
      VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'CALL_ANSWERED', DATETIME('now'), 0, ?)
    `, [
      uuidv4(),
      sim.organization_id,
      sim.id,
      sim.campaign_id,
      sim.employee_id,
      sim.scenario_id,
      JSON.stringify({ session_id: sessionId, caller_id: sim.sender_profile?.caller_id || 'UNKNOWN' })
    ]);

    return {
      session_id: sessionId,
      simulation_id: sim.id,
      current_state: 'INTRODUCTION',
      opening_audio_text: openingText,
      persona: sim.payload_config?.voice_persona || sim.sender_profile?.name || 'Corporate Security Officer',
      transcript: initialTranscript
    };
  }

  /**
   * Process employee utterance during active voice call
   * Uses rule-based intent analysis + strict safety redaction
   */
  static async processUtterance(sessionId: string, employeeUtterance: string) {
    const session = await get<any>('SELECT * FROM voice_sessions WHERE id = ?', [sessionId]);
    if (!session) throw new Error('Voice session not found.');
    if (session.status !== 'IN_PROGRESS') throw new Error('Voice call has already ended.');

    const sim = await SimulationService.getSimulationById(session.simulation_id);
    const transcript: VoiceMessage[] = JSON.parse(session.transcript || '[]');
    const currentState = session.current_state;

    // Safety Redaction & Analysis: Check if employee uttered a 4-8 digit code or password
    const codeMatch = employeeUtterance.match(/\b\d{4,8}\b/);
    const secretKeywords = ['password', 'secret', 'passcode', 'code is', 'pin is', 'otp is', 'here is my code'];
    const hasDisclosedCode = Boolean(codeMatch) || secretKeywords.some(kw => employeeUtterance.toLowerCase().includes(kw));

    // Check verification attempts (e.g. employee asks for ticket number, callback, or states policy)
    const verificationPhrases = ['ticket number', 'callback', 'call you back', 'directory', 'policy', 'cannot give', 'won\'t share', 'not authorized', 'verify your identity', 'who is your manager', 'refuse'];
    const isAskingVerification = verificationPhrases.some(p => employeeUtterance.toLowerCase().includes(p));

    // Refusal phrases
    const refusalPhrases = ['no', 'refuse', 'never', 'hang up', 'cannot share', 'i won\'t', 'scam', 'phishing', 'fake', 'prohibited'];
    const isRefusing = refusalPhrases.some(p => employeeUtterance.toLowerCase().includes(p));

    // Redacted safe transcript entry
    const safeEmployeeText = hasDisclosedCode
      ? employeeUtterance.replace(/\b\d{4,8}\b/g, '[REDACTED_NUMERIC_SECRET]').replace(/(password\s*is\s*)[^\s]+/gi, '$1[REDACTED]')
      : employeeUtterance;

    transcript.push({
      speaker: 'EMPLOYEE',
      text: safeEmployeeText,
      timestamp: new Date().toISOString(),
      state: currentState,
      safe_flag: !hasDisclosedCode
    });

    let nextState = currentState;
    let aiResponseText = '';
    let isTerminal = false;
    let outcome = 'IN_PROGRESS';

    // Global check: If secret was disclosed, immediately fail regardless of state
    if (hasDisclosedCode) {
      nextState = 'UNSAFE_DECISION';
      aiResponseText = "Thank you, I have logged that code into our system and applied the override. Goodbye.";
      isTerminal = true;
      outcome = 'FAILED';
    } else if (currentState === 'INTRODUCTION') {
      if (isAskingVerification) {
        nextState = 'VERIFICATION';
        aiResponseText = "I'm calling under urgent security ticket SEC-9481. You can check it in the internal portal, but the router patch window closes in 60 seconds.";
      } else {
        nextState = 'IDENTITY_CLAIM';
        aiResponseText = `Great. I see your workstation is currently active for ${sim.department_name || 'your department'}. I just triggered an authorization confirmation to your phone. Can you read that 6-digit MFA confirmation code to me?`;
      }
    } else if (currentState === 'IDENTITY_CLAIM' || currentState === 'PRESSURE') {
      if (isRefusing || isAskingVerification) {
        if (currentState === 'IDENTITY_CLAIM') {
          nextState = 'PRESSURE';
          aiResponseText = "Listen, if we don't apply this update in the next 2 minutes, your network access will be revoked by the firewall and you'll have to visit IT physically. I just need that quick confirmation number.";
        } else {
          nextState = 'SAFE_EXIT';
          aiResponseText = "Understood. Refusing to share MFA codes or passwords over an inbound phone call is correct company policy. This security exercise is now concluding.";
          isTerminal = true;
          outcome = 'COMPLETED';
        }
      } else {
        nextState = 'PRESSURE';
        aiResponseText = "I really need that 6-digit confirmation to avoid taking your entire workstation offline.";
      }
    } else if (currentState === 'VERIFICATION') {
      nextState = 'SAFE_EXIT';
      aiResponseText = "You followed protocol by verifying and withholding credentials. Thank you for maintaining corporate security.";
      isTerminal = true;
      outcome = 'COMPLETED';
    }

    // Append AI Response to transcript
    transcript.push({
      speaker: 'AI_AGENT',
      text: aiResponseText,
      timestamp: new Date().toISOString(),
      state: nextState
    });

    const verificationPassed = (nextState === 'SAFE_EXIT' || isAskingVerification) ? 1 : 0;
    const secretDisclosed = hasDisclosedCode ? 1 : 0;
    const sessionStatus = isTerminal ? (outcome === 'FAILED' ? 'FAILED' : 'COMPLETED') : 'IN_PROGRESS';

    // Update voice session record
    await run(`
      UPDATE voice_sessions
      SET current_state = ?, transcript = ?, verification_passed = MAX(verification_passed, ?), secret_disclosed = MAX(secret_disclosed, ?), status = ?, ended_at = ?, duration_seconds = duration_seconds + 8
      WHERE id = ?
    `, [
      nextState,
      JSON.stringify(transcript),
      verificationPassed,
      secretDisclosed,
      sessionStatus,
      isTerminal ? new Date().toISOString() : null,
      sessionId
    ]);

    // Behavioral event logging & Score recalculation
    if (hasDisclosedCode) {
      await run(`
        INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
        VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'CALL_SECRET_DISCLOSED', DATETIME('now'), 45, ?)
      `, [
        uuidv4(),
        sim.organization_id,
        sim.id,
        sim.campaign_id,
        sim.employee_id,
        sim.scenario_id,
        JSON.stringify({ reason: 'Spoke authentication code or password during voice simulation' })
      ]);
      await run('UPDATE simulations SET status = "FAILED", completed_at = DATETIME("now") WHERE id = ?', [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
      await run('UPDATE employees SET simulations_failed = simulations_failed + 1 WHERE id = ?', [sim.employee_id]);
      await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, 'VOICE_SECRET_DISCLOSED');
      await RiskEngine.generateTrainingRecommendations(sim.organization_id, sim.employee_id, 'VOICE_SECURITY', 'VOICE');
    } else if (isAskingVerification) {
      await run(`
        INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
        VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'CALL_VERIFICATION_ASKED', DATETIME('now'), -5, ?)
      `, [
        uuidv4(),
        sim.organization_id,
        sim.id,
        sim.campaign_id,
        sim.employee_id,
        sim.scenario_id,
        JSON.stringify({ verification_type: 'ASKED_FOR_TICKET_OR_CALLBACK' })
      ]);
    }

    if (isTerminal && nextState === 'SAFE_EXIT') {
      await run(`
        INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
        VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'REPORTED_VISH', DATETIME('now'), -15, ?)
      `, [
        uuidv4(),
        sim.organization_id,
        sim.id,
        sim.campaign_id,
        sim.employee_id,
        sim.scenario_id,
        JSON.stringify({ outcome: 'SAFE_PROTOCOL_ADHERED' })
      ]);
      await run('UPDATE simulations SET status = "REPORTED", reported_at = DATETIME("now"), completed_at = DATETIME("now") WHERE id = ?', [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
      await run('UPDATE employees SET simulations_reported = simulations_reported + 1 WHERE id = ?', [sim.employee_id]);
      await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, 'VOICE_SAFE_EXIT');
    }

    return {
      session_id: sessionId,
      current_state: nextState,
      ai_response_text: aiResponseText,
      is_terminal: isTerminal,
      outcome,
      transcript
    };
  }

  /**
   * Safe End Call / Hang Up / Decline Call
   */
  static async terminateCall(sessionId: string, reason = 'EMPLOYEE_HUNG_UP') {
    const session = await get<any>('SELECT * FROM voice_sessions WHERE id = ?', [sessionId]);
    if (!session) return { success: true };

    const sim = await SimulationService.getSimulationById(session.simulation_id);

    await run(`
      UPDATE voice_sessions
      SET status = 'TERMINATED_BY_EMPLOYEE', ended_at = DATETIME('now')
      WHERE id = ?
    `, [sessionId]);

    if (session.secret_disclosed === 0) {
      await run(`
        INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
        VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'REPORTED_VISH', DATETIME('now'), -15, ?)
      `, [
        uuidv4(),
        sim.organization_id,
        sim.id,
        sim.campaign_id,
        sim.employee_id,
        sim.scenario_id,
        JSON.stringify({ reason, note: 'Safely hung up or refused unsolicited call' })
      ]);
      await run('UPDATE simulations SET status = "REPORTED", reported_at = DATETIME("now"), completed_at = DATETIME("now") WHERE id = ?', [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
      await run('UPDATE employees SET simulations_reported = simulations_reported + 1 WHERE id = ?', [sim.employee_id]);
      await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, 'VOICE_HANGUP_SAFE');
    } else {
      await run('UPDATE simulations SET status = "FAILED", completed_at = DATETIME("now") WHERE id = ?', [sim.id]);
      await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
      await run('UPDATE employees SET simulations_failed = simulations_failed + 1 WHERE id = ?', [sim.employee_id]);
      await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, 'VOICE_SECRET_DISCLOSED');
    }

    return { success: true, status: 'TERMINATED_BY_EMPLOYEE' };
  }

  /**
   * Decline incoming call without answering
   */
  static async declineIncomingCall(simulationId: string) {
    const sim = await SimulationService.getSimulationById(simulationId);
    await run(`
      INSERT INTO simulation_events (id, organization_id, simulation_id, campaign_id, employee_id, scenario_id, channel, event_type, timestamp, risk_weight, safe_metadata)
      VALUES (?, ?, ?, ?, ?, ?, 'VOICE', 'REPORTED_VISH', DATETIME('now'), -15, ?)
    `, [
      uuidv4(),
      sim.organization_id,
      sim.id,
      sim.campaign_id,
      sim.employee_id,
      sim.scenario_id,
      JSON.stringify({ action: 'DECLINED_INCOMING_CALL' })
    ]);
    await run('UPDATE simulations SET status = "REPORTED", reported_at = DATETIME("now"), completed_at = DATETIME("now") WHERE id = ?', [sim.id]);
    await run('UPDATE campaign_targets SET status = "COMPLETED", completed_at = DATETIME("now") WHERE campaign_id = ? AND employee_id = ?', [sim.campaign_id, sim.employee_id]);
    await run('UPDATE employees SET simulations_reported = simulations_reported + 1 WHERE id = ?', [sim.employee_id]);
    await RiskEngine.recalculateEmployeeRisk(sim.organization_id, sim.employee_id, 'VOICE_DECLINED_INCOMING');
    return { success: true, status: 'REPORTED' };
  }
}

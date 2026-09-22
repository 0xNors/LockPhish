import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Shield, Clock, AlertTriangle, CheckCircle2, XCircle, Globe, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';

interface SimulationReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  replayData: any;
}

export const SimulationReplayModal: React.FC<SimulationReplayModalProps> = ({
  isOpen,
  onClose,
  replayData
}) => {
  if (!replayData) return null;

  const { simulation, events, voice_session } = replayData;

  const stageTitles: Record<string, string> = {
    OPENED: 'Stage 1 — Email Opened & Delivery Confirmed',
    HEADER_INSPECTED: 'Stage 1 — Envelope SPF/DKIM Headers Inspected',
    SENDER_INSPECTED: 'Stage 1 — Sender Address Analyzed',
    DECISION_MADE: 'Stage 2 — Employee In-Scenario Decision Recorded',
    FOLLOW_UP_TRIGGERED: 'Stage 3 — Urgency Follow-Up Pressure Dispatched',
    LOGIN_PAGE_OPENED: 'Stage 4 — Simulated SSO Login Portal Opened',
    FIELD_FOCUSED: 'Stage 4 — Input Field Focused in Simulation',
    CREDENTIAL_SUBMISSION_ATTEMPTED: 'Stage 4 — Credential Submission Intercepted (Zero Leak)',
    LINK_CLICKED: 'Stage 2 — Link Clicked on Simulated Email',
    REPORTED_PHISH: 'Stage 5 — Simulated Phishing Threat Safely Reported',
    REPORTED_SMISH: 'Stage 5 — Smishing Threat Safely Reported',
    REPORTED_VISH: 'Stage 5 — Voice Vishing Threat Safely Defused',
    TRAINING_STARTED: 'Stage 6 — Adaptive Remediation Training Started',
    TRAINING_COMPLETED: 'Stage 6 — Interactive Security Masterclass Completed',
    ASSESSMENT_PASSED: 'Stage 6 — Post-Training Mastery Assessment Passed',
    CALL_ANSWERED: 'Voice Stage 1 — Inbound Call Answered',
    CALL_VERIFICATION_ASKED: 'Voice Stage 2 — Caller Challenged for Ticket Verification',
    CALL_TERMINATED_SAFELY: 'Voice Stage 3 — Call Safely Terminated (Safe Refusal)',
    CALL_SECRET_DISCLOSED: 'Voice Stage 3 — Verbal Secret Disclosed (Intercepted)'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Stage Simulation Timeline & Behavioral Audit"
      subtitle={`Mission ID: ${simulation?.id} &bull; Channel: ${simulation?.channel}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs font-sans">
        {/* Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Scenario</span>
            <span className="font-bold text-slate-100 mt-0.5 block truncate">{simulation?.scenario_name || simulation?.scenario_id}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Channel</span>
            <Badge variant="info" size="sm" className="mt-1">{simulation?.channel}</Badge>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Final Status</span>
            <Badge variant={simulation?.status === 'REPORTED' ? 'low' : simulation?.status === 'CREDENTIALS_ENTERED' ? 'critical' : 'medium'} size="sm" className="mt-1">
              {simulation?.status}
            </Badge>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Debrief Viewed</span>
            <span className="font-bold text-slate-200 mt-0.5 block">{simulation?.debrief_viewed ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* 6-Stage Behavioral Action Event Sequence */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Chronological Behavioral Progression (Stage 1 to Stage 6)
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {events?.map((ev: any, idx: number) => {
              const isCompromise = ev.risk_weight > 10;
              const isSafe = ev.risk_weight < 0;
              const friendlyTitle = stageTitles[ev.event_type] || `Event: ${ev.event_type}`;

              return (
                <div key={idx} className="relative flex items-start gap-4 pl-8">
                  <div className={`absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 ${
                    isCompromise ? 'border-rose-500 bg-rose-950' : isSafe ? 'border-emerald-500 bg-emerald-950' : 'border-slate-600'
                  }`} />

                  <div className="flex-1 p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">{friendlyTitle}</span>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between text-slate-400 text-[11px] font-mono">
                      <span className={ev.risk_weight > 0 ? 'text-rose-400 font-bold' : ev.risk_weight < 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                        {ev.risk_weight > 0 ? `+${ev.risk_weight} risk penalty` : ev.risk_weight < 0 ? `${ev.risk_weight} safe reward` : '0 neutral'}
                      </span>

                      {ev.safe_metadata && Object.keys(ev.safe_metadata).length > 0 && (
                        <span className="text-[10px] text-slate-500 font-sans truncate max-w-xs">
                          {ev.safe_metadata.interception_type
                            ? '🛡️ Sensitive credential strictly REDACTED'
                            : ev.safe_metadata.decision_choice
                            ? `Decision: ${ev.safe_metadata.decision_choice}`
                            : ev.safe_metadata.inspected_item
                            ? `Inspected: ${ev.safe_metadata.inspected_item}`
                            : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voice Session Transcript if applicable */}
        {voice_session && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Voice Session Transcript Replay (Redacted)
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[11px]">
              {voice_session.transcript?.map((msg: any, i: number) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-slate-400 mr-2">[{msg.speaker}]:</span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

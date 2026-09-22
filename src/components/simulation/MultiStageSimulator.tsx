import React, { useState, useEffect } from 'react';
import {
  Layers,
  Mail,
  Smartphone,
  PhoneCall,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Lock,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  Flame,
  Award,
  Terminal,
  Activity
} from 'lucide-react';
import { Simulation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { EmailClientSimulator } from './EmailClientSimulator';
import { SmsClientSimulator } from './SmsClientSimulator';
import { VoiceCallSimulator } from './VoiceCallSimulator';
import { api } from '../../api/client';

interface MultiStageSimulatorProps {
  simulation: Simulation;
  onEventRecorded?: (eventResult: any) => void;
  onClose?: () => void;
}

export const MultiStageSimulator: React.FC<MultiStageSimulatorProps> = ({
  simulation,
  onEventRecorded,
  onClose
}) => {
  // Current active sub-vector stage: 'EMAIL' -> 'SMS' -> 'VOICE' -> 'DEBRIEF'
  const [activeVectorStage, setActiveVectorStage] = useState<'EMAIL' | 'SMS' | 'VOICE' | 'DEBRIEF'>('EMAIL');
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [showMultiStageDebrief, setShowMultiStageDebrief] = useState(false);
  const [simulationEvents, setSimulationEvents] = useState<any[]>([]);

  // Cross-Channel Live Notification Alerts
  const [showSmsPushToast, setShowSmsPushToast] = useState(false);
  const [showVoiceCallOverlay, setShowVoiceCallOverlay] = useState(false);

  useEffect(() => {
    // Schedule cross-channel notifications to simulate coordinated attack arrival
    const smsTimer = setTimeout(() => {
      setShowSmsPushToast(true);
    }, 4000);

    const voiceTimer = setTimeout(() => {
      setShowVoiceCallOverlay(true);
    }, 9000);

    return () => {
      clearTimeout(smsTimer);
      clearTimeout(voiceTimer);
    };
  }, []);

  const handleStageComplete = (completedStage: 'EMAIL' | 'SMS' | 'VOICE') => {
    if (!completedStages.includes(completedStage)) {
      setCompletedStages(prev => [...prev, completedStage]);
    }

    if (completedStage === 'EMAIL') {
      setActiveVectorStage('SMS');
    } else if (completedStage === 'SMS') {
      setActiveVectorStage('VOICE');
    } else if (completedStage === 'VOICE') {
      setActiveVectorStage('DEBRIEF');
      setShowMultiStageDebrief(true);
    }
  };

  const handleReportMultiStagePhish = async () => {
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'REPORTED_PHISH',
        raw_payload: {
          vector: 'MULTI_STAGE_CHAIN',
          completed_stages: completedStages,
          reported_at: new Date().toISOString()
        }
      });
      if (onEventRecorded) onEventRecorded(res);
      setCompletedStages(['EMAIL', 'SMS', 'VOICE']);
      setActiveVectorStage('DEBRIEF');
      setShowMultiStageDebrief(true);
    } catch (err) {
      console.error(err);
    }
  };

  const sender = simulation.sender_profile || {};
  const payload = simulation.payload_config || {};

  return (
    <div className="space-y-4 font-sans text-slate-100 max-w-6xl mx-auto relative">
      {/* FLOATING CROSS-CHANNEL SMS TOAST (IF IN EMAIL STAGE) */}
      {showSmsPushToast && activeVectorStage === 'EMAIL' && (
        <div
          onClick={() => {
            setShowSmsPushToast(false);
            setActiveVectorStage('SMS');
          }}
          className="fixed top-20 right-8 z-50 bg-[#0f172a] text-slate-100 border-2 border-sky-500 rounded-3xl p-4 shadow-2xl max-w-sm cursor-pointer hover:bg-slate-900 transition-all animate-bounce"
        >
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5 font-mono">
              <Smartphone className="w-3.5 h-3.5" /> INCOMING SMS ESCALATION
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); setShowSmsPushToast(false); }}
              className="text-slate-400 hover:text-white"
            >
              &times;
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-2 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            [ALERT] Action required on invoice #{payload.subject?.substring(0, 15) || 'INV-8839'}. Tap to review SMS &rarr;
          </p>
        </div>
      )}

      {/* FLOATING INBOUND VOICE CALL OVERLAY (IF IN EMAIL OR SMS STAGE) */}
      {showVoiceCallOverlay && activeVectorStage !== 'VOICE' && activeVectorStage !== 'DEBRIEF' && (
        <div
          onClick={() => {
            setShowVoiceCallOverlay(false);
            setActiveVectorStage('VOICE');
          }}
          className="fixed top-48 right-8 z-50 bg-gradient-to-br from-amber-950 to-slate-900 text-slate-100 border-2 border-amber-500 rounded-3xl p-4 shadow-2xl max-w-sm cursor-pointer hover:bg-slate-900 transition-all animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-lg">
              <PhoneCall className="w-5 h-5 animate-spin" />
            </div>
            <div className="text-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block font-mono">
                📞 INCOMING VOICE CALL
              </span>
              <span className="font-bold text-slate-100 text-sm block">Billing Recovery Desk</span>
              <span className="text-slate-400 font-mono text-[11px]">+1 (800) 555-0182</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80 mt-2">
            <span className="text-xs text-emerald-400 font-bold">Tap to Answer Voice Call &rarr;</span>
          </div>
        </div>
      )}

      {/* MULTI-STAGE COORDINATED ATTACK ORCHESTRATOR HEADER */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-slate-950 border-2 border-purple-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-xl bg-purple-900 text-purple-300 border border-purple-700 shadow">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-100 tracking-tight">
              Coordinated Multi-Stage Attack Chain Simulator
            </h3>
            <Badge variant="expert" size="sm">Cross-Channel Matrix</Badge>
          </div>
          <p className="text-xs text-purple-200/90">
            Adversaries coordinate multi-vector attack chains across <strong>Email Pretext</strong> &rarr; <strong>SMS Smishing Escalation</strong> &rarr; <strong>Telecom Voice Vishing</strong>.
          </p>
        </div>

        {/* Channel Stage Stepper Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveVectorStage('EMAIL')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              activeVectorStage === 'EMAIL'
                ? 'bg-purple-600 text-white shadow-md'
                : completedStages.includes('EMAIL')
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>1. Email Pretext</span>
            {completedStages.includes('EMAIL') && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
          </button>

          <span className="text-slate-600">&rarr;</span>

          <button
            type="button"
            onClick={() => setActiveVectorStage('SMS')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all relative ${
              activeVectorStage === 'SMS'
                ? 'bg-purple-600 text-white shadow-md'
                : completedStages.includes('SMS')
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. SMS Smish</span>
            {completedStages.includes('SMS') && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {showSmsPushToast && activeVectorStage !== 'SMS' && (
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <span className="text-slate-600">&rarr;</span>

          <button
            type="button"
            onClick={() => setActiveVectorStage('VOICE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all relative ${
              activeVectorStage === 'VOICE'
                ? 'bg-purple-600 text-white shadow-md'
                : completedStages.includes('VOICE')
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>3. Telecom Call</span>
            {completedStages.includes('VOICE') && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            {showVoiceCallOverlay && activeVectorStage !== 'VOICE' && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* ACTIVE STAGE SIMULATOR CONTAINER */}
      <div>
        {activeVectorStage === 'EMAIL' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                Stage 1 of 3: Inbound Phishing Email Pretext &bull; Inspect and interact with the simulated email
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => handleStageComplete('EMAIL')}
              >
                Proceed to Stage 2: SMS Smishing &rarr;
              </Button>
            </div>

            <EmailClientSimulator
              simulation={simulation}
              onEventRecorded={(res) => {
                if (onEventRecorded) onEventRecorded(res);
                if (!completedStages.includes('EMAIL')) setCompletedStages(prev => [...prev, 'EMAIL']);
              }}
              onClose={() => handleStageComplete('EMAIL')}
            />
          </div>
        )}

        {activeVectorStage === 'SMS' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => setActiveVectorStage('EMAIL')}
                >
                  &larr; Return to Email
                </Button>
                <span className="text-slate-300 font-bold flex items-center gap-1.5 ml-2">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  Stage 2 of 3: Coordinated SMS Smishing Escalation Alert
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => handleStageComplete('SMS')}
              >
                Proceed to Stage 3: Voice Vishing Call &rarr;
              </Button>
            </div>

            <SmsClientSimulator
              simulation={simulation}
              onEventRecorded={(res) => {
                if (onEventRecorded) onEventRecorded(res);
                if (!completedStages.includes('SMS')) setCompletedStages(prev => [...prev, 'SMS']);
              }}
              onClose={() => handleStageComplete('SMS')}
            />
          </div>
        )}

        {activeVectorStage === 'VOICE' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => setActiveVectorStage('SMS')}
                >
                  &larr; Return to SMS
                </Button>
                <span className="text-slate-300 font-bold flex items-center gap-1.5 ml-2">
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  Stage 3 of 3: High-Pressure Telecom AI Voice Call
                </span>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
                onClick={() => handleStageComplete('VOICE')}
              >
                Conclude Multi-Stage Mission &rarr;
              </Button>
            </div>

            <VoiceCallSimulator
              simulation={simulation}
              onEventRecorded={(res) => {
                if (onEventRecorded) onEventRecorded(res);
                if (!completedStages.includes('VOICE')) setCompletedStages(prev => [...prev, 'VOICE']);
              }}
              onClose={() => handleStageComplete('VOICE')}
            />
          </div>
        )}

        {activeVectorStage === 'DEBRIEF' && (
          <div className="p-8 rounded-3xl bg-slate-900 border-2 border-emerald-500/60 space-y-6 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-2xl font-black text-slate-100 tracking-tight">
                Coordinated Multi-Stage Attack Matrix Completed!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                You successfully defended against an orchestrated cyber campaign spanning <strong>Email</strong>, <strong>SMS Smishing</strong>, and <strong>Inbound Telecom Voice Vishing</strong>.
              </p>
            </div>

            {/* MITRE ATT&CK Matrix Mapping Strip */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 max-w-3xl mx-auto font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-sans font-bold">MITRE ATT&CK Enterprise Matrix Alignment:</span>
                <Badge variant="low" size="sm">Threat Defused</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-emerald-400 font-bold block">T1566.001</span>
                  <span className="text-slate-300">Spearphishing Link (Email Pretext)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-sky-400 font-bold block">T1566.002</span>
                  <span className="text-slate-300">Spearphishing Voice (Vishing Escalation)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-amber-400 font-bold block">T1556</span>
                  <span className="text-slate-300">MFA Interception Shield Active</span>
                </div>
              </div>
            </div>

            {/* 3-Channel Attack Summary Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left text-xs">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Mail className="w-4 h-4" />
                  <span>Channel 1: Email Pretext</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                  Adversary established initial hook regarding invoice renewal and lookalike domain.
                </p>
                <Badge variant="low" size="sm">✓ Inspected Headers</Badge>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold">
                  <Smartphone className="w-4 h-4" />
                  <span>Channel 2: SMS Urgency</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                  Adversary reinforced urgency with mobile cancellation alert to bypass desktop spam filters.
                </p>
                <Badge variant="low" size="sm">✓ Identified Lookalike</Badge>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <PhoneCall className="w-4 h-4" />
                  <span>Channel 3: Voice Pressure</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
                  Adversary placed direct inbound call requesting 6-digit confirmation codes.
                </p>
                <Badge variant="low" size="sm">✓ Refused Secret (+15 pts)</Badge>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={onClose}
              >
                Return to Mission Center
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

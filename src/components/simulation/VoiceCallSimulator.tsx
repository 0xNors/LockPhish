import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  ShieldAlert,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  Radio,
  User,
  Shield,
  Sparkles,
  Building2,
  KeyRound,
  FileText,
  Info,
  Grid,
  Square,
  CheckSquare,
  X,
  ArrowRight,
  Headphones,
  Sliders,
  Bell,
  Pause,
  Layers,
  PhoneForwarded,
  Music
} from 'lucide-react';
import { Simulation } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { api } from '../../api/client';

interface VoiceCallSimulatorProps {
  simulation: Simulation;
  onEventRecorded?: (eventResult: any) => void;
  onClose?: () => void;
}

// Scenario-Specific Dynamic Dialogue Paths
const getContextualVoiceOptions = (category: string, scenName: string) => {
  const cat = (category || '').toUpperCase();
  const name = (scenName || '').toLowerCase();

  if (cat.includes('IT') || cat.includes('SUPPORT') || name.includes('vpn') || name.includes('helpdesk')) {
    return [
      { text: "Can you provide the ServiceNow ticket number and your employee badge ID?", type: 'SAFE_CHALLENGE' },
      { text: "I will hang up and call the IT helpdesk directory number on +1 (800) 555-0199.", type: 'SAFE_EXIT' },
      { text: "Our company policy strictly prohibits speaking 6-digit MFA codes over phone calls.", type: 'SAFE_REFUSAL' },
      { text: "I do not see any scheduled network maintenance on the corporate IT status channel.", type: 'SAFE_QUESTION' },
      { text: "The 6-digit confirmation code on my phone is 849-102.", type: 'DISCLOSE_TRAP' }
    ];
  }

  if (cat.includes('EXEC') || cat.includes('IMPERSONATION') || name.includes('wire') || name.includes('ceo') || name.includes('cfo')) {
    return [
      { text: "I cannot authorize wires without verbal dual-control signoff from Treasury.", type: 'SAFE_CHALLENGE' },
      { text: "What is our internal pre-agreed code word for Project Apex?", type: 'SAFE_CHALLENGE' },
      { text: "I will confirm this request with your executive assistant on your primary cell line.", type: 'SAFE_EXIT' },
      { text: "Corporate policy requires all escrow authorizations to go through the verified ERP portal.", type: 'SAFE_REFUSAL' },
      { text: "I am releasing the $480,000 wire transfer confirmation code now: 994-182.", type: 'DISCLOSE_TRAP' }
    ];
  }

  if (cat.includes('FINANCE') || cat.includes('VENDOR') || cat.includes('PAYROLL') || name.includes('invoice') || name.includes('tax')) {
    return [
      { text: "I must verify this banking modification using the verified vendor number on file.", type: 'SAFE_CHALLENGE' },
      { text: "Please submit the formal W-9 and banking verification form through the ERP portal.", type: 'SAFE_REFUSAL' },
      { text: "I will hang up and contact our accounts payable supervisor before authorizing changes.", type: 'SAFE_EXIT' },
      { text: "Our corporate direct deposit changes are managed strictly in the Workday portal.", type: 'SAFE_QUESTION' },
      { text: "The authorization routing code is 88391-492.", type: 'DISCLOSE_TRAP' }
    ];
  }

  return [
    { text: "Can you provide official verification through our internal ticketing system?", type: 'SAFE_CHALLENGE' },
    { text: "I will hang up and verify your identity through our official corporate directory.", type: 'SAFE_EXIT' },
    { text: "Company security policy strictly prohibits disclosing passwords or OTP codes.", type: 'SAFE_REFUSAL' },
    { text: "I am logging a security report with the SOC right now.", type: 'SAFE_REPORT' },
    { text: "My confirmation code is 551-928.", type: 'DISCLOSE_TRAP' }
  ];
};

// DTMF Tone Frequencies (North American Standard)
const dtmfFrequencies: Record<string, [number, number]> = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

export const VoiceCallSimulator: React.FC<VoiceCallSimulatorProps> = ({
  simulation,
  onEventRecorded,
  onClose
}) => {
  const [callState, setCallState] = useState<'INCOMING' | 'ACTIVE' | 'ENDED'>('INCOMING');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState('INTRODUCTION');
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; state?: string }>>([]);
  const [duration, setDuration] = useState(0);

  // In-Call Phone Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedKeys, setDialedKeys] = useState('');

  const [employeeInput, setEmployeeInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [interceptedSecretWarning, setInterceptedSecretWarning] = useState(false);

  // Telephony Info & Report Modals
  const [showCallerInfo, setShowCallerInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefOutcome, setDebriefOutcome] = useState<'SAFE' | 'UNSAFE'>('SAFE');

  // Mission Tasks Checklist State
  const [taskAnswered, setTaskAnswered] = useState(false);
  const [taskInspectedCaller, setTaskInspectedCaller] = useState(false);
  const [taskChallenged, setTaskChallenged] = useState(false);
  const [taskSafeExit, setTaskSafeExit] = useState(false);
  const [showTaskHud, setShowTaskHud] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sender = simulation.sender_profile || {};
  const payload = simulation.payload_config || {};
  const indicators = simulation.learning_indicators || [];

  const voiceOptions = getContextualVoiceOptions(simulation.scenario_category || '', simulation.scenario_name || '');

  // Telecom Ringing Audio Synthesizer (Web Audio API: 440Hz + 480Hz)
  const playRingTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playChime = () => {
        if (ctx.state === 'suspended') ctx.resume();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.frequency.value = 440;
        osc2.frequency.value = 480;
        gain.gain.value = 0.08;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {}
        }, 1200);
      };

      playChime();
      ringIntervalRef.current = setInterval(playChime, 3000);
    } catch {}
  };

  const stopRingTone = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (holdMusicIntervalRef.current) clearInterval(holdMusicIntervalRef.current);
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
    }
  };

  // Authentic DTMF Dual-Tone Multi-Frequency Synthesizer
  const playDtmfTone = (key: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = dtmfFrequencies[key] || [697, 1209];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.value = 0.06;

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      setTimeout(() => {
        try {
          osc1.stop();
          osc2.stop();
          ctx.close();
        } catch {}
      }, 160);
    } catch {}
  };

  // Hold Music Chime Synthesizer
  const toggleHold = () => {
    const nextHold = !isOnHold;
    setIsOnHold(nextHold);

    if (nextHold) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        let noteIdx = 0;

        const playHoldNote = () => {
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = notes[noteIdx % notes.length];
          noteIdx++;
          gain.gain.value = 0.03;
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          setTimeout(() => {
            try { osc.stop(); } catch {}
          }, 350);
        };

        playHoldNote();
        holdMusicIntervalRef.current = setInterval(playHoldNote, 800);
      } catch {}
    } else {
      if (holdMusicIntervalRef.current) clearInterval(holdMusicIntervalRef.current);
    }
  };

  useEffect(() => {
    if (callState === 'INCOMING') {
      playRingTone();
    } else {
      stopRingTone();
    }
    return () => stopRingTone();
  }, [callState]);

  // Duration Timer
  useEffect(() => {
    if (callState === 'ACTIVE' && !isOnHold) {
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState, isOnHold]);

  // Voice synthesis helper
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 0.98;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Answer Call
  const handleAnswerCall = async () => {
    stopRingTone();
    setTaskAnswered(true);
    try {
      const res = await api.voice.startSession(simulation.id);
      setSessionId(res.session_id);
      setCurrentState(res.current_state);
      setTranscript(res.transcript || []);
      setCallState('ACTIVE');

      speakText(res.opening_audio_text);

      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error('Failed to start voice call session:', err);
    }
  };

  // Send Employee Utterance
  const handleSendUtterance = async (textToSend?: string, type?: string) => {
    const text = textToSend || employeeInput.trim();
    if (!text || !sessionId) return;

    if (type === 'SAFE_CHALLENGE' || type === 'SAFE_QUESTION') {
      setTaskChallenged(true);
    }

    // Check for sensitive code disclosure locally
    const isSensitive = /\b\d{4,8}\b/.test(text) || text.toLowerCase().includes('password') || text.toLowerCase().includes('otp') || text.toLowerCase().includes('849') || text.toLowerCase().includes('994') || type === 'DISCLOSE_TRAP';

    if (isSensitive) {
      setInterceptedSecretWarning(true);
      setTimeout(() => setInterceptedSecretWarning(false), 4000);
    }

    setEmployeeInput('');

    try {
      const res = await api.voice.sendUtterance(sessionId, text);
      setCurrentState(res.current_state);
      setTranscript(res.transcript || []);

      speakText(res.ai_response_text);

      if (res.is_terminal || isSensitive) {
        setTimeout(() => {
          handleEndCall(res.outcome === 'FAILED' || isSensitive ? 'UNSAFE_DECISION' : 'SAFE_PROTOCOL_ADHERED');
        }, 4500);
      }

      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {
      console.error(err);
    }
  };

  // Safe End / Hang up call
  const handleEndCall = async (reason = 'EMPLOYEE_HUNG_UP') => {
    stopRingTone();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
    setCallState('ENDED');

    if (reason !== 'UNSAFE_DECISION') {
      setTaskSafeExit(true);
    }

    let result = null;
    if (reason === 'DECLINED_INCOMING' && !sessionId) {
      try {
        result = await api.voice.decline(simulation.id);
        if (onEventRecorded) onEventRecorded(result);
      } catch (err) {
        console.error(err);
      }
    } else if (sessionId) {
      try {
        result = await api.voice.terminate(sessionId, reason);
        if (onEventRecorded) onEventRecorded(result);
      } catch (err) {
        console.error(err);
      }
    }

    const isUnsafe = reason === 'UNSAFE_DECISION' || currentState === 'UNSAFE_DECISION';
    setDebriefOutcome(isUnsafe ? 'UNSAFE' : 'SAFE');
    setShowDebrief(true);
  };

  const handleReportVishing = async () => {
    setTaskSafeExit(true);
    try {
      const res = await api.simulations.recordEvent(simulation.id, {
        event_type: 'REPORTED_VISH'
      });
      setShowReportModal(false);
      handleEndCall('REPORTED_VISHING');
      if (onEventRecorded) onEventRecorded(res);
    } catch (err) {}
  };

  // Speech Recognition (Microphone)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the scenario-specific response options or type your response below.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setEmployeeInput(spoken);
        handleSendUtterance(spoken);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const handleKeyPress = (key: string) => {
    playDtmfTone(key);
    setDialedKeys(prev => prev + key);
    if (dialedKeys.length >= 5) {
      handleSendUtterance(dialedKeys + key);
      setDialedKeys('');
      setShowKeypad(false);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const completedTasksCount = [taskAnswered, taskInspectedCaller, taskChallenged, taskSafeExit].filter(Boolean).length;

  return (
    <div className="max-w-md mx-auto bg-slate-950 border-4 border-slate-800 rounded-[44px] shadow-2xl overflow-hidden flex flex-col h-[760px] relative text-slate-100 font-sans ring-1 ring-slate-700/50">
      {/* 🎯 VOICE MISSION TASKS FLOATING HUD CHECKLIST */}
      {showTaskHud && (
        <div className="absolute top-16 right-4 z-50 bg-[#0f172a] text-slate-100 border border-emerald-500/70 rounded-2xl p-3.5 shadow-2xl w-72 font-sans animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-slate-100">Voice Vishing Mission</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                {completedTasksCount}/4 Done
              </span>
              <button onClick={() => setShowTaskHud(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 text-xs">
            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskAnswered ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskAnswered ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 1: Answer & Listen to Caller</strong>
                <span className="text-[10px] text-slate-400">Accept inbound priority telecom call.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskInspectedCaller ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskInspectedCaller ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 2: Inspect Telephony Routing (i)</strong>
                <span className="text-[10px] text-slate-400">Check STIR/SHAKEN unverified caller ID score.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskChallenged ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskChallenged ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 3: Challenge Identity Out-of-Band</strong>
                <span className="text-[10px] text-slate-400">Demand internal ticket # or official callback.</span>
              </div>
            </div>

            <div className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${taskSafeExit ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
              {taskSafeExit ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />}
              <div>
                <strong className="block text-[11px]">Task 4: Refuse OTP & Report (+15 pts)</strong>
                <span className="text-[10px] text-slate-400">Hang up safely or submit vishing report.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP SMARTPHONE CHROME: DYNAMIC ISLAND + STATUS BAR */}
      <div className="bg-slate-900 px-6 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <span className="text-xs font-mono text-slate-300 font-bold">9:41</span>
        
        {/* Dynamic Island Pill */}
        <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto flex items-center justify-center border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-slate-700 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>HD Voice</span>
        </div>
      </div>

      {callState === 'INCOMING' ? (
        /* INCOMING TELECOM CALL SCREEN */
        <div className="flex-1 flex flex-col items-center justify-between p-8 text-center bg-gradient-to-b from-[#0f172a] via-slate-950 to-[#020617]">
          <div className="mt-8 space-y-4">
            <div className="w-24 h-24 rounded-3xl bg-emerald-950/90 border-2 border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400 animate-pulse shadow-2xl shadow-emerald-950/80">
              <PhoneCall className="w-11 h-11" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-100 tracking-tight">
                {sender.caller_id || sender.name || 'Corporate IT Helpdesk'}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">{sender.phone || '+1 (415) 555-0192'}</p>
              
              {/* STIR/SHAKEN Attestation Badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-rose-300 text-[10px] font-mono font-bold">
                <span>⚠️ Carrier Attestation: Level C (Unverified)</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 mb-4">
            <div className="flex items-center justify-center gap-12">
              <button
                type="button"
                onClick={() => handleEndCall('DECLINED_INCOMING')}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-xl shadow-rose-950/60 transition-transform active:scale-95"
                title="Decline Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                type="button"
                onClick={handleAnswerCall}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-950/60 animate-bounce transition-transform active:scale-95"
                title="Answer Call"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">Tap Green button to answer incoming security drill</p>
          </div>
        </div>
      ) : callState === 'ACTIVE' ? (
        /* ACTIVE IN-CALL SMARTPHONE CONSOLE */
        <div className="flex-1 flex flex-col justify-between bg-slate-950 p-4 min-h-0">
          {/* Top In-Call Header & Action Buttons */}
          <div className="px-2 pt-1 pb-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs shrink-0">
                {sender.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate text-left">
                <h4 className="text-xs font-bold text-slate-100 truncate">{sender.name || 'Caller Persona (AI)'}</h4>
                <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-emerald-400 font-bold">{formatTimer(duration)}</span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="text-amber-400">{isOnHold ? 'ON HOLD' : currentState}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowCallerInfo(true);
                  setTaskInspectedCaller(true);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900"
                title="Inspect Telephony Routing"
              >
                <Info className="w-4 h-4 text-sky-400" />
              </button>

              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                title="Report as Vishing"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Intercepted Secret Warning Banner */}
          {interceptedSecretWarning && (
            <div className="p-2.5 rounded-xl bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0 mt-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Sensitive Secret Intercepted & Redacted by Safety Policy!</span>
            </div>
          )}

          {/* Animated Spectral Audio Waveform Visualizer */}
          <div className="py-2 flex items-center justify-center gap-1.5 shrink-0">
            {[35, 65, 95, 45, 100, 75, 40, 85, 60, 70, 95, 35, 80, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isAiSpeaking
                    ? 'bg-emerald-400 animate-pulse'
                    : isListening
                    ? 'bg-sky-400 animate-pulse'
                    : isOnHold
                    ? 'bg-amber-400 animate-bounce'
                    : 'bg-slate-800'
                }`}
                style={{ height: isAiSpeaking ? `${h}%` : '8px', minHeight: '6px', maxHeight: '36px' }}
              />
            ))}
          </div>

          {/* In-Call Keypad Modal / Overlay */}
          {showKeypad ? (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">DTMF Touch-Tone Dialpad:</span>
                <button onClick={() => setShowKeypad(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono text-lg text-emerald-400 font-bold min-h-[36px]">
                {dialedKeys || 'Dial digits...'}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-sm">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(k => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleKeyPress(k)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 active:scale-95 transition-all"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Live Transcript Stream */
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
              {transcript.map((t, idx) => (
                <div key={idx} className={`flex flex-col ${t.speaker === 'EMPLOYEE' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2 leading-relaxed font-sans ${
                      t.speaker === 'EMPLOYEE'
                        ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-800/60 rounded-br-none font-medium'
                        : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-0.5 opacity-60 font-mono">
                      {t.speaker === 'EMPLOYEE' ? 'You' : 'Caller (AI Voice)'}
                    </span>
                    {t.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Scenario-Specific Dynamic Response Actions */}
          <div className="py-2 space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              <span>Dynamic Voice Responses:</span>
              <span className="text-emerald-400">Multi-Turn Path</span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
              {voiceOptions.map((opt, idx) => {
                const isTrap = opt.type === 'DISCLOSE_TRAP';
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendUtterance(opt.text, opt.type)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-[11px] font-medium text-left transition-all flex items-start gap-1.5 ${
                      isTrap
                        ? 'bg-rose-950/30 border-rose-900/60 text-rose-300 hover:bg-rose-900/50'
                        : 'bg-slate-900 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/50'
                    }`}
                  >
                    <span className="shrink-0 font-bold font-mono">{idx + 1}.</span>
                    <span className="line-clamp-2">&ldquo;{opt.text}&rdquo;</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* In-Call Telecom Quick Toolbar (Mute, Keypad, Hold, Speaker, Hangup) */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isMuted ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowKeypad(!showKeypad)}
              className={`p-2.5 rounded-xl border transition-colors ${
                showKeypad ? 'bg-sky-950 border-sky-500 text-sky-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title="Keypad"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleHold}
              className={`p-2.5 rounded-xl border transition-colors ${
                isOnHold ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
              title={isOnHold ? 'Resume Call' : 'Place Call on Hold (Play Music)'}
            >
              <Music className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isSpeakerOn ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
              title="Speaker"
            >
              {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <form
              onSubmit={(e) => { e.preventDefault(); handleSendUtterance(); }}
              className="flex-1 flex items-center gap-1"
            >
              <input
                type="text"
                value={employeeInput}
                onChange={e => setEmployeeInput(e.target.value)}
                placeholder="Speak/type to caller..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
              />
              <Button type="submit" variant="primary" size="sm">
                Say
              </Button>
            </form>

            <button
              type="button"
              onClick={() => handleEndCall('EMPLOYEE_HUNG_UP')}
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60 transition-colors shrink-0"
              title="Hang Up"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* CALL ENDED SCREEN */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4">
            <PhoneOff className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100">Voice Call Completed</h3>
          <p className="text-xs text-slate-400 mt-1 mb-6 font-mono">Duration: {formatTimer(duration)}</p>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowDebrief(true)}
            icon={<ShieldCheck className="w-4 h-4" />}
          >
            Review Security Debrief
          </Button>
        </div>
      )}

      {/* Caller Info Forensic Breakdown Modal */}
      <Modal
        isOpen={showCallerInfo}
        onClose={() => setShowCallerInfo(false)}
        title="Telephony Carrier Forensic Analysis"
        maxWidth="sm"
      >
        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Caller ID:</span>
              <span className="text-slate-200 font-bold">{sender.caller_id || 'IT-HELPDESK-PRIORITY'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Originating Line:</span>
              <span className="text-slate-200">{sender.phone || '+1 (415) 555-0192'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">STIR/SHAKEN Attestation:</span>
              <span className="text-rose-400 font-bold">LEVEL C (Unverified VOIP)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Carrier Spoof Risk:</span>
              <span className="text-amber-400 font-bold">96% High Likelihood</span>
            </div>
          </div>
          <p className="text-slate-400 font-sans text-xs leading-relaxed">
            Adversaries use commercial SIP trunk providers to display arbitrary caller IDs on your phone screen. Never rely on caller ID alone.
          </p>
        </div>
      </Modal>

      {/* Report Vishing Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Report Vishing Voice Call to Security Operations"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs font-sans">
          <p className="text-slate-300 leading-relaxed">
            Confirm reporting this incoming phone call as an unauthorized social engineering voice attack to corporate Security Operations.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setShowReportModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReportVishing} icon={<ShieldAlert className="w-3.5 h-3.5" />}>
              Submit Vishing Report (+15 pts)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post-Call Security Debrief Modal */}
      <Modal
        isOpen={showDebrief}
        onClose={() => setShowDebrief(false)}
        title="Voice Vishing Security Debrief"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs font-sans">
          {debriefOutcome === 'SAFE' ? (
            <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">Voice Verification Protocol Upheld! (+15 pts)</h4>
                <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
                  You refused to disclose MFA codes or passwords over the inbound call and challenged the caller to follow official out-of-band verification procedures.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-300">Credential / OTP Disclosed Over Call</h4>
                <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
                  You shared a secret with the simulated caller under pressure. LockPhish intercepted and redacted the secret value to safeguard your privacy.
                </p>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Vishing Warning Signs Present in Call:
            </h4>
            <div className="space-y-2">
              {indicators.map((ind: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-400 block mb-0.5">{ind.title}</span>
                  <span className="text-slate-300">{ind.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowDebrief(false);
                if (onClose) onClose();
              }}
            >
              Conclude Simulation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

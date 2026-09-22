import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Volume2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Award,
  Radio,
  User,
  Clock
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface VoiceLabScenario {
  id: number;
  category: string;
  isVishing: boolean;
  callerId: string;
  phone: string;
  persona: string;
  transcript: Array<{ speaker: 'CALLER' | 'EMPLOYEE'; text: string }>;
  redFlags: string[];
  explanation: string;
}

export const voiceLabScenarios: VoiceLabScenario[] = [
  {
    id: 1,
    category: 'IT Helpdesk & MFA Override',
    isVishing: true,
    callerId: 'IT-HELPDESK-PRIORITY',
    phone: '+1 (415) 555-0192',
    persona: 'Alex Taylor, Corporate IT Support Lead',
    transcript: [
      { speaker: 'CALLER', text: "Hello! This is Alex from corporate IT. We're performing an emergency VPN router switchover for your department." },
      { speaker: 'CALLER', text: "I just triggered an authentication prompt to your phone. Can you read that 6-digit confirmation code to me so we keep your workstation connected?" },
      { speaker: 'EMPLOYEE', text: "Can you provide the internal ServiceNow ticket number for this maintenance?" },
      { speaker: 'CALLER', text: "Look, if we don't apply this sync in the next 60 seconds, your firewall access will be terminated. I need the code on your screen now." }
    ],
    redFlags: [
      'Inbound caller demanding a 6-digit Multi-Factor Authentication (MFA) push code',
      'Refusing to provide a verified internal ticket number',
      'Artificial emergency pressure threatening immediate workstation lockout'
    ],
    explanation: 'Legitimate IT helpdesk technicians will NEVER ask you to speak an MFA code or one-time password over an incoming phone call.'
  },
  {
    id: 2,
    category: 'Executive CEO AI Deepfake Wire',
    isVishing: true,
    callerId: 'CEO-PRIVATE-CELL',
    phone: '+1 (212) 555-0184',
    persona: 'David Harrison, Chief Executive Officer',
    transcript: [
      { speaker: 'CALLER', text: "Hi, this is David. I'm boarding a flight to London for Project Apex. Did you see my email regarding the urgent $480,000 escrow deposit?" },
      { speaker: 'CALLER', text: "The escrow agent is waiting. I need you to authorize the wire release immediately and read me the bank approval PIN." },
      { speaker: 'EMPLOYEE', text: "Company policy requires secondary verbal verification from the CFO before releasing wires over $100k." },
      { speaker: 'CALLER', text: "I am the CEO! If this wire isn't confirmed before my plane takes off in 3 minutes, the deal collapses and you will be held responsible." }
    ],
    redFlags: [
      'AI Deepfake voice cloning simulating executive leadership',
      'Demanding immediate bypass of standard dual-authorization financial controls',
      'Using anger and intimidation to prevent out-of-band verification'
    ],
    explanation: 'Over $50 Billion in global corporate fraud is executed through executive impersonation. Mandatory offline verification code words and dual authorization prevent this attack.'
  },
  {
    id: 3,
    category: 'Authentic Helpdesk Callback',
    isVishing: false,
    callerId: 'COMPANY-IT-SUPPORT',
    phone: '+1 (800) 555-0100',
    persona: 'Sarah Jenkins, Senior Helpdesk Specialist',
    transcript: [
      { speaker: 'CALLER', text: "Hi, this is Sarah from the IT Helpdesk returning your call regarding ticket #INC-94812 (Outlook calendar sync error)." },
      { speaker: 'EMPLOYEE', text: "Thanks for calling back so quickly, Sarah." },
      { speaker: 'CALLER', text: "No problem! I have your ticket open. I don't need any passwords or codes from you—I am just checking if the error message is still appearing on your screen." },
      { speaker: 'EMPLOYEE', text: "Let me check... it seems to have resolved after the restart." }
    ],
    redFlags: [],
    explanation: 'This is a LEGITIMATE IT support call. The technician called back in direct response to an existing ticket, explicitly stated they do not need passwords/codes, and followed standard support protocol.'
  },
  {
    id: 4,
    category: 'Commercial Bank Wire Fraud Call',
    isVishing: true,
    callerId: 'CHASE-COMMERCIAL-FRAUD',
    phone: '+1 (877) 555-0199',
    persona: 'Victoria Chase, Senior Fraud Prevention Officer',
    transcript: [
      { speaker: 'CALLER', text: "Urgent alert: This is Chase Commercial Fraud. We detected a suspicious $85,000 wire to an offshore crypto exchange on your commercial account." },
      { speaker: 'CALLER', text: "To block and cancel this transaction immediately, I sent a one-time cancellation PIN to your phone. Read it to me now." },
      { speaker: 'EMPLOYEE', text: "I will hang up and call the number on the back of our corporate card." },
      { speaker: 'CALLER', text: "If you hang up, the batch closes in 30 seconds and the $85,000 will be permanently wired offshore with zero recourse!" }
    ],
    redFlags: [
      'Reverse-psychology fraud: claiming to "cancel" a fraud while actually using the OTP to execute it',
      'Discouraging the employee from calling back the verified bank number',
      'Extreme urgency panic countdown'
    ],
    explanation: 'In reverse bank vishing, attackers initiate a fraudulent transfer and call the victim demanding the OTP under the guise of "cancelling" the wire.'
  },
  {
    id: 5,
    category: 'Authentic Benefits Confirmation',
    isVishing: false,
    callerId: 'TOTAL-REWARDS-HR',
    phone: '+1 (800) 555-0150',
    persona: 'Elena Ramos, HR Benefits Coordinator',
    transcript: [
      { speaker: 'CALLER', text: "Hello! This is Elena from HR Benefits. I'm following up on your submitted change-of-address form." },
      { speaker: 'CALLER', text: "I just wanted to let you know that your new medical card will be mailed to your updated address next week. You can view it anytime in the Workday portal." },
      { speaker: 'EMPLOYEE', text: "Great, thank you Elena!" },
      { speaker: 'CALLER', text: "You're welcome! Have a great day." }
    ],
    redFlags: [],
    explanation: 'This is a LEGITIMATE HR communication. The caller is providing informational status on an employee-initiated request and solicits no credentials or payment.'
  },
  {
    id: 6,
    category: 'AWS Cloud Security Token Theft',
    isVishing: true,
    callerId: 'AWS-SECURITY-ESCALATION',
    phone: '+1 (206) 555-0177',
    persona: 'Marcus Brody, AWS Security Incident Response',
    transcript: [
      { speaker: 'CALLER', text: "Hello, this is AWS Security. We detected your corporate AWS IAM root access key leaked in a public GitHub repository." },
      { speaker: 'CALLER', text: "Hackers are spinning up $10,000/hr GPU instances on your account right now! I need the 6-digit root MFA token on your screen to freeze the account." },
      { speaker: 'EMPLOYEE', text: "AWS support does not initiate phone calls demanding root MFA tokens." },
      { speaker: 'CALLER', text: "Every second you delay costs your company thousands! Give me the code right now!" }
    ],
    redFlags: [
      'AWS / cloud providers do not place unprompted phone calls demanding root MFA tokens',
      'Fabricating catastrophic billing panic',
      'Targeting root cloud infrastructure credentials'
    ],
    explanation: 'Cloud service providers never call unprompted to request root MFA tokens or access keys.'
  },
  {
    id: 7,
    category: 'Vendor Bank Routing Switch',
    isVishing: true,
    callerId: 'SUPPLIER-TREASURY',
    phone: '+1 (312) 555-0155',
    persona: 'Richard Vance, VP of Finance at Apex Logistics',
    transcript: [
      { speaker: 'CALLER', text: "Good afternoon! Richard from Apex Logistics. I'm following up on our $124,000 Q3 invoice." },
      { speaker: 'CALLER', text: "Our main account at Chase is under audit, so we updated our bank routing to Wells Fargo. Can you confirm the update code we emailed you?" },
      { speaker: 'EMPLOYEE', text: "I must place a callback to our registered procurement contact number before updating bank accounts." },
      { speaker: 'CALLER', text: "We have two freight containers stuck at port until this wire clears! If you don't approve it on this call, your delivery is cancelled." }
    ],
    redFlags: [
      'Altering bank routing numbers over an unverified inbound phone call',
      'Threatening supply chain shipping delays',
      'Pressuring accounting staff to skip verified directory callbacks'
    ],
    explanation: 'Supply chain banking redirection is a primary vector for multi-million dollar corporate losses. Always verify banking changes via known landline directory numbers.'
  },
  {
    id: 8,
    category: 'Authentic Facilities Maintenance',
    isVishing: false,
    callerId: 'FACILITIES-DESK',
    phone: '+1 (800) 555-0110',
    persona: 'Mark Sullivan, Building Facilities Manager',
    transcript: [
      { speaker: 'CALLER', text: "Hi, this is Mark from Building Facilities. Just letting everyone on Floor 4 know that routine fire alarm testing will occur at 2 PM today." },
      { speaker: 'EMPLOYEE', text: "Thanks for the heads up, Mark." },
      { speaker: 'CALLER', text: "No building evacuation is required during the test. Have a good afternoon!" }
    ],
    redFlags: [],
    explanation: 'This is a LEGITIMATE informational facilities announcement containing no requests for access codes or data.'
  },
  {
    id: 9,
    category: 'Data Center Server Cage Access PIN',
    isVishing: true,
    callerId: 'EQUINIX-NOC-DISPATCH',
    phone: '+1 (408) 555-0166',
    persona: 'Derrick Vance, Equinix Shift Operations Supervisor',
    transcript: [
      { speaker: 'CALLER', text: "Emergency alert: Derrick from Equinix DC-4. Your server cage Rack 12 has suffered an HVAC failure and is overheating at 104°F!" },
      { speaker: 'CALLER', text: "I have emergency portable chillers at your door. Read me the 6-digit physical access PIN sent to your phone so I can unlock the cage." },
      { speaker: 'EMPLOYEE', text: "Physical server cage access requires formal ticket authorization through the Equinix portal." },
      { speaker: 'CALLER', text: "Your production databases will burn out in 45 seconds! Give me the cage PIN right now!" }
    ],
    redFlags: [
      'Requesting physical data center server cage door access PINs over the phone',
      'Fabricating thermal overheating and hardware destruction panic',
      'Attempting physical server compromise'
    ],
    explanation: 'Physical data center access codes grant attackers direct hardware access to tap network cables or steal server hard drives.'
  },
  {
    id: 10,
    category: 'CrowdStrike BSOD Hotfix Vishing',
    isVishing: true,
    callerId: 'CROWDSTRIKE-HOTFIX-LINE',
    phone: '+1 (800) 555-0128',
    persona: 'Dr. Simon Vance, Lead Endpoint Systems Architect',
    transcript: [
      { speaker: 'CALLER', text: "Urgent technical alert: Simon from Endpoint Security. A corrupted CrowdStrike driver file is causing blue-screen crashes across your department." },
      { speaker: 'CALLER', text: "We are injecting an emergency kernel patch. What is the 6-digit administrative override code displayed on your screen?" },
      { speaker: 'EMPLOYEE', text: "All endpoint security patches are managed centrally via Microsoft Intune without phone overrides." },
      { speaker: 'CALLER', text: "If you don't provide the override code immediately, your machine will crash and all your unsaved work will be lost forever!" }
    ],
    redFlags: [
      'News-jacking real-world IT outages (CrowdStrike) to build credibility',
      'Soliciting administrative override codes over voice call',
      'Preying on fear of lost computer files'
    ],
    explanation: 'Threat actors capitalize on widespread IT news events to impersonate security software vendors and capture administrative bypass codes.'
  }
];

interface VoiceVishingLabProps {
  onClose?: () => void;
}

export const VoiceVishingLab: React.FC<VoiceVishingLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = voiceLabScenarios[currentIdx];
  const totalScenarios = voiceLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isVishing;

  const handleDecision = (userSelectedVishing: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedVishing }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      voiceLabScenarios.forEach(s => {
        if (answers[s.id] === s.isVishing) correct++;
      });
      setScore({ correct, total: totalScenarios });
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setScore(null);
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 min-h-[720px]">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">Voice Vishing & Phone Fraud Lab</h2>
            <p className="text-xs text-slate-400">Analyze real inbound telephone scripts, caller IDs, and voice pressure tactics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            Call {currentIdx + 1} of {totalScenarios}
          </span>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Exit Lab
            </Button>
          )}
        </div>
      </div>

      {score ? (
        /* Completion Screen */
        <div className="p-10 text-center space-y-6 my-auto">
          <div className="w-20 h-20 rounded-full bg-amber-950/90 border-2 border-amber-400 flex items-center justify-center text-amber-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100">Voice Vishing Lab Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is your telephone threat detection accuracy:</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-amber-400">{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-slate-100">{score.correct} / {score.total}</span>
            </div>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" icon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
              Restart Lab
            </Button>
            {onClose && (
              <Button variant="primary" onClick={onClose}>
                Return to Academy
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Active Voice Lab Slide */
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Simulated Inbound Call Console */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            {/* Top Banner */}
            <div className="bg-[#b45309] px-5 py-2.5 text-white font-bold text-xs flex items-center justify-between">
              <span>{scenario.category}</span>
              <span className="font-mono text-[11px] opacity-80">Call Scenario #{scenario.id}</span>
            </div>

            {/* Caller ID Strip */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center font-bold">
                  <PhoneCall className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-slate-100 block font-sans">{scenario.callerId}</span>
                  <span className="text-slate-400">{scenario.phone} &bull; {scenario.persona}</span>
                </div>
              </div>
              <Badge variant="medium" size="sm">INCOMING CALL</Badge>
            </div>

            {/* Call Transcript */}
            <div className="p-5 bg-slate-950 space-y-3 font-sans text-xs max-h-72 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Call Audio Transcript:</span>
              {scenario.transcript.map((t, idx) => (
                <div key={idx} className={`flex flex-col ${t.speaker === 'EMPLOYEE' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    t.speaker === 'EMPLOYEE'
                      ? 'bg-emerald-950 text-emerald-200 border border-emerald-800 rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}>
                    <span className="text-[10px] font-bold block mb-0.5 opacity-60 font-mono">
                      {t.speaker === 'EMPLOYEE' ? 'You' : `${scenario.persona} (Caller)`}
                    </span>
                    {t.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar: Vishing vs Legitimate */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this call legitimate or vishing / social engineering?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Vishing / Fraud</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate Call</span>
                </button>
              </div>
            </div>
          ) : (
            /* Educational Instant Feedback */
            <div className={`p-5 rounded-2xl border space-y-3.5 animate-fadeIn ${
              isCorrect ? 'bg-emerald-950/50 border-emerald-600' : 'bg-rose-950/50 border-rose-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <h4 className={`text-sm font-bold ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {isCorrect
                      ? `Correct! This phone call is ${scenario.isVishing ? 'Vishing / Social Engineering' : 'Legitimate'}.`
                      : `Incorrect. This phone call is actually ${scenario.isVishing ? 'Vishing / Social Engineering' : 'Legitimate'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isVishing ? 'critical' : 'low'} size="sm">
                  {scenario.isVishing ? 'VISHING ATTACK' : 'AUTHENTIC CALL'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this Call:</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                    {scenario.redFlags.map((rf, i) => (
                      <li key={i}>{rf}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={handlePrev}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!isAnswered}
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {currentIdx < totalScenarios - 1 ? 'Next Call' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Award,
  Globe,
  Radio
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface SmsLabScenario {
  id: number;
  category: string;
  isSmishing: boolean;
  sender: string;
  time: string;
  text: string;
  redFlags: string[];
  explanation: string;
}

export const smsLabScenarios: SmsLabScenario[] = [
  {
    id: 1,
    category: 'Banking & Fraud Alert',
    isSmishing: true,
    sender: '+1 (888) 492-7104',
    time: '10:42 AM',
    text: '[SECURITY ALERT] A wire transfer of $4,850.00 to Global Trade FX was initiated on your commercial account ending in *4091. If you did NOT authorize this, cancel immediately at: https://security-dispute-auth.bank-commercial-corp.net/verify or reply STOP.',
    redFlags: [
      'Unsolicited text message regarding a huge wire from an unknown 1-888 number',
      'Link points to "bank-commercial-corp.net" rather than the verified bank portal',
      'Panic-inducing urgency to bypass rational validation'
    ],
    explanation: 'This is banking fraud smishing. Financial institutions will never send external third-party links via SMS to cancel wire transfers.'
  },
  {
    id: 2,
    category: 'Package Delivery',
    isSmishing: true,
    sender: 'USPS-TRACK',
    time: '11:15 AM',
    text: 'USPS: Package #9400100021 cannot be delivered due to missing house number. Please confirm your street address within 12 hours: https://usps-redelivery-address-update.com/track',
    redFlags: [
      'Domain uses "usps-redelivery-address-update.com" instead of the official usps.com',
      'Urgency deadline of 12 hours',
      'Postal services do not track street addresses via random SMS links'
    ],
    explanation: 'One of the most widespread smishing campaigns in the US. The link collects personal addresses and credit card numbers on fake postage payment forms.'
  },
  {
    id: 3,
    category: 'Authentic 2FA Security Code',
    isSmishing: false,
    sender: '22000 (Google)',
    time: '12:30 PM',
    text: 'G-382914 is your Google verification code. Do not share this code with anyone.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE Two-Factor Authentication SMS. It originates from Google official shortcode, contains no clickable links, and reminds the user not to share the code.'
  },
  {
    id: 4,
    category: 'Courier Customs Fee',
    isSmishing: true,
    sender: '+1 (800) 463-3339',
    time: '01:05 PM',
    text: 'FedEx: Package #US-88491 is held at the local distribution depot due to an unpaid customs duty fee of $1.85. Pay online to release: http://bit.ly/fedex-track-fee',
    redFlags: [
      'Shortened URL (bit.ly) used to conceal the true destination domain',
      'Micro-fee trap ($1.85) designed to harvest credit cards and CVVs'
    ],
    explanation: 'Courier fee smishing lures victims with small $1.85 charges to capture full credit card numbers on fake merchant forms.'
  },
  {
    id: 5,
    category: 'Authentic Ride Receipt',
    isSmishing: false,
    sender: 'UBER',
    time: '02:40 PM',
    text: 'Your Uber driver is arriving in a Silver Toyota Camry (License: 7ABC123). Track in app.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE Uber operational text message containing vehicle details with no suspicious links or credential requests.'
  },
  {
    id: 6,
    category: 'Apple Pay Suspension',
    isSmishing: true,
    sender: 'APPLE-WALLET',
    time: '03:15 PM',
    text: 'Apple Security: Apple Pay on your corporate iPhone has been temporarily suspended. Tap link to re-verify Apple ID: https://appleid-wallet-verify-auth.org/applepay',
    redFlags: [
      'Domain uses "appleid-wallet-verify-auth.org" instead of apple.com',
      'Harvests Apple ID passwords and 2FA SMS tokens'
    ],
    explanation: 'Threat actors impersonate Apple Wallet to harvest Apple IDs and take over iCloud accounts.'
  },
  {
    id: 7,
    category: 'Authentic Bank Alert',
    isSmishing: false,
    sender: '24273 (Chase)',
    time: '04:00 PM',
    text: 'Chase Alert: A charge of $42.15 was made at Whole Foods on card ending in *4092. No action needed if this was you.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE bank notification from official Chase shortcode 24273. It requires no action and contains no clickable links.'
  },
  {
    id: 8,
    category: 'IRS Tax Rebate Scam',
    isSmishing: true,
    sender: 'IRS-TAX-GOV',
    time: '04:45 PM',
    text: 'IRS Alert: You have an unclaimed corporate tax rebate of $1,420.50 pending direct deposit. Submit your routing number before midnight: https://irs-electronic-tax-refund.org/direct-deposit',
    redFlags: [
      'The IRS NEVER contacts taxpayers via SMS text message to issue refunds',
      'Domain uses .org instead of official .gov',
      'Demands direct deposit bank routing numbers'
    ],
    explanation: 'The IRS does not initiate taxpayer communications by SMS. This is an identity theft and banking credential harvester.'
  },
  {
    id: 9,
    category: 'Authentic Flight Alert',
    isSmishing: false,
    sender: 'Delta Air Lines',
    time: '05:30 PM',
    text: 'Delta Flight DL-482 boarding at Gate B12. Departure 10:45 AM. Access boarding pass in the Fly Delta app.',
    redFlags: [],
    explanation: 'This is a LEGITIMATE operational flight update directing the user to the official mobile app without suspicious links.'
  },
  {
    id: 10,
    category: 'CEO Direct Text / Gift Card Scam',
    isSmishing: true,
    sender: '+1 (212) 555-0174',
    time: '06:10 PM',
    text: 'Hi, this is David (CEO). I am in an all-day confidential board meeting with no reception. Are you at your desk? I need an urgent favor regarding purchasing 5 Apple gift cards for a client.',
    redFlags: [
      'Classic executive gift card pretext',
      'Claiming to be in a meeting with no phone access to avoid verbal verification',
      'Bypassing standard corporate procurement channels'
    ],
    explanation: 'Executive gift card text scams exploit authority compliance. CEOs will never text subordinates demanding secret gift card purchases.'
  }
];

interface SmsSmishingLabProps {
  onClose?: () => void;
}

export const SmsSmishingLab: React.FC<SmsSmishingLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = smsLabScenarios[currentIdx];
  const totalScenarios = smsLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isSmishing;

  const handleDecision = (userSelectedSmishing: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedSmishing }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      smsLabScenarios.forEach(s => {
        if (answers[s.id] === s.isSmishing) correct++;
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
    <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 min-h-[700px]">
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-950 text-sky-400 border border-sky-800">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">SMS Smishing Threat Lab</h2>
            <p className="text-xs text-slate-400">Examine realistic smartphone text messages and spot red flags</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-sky-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            Message {currentIdx + 1} of {totalScenarios}
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
          <div className="w-20 h-20 rounded-full bg-sky-950/90 border-2 border-sky-400 flex items-center justify-center text-sky-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100">SMS Threat Lab Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is your mobile threat detection score:</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-sky-400">{Math.round((score.correct / score.total) * 100)}%</span>
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
        /* Active Smartphone SMS Lab Slide */
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Smartphone Simulator Shell */}
          <div className="max-w-sm mx-auto w-full bg-slate-900 border-4 border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col">
            {/* Phone Top Notch */}
            <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
              <span>9:41 AM</span>
              <div className="w-16 h-3 bg-slate-800 rounded-full" />
              <Radio className="w-3 h-3 text-emerald-400" />
            </div>

            {/* Sender Header */}
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 mx-auto mb-1">
                {scenario.sender.charAt(0)}
              </div>
              <h4 className="text-xs font-bold text-slate-100">{scenario.sender}</h4>
              <span className="text-[10px] text-slate-400 font-mono">{scenario.category}</span>
            </div>

            {/* SMS Message Bubble */}
            <div className="p-4 bg-slate-950 flex-1 space-y-3 min-h-[180px]">
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-slate-500 font-mono mb-1 self-center">{scenario.time}</span>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800 text-slate-100 text-xs leading-relaxed border border-slate-700">
                  {scenario.text}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar: Smishing vs Legitimate */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this SMS legitimate or smishing?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Smishing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate</span>
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
                      ? `Correct! This SMS is ${scenario.isSmishing ? 'Smishing' : 'Legitimate'}.`
                      : `Incorrect. This SMS is actually ${scenario.isSmishing ? 'Smishing' : 'Legitimate'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isSmishing ? 'critical' : 'low'} size="sm">
                  {scenario.isSmishing ? 'SMISHING THREAT' : 'AUTHENTIC SMS'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this SMS:</strong>
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
              {currentIdx < totalScenarios - 1 ? 'Next Message' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

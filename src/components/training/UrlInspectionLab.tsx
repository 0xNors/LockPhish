import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Award,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export interface UrlLabScenario {
  id: number;
  category: string;
  isMalicious: boolean;
  displayText: string;
  actualUrl: string;
  protocol: string;
  subdomain: string;
  rootDomain: string;
  path: string;
  redFlags: string[];
  explanation: string;
}

export const urlLabScenarios: UrlLabScenario[] = [
  {
    id: 1,
    category: 'Subdomain Prefix Deception',
    isMalicious: true,
    displayText: 'https://login.microsoft.com/oauth2/v2.0/authorize',
    actualUrl: 'https://login.microsoft.com.security-verify-portal.net/auth',
    protocol: 'https://',
    subdomain: 'login.microsoft.com',
    rootDomain: 'security-verify-portal.net',
    path: '/auth',
    redFlags: [
      '"login.microsoft.com" is placed as a subdomain prefix, not the root domain',
      'The true destination is "security-verify-portal.net"'
    ],
    explanation: 'In web architecture, the owner of security-verify-portal.net can create any subdomain they want (like login.microsoft.com). The real destination is always the root domain before the first single forward slash.'
  },
  {
    id: 2,
    category: 'Authentic Corporate Single Sign-On',
    isMalicious: false,
    displayText: 'https://login.microsoftonline.com/common/oauth2/authorize',
    actualUrl: 'https://login.microsoftonline.com/common/oauth2/authorize',
    protocol: 'https://',
    subdomain: 'login',
    rootDomain: 'microsoftonline.com',
    path: '/common/oauth2/authorize',
    redFlags: [],
    explanation: 'This is an AUTHENTIC Microsoft 365 login address. The root domain is "microsoftonline.com", verified and operated by Microsoft Corporation.'
  },
  {
    id: 3,
    category: 'Typosquatting & Transposed Letters',
    isMalicious: true,
    displayText: 'https://www.paypal.com/signin',
    actualUrl: 'https://www.paypaI.com/signin',
    protocol: 'https://',
    subdomain: 'www',
    rootDomain: 'paypaI.com (Capital "i" instead of lowercase "L")',
    path: '/signin',
    redFlags: [
      'Visual homoglyph: capital letter "I" used in place of lowercase "l" in paypal',
      'Domain was registered to harvest banking credentials'
    ],
    explanation: 'Typosquatting exploits visual letter similarities. On many screens, a capital "I" and lowercase "l" look identical.'
  },
  {
    id: 4,
    category: 'Authentic Google Drive Document',
    isMalicious: false,
    displayText: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    actualUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
    protocol: 'https://',
    subdomain: 'docs',
    rootDomain: 'google.com',
    path: '/spreadsheets/d/.../edit',
    redFlags: [],
    explanation: 'This is an AUTHENTIC Google Sheets document hosted on the verified "google.com" root domain.'
  },
  {
    id: 5,
    category: 'Open Redirect & Token Sniffing',
    isMalicious: true,
    displayText: 'https://google.com/url?q=https://hacker-infostealer.com',
    actualUrl: 'https://www.google.com/url?q=https://hacker-infostealer.com/payload.exe',
    protocol: 'https://',
    subdomain: 'www',
    rootDomain: 'google.com (Open Redirect Vulnerability)',
    path: '/url?q=https://hacker-infostealer.com',
    redFlags: [
      'Uses legitimate google.com as an open redirect gateway',
      'The "q=" parameter bounces the browser immediately to an external malware site'
    ],
    explanation: 'Open redirect attacks abuse legitimate web server redirect parameters to bypass spam filters while redirecting the victim to malware.'
  },
  {
    id: 6,
    category: 'Combosquatting with Hyphenation',
    isMalicious: true,
    displayText: 'https://salesforce-security-audit.com/login',
    actualUrl: 'https://salesforce-security-audit.com/login',
    protocol: 'https://',
    subdomain: '',
    rootDomain: 'salesforce-security-audit.com',
    path: '/login',
    redFlags: [
      'Combines brand name with security keywords ("salesforce-security-audit.com")',
      'Not the official salesforce.com domain'
    ],
    explanation: 'Combosquatting adds legitimate-sounding words (like -security, -support, -portal) to official brand names to register deceptive domains.'
  },
  {
    id: 7,
    category: 'Authentic Enterprise Okta Portal',
    isMalicious: false,
    displayText: 'https://yourcompany.okta.com',
    actualUrl: 'https://yourcompany.okta.com',
    protocol: 'https://',
    subdomain: 'yourcompany',
    rootDomain: 'okta.com',
    path: '',
    redFlags: [],
    explanation: 'This is an AUTHENTIC Okta enterprise tenant URL. The root domain is "okta.com".'
  },
  {
    id: 8,
    category: 'IP Address & Hex Encoded URL',
    isMalicious: true,
    displayText: 'https://194.26.29.112/update/win32',
    actualUrl: 'https://194.26.29.112/update/win32',
    protocol: 'https://',
    subdomain: '',
    rootDomain: '194.26.29.112 (Raw IP Address)',
    path: '/update/win32',
    redFlags: [
      'Uses raw numeric IP address instead of a registered corporate domain name',
      'Common sign of bulletproof hosting and command-and-control servers'
    ],
    explanation: 'Legitimate cloud and software vendors never distribute corporate updates from raw numeric IP addresses.'
  },
  {
    id: 9,
    category: 'Authentic AWS S3 Bucket Storage',
    isMalicious: false,
    displayText: 'https://yourcompany-assets.s3.amazonaws.com/logo.png',
    actualUrl: 'https://yourcompany-assets.s3.amazonaws.com/logo.png',
    protocol: 'https://',
    subdomain: 'yourcompany-assets.s3',
    rootDomain: 'amazonaws.com',
    path: '/logo.png',
    redFlags: [],
    explanation: 'This is an AUTHENTIC Amazon Web Services S3 object hosted on the official "amazonaws.com" domain.'
  },
  {
    id: 10,
    category: 'IDN Cyrillic Homograph Spoof',
    isMalicious: true,
    displayText: 'https://www.apple.com/support',
    actualUrl: 'https://www.xn--pple-43d.com/support (Cyrillic "а")',
    protocol: 'https://',
    subdomain: 'www',
    rootDomain: 'xn--pple-43d.com (Punycode)',
    path: '/support',
    redFlags: [
      'Internationalized Domain Name (IDN) attack replacing Latin "a" with Cyrillic "а"',
      'True punycode domain is xn--pple-43d.com'
    ],
    explanation: 'Homograph attacks register foreign Unicode characters that look identical in browsers to fool victims into entering credentials.'
  }
];

interface UrlInspectionLabProps {
  onClose?: () => void;
}

export const UrlInspectionLab: React.FC<UrlInspectionLabProps> = ({ onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario = urlLabScenarios[currentIdx];
  const totalScenarios = urlLabScenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isMalicious;

  const handleDecision = (userSelectedMalicious: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: userSelectedMalicious }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      urlLabScenarios.forEach(s => {
        if (answers[s.id] === s.isMalicious) correct++;
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
          <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">URL & Domain Root Inspector Lab</h2>
            <p className="text-xs text-slate-400">Master reading URLs from right to left and spotting deceptive subdomains</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-purple-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            Link {currentIdx + 1} of {totalScenarios}
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
          <div className="w-20 h-20 rounded-full bg-purple-950/90 border-2 border-purple-400 flex items-center justify-center text-purple-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-100">URL Inspector Lab Complete!</h3>
            <p className="text-xs text-slate-400 mt-1">Here is your link analysis accuracy score:</p>
          </div>
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-xs mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-purple-400">{Math.round((score.correct / score.total) * 100)}%</span>
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
        /* Active URL Lab Slide */
        <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
          {/* Simulated Browser URL Inspector Container */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs font-bold text-slate-400 ml-2">Category: {scenario.category}</span>
              </div>
              <Badge variant="neutral" size="sm">URL Scenario #{scenario.id}</Badge>
            </div>

            {/* Address Bar Simulation */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 font-mono text-xs text-slate-200 overflow-x-auto">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-500">{scenario.protocol}</span>
              {scenario.subdomain && <span className="text-amber-400 font-bold">{scenario.subdomain}.</span>}
              <span className={scenario.isMalicious ? 'text-rose-400 font-black underline' : 'text-emerald-400 font-black'}>
                {scenario.rootDomain}
              </span>
              <span className="text-slate-500 truncate">{scenario.path}</span>
            </div>

            {/* Anatomical URL Decomposition Strip */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-400">
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Protocol</span>
                <span className="text-slate-200">{scenario.protocol}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Subdomain Prefix</span>
                <span className="text-amber-400 font-bold">{scenario.subdomain || '(None)'}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">True Root Domain</span>
                <span className="text-emerald-400 font-bold">{scenario.rootDomain}</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-500">Path / Query</span>
                <span className="text-slate-300 truncate block">{scenario.path || '/'}</span>
              </div>
            </div>
          </div>

          {/* Action Bar: Malicious vs Legitimate */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this URL address legitimate or malicious?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Malicious / Phishing URL</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate Authentic Link</span>
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
                      ? `Correct! This URL is ${scenario.isMalicious ? 'Malicious / Deceptive' : 'Legitimate'}.`
                      : `Incorrect. This URL is actually ${scenario.isMalicious ? 'Malicious / Deceptive' : 'Legitimate'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isMalicious ? 'critical' : 'low'} size="sm">
                  {scenario.isMalicious ? 'PHISHING TRAP' : 'AUTHENTIC DOMAIN'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags in this URL:</strong>
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
              {currentIdx < totalScenarios - 1 ? 'Next Link' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

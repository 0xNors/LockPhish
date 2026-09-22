import React, { useState } from 'react';
import {
  Mail,
  Smartphone,
  PhoneCall,
  Globe,
  FileText,
  Target,
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
  ExternalLink,
  Paperclip,
  Radio,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ThreatLabCategory, ThreatLabScenario } from './ThreatLabsData';

interface UniversalThreatLabPlayerProps {
  lab: ThreatLabCategory;
  onClose?: () => void;
  onCompleted?: (score: number) => void;
}

export const UniversalThreatLabPlayer: React.FC<UniversalThreatLabPlayerProps> = ({
  lab,
  onClose,
  onCompleted
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  const scenario: ThreatLabScenario = lab.scenarios[currentIdx] || lab.scenarios[0];
  const totalScenarios = lab.scenarios.length;
  const isAnswered = answers[scenario.id] !== undefined;
  const userAnswer = answers[scenario.id];
  const isCorrect = isAnswered && userAnswer === scenario.isMalicious;

  const handleDecision = (selectedMalicious: boolean) => {
    setAnswers(prev => ({ ...prev, [scenario.id]: selectedMalicious }));
  };

  const handleNext = () => {
    if (currentIdx < totalScenarios - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      let correct = 0;
      lab.scenarios.forEach(s => {
        if (answers[s.id] === s.isMalicious) correct++;
      });
      const finalScore = { correct, total: totalScenarios };
      setScore(finalScore);
      if (onCompleted) onCompleted(Math.round((correct / totalScenarios) * 100));
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
    <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans text-slate-100 min-h-[720px]">
      {/* Top Header Bar */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
            {lab.type === 'EMAIL' ? <Mail className="w-5 h-5" /> :
             lab.type === 'SMS' ? <Smartphone className="w-5 h-5" /> :
             lab.type === 'VOICE' ? <PhoneCall className="w-5 h-5" /> :
             lab.type === 'URL' ? <Globe className="w-5 h-5" /> :
             lab.type === 'DOCUMENT' ? <FileText className="w-5 h-5" /> :
             <Target className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-100">{lab.title}</h2>
              <Badge variant={lab.difficulty.toLowerCase() as any} size="sm">{lab.difficulty}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{lab.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
            Slide {currentIdx + 1} of {totalScenarios}
          </span>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Exit Lab
            </Button>
          )}
        </div>
      </div>

      {score ? (
        /* Final Score & Completion Screen */
        <div className="p-10 text-center space-y-6 my-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-100">{lab.title} &mdash; Lab Complete!</h3>
            <p className="text-xs text-slate-400">Here is your threat detection accuracy breakdown:</p>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-md mx-auto grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
              <span className="text-2xl font-black text-emerald-400">{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-black text-slate-100">{score.correct} / {score.total} Correct</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" icon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
              Restart Lab
            </Button>
            {onClose && (
              <Button variant="primary" onClick={onClose}>
                Return to Threat Labs Catalog
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Active Threat Lab Slide */
        <div className="flex-1 flex flex-col justify-between p-6 space-y-6">
          {/* Dynamic Scenario Container depending on Lab Type */}
          {scenario.type === 'EMAIL' && scenario.headerData && (
            /* 1. EMAIL LAB CONTAINER (Matching justforphishing.com/email-lab.html) */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="bg-[#1d4ed8] px-5 py-2.5 text-white font-bold text-xs flex items-center justify-between">
                <span>{scenario.category}</span>
                <span className="font-mono text-[11px] opacity-80">Scenario #{scenario.id}</span>
              </div>

              {/* RFC Headers Table */}
              <div className="p-4 bg-slate-950/90 border-b border-slate-800 text-xs font-mono space-y-1.5">
                <div className="flex items-start">
                  <span className="w-20 text-slate-500 shrink-0 font-bold">From:</span>
                  <span className="text-slate-200 truncate">{scenario.headerData.from}</span>
                </div>
                {scenario.headerData.replyTo && (
                  <div className="flex items-start">
                    <span className="w-20 text-slate-500 shrink-0 font-bold">Reply-To:</span>
                    <span className="text-amber-400 truncate">{scenario.headerData.replyTo}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <span className="w-20 text-slate-500 shrink-0 font-bold">To:</span>
                  <span className="text-slate-300 truncate">{scenario.headerData.to}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-slate-500 shrink-0 font-bold">Date:</span>
                  <span className="text-slate-400">{scenario.headerData.date}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-20 text-slate-500 shrink-0 font-bold">Subject:</span>
                  <span className="text-slate-100 font-bold truncate">{scenario.headerData.subject}</span>
                </div>
              </div>

              {/* Rendered HTML Email Body */}
              <div className="p-6 bg-white overflow-x-auto text-slate-900">
                <div dangerouslySetInnerHTML={{ __html: scenario.bodyHtml || '<p>Content</p>' }} />
              </div>
            </div>
          )}

          {scenario.type === 'SMS' && scenario.phoneData && (
            /* 2. SMS SMISHING SMARTPHONE CONTAINER */
            <div className="max-w-sm mx-auto w-full bg-slate-900 border-4 border-slate-800 rounded-[36px] shadow-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
                <span>9:41 AM</span>
                <div className="w-16 h-3 bg-slate-800 rounded-full" />
                <Radio className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="p-3.5 bg-slate-900 border-b border-slate-800 text-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 mx-auto mb-1">
                  {scenario.phoneData.sender.charAt(0)}
                </div>
                <h4 className="text-xs font-bold text-slate-100">{scenario.phoneData.sender}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{scenario.category}</span>
              </div>
              <div className="p-4 bg-slate-950 flex-1 space-y-3 min-h-[160px]">
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800 text-slate-100 text-xs leading-relaxed border border-slate-700">
                  {scenario.phoneData.text}
                </div>
              </div>
            </div>
          )}

          {scenario.type === 'VOICE' && scenario.voiceData && (
            /* 3. VOICE VISHING CONSOLE */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-3">
              <div className="bg-[#b45309] px-5 py-2.5 text-white font-bold text-xs flex items-center justify-between">
                <span>{scenario.category}</span>
                <Badge variant="medium" size="sm">INCOMING CALL</Badge>
              </div>
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3 font-mono text-xs">
                <PhoneCall className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <span className="font-bold text-slate-100 font-sans block">{scenario.voiceData.callerId}</span>
                  <span className="text-slate-400">{scenario.voiceData.phone} &bull; {scenario.voiceData.persona}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950 space-y-2 text-xs max-h-56 overflow-y-auto font-sans">
                {scenario.voiceData.transcript.map((t, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-amber-400 block font-mono">{t.speaker}</span>
                    <span className="text-slate-200">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scenario.type === 'URL' && scenario.urlData && (
            /* 4. URL ROOT DOMAIN INSPECTOR CONTAINER */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-purple-400">Category: {scenario.category}</span>
                <Badge variant="neutral" size="sm">URL Scenario #{scenario.id}</Badge>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 font-mono text-xs text-slate-200 overflow-x-auto">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-500">{scenario.urlData.protocol}</span>
                {scenario.urlData.subdomain && <span className="text-amber-400 font-bold">{scenario.urlData.subdomain}.</span>}
                <span className={scenario.isMalicious ? 'text-rose-400 font-black underline' : 'text-emerald-400 font-black'}>
                  {scenario.urlData.rootDomain}
                </span>
                <span className="text-slate-500 truncate">{scenario.urlData.path}</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-400">
                <div><span className="block text-[9px] uppercase text-slate-500">Protocol</span><span className="text-slate-200">{scenario.urlData.protocol}</span></div>
                <div><span className="block text-[9px] uppercase text-slate-500">Subdomain Prefix</span><span className="text-amber-400 font-bold">{scenario.urlData.subdomain || '(None)'}</span></div>
                <div><span className="block text-[9px] uppercase text-slate-500">True Root Domain</span><span className="text-emerald-400 font-bold">{scenario.urlData.rootDomain}</span></div>
                <div><span className="block text-[9px] uppercase text-slate-500">Path</span><span className="text-slate-300 truncate block">{scenario.urlData.path || '/'}</span></div>
              </div>
            </div>
          )}

          {scenario.type === 'DOCUMENT' && scenario.docData && (
            /* 5. DOCUMENT ATTACHMENT CONTAINER */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-rose-400">Category: {scenario.category}</span>
                <Badge variant="neutral" size="sm">File Scenario #{scenario.id}</Badge>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5 truncate font-mono">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
                    <Paperclip className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-slate-100 truncate">{scenario.docData.fileName}</h4>
                    <span className="text-[11px] text-slate-400 block">{scenario.docData.fileType} &bull; {scenario.docData.fileSize}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <p className="text-slate-200 leading-relaxed font-sans">{scenario.docData.context}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  Sender: <span className="text-slate-300">{scenario.docData.apparentSender}</span>
                </div>
              </div>
            </div>
          )}

          {scenario.type === 'DECISION' && (
            /* 6. GENERAL DECISION SCENARIO CONTAINER */
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-purple-400">Category: {scenario.category}</span>
                <Badge variant="neutral" size="sm">Scenario #{scenario.id}</Badge>
              </div>
              {scenario.headerData && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                  <div>From: <span className="text-slate-200">{scenario.headerData.from}</span></div>
                  <div>Subject: <span className="text-slate-100 font-bold">{scenario.headerData.subject}</span></div>
                </div>
              )}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                <div dangerouslySetInnerHTML={{ __html: scenario.bodyHtml || '<p>Scenario Details</p>' }} />
              </div>
            </div>
          )}

          {/* Interactive Action Bar (Matching justforphishing.com) */}
          {!isAnswered ? (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-slate-100">Is this scenario legitimate or a malicious cyber threat?</h4>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => handleDecision(true)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-2 border-rose-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-950/40"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>🚫 Malicious / Threat</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDecision(false)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-2 border-emerald-600 font-bold text-xs transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ Legitimate / Safe</span>
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
                      ? `Correct! This is ${scenario.isMalicious ? 'a Malicious Threat' : 'Legitimate & Safe'}.`
                      : `Incorrect. This is actually ${scenario.isMalicious ? 'a Malicious Threat' : 'Legitimate & Safe'}.`}
                  </h4>
                </div>
                <Badge variant={scenario.isMalicious ? 'critical' : 'low'} size="sm">
                  {scenario.isMalicious ? 'MALICIOUS ATTACK' : 'AUTHENTIC / SAFE'}
                </Badge>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{scenario.explanation}</p>

              {scenario.redFlags.length > 0 && (
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1 font-sans">
                  <strong className="text-amber-400 block mb-1 text-[11px] uppercase">Concealed Red Flags:</strong>
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
              Previous Slide
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!isAnswered}
              onClick={handleNext}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {currentIdx < totalScenarios - 1 ? 'Next Slide' : 'View Final Score'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

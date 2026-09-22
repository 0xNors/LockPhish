import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Eye, CheckCircle2, Award, Sparkles, ArrowRight, HelpCircle, Globe, Lock } from 'lucide-react';
import { Button } from '../common/Button';

interface InteractiveEmailInspectorProps {
  moduleData: {
    instructions: string;
    sample_email: {
      from: string;
      subject: string;
      reply_to: string;
      body: string;
      indicators: Array<{ id: string; label: string; text: string; clue: string }>;
    };
  };
  onComplete: () => void;
}

export const InteractiveEmailInspector: React.FC<InteractiveEmailInspectorProps> = ({
  moduleData,
  onComplete
}) => {
  const { sample_email, instructions } = moduleData;
  const indicators = sample_email?.indicators || [
    { id: 'ind-1', label: 'Deceptive Domain', text: 'microsoft-security-alert-verify.com', clue: 'Not the genuine @microsoft.com domain.' },
    { id: 'ind-2', label: 'Reply-To Mismatch', text: 'quick-auth-collector.net', clue: 'Replies go to an external third-party domain.' },
    { id: 'ind-3', label: 'False Urgency', text: 'expires in 2 hours', clue: 'Creates panic to bypass analytical thinking.' }
  ];

  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [selectedClue, setSelectedClue] = useState<string | null>(null);

  const handleIndicatorClick = (id: string, clue: string) => {
    if (!revealedIds.includes(id)) {
      setRevealedIds(prev => [...prev, id]);
    }
    setSelectedClue(clue);
  };

  const handleRevealAll = () => {
    setRevealedIds(indicators.map(i => i.id));
    setSelectedClue('All red flags uncovered! Review the clues and continue to the next lesson.');
  };

  return (
    <div className="space-y-6">
      {/* Exercise Instructions Header */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Interactive Red-Flag Threat Hunting Lab
            </h4>
            <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
              {instructions || 'Click on the underlined suspicious elements in the email below to expose concealed phishing red flags.'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          icon={<Sparkles className="w-3 h-3 text-emerald-400" />}
          onClick={handleRevealAll}
        >
          Reveal All Red Flags
        </Button>
      </div>

      {/* Realistic Simulated Webmail Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Email Header Chrome */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-mono text-[11px] ml-2">Inbox Preview &bull; Threat Hunting Sandbox</span>
          </div>
          <span className="text-emerald-400 font-bold font-mono text-[10px]">
            {revealedIds.length} of {indicators.length} Clues Found
          </span>
        </div>

        {/* Email Headers Form */}
        <div className="p-6 space-y-3 bg-slate-900/60 border-b border-slate-800 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px] w-20">From:</span>
            <button
              type="button"
              onClick={() => handleIndicatorClick('ind-1', indicators.find(i => i.id === 'ind-1')?.clue || 'Suspicious lookalike domain: Notice the domain suffix.')}
              className={`flex-1 text-left p-1.5 px-3 rounded-lg font-mono transition-all ${
                revealedIds.includes('ind-1')
                  ? 'bg-rose-950 border border-rose-500 text-rose-300 font-bold shadow'
                  : 'hover:bg-slate-800 text-slate-200 border border-dashed border-slate-700'
              }`}
            >
              {sample_email?.from || 'Microsoft Security <support@microsoft-security-alert-verify.com>'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px] w-20">Reply-To:</span>
            <button
              type="button"
              onClick={() => handleIndicatorClick('ind-2', indicators.find(i => i.id === 'ind-2')?.clue || 'Mismatch external reply domain: Replies redirect to an external unauthorized inbox.')}
              className={`flex-1 text-left p-1.5 px-3 rounded-lg font-mono transition-all ${
                revealedIds.includes('ind-2')
                  ? 'bg-rose-950 border border-rose-500 text-rose-300 font-bold shadow'
                  : 'hover:bg-slate-800 text-slate-200 border border-dashed border-slate-700'
              }`}
            >
              {sample_email?.reply_to || 'admin@quick-auth-collector.net'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase text-[10px] w-20">Subject:</span>
            <span className="flex-1 font-bold text-slate-100">{sample_email?.subject || 'Action Required: Security Alert'}</span>
          </div>
        </div>

        {/* Email Body with Clickable Clue Zone */}
        <div className="p-8 bg-white text-slate-900 font-sans text-sm leading-relaxed space-y-4">
          <p>
            Your corporate account was flagged for unauthorized login attempts.
          </p>
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => handleIndicatorClick('ind-3', indicators.find(i => i.id === 'ind-3')?.clue || 'Artificial panic deadline: Threat actors create intense time pressure to force hasty compliance.')}
              className={`p-2 rounded font-bold transition-all text-left ${
                revealedIds.includes('ind-3')
                  ? 'bg-amber-100 border-2 border-amber-500 text-amber-900'
                  : 'text-amber-800 hover:bg-amber-50 border border-dashed border-amber-400'
              }`}
            >
              👉 Click here to verify your credentials within 2 hours or your account access will be revoked immediately.
            </button>
          </div>
        </div>
      </div>

      {/* Clue Inspector Card */}
      {selectedClue && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-fadeIn">
          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Security Indicator Discovered:
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedClue}</p>
        </div>
      )}

      {/* Footer Navigation Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-400 font-mono">
          Red Flags Uncovered: <span className="text-emerald-400">{revealedIds.length}</span> / {indicators.length}
        </span>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onComplete}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue to Next Lesson
        </Button>
      </div>
    </div>
  );
};

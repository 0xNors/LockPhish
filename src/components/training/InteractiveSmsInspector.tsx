import React, { useState } from 'react';
import { Smartphone, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { Button } from '../common/Button';

interface InteractiveSmsInspectorProps {
  moduleData: {
    instructions: string;
    chat_scenario: {
      messages: Array<{ sender: string; text: string }>;
      question: string;
      options: string[];
      correct_index: number;
    };
  };
  onComplete: () => void;
}

export const InteractiveSmsInspector: React.FC<InteractiveSmsInspectorProps> = ({
  moduleData,
  onComplete
}) => {
  const { chat_scenario, instructions } = moduleData;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selectedIndex === chat_scenario.correct_index;

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    if (selectedIndex === chat_scenario.correct_index) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-800/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
          Interactive Smishing Scenario Challenge
        </h4>
        <p className="text-xs text-sky-200/90 leading-relaxed">
          {instructions || 'Analyze the SMS exchange below and identify the critical security warning sign.'}
        </p>
      </div>

      {/* Simulated Chat Phone View */}
      <div className="max-w-md mx-auto p-4 bg-slate-950 border border-slate-800 rounded-3xl space-y-3 shadow-xl">
        {chat_scenario.messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-2xl text-xs max-w-[85%] ${
              m.sender === 'User'
                ? 'bg-emerald-600 text-white ml-auto rounded-br-none'
                : 'bg-slate-800 text-slate-100 mr-auto rounded-bl-none border border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold block mb-1 opacity-70">{m.sender}</span>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      {/* Analysis Question */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
          {chat_scenario.question}
        </h4>

        <div className="space-y-2">
          {chat_scenario.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!submitted) setSelectedIndex(idx);
              }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                selectedIndex === idx
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {submitted && (
          <div className={`p-3 rounded-xl border text-xs ${
            isCorrect ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'
          }`}>
            {isCorrect ? (
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Correct! Shortened links conceal fraudulent domains.
              </span>
            ) : (
              <span className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Incorrect. Review the message URL and retry.
              </span>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            size="sm"
            disabled={selectedIndex === null}
            onClick={handleSubmit}
            icon={<Award className="w-4 h-4" />}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, Clock, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { api } from '../../api/client';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_index?: number;
  explanation?: string;
  risk_domain?: string;
}

interface AssessmentRunnerProps {
  assessment: {
    id: string;
    title: string;
    passing_score: number;
    questions: Question[];
  };
  assignmentId?: string;
  attemptType?: 'PRE_TRAINING' | 'POST_TRAINING' | 'STANDALONE';
  onCompleted?: (result: any) => void;
  onClose?: () => void;
}

export const AssessmentRunner: React.FC<AssessmentRunnerProps> = ({
  assessment,
  assignmentId,
  attemptType = 'POST_TRAINING',
  onCompleted,
  onClose
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const questions = assessment.questions || [
    {
      id: 'q1',
      question: 'What is the primary indicator of a spoofed email sender?',
      options: ['The display name', 'The domain in Return-Path envelope headers', 'The signature image'],
      correct_index: 1,
      explanation: 'Return-Path and cryptographic headers provide authentic sender origin.'
    }
  ];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ || result) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(i => i - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (assignmentId && !assignmentId.startsWith('preview-')) {
        const res = await api.training.submitAssessment({
          assessment_id: assessment.id,
          assignment_id: assignmentId,
          attempt_type: attemptType,
          answers
        });
        setSubmitting(false);
        setResult(res);
        if (onCompleted) onCompleted(res);
      } else {
        // Preview mode calculation
        let correct = 0;
        const graded = questions.map(q => {
          const sel = answers[q.id];
          const isCorr = sel === q.correct_index;
          if (isCorr) correct++;
          return { ...q, is_correct: isCorr, user_answer_index: sel };
        });
        const score = Math.round((correct / questions.length) * 100);
        const passed = score >= (assessment.passing_score || 80);
        const res = {
          score,
          passed,
          passing_score: assessment.passing_score || 80,
          total_questions: questions.length,
          correct_count: correct,
          questions: graded,
          updated_risk_level: passed ? 'LOW' : 'MEDIUM'
        };
        setSubmitting(false);
        setResult(res);
        if (onCompleted) onCompleted(res);
      }
    } catch (err) {
      setSubmitting(false);
      console.error(err);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIdx(0);
    setResult(null);
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;

  if (result) {
    return (
      <div className="p-8 bg-slate-900 border-2 border-slate-800 rounded-3xl shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center border-2 shadow-xl ${
          result.passed
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400'
            : 'bg-rose-950/90 border-rose-500 text-rose-400'
        }`}>
          {result.passed ? <Award className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-2xl font-black text-slate-100">
              {result.passed ? '🎉 Assessment Passed & 100% Certified!' : '⚠️ Assessment Retest Required'}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Passing Standard: {result.passing_score}% &bull; Your Score: <strong className={result.passed ? 'text-emerald-400' : 'text-rose-400'}>{result.score}%</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 max-w-sm mx-auto text-xs font-mono">
          <div>
            <span className="text-slate-500 font-bold block text-[10px] uppercase font-sans">Final Score</span>
            <span className={`text-2xl font-black ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {result.score}%
            </span>
          </div>
          <div>
            <span className="text-slate-500 font-bold block text-[10px] uppercase font-sans">Curriculum Status</span>
            <Badge variant={result.passed ? 'low' : 'critical'} size="md" className="mt-1">
              {result.passed ? '100% COMPLETED' : 'RETAKE REQUIRED'}
            </Badge>
          </div>
        </div>

        {/* Answer Breakdown */}
        <div className="text-left space-y-2.5 max-h-64 overflow-y-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <span className="font-bold uppercase text-[10px] text-slate-400 font-mono block">Question Review & Security Guidance</span>
          {result.questions?.map((q: any, idx: number) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-slate-200">Q{idx + 1}: {q.question}</span>
                {q.is_correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{q.explanation}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {!result.passed && (
            <Button
              variant="outline"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={handleRetake}
            >
              Retake Assessment
            </Button>
          )}

          {onClose && (
            <Button
              variant="primary"
              size="md"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
            >
              Conclude & Return to Academy
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
      {/* Assessment Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <Badge variant="info" size="sm" className="mb-1.5">
            {attemptType.replace('_', ' ')}
          </Badge>
          <h3 className="text-base font-bold text-slate-100">{assessment.title}</h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-bold">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>
      </div>

      {/* Question Body */}
      {currentQ && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-100 leading-relaxed">
            {currentIdx + 1}. {currentQ.question}
          </h4>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = answers[currentQ.id] === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="inline-block w-5 font-mono text-slate-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <Button
          variant="outline"
          size="sm"
          disabled={currentIdx === 0}
          onClick={handlePrev}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentIdx < questions.length - 1 ? (
            <Button variant="secondary" size="sm" onClick={handleNext}>
              Next Question
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              disabled={!isAllAnswered}
              loading={submitting}
              onClick={handleSubmit}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Submit Assessment
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

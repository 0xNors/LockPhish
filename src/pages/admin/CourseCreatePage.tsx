import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Award,
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { api } from '../../api/client';

interface CourseCreatePageProps {
  navigate: (path: string) => void;
}

export const CourseCreatePage: React.FC<CourseCreatePageProps> = ({ navigate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('EMAIL_SECURITY');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [duration, setDuration] = useState(10);
  const [description, setDescription] = useState('');

  // Interactive Lesson Modules
  const [modules, setModules] = useState<Array<{ title: string; content: string }>>([
    { title: 'Understanding the Threat Vector', content: 'Modern cyber attacks exploit urgency and authority to manipulate human emotions.' },
    { title: 'Standard Operating Verification Procedure', content: 'Always verify unexpected requests out-of-band using official directory contact numbers.' }
  ]);

  // Assessment Builder Questions
  const [questions, setQuestions] = useState<Array<{
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
  }>>([
    {
      question: 'What is the primary indicator of a spoofed email sender?',
      options: [
        'The sender display name',
        'The authenticated envelope domain after the @ in Return-Path headers',
        'The company logo in the message body',
        'The time the email was sent'
      ],
      correct_index: 1,
      explanation: 'Envelope headers and Return-Path provide the authentic cryptographic origin.'
    }
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAddModule = () => {
    setModules(prev => [...prev, { title: '', content: '' }]);
  };

  const handleRemoveModule = (index: number) => {
    setModules(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateModule = (index: number, field: 'title' | 'content', value: string) => {
    setModules(prev => prev.map((m, i) => i === index ? { ...m, [field]: value } : m));
  };

  const handleAddQuestion = () => {
    setQuestions(prev => [
      ...prev,
      {
        question: '',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct_index: 0,
        explanation: ''
      }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestion = (index: number, field: string, value: any) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const newOpts = [...q.options];
      newOpts[optIdx] = value;
      return { ...q, options: newOpts };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Course title is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.training.createCourse({
        title,
        category,
        difficulty,
        duration_minutes: duration,
        description,
        modules: modules.map((m, i) => ({
          id: `mod-${i + 1}`,
          title: m.title || `Lesson ${i + 1}`,
          type: 'LESSON',
          content: m.content
        })),
        assessment: questions.length > 0 ? {
          title: `${title} Mastery Assessment`,
          passing_score: 80,
          questions: questions.map((q, i) => ({
            id: `q${i + 1}`,
            question: q.question,
            type: 'MULTIPLE_CHOICE',
            options: q.options,
            correct_index: q.correct_index,
            explanation: q.explanation
          }))
        } : undefined
      });

      setSaving(false);
      navigate('/admin/training');
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Failed to create training course.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/admin/training')}
        >
          Back to Courses
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Create Custom Training Course</h1>
          <p className="text-xs text-slate-400">Design interactive lessons, learning objectives, and custom scored quizzes.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Course Details */}
        <Card title="1. Course Overview" subtitle="General title and learning classification">
          <div className="space-y-4">
            <Input
              label="Course Title"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Advanced Spear Phishing & Executive Defense"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="EMAIL_SECURITY">Email Security</option>
                  <option value="SMS_SECURITY">SMS & Smishing Defense</option>
                  <option value="VOICE_SECURITY">Voice & Vishing Verification</option>
                  <option value="SOCIAL_ENGINEERING">Social Engineering Defense</option>
                  <option value="ACCOUNT_SECURITY">Credential & MFA Security</option>
                  <option value="COMPLIANCE">Regulatory Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="BEGINNER">🟢 Easy / Beginner</option>
                  <option value="INTERMEDIATE">🟡 Medium / Intermediate</option>
                  <option value="ADVANCED">🔴 Hard / Advanced</option>
                  <option value="EXPERT">🟣 Extreme / Expert</option>
                </select>
              </div>

              <Input
                label="Estimated Duration (Minutes)"
                type="number"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value, 10))}
              />
            </div>

            <Input
              label="Course Summary / Objectives"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Train employees to challenge urgent executive fund requests."
            />
          </div>
        </Card>

        {/* 2. Interactive Lesson Slides */}
        <Card title="2. Interactive Lesson Modules" subtitle="Add step-by-step training content for employees to study">
          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400">Lesson {idx + 1}</span>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveModule(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Input
                  label="Lesson Title"
                  value={mod.title}
                  onChange={e => handleUpdateModule(idx, 'title', e.target.value)}
                  placeholder="e.g. Deconstructing Executive Pretexting"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Lesson Educational Content
                  </label>
                  <textarea
                    rows={3}
                    value={mod.content}
                    onChange={e => handleUpdateModule(idx, 'content', e.target.value)}
                    placeholder="Provide clear educational guidance..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddModule}
            >
              Add Another Lesson
            </Button>
          </div>
        </Card>

        {/* 3. Scored Assessment Builder */}
        <Card title="3. Mastery Assessment Questions" subtitle="Create knowledge evaluation quizzes with passing grade requirements">
          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-400">Question {qIdx + 1}</span>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <Input
                  label="Question Prompt"
                  value={q.question}
                  onChange={e => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                  placeholder="e.g. What should you do when receiving an urgent payment request?"
                />

                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Multiple-Choice Options (Select radio button for Correct Answer)
                  </label>
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct_q_${qIdx}`}
                        checked={q.correct_index === optIdx}
                        onChange={() => handleUpdateQuestion(qIdx, 'correct_index', optIdx)}
                        className="text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="font-mono text-slate-500 text-xs w-4">{String.fromCharCode(65 + optIdx)}.</span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handleUpdateOption(qIdx, optIdx, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <Input
                  label="Correct Answer Explanation"
                  value={q.explanation}
                  onChange={e => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                  placeholder="e.g. Dual authorization is required for financial wire requests."
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddQuestion}
            >
              Add Assessment Question
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="md" type="button" onClick={() => navigate('/admin/training')}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
            Create & Publish Course
          </Button>
        </div>
      </form>
    </div>
  );
};

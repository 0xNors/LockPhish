import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Terminal,
  Copy,
  Check,
  PhoneCall,
  ExternalLink,
  BookOpen,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckSquare,
  Square,
  Activity,
  FileCode,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { getDefenseSop, DefenseSopDetail } from './defenseMasterData';

interface ModuleDefenseEngineProps {
  module: any;
  course: any;
  stepIndex?: number;
}

export const ModuleDefenseEngine: React.FC<ModuleDefenseEngineProps> = ({
  module,
  course,
  stepIndex = 0
}) => {
  // Retrieve the specialized defense SOP for this course/module
  const courseCode = course?.course_code || course?.code || module?.code || '';
  const courseTitle = course?.course_title || course?.title || module?.title || '';
  const courseCategory = course?.course_category || course?.category || '';

  const defense: DefenseSopDetail = getDefenseSop(courseCode, courseTitle, courseCategory);

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copiedAction, setCopiedAction] = useState(false);
  const [activePhaseTab, setActivePhaseTab] = useState<'ALL' | 'PHASE_1' | 'PHASE_2' | 'PHASE_3' | 'PHASE_4'>('ALL');

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistTotal = defense.checklist.length;
  const checklistCompleted = defense.checklist.filter(c => checkedItems[c.id]).length;
  const isAllChecked = checklistTotal > 0 && checklistCompleted === checklistTotal;

  const handleCopyAction = () => {
    navigator.clipboard.writeText(defense.incident_response_action);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2000);
  };

  const getSeverityVariant = (sev: string) => {
    if (sev.includes('P1')) return 'high';
    if (sev.includes('P2')) return 'medium';
    if (sev.includes('P3')) return 'low';
    return 'neutral';
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-xs space-y-6 animate-fadeIn font-sans text-slate-100 shadow-2xl">
      {/* Header Banner */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5 flex-1 min-w-[280px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SOP & Runbook Engine &bull; {defense.code}
            </span>
            <Badge variant={getSeverityVariant(defense.severity)} size="sm">
              {defense.severity}
            </Badge>
          </div>
          <h3 className="font-bold text-base text-slate-100 leading-snug">
            {defense.sop_title}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            {defense.strategic_objective}
          </p>
        </div>

        {/* Rapid Status Pill */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-right flex flex-col justify-center items-end min-w-[150px]">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Verification Progress</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-sm font-bold font-mono ${isAllChecked ? 'text-emerald-400' : 'text-amber-400'}`}>
              {checklistCompleted} / {checklistTotal} Verified
            </span>
            {isAllChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isAllChecked ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${checklistTotal ? (checklistCompleted / checklistTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActivePhaseTab('ALL')}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
            activePhaseTab === 'ALL'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All 4 Phases
        </button>
        <button
          onClick={() => setActivePhaseTab('PHASE_1')}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
            activePhaseTab === 'PHASE_1'
              ? 'bg-rose-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          1. Tactical Freeze
        </button>
        <button
          onClick={() => setActivePhaseTab('PHASE_2')}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
            activePhaseTab === 'PHASE_2'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          2. Root Verification
        </button>
        <button
          onClick={() => setActivePhaseTab('PHASE_3')}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
            activePhaseTab === 'PHASE_3'
              ? 'bg-blue-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          3. Containment
        </button>
        <button
          onClick={() => setActivePhaseTab('PHASE_4')}
          className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-medium transition-all ${
            activePhaseTab === 'PHASE_4'
              ? 'bg-purple-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          4. Tech Controls
        </button>
      </div>

      {/* 4-Phase Tactical Defense Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Phase 1: Tactical Freeze & Immediate Triage */}
        {(activePhaseTab === 'ALL' || activePhaseTab === 'PHASE_1') && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-800/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <div className="w-5 h-5 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 font-mono text-xs">
                  1
                </div>
                <span>Phase 1: Tactical Freeze & Immediate Triage</span>
              </div>
              <span className="text-[10px] font-mono bg-rose-900/60 text-rose-300 px-2 py-0.5 rounded-md border border-rose-700/50">
                Immediate (0-15s)
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11.5px] pl-7">
              {defense.step_1}
            </p>
          </div>
        )}

        {/* Phase 2: Technical Forensics & Out-of-Band Inspection */}
        {(activePhaseTab === 'ALL' || activePhaseTab === 'PHASE_2') && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-800/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs">
                  2
                </div>
                <span>Phase 2: Forensic & Out-of-Band Validation</span>
              </div>
              <span className="text-[10px] font-mono bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-md border border-amber-700/50">
                Inspection (15-60s)
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11.5px] pl-7">
              {defense.step_2}
            </p>
          </div>
        )}

        {/* Phase 3: Containment, Blast-Radius Mitigation & SOC Escalation */}
        {(activePhaseTab === 'ALL' || activePhaseTab === 'PHASE_3') && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-800/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <div className="w-5 h-5 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs">
                  3
                </div>
                <span>Phase 3: Containment & 1-Click SOC Report</span>
              </div>
              <span className="text-[10px] font-mono bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-md border border-blue-700/50">
                Action (60s SLA)
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11.5px] pl-7">
              {defense.step_3}
            </p>
          </div>
        )}

        {/* Phase 4: Enterprise Technical Controls & Architectural Hardening */}
        {(activePhaseTab === 'ALL' || activePhaseTab === 'PHASE_4') && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <div className="w-5 h-5 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-mono text-xs">
                  4
                </div>
                <span>Phase 4: Architectural Engineering Controls</span>
              </div>
              <span className="text-[10px] font-mono bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-md border border-purple-700/50">
                Prevention
              </span>
            </div>
            <p className="text-slate-200 leading-relaxed text-[11.5px] pl-7">
              {defense.step_4}
            </p>
          </div>
        )}
      </div>

      {/* Interactive Verification Checklist */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Interactive Threat Defense Verification Checklist</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click each box to verify defensive controls for this attack vector
          </span>
        </div>

        <div className="space-y-2.5">
          {defense.checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-100 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 hover:text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-0.5">
                  <span className={`font-bold text-xs block ${isChecked ? 'text-emerald-300' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {isAllChecked && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/80 rounded-xl flex items-center justify-between text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>All Defensive Verifications Completed for this Threat Vector!</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300">
              100% SOP Compliance
            </span>
          </div>
        )}
      </div>

      {/* Technical Standards & Direct SOC Action Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Official Standards */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Official Cybersecurity & Compliance Standards</span>
          </div>
          <div className="space-y-1.5">
            {defense.official_standards.map((std, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                <span className="font-mono">{std}</span>
              </div>
            ))}
          </div>
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-mono">MITRE ATT&CK:</span>
            {defense.mitre_techniques.map((tech, i) => (
              <span key={i} className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-amber-400 px-2 py-0.5 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Incident Response Playbook Command / Action */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>SOC Incident Response Runbook Action</span>
              </div>
              <button
                onClick={handleCopyAction}
                className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-emerald-400 bg-slate-950 px-2 py-1 rounded-md border border-slate-800 transition-all"
              >
                {copiedAction ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Action</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 font-mono text-[10.5px] text-emerald-300 break-all select-all leading-relaxed">
              {defense.incident_response_action}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80">
            <span>24/7 Rapid Response Desk: Ext #911</span>
            <span className="text-emerald-400">LockPhish Active SOC Guard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

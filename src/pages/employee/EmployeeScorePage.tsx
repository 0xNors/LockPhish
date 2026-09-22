import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Shield,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Lock,
  Mail,
  Smartphone,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingState } from '../../components/common/LoadingState';
import { RiskScoreCard, RiskTrendChart } from '../../components/analytics/AnalyticsComponents';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface EmployeeScorePageProps {
  navigate: (path: string) => void;
}

export const EmployeeScorePage: React.FC<EmployeeScorePageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScore();
  }, []);

  const loadScore = async () => {
    setLoading(true);
    try {
      if (user?.employee_id) {
        const [empData, achData] = await Promise.all([
          api.employees.get(user.employee_id),
          api.training.getAchievements()
        ]);
        setProfile(empData);
        setAchievements(achData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return <LoadingState message="Loading your security skill matrix and achievements..." />;
  }

  const score = profile.current_risk_score || 100;
  const riskLevel = profile.current_risk_level || 'LOW';

  // Dynamic Skill Matrix based on real events and trainings
  const reportingCount = profile.simulations_reported || 0;
  const failedCount = profile.simulations_failed || 0;
  const trainingsCompleted = profile.trainings_completed || 0;

  const reportingSkill = Math.min(100, Math.max(70, Math.round(75 + reportingCount * 10 - failedCount * 5)));
  const credentialSkill = failedCount === 0 ? 98 : Math.max(50, 98 - failedCount * 20);
  const domainSkill = Math.min(100, Math.max(65, Math.round(70 + trainingsCompleted * 8)));
  const emailSkill = Math.min(100, Math.max(70, Math.round(78 + reportingCount * 8)));
  const socialEngSkill = Math.min(100, Math.max(65, Math.round(75 + trainingsCompleted * 6 + reportingCount * 4)));
  const phishingDetection = Math.round((reportingSkill + credentialSkill + emailSkill + domainSkill) / 4);

  const skills = [
    { label: 'Phishing Detection', value: phishingDetection, desc: 'Recognizing deceptive lures and fake identity claims', icon: <Mail className="w-4 h-4 text-emerald-400" /> },
    { label: 'Email Analysis & Headers', value: emailSkill, desc: 'Inspecting Return-Path, SPF, and lookalike senders', icon: <Shield className="w-4 h-4 text-sky-400" /> },
    { label: 'Domain & Link Inspection', value: domainSkill, desc: 'Deconstructing root domains from subdomain prefixes', icon: <Globe className="w-4 h-4 text-amber-400" /> },
    { label: 'Social Engineering Defense', value: socialEngSkill, desc: 'Resisting urgency pressure and authority bias', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
    { label: 'Credential & MFA Safety', value: credentialSkill, desc: 'Zero password disclosure and OTP shielding', icon: <Lock className="w-4 h-4 text-rose-400" /> },
    { label: 'Incident Reporting Speed', value: reportingSkill, desc: '60-second breach notification protocol', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> }
  ];

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Security Skill Matrix & Defense Score</h1>
        <p className="text-xs text-slate-400 mt-1">
          Your resilience score reflects threat reporting speed, safe link inspection, and interactive academy completions.
        </p>
      </div>

      {/* Score and Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard
            score={score}
            riskLevel={riskLevel}
            title="Current Resilience Score"
            subtitle="Calculated from real behavioral events"
          />
        </div>

        <div className="lg:col-span-2">
          <Card title="Score History & Trajectory" subtitle="Tracking score progression following assessments and threat reports">
            <RiskTrendChart
              data={profile.risk_history?.map((r: any) => ({
                date: r.recorded_date,
                security_score: r.security_score
              })) || []}
            />
          </Card>
        </div>
      </div>

      {/* Section 24: Employee Security Skill Matrix */}
      <Card title="Cybersecurity Competency Skill Matrix" subtitle="Evaluated across 6 essential behavioral security domains">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {skills.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100">{s.label}</h4>
                    <span className="text-[10px] text-slate-400 block">{s.desc}</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">{s.value}%</span>
              </div>
              <ProgressBar value={s.value} size="sm" variant="emerald" />
            </div>
          ))}
        </div>
      </Card>

      {/* Gamification Achievements Grid */}
      <Card title="Security Defense Badges & Honors" subtitle="Earn badges through vigilant threat reporting and training completions">
        {achievements.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <Award className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs font-bold text-slate-300">Complete Training to Unlock Badges</p>
            <p className="text-[11px] text-slate-400">Complete your first awareness module or report an email simulation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="low" size="sm">Unlocked</Badge>
                </div>

                <div>
                  <h4 className="font-bold text-slate-100">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

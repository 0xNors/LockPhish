import React, { useState, useEffect } from 'react';
import {
  Shield,
  Target,
  BookOpen,
  Trophy,
  History,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Mail,
  Smartphone,
  PhoneCall,
  Layers,
  RotateCcw,
  Users,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingState } from '../../components/common/LoadingState';
import { RiskScoreCard } from '../../components/analytics/AnalyticsComponents';
import { api } from '../../api/client';
import { CyberHero } from '../../components/common/CyberHero';
import { useAuth } from '../../context/AuthContext';

interface EmployeeDashboardProps {
  navigate: (path: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [workforceEmployees, setWorkforceEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');

  const isAdmin = user?.role && ['SUPER_ADMIN', 'ORG_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER'].includes(user.role);

  useEffect(() => {
    loadWorkforce();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [selectedEmpId]);

  const loadWorkforce = async () => {
    if (isAdmin) {
      try {
        const empRes = await api.employees.list({ limit: 100 });
        setWorkforceEmployees(empRes.employees || []);
      } catch {}
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const targetEmpId = selectedEmpId || user?.employee_id;

      const [mRes, aRes] = await Promise.all([
        api.simulations.getMyMissions(),
        api.training.getMyAssignments()
      ]);
      setMissions(mRes || []);
      setAssignments(aRes || []);

      if (targetEmpId) {
        const emp = await api.employees.get(targetEmpId);
        setProfile(emp);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading your cybersecurity mission dashboard..." />;
  }

  const activeMissions = missions.filter(m => !['COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED'].includes(m.status));
  const completedMissions = missions.filter(m => ['COMPLETED', 'REPORTED', 'FAILED', 'CREDENTIALS_ENTERED'].includes(m.status));
  const pendingTraining = assignments.filter(a => a.status !== 'COMPLETED');
  const securityScore = profile?.current_risk_score ?? 100;
  const riskLevel = profile?.current_risk_level || 'LOW';

  return (
    <div className="space-y-6">
      <CyberHero
        title={`Defender Console — ${profile?.first_name ? profile.first_name : 'Operative'}`}
        subtitle="Your personal human-risk posture, assigned missions and training progress in real time."
        chips={[
          { label: 'Security Score', value: String(securityScore) },
          { label: 'Risk Level', value: riskLevel, tone: riskLevel === 'LOW' ? 'emerald' : 'amber' },
          { label: 'Missions', value: String(missions.length), tone: 'sky' },
          { label: 'Courses', value: String(assignments.length), tone: 'amber' }
        ]}
      />
      {/* Admin Persona Switcher Bar (If Admin viewing Employee View) */}
      {isAdmin && workforceEmployees.length > 0 && (
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Admin View As Employee:</span>
            <span className="text-slate-400">Preview any workforce member&apos;s dashboard</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedEmpId || user?.employee_id || ''}
              onChange={e => setSelectedEmpId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="">My Profile ({user?.full_name})</option>
              {workforceEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.email}) - Score: {emp.current_risk_score}
                </option>
              ))}
            </select>

            <Button
              variant="outline"
              size="sm"
              icon={<ArrowRightLeft className="w-3 h-3" />}
              onClick={() => navigate('/admin/dashboard')}
            >
              Admin Portal
            </Button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-black text-slate-100">
              {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.full_name || 'Team Member'}
            </h1>
            <Badge variant="low" size="sm">
              {profile?.job_title || 'Chief Administrator'}
            </Badge>
            <Badge variant="active" size="sm">
              {profile?.status === 'ACTIVE' ? '🟢 Active & Monitored' : (profile?.status || 'Active')}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Department: <strong className="text-emerald-400">{profile?.department_name || 'Executive & Leadership'}</strong> &bull; Email: <span className="font-mono text-slate-300">{profile?.email || user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadDashboard}
          >
            Refresh Hub
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Target className="w-3.5 h-3.5" />}
            onClick={() => navigate('/employee/missions')}
          >
            Active Missions ({activeMissions.length})
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard
            score={securityScore}
            riskLevel={riskLevel}
            title="My Security Resilience Score"
            subtitle="Calculated from real behavioral events & reporting"
          />
        </div>

        {/* Active Missions Quick Card */}
        <div className="lg:col-span-2">
          <Card
            title="Assigned Simulation Missions"
            subtitle="Practice identifying realistic email, SMS, and voice social engineering tactics"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/employee/missions')}>
                Mission Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            {activeMissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-200">No Pending Simulations</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                    All current security exercises are up-to-date. When your security team launches a campaign, missions appear here.
                  </p>
                </div>
                {isAdmin && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => navigate('/admin/campaigns/create')}
                  >
                    Launch Campaign from Admin Portal
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                {activeMissions.map((m) => {
                  const channelIcons: Record<string, React.ReactNode> = {
                    EMAIL: <Mail className="w-4 h-4 text-emerald-400" />,
                    SMS: <Smartphone className="w-4 h-4 text-sky-400" />,
                    VOICE: <PhoneCall className="w-4 h-4 text-amber-400" />,
                    MULTI_STAGE: <Layers className="w-4 h-4 text-purple-400" />
                  };

                  return (
                    <div key={m.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                          {channelIcons[m.channel] || <Target className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{m.scenario_name || 'Security Exercise'}</span>
                          <span className="text-[11px] text-slate-400">Channel: {m.channel} &bull; Difficulty: {m.scenario_difficulty || 'Medium'}</span>
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Play className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/employee/missions`)}
                      >
                        Enter Simulator
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Training Center Modules Quick List */}
      <Card
        title="My Assigned Training Modules"
        subtitle="Targeted remediation lessons & threat hunting games"
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate('/employee/training')}>
            Training Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
      >
        {pendingTraining.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs font-bold text-slate-200">100% Training Compliance</p>
            <p className="text-[11px] text-slate-400">You have completed all mandatory and adaptive awareness courses.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {pendingTraining.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-100">{t.course_title}</span>
                    <Badge variant={t.course_difficulty?.toLowerCase()} size="sm">{t.course_difficulty}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description || 'Targeted remediation module'}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <ProgressBar value={t.progress_percent} size="sm" variant="emerald" />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">{t.duration_minutes} min duration</span>
                    <Button variant="primary" size="sm" onClick={() => navigate('/employee/training')}>
                      {t.progress_percent > 0 ? 'Resume Lesson' : 'Start Course'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

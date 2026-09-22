import React, { useState, useEffect } from 'react';
import {
  Users,
  ArrowLeft,
  Shield,
  TrendingDown,
  BookOpen,
  Send,
  History,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { LoadingState } from '../../components/common/LoadingState';
import { RiskScoreCard, RiskTrendChart } from '../../components/analytics/AnalyticsComponents';
import { SimulationReplayModal } from '../../components/simulation/SimulationReplayModal';
import { api } from '../../api/client';

interface EmployeeDetailPageProps {
  employeeId: string;
  navigate: (path: string) => void;
}

export const EmployeeDetailPage: React.FC<EmployeeDetailPageProps> = ({ employeeId, navigate }) => {
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replayData, setReplayData] = useState<any>(null);

  useEffect(() => {
    loadDetail();
  }, [employeeId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await api.employees.get(employeeId);
      setEmployee(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReplay = async (simId: string) => {
    try {
      const replay = await api.simulations.getReplay(simId);
      setReplayData(replay);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !employee) {
    return <LoadingState message="Loading employee security profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/admin/employees')}
        >
          Back to Directory
        </Button>
      </div>

      {/* Employee Profile Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-slate-200">
            {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-100">{employee.first_name} {employee.last_name}</h1>
              <Badge variant={employee.status?.toLowerCase()} size="sm">{employee.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{employee.email}</p>
            <p className="text-xs text-slate-500 mt-1">
              {employee.job_title || 'Staff'} &bull; {employee.department_name || 'General Department'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={employee.current_risk_level?.toLowerCase()} size="md">
            {employee.current_risk_level} RISK
          </Badge>
        </div>
      </div>

      {/* Risk Metrics & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard
            score={employee.current_risk_score}
            riskLevel={employee.current_risk_level}
            title="Employee Security Score"
            subtitle="Individual human risk quantification"
          />
        </div>

        <div className="lg:col-span-2">
          <Card title="Risk Score Timeline (Past 30 Days)" subtitle="Historical risk evolution following simulation & training events">
            <RiskTrendChart
              data={employee.risk_history?.map((r: any) => ({
                date: r.recorded_date,
                security_score: r.security_score
              })) || []}
            />
          </Card>
        </div>
      </div>

      {/* Simulation History & Training Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation History Table */}
        <Card title="Simulation Mission History" subtitle="Authorized phishing, smishing, and voice assessments">
          {employee.simulations?.length > 0 ? (
            <Table
              data={employee.simulations as any[]}
              keyExtractor={(s: any) => s.id}
              columns={[
                { header: 'Scenario', accessor: (s: any) => <span className="font-bold text-slate-100">{s.scenario_name || s.scenario_category}</span> },
                { header: 'Channel', accessor: (s: any) => <Badge variant="info" size="sm">{s.channel}</Badge> },
                { header: 'Result', accessor: (s: any) => <Badge variant={s.status === 'REPORTED' ? 'low' : s.status === 'CREDENTIALS_ENTERED' ? 'critical' : 'medium'} size="sm">{s.status}</Badge> },
                {
                  header: 'Replay',
                  accessor: (s: any) => (
                    <Button variant="ghost" size="sm" onClick={() => handleOpenReplay(s.id)}>
                      Replay
                    </Button>
                  )
                }
              ]}
            />
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No simulation missions received yet.</p>
          )}
        </Card>

        {/* Assigned Training Modules */}
        <Card title="Assigned Training Courses" subtitle="Remediation courses & post-simulation learning modules">
          {employee.trainings?.length > 0 ? (
            <Table
              data={employee.trainings as any[]}
              keyExtractor={(t: any) => t.id}
              columns={[
                { header: 'Course', accessor: (t: any) => <span className="font-bold text-slate-100">{t.course_title}</span> },
                { header: 'Progress', accessor: (t: any) => <span className="font-mono text-xs">{t.progress_percent}%</span> },
                { header: 'Post Score', accessor: (t: any) => <span className="font-mono font-bold text-emerald-400">{t.score_post_assessment ? `${t.score_post_assessment}%` : '-'}</span> },
                { header: 'Status', accessor: (t: any) => <Badge variant={t.status === 'COMPLETED' ? 'low' : 'medium'} size="sm">{t.status}</Badge> }
              ]}
            />
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No training assigned yet.</p>
          )}
        </Card>
      </div>

      {/* Behavioral Event Stream */}
      <Card title="Behavioral Audit Events" subtitle="Raw behavioral telemetry captured across security simulations">
        {employee.recent_events?.length > 0 ? (
          <div className="space-y-2 text-xs">
            {employee.recent_events.map((ev: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 font-mono">{ev.event_type}</span>
                  <span className="text-[11px] text-slate-500 ml-2">Channel: {ev.channel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[11px] ${ev.risk_weight > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ev.risk_weight > 0 ? `+${ev.risk_weight} risk penalty` : `${ev.risk_weight} risk reward`}
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No behavioral events recorded yet.</p>
        )}
      </Card>

      {/* Safe Simulation Replay Modal */}
      <SimulationReplayModal
        isOpen={Boolean(replayData)}
        onClose={() => setReplayData(null)}
        replayData={replayData}
      />
    </div>
  );
};

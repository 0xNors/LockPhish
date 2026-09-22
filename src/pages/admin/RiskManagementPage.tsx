import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Users,
  Building2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Sliders,
  Sparkles,
  Lock,
  Crown,
  KeyRound,
  Shield,
  Activity,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingState } from '../../components/common/LoadingState';
import { RiskScoreCard, DepartmentRiskHeatmap, RiskTrendChart } from '../../components/analytics/AnalyticsComponents';
import { api } from '../../api/client';

interface RiskManagementPageProps {
  navigate: (path: string) => void;
}

export const RiskManagementPage: React.FC<RiskManagementPageProps> = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [orgRisk, setOrgRisk] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FORMULA' | 'PRIVILEGE' | 'REMEDIATION' | 'SIMULATOR'>('OVERVIEW');

  // Interactive Risk Simulator State
  const [simulatedTrainingCoverage, setSimulatedTrainingCoverage] = useState<number>(85);
  const [simulatedReportingRate, setSimulatedReportingRate] = useState<number>(75);
  const [simulatedCompromiseRate, setSimulatedCompromiseRate] = useState<number>(5);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    setLoading(true);
    try {
      const [riskData, deptData, empRes, trendData] = await Promise.all([
        api.risk.getOrgRisk(),
        api.analytics.getDepartments(),
        api.employees.list({ limit: 20 }),
        api.analytics.getTrends(30)
      ]);
      setOrgRisk(riskData);
      setDepartments(deptData || []);
      setEmployees(empRes.employees || []);
      setTrends(trendData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !orgRisk) {
    return <LoadingState message="Calculating human risk scores and department distributions..." />;
  }

  // Calculate simulated HRI score
  // HRI = 0.35 * (CompromiseRate) + 0.25 * (100 - ReportingRate) + 0.20 * (100 - TrainingCoverage) + 0.20 * (PrivilegeMultiplier = 15)
  const simulatedHriRisk = Math.round(
    0.35 * simulatedCompromiseRate +
    0.25 * (100 - simulatedReportingRate) +
    0.20 * (100 - simulatedTrainingCoverage) +
    0.20 * 15
  );
  const simulatedResilienceScore = Math.max(10, Math.min(99, 100 - simulatedHriRisk));

  // High-Risk Repeat Clickers
  const highRiskEmployees = employees.filter(e => e.simulations_failed > 0 || e.current_risk_level === 'HIGH' || e.current_risk_level === 'CRITICAL');

  // Privileged VIP Roles
  const privilegedRoles = [
    {
      group: 'C-Suite & Executive Leadership',
      riskMultiplier: '3.5x',
      exposure: 'Wire transfers, strategic IP, M&A confidential memos',
      recommendedDrills: 'Executive Impersonation (BEC) & Out-of-Band Callbacks',
      count: departments.find(d => d.name?.includes('Executive') || d.name?.includes('Leadership'))?.employee_count || 3
    },
    {
      group: 'Finance & Treasury Wire Signers',
      riskMultiplier: '3.0x',
      exposure: 'ERP direct deposit changes, SWIFT wire routing, vendor bank modification',
      recommendedDrills: 'Urgent Vendor Invoice Redirection & W-9 Fraud',
      count: departments.find(d => d.name?.includes('Finance') || d.name?.includes('Accounting'))?.employee_count || 6
    },
    {
      group: 'IT & Cloud Infrastructure Admins',
      riskMultiplier: '3.8x',
      exposure: 'AWS/Azure root keys, SSO IdP tokens, MFA enrollment bypass',
      recommendedDrills: 'OAuth Device Code Phishing & Reverse Proxy AitM Bypass',
      count: departments.find(d => d.name?.includes('IT') || d.name?.includes('Engineering'))?.employee_count || 8
    },
    {
      group: 'Human Resources & People Ops',
      riskMultiplier: '2.4x',
      exposure: 'Employee PII, SSNs, compensation spreadsheets, resume macro attachments',
      recommendedDrills: 'Weaponized Resume Macros & QR Code Quishing',
      count: departments.find(d => d.name?.includes('Human') || d.name?.includes('HR'))?.employee_count || 4
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Human Risk Quantification & Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mathematical Human Risk Index (HRI), privileged role exposure multipliers, repeat offender remediation, and predictive simulations.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={loadRiskData}
        >
          Recalculate HRI Engine
        </Button>
      </div>

      {/* Top Risk Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard
            score={orgRisk.avg_security_score}
            riskLevel={orgRisk.overall_risk_level}
            title="Enterprise Human Risk Index (HRI)"
            subtitle="Normalized resilience score from active SQLite database telemetry"
          />
        </div>

        <div className="lg:col-span-2">
          <Card title="Workforce Risk Distribution" subtitle="Risk grade segmentation across monitored personnel">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">Low Risk</span>
                <span className="text-2xl font-black text-emerald-300 mt-1 block font-mono">{orgRisk.risk_distribution.LOW}</span>
                <span className="text-[10px] text-emerald-400/80 mt-0.5 block">&gt;85 resilience</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-center">
                <span className="text-[10px] font-bold uppercase text-amber-400 block font-mono">Medium Risk</span>
                <span className="text-2xl font-black text-amber-300 mt-1 block font-mono">{orgRisk.risk_distribution.MEDIUM}</span>
                <span className="text-[10px] text-amber-400/80 mt-0.5 block">65-84 score</span>
              </div>

              <div className="p-4 rounded-xl bg-orange-950/40 border border-orange-800/60 text-center">
                <span className="text-[10px] font-bold uppercase text-orange-400 block font-mono">High Risk</span>
                <span className="text-2xl font-black text-orange-300 mt-1 block font-mono">{orgRisk.risk_distribution.HIGH}</span>
                <span className="text-[10px] text-orange-400/80 mt-0.5 block">40-64 score</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-center">
                <span className="text-[10px] font-bold uppercase text-rose-400 block font-mono">Critical Risk</span>
                <span className="text-2xl font-black text-rose-300 mt-1 block font-mono">{orgRisk.risk_distribution.CRITICAL}</span>
                <span className="text-[10px] text-rose-400/80 mt-0.5 block">&lt;40 score</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'Vulnerability Heatmap & Score Trajectory', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'FORMULA', label: 'Mathematical HRI Formula', icon: <Calculator className="w-3.5 h-3.5" /> },
          { id: 'PRIVILEGE', label: 'Privileged Access Multipliers', icon: <Crown className="w-3.5 h-3.5" /> },
          { id: 'REMEDIATION', label: 'Repeat Clicker Remediation', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
          { id: 'SIMULATOR', label: 'Predictive Resilience Sandbox', icon: <Sliders className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 border border-emerald-500/70 text-emerald-300 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW HEATMAP & TREND */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-fadeIn">
          <Card title="Organization Risk Score Trajectory (30 Days)" subtitle="30-day aggregate score trajectory after campaigns and assessments">
            <RiskTrendChart data={trends} />
          </Card>

          <div>
            <h2 className="text-base font-bold text-slate-100 mb-3">Department Risk Heatmap</h2>
            <DepartmentRiskHeatmap departments={departments} />
          </div>

          <Card
            title="Workforce Risk Roster"
            subtitle="Personnel ordered by vulnerability requiring targeted drill assignments"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
                All Workforce <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            <Table
              data={employees}
              keyExtractor={e => e.id}
              columns={[
                {
                  header: 'Employee',
                  accessor: e => (
                    <div>
                      <span className="font-bold text-slate-100 block">{e.first_name} {e.last_name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{e.email}</span>
                    </div>
                  )
                },
                {
                  header: 'Department',
                  accessor: e => <span className="text-slate-300">{e.department_name || 'General'}</span>
                },
                {
                  header: 'Security Score',
                  accessor: e => (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{e.current_risk_score}/100</span>
                      <Badge variant={e.current_risk_level.toLowerCase()} size="sm">
                        {e.current_risk_level}
                      </Badge>
                    </div>
                  )
                },
                {
                  header: 'Simulations',
                  accessor: e => (
                    <span className="text-slate-400 font-mono text-[11px]">
                      {e.simulations_reported} rep / {e.simulations_failed} fail
                    </span>
                  )
                },
                {
                  header: 'Action',
                  accessor: e => (
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/employees/${e.id}`)}>
                      Profile
                    </Button>
                  )
                }
              ]}
            />
          </Card>
        </div>
      )}

      {/* TAB 2: MATHEMATICAL HRI FORMULA */}
      {activeTab === 'FORMULA' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-slate-900 border-2 border-emerald-500/50 rounded-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">LockPhish Mathematical Human Risk Quantification Model</h3>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-center text-sm text-emerald-300">
              HRI = w₁ &times; CompromiseRate + w₂ &times; (100 - ReportingRate) + w₃ &times; (100 - TrainingCoverage) + w₄ &times; PrivilegeMultiplier
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">Weight w₁ = 35%</span>
                <strong className="block text-slate-200">Compromise Rate (C)</strong>
                <p className="text-[11px] text-slate-400">Percentage of personnel submitting credentials, executing macros, or granting OAuth tokens.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-sky-400 block font-mono">Weight w₂ = 25%</span>
                <strong className="block text-slate-200">Threat Inaction Rate (R)</strong>
                <p className="text-[11px] text-slate-400">Inverse of threat reporting efficacy. Higher reporting significantly drives down enterprise risk.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400 block font-mono">Weight w₃ = 20%</span>
                <strong className="block text-slate-200">Training Deficit (T)</strong>
                <p className="text-[11px] text-slate-400">Percentage of assigned mandatory and adaptive LMS masterclasses remaining uncompleted.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-400 block font-mono">Weight w₄ = 20%</span>
                <strong className="block text-slate-200">Privilege Exposure (P)</strong>
                <p className="text-[11px] text-slate-400">Weighted multiplier accounting for high-privilege executive, finance, and root cloud credentials.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRIVILEGED ACCESS EXPOSURE MULTIPLIERS */}
      {activeTab === 'PRIVILEGE' && (
        <div className="space-y-6 animate-fadeIn">
          <Card
            title="High-Privilege Account Exposure Matrix"
            subtitle="Why social engineering against key personnel carries up to 3.8x higher risk impact"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {privilegedRoles.map((role, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-slate-100 text-sm">{role.group}</h4>
                      </div>
                      <Badge variant="critical" size="sm">
                        {role.riskMultiplier} Risk Multiplier
                      </Badge>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                      <div>
                        <span className="text-slate-400">Target Cohort Size:</span>
                        <strong className="text-slate-200 ml-1.5">{role.count} Personnel</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Critical Threat Exposure:</span>
                        <p className="text-slate-300 mt-0.5">{role.exposure}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold">Recommended Drill: {role.recommendedDrills}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/admin/campaigns/create')}
                    >
                      Launch VIP Drill
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: REPEAT OFFENDER REMEDIATION */}
      {activeTab === 'REMEDIATION' && (
        <div className="space-y-6 animate-fadeIn">
          <Card
            title="Susceptible Personnel Remediation Queue"
            subtitle="Automated adaptive micro-learning assigned to staff who fell for simulated campaigns"
          >
            {highRiskEmployees.length === 0 ? (
              <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-slate-200">Zero Critical Repeat Offenders</h4>
                <p className="text-xs text-slate-400">All workforce members are currently meeting required security thresholds.</p>
              </div>
            ) : (
              <Table
                data={highRiskEmployees}
                keyExtractor={e => e.id}
                columns={[
                  {
                    header: 'Vulnerable Employee',
                    accessor: e => (
                      <div>
                        <span className="font-bold text-slate-100 block">{e.first_name} {e.last_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{e.email}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Susceptibility',
                    accessor: e => (
                      <span className="text-rose-400 font-bold font-mono">
                        {e.simulations_failed} Compromise Failures
                      </span>
                    )
                  },
                  {
                    header: 'Current Rating',
                    accessor: e => (
                      <Badge variant={e.current_risk_level.toLowerCase()} size="sm">
                        {e.current_risk_level} ({e.current_risk_score}/100)
                      </Badge>
                    )
                  },
                  {
                    header: 'Remediation Status',
                    accessor: e => (
                      <Badge variant="medium" size="sm">
                        Mandatory Remediation Active
                      </Badge>
                    )
                  },
                  {
                    header: 'Action',
                    accessor: e => (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/admin/employees/${e.id}`)}
                      >
                        Inspect & Assign Drill
                      </Button>
                    )
                  }
                ]}
              />
            )}
          </Card>
        </div>
      )}

      {/* TAB 5: PREDICTIVE RESILIENCE SANDBOX */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-6 animate-fadeIn">
          <Card
            title="Predictive Human Risk Sandbox Simulator"
            subtitle="Adjust target workforce behaviors to forecast overall organization resilience score impact"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-slate-300">Workforce Training Academy Completion:</span>
                    <span className="text-emerald-400 font-mono">{simulatedTrainingCoverage}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={simulatedTrainingCoverage}
                    onChange={e => setSimulatedTrainingCoverage(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-slate-300">Staff Threat Reporting Efficacy:</span>
                    <span className="text-sky-400 font-mono">{simulatedReportingRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulatedReportingRate}
                    onChange={e => setSimulatedReportingRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-bold text-xs">
                    <span className="text-slate-300">Simulation Click / Compromise Failure Rate:</span>
                    <span className="text-rose-400 font-mono">{simulatedCompromiseRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={simulatedCompromiseRate}
                    onChange={e => setSimulatedCompromiseRate(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-950 border-2 border-emerald-500/80 rounded-3xl text-center space-y-3 shadow-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-mono">
                  Forecasted Organization Resilience
                </span>
                <span className="text-5xl font-black text-emerald-400 block font-mono">
                  {simulatedResilienceScore}/100
                </span>
                <Badge
                  variant={simulatedResilienceScore > 85 ? 'low' : simulatedResilienceScore > 65 ? 'medium' : 'high'}
                  size="md"
                >
                  {simulatedResilienceScore > 85 ? 'Low Enterprise Risk' : simulatedResilienceScore > 65 ? 'Moderate Enterprise Risk' : 'High Enterprise Risk'}
                </Badge>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Achieving a {simulatedTrainingCoverage}% training completion rate combined with a {simulatedReportingRate}% reporting rate lowers enterprise breach probability by {Math.round((simulatedResilienceScore / 100) * 82)}%.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Users,
  Send,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  Plus,
  Play,
  TrendingDown,
  Activity,
  FileSpreadsheet,
  Radio,
  UserCheck,
  RefreshCw,
  Folder,
  FolderOpen,
  Trash2,
  Sparkles,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { MetricCard } from '../../components/common/MetricCard';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { RiskScoreCard, ChannelComparisonChart, DepartmentRiskHeatmap } from '../../components/analytics/AnalyticsComponents';
import { CyberHero } from '../../components/common/CyberHero';
import { api } from '../../api/client';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>({
    employees: { total: 0, avg_security_score: 100, distribution: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 } },
    campaigns: { total: 0, active: 0, completed: 0 },
    simulations: { total: 0, completed: 0, reported: 0, compromised: 0, reporting_rate: 0, compromise_rate: 0 },
    training: { total_assigned: 0, completed: 0, completion_rate: 0, improvement_delta: 0 }
  });
  const [channels, setChannels] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [liveActivities, setLiveActivities] = useState<any[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');

  // Add Employee Quick Modal
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [deptId, setDeptId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'TRAINER' | 'CAMPAIGN_MANAGER' | 'ORG_ADMIN'>('EMPLOYEE');
  const [password, setPassword] = useState('LockPhish2026!');
  const [savingEmp, setSavingEmp] = useState(false);
  const [empError, setEmpError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete Employee Confirmation
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ovData, chData, deptData, campData, empData, actData] = await Promise.allSettled([
        api.analytics.getOverview(),
        api.analytics.getChannels(),
        api.analytics.getDepartments(),
        api.campaigns.list({ limit: 10 }),
        api.employees.list({ limit: 100 }),
        api.activity.getStream({ limit: 10 })
      ]);

      if (ovData.status === 'fulfilled') setOverview(ovData.value);
      if (chData.status === 'fulfilled') setChannels(chData.value);
      if (deptData.status === 'fulfilled') setDepartments(deptData.value || []);
      if (campData.status === 'fulfilled') setCampaigns(campData.value || []);
      if (empData.status === 'fulfilled') setEmployees(empData.value?.employees || []);
      if (actData.status === 'fulfilled') setLiveActivities(actData.value?.activities || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmp(true);
    setEmpError('');
    try {
      const targetDept = deptId || (departments.length > 0 ? departments[0].id : undefined);
      const created = await api.employees.create({
        first_name: firstName,
        last_name: lastName,
        email,
        department_id: targetDept,
        job_title: jobTitle || 'Staff Member',
        role,
        password: password || undefined
      });
      setSavingEmp(false);
      setShowAddEmpModal(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setJobTitle('');
      setSuccessMsg(`Employee ${created.first_name} ${created.last_name} (${created.email}) created successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      loadDashboardData();
    } catch (err: any) {
      setSavingEmp(false);
      setEmpError(err.message || 'Failed to create employee');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.employees.deactivate(deleteTarget.id);
      setDeleting(false);
      setDeleteTarget(null);
      setSuccessMsg('Employee removed successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
      loadDashboardData();
    } catch (err) {
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Aggregating enterprise human-risk telemetry..." />;
  }

  const filteredEmployees = employees.filter(e => {
    if (!employeeSearch) return true;
    const q = employeeSearch.toLowerCase();
    return (
      (e.first_name || '').toLowerCase().includes(q) ||
      (e.last_name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.job_title || '').toLowerCase().includes(q) ||
      (e.department_name || '').toLowerCase().includes(q)
    );
  });

  const hasEmployees = employees.length > 0;
  const hasCampaigns = campaigns.length > 0;

  return (
    <div className="space-y-8">
      {/* Cyber Command Hero */}
      <CyberHero
        title="Security Command Center"
        subtitle="Real-time human risk quantification, monitored workforce directory, and active security simulations."
        chips={[
          { label: 'Workforce', value: String(overview.employees.total) },
          { label: 'Security Score', value: String(overview.employees.avg_security_score) },
          { label: 'Active Campaigns', value: String(overview.campaigns.active), tone: 'sky' },
          { label: 'Reporting Rate', value: `${overview.simulations.reporting_rate}%`, tone: 'amber' }
        ]}
      />

      <div className="flex justify-end gap-2.5 flex-wrap">
        <Button variant="secondary" size="sm" icon={<Users className="w-3.5 h-3.5" />} onClick={() => setShowAddEmpModal(true)}>
          + Add Employee
        </Button>
        <Button variant="secondary" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/scenarios/create')}>
          + Build Scenario
        </Button>
        <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => navigate('/admin/campaigns/create')}>
          Launch Campaign
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monitored Workforce"
          value={overview?.employees?.total || employees.length}
          subtitle="Active workforce profiles"
          icon={<Users className="w-5 h-5" />}
          variant="emerald"
        />

        <MetricCard
          title="Active Campaigns"
          value={overview?.campaigns?.active || 0}
          subtitle={`${overview?.campaigns?.total || 0} lifetime campaigns`}
          icon={<Send className="w-5 h-5" />}
          variant="sky"
        />

        <MetricCard
          title="Threat Reporting Rate"
          value={`${overview?.simulations?.reporting_rate || 0}%`}
          subtitle={`${overview?.simulations?.reported || 0} threats safely reported`}
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="emerald"
        />

        <MetricCard
          title="Training Completion"
          value={`${overview?.training?.completion_rate || 0}%`}
          subtitle={`${overview?.training?.completed || 0} of ${overview?.training?.total_assigned || 0} assigned`}
          icon={<BookOpen className="w-5 h-5" />}
          variant="amber"
        />
      </div>

      {/* 1. Monitored Workforce & Department Hierarchy */}
      <Card
        title="Monitored Workforce Directory"
        subtitle={`All active employees in organization (${employees.length} total)`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Users className="w-3.5 h-3.5" />}
              onClick={() => setShowAddEmpModal(true)}
            >
              Add Employee
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
              Department Folders View <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Quick Search inside Workforce table */}
          {hasEmployees && (
            <div className="flex items-center justify-between gap-3 pb-2">
              <input
                type="text"
                placeholder="Search workforce by name, email, department..."
                value={employeeSearch}
                onChange={e => setEmployeeSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-72"
              />
              <span className="text-xs font-mono text-slate-500">{filteredEmployees.length} of {employees.length} staff displayed</span>
            </div>
          )}

          {!hasEmployees ? (
            <EmptyState
              title="No employees added yet"
              description="Add your employees to monitor their security score and launch targeted threat simulations."
              actionText="Add Employee"
              onAction={() => setShowAddEmpModal(true)}
            />
          ) : (
            <Table
              data={filteredEmployees}
              keyExtractor={e => e.id}
              onRowClick={e => navigate(`/admin/employees/${e.id}`)}
              columns={[
                {
                  header: 'Employee Name',
                  accessor: e => (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {e.first_name?.charAt(0)}{e.last_name?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 block">{e.first_name} {e.last_name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{e.email}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Department Folder',
                  accessor: e => (
                    <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                      <Folder className="w-3.5 h-3.5 text-amber-400" />
                      {e.department_name || 'General'}
                    </span>
                  )
                },
                {
                  header: 'Job Title',
                  accessor: e => <span className="text-slate-400">{e.job_title || 'Staff Member'}</span>
                },
                {
                  header: 'Security Score',
                  accessor: e => (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{e.current_risk_score}/100</span>
                      <Badge variant={e.current_risk_level?.toLowerCase() || 'low'} size="sm">
                        {e.current_risk_level || 'LOW'}
                      </Badge>
                    </div>
                  )
                },
                {
                  header: 'Simulations',
                  accessor: e => (
                    <span className="text-slate-400 font-mono text-[11px]">
                      {e.simulations_reported || 0} rep / {e.simulations_failed || 0} fail
                    </span>
                  )
                },
                {
                  header: 'Action',
                  accessor: e => (
                    <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/employees/${e.id}`)}>
                        Profile <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                      <button
                        onClick={() => setDeleteTarget(e)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Remove employee"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </Card>

      {/* 2. Score Overview & Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskScoreCard
            score={overview?.employees?.avg_security_score || 100}
            riskLevel={
              (overview?.employees?.avg_security_score || 100) >= 85
                ? 'LOW'
                : (overview?.employees?.avg_security_score || 100) >= 65
                ? 'MEDIUM'
                : 'HIGH'
            }
          />
        </div>

        <div className="lg:col-span-2">
          <Card
            title="Multi-Channel Threat Simulations"
            subtitle="Phishing, Smishing, Controlled Voice, and Multi-Stage breakdown"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/results')}>
                All Results <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            }
          >
            {channels ? (
              <ChannelComparisonChart channels={channels} />
            ) : (
              <EmptyState title="No simulation telemetry" description="Launch a campaign to begin gathering multi-channel telemetry." />
            )}
          </Card>
        </div>
      </div>

      {/* 3. Department Workforce & Active Campaigns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Workforce Overview Widget */}
        <Card
          title="Department Workforce & Risk Overview"
          subtitle="Real-time employee counts and average resilience scores by department"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/employees')}>
              All Departments <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          {departments.length === 0 ? (
            <EmptyState title="No departments configured" description="Create departments to organize workforce by business division." />
          ) : (
            <div className="space-y-2.5 text-xs">
              {departments.map((dept, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/admin/workforce/department/${dept.id}`)}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-emerald-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:text-emerald-400 group-hover:border-emerald-800/60 shrink-0">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-slate-200 group-hover:text-emerald-300 block truncate">{dept.name}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {dept.employee_count === 1 ? '1 Staff Member' : `${dept.employee_count || 0} Staff Members`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={dept.avg_security_score >= 85 ? 'low' : 'medium'} size="sm">
                      {dept.avg_security_score || 100} Score
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Campaigns Table */}
        <Card
          title="Active Security Campaigns"
          subtitle="Real-time status of authorized simulation missions"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/campaigns')}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          {hasCampaigns ? (
            <Table
              data={campaigns}
              keyExtractor={c => c.id}
              onRowClick={c => navigate(`/admin/campaigns/${c.id}`)}
              columns={[
                { header: 'Campaign', accessor: c => <span className="font-bold text-slate-100">{c.name}</span> },
                { header: 'Channel', accessor: c => <Badge variant="info" size="sm">{c.channel}</Badge> },
                { header: 'Status', accessor: c => <Badge variant={c.status.toLowerCase()} size="sm">{c.status}</Badge> },
                { header: 'Targets', accessor: c => <span className="font-mono text-slate-300">{c.target_count || 0}</span> }
              ]}
            />
          ) : (
            <EmptyState
              title="No campaigns yet"
              description="Create your first security campaign to begin measuring employee resilience."
              actionText="Create Campaign"
              onAction={() => navigate('/admin/campaigns/create')}
            />
          )}
        </Card>
      </div>

      {/* 4. Department Risk Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100">Department Risk & Vulnerability Matrix</h2>
            <p className="text-xs text-slate-400">Comparing human risk scores and reporting efficacy across organizational units.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/departments')}>
            Manage Departments
          </Button>
        </div>

        {departments.length > 0 ? (
          <DepartmentRiskHeatmap departments={departments} />
        ) : (
          <EmptyState
            title="No departments configured"
            description="Add departments to segment simulation campaigns and pinpoint high-risk teams."
            actionText="Add Department"
            onAction={() => navigate('/admin/departments')}
          />
        )}
      </div>

      {/* Quick Add Employee Modal */}
      <Modal
        isOpen={showAddEmpModal}
        onClose={() => setShowAddEmpModal(false)}
        title="Add Monitored Employee"
        subtitle="Provision employee profile into department folder"
        maxWidth="md"
      >
        <form onSubmit={handleQuickAddEmployee} className="space-y-4 text-xs">
          {empError && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
              {empError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Jane"
            />
            <Input
              label="Last Name"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Doe"
            />
          </div>

          <Input
            label="Corporate Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="jane.doe@company.com"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Department Folder *
              </label>
              <select
                value={deptId || (departments.length > 0 ? departments[0].id : '')}
                onChange={e => setDeptId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Job Title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Financial Analyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                System Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="TRAINER">Trainer</option>
                <option value="CAMPAIGN_MANAGER">Campaign Manager</option>
                <option value="ORG_ADMIN">Organization Admin</option>
              </select>
            </div>

            <Input
              label="Initial Password"
              type="text"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddEmpModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={savingEmp}>
              Create Employee Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Permanently Delete Employee Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Employee Profile"
        message={`Are you sure you want to remove ${deleteTarget?.first_name} ${deleteTarget?.last_name} (${deleteTarget?.email})?`}
        confirmText="Remove Employee"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

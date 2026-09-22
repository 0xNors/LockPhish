import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  Trash2,
  Mail,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Folder,
  LayoutGrid,
  List,
  Building2,
  ChevronRight,
  UserPlus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Phone,
  Briefcase,
  User,
  Rocket,
  ShieldAlert,
  Play,
  TrendingDown,
  Lock,
  Layers,
  X
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmailClientSimulator } from '../../components/simulation/EmailClientSimulator';
import { SmsClientSimulator } from '../../components/simulation/SmsClientSimulator';
import { VoiceCallSimulator } from '../../components/simulation/VoiceCallSimulator';
import { MultiStageSimulator } from '../../components/simulation/MultiStageSimulator';
import { api } from '../../api/client';
import { Employee } from '../../types';

interface EmployeesPageProps {
  navigate: (path: string) => void;
}

export const EmployeesPage: React.FC<EmployeesPageProps> = ({ navigate }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [passwordRequests, setPasswordRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // View mode: 'FOLDER' (by Department) vs 'TABLE' (flat list)
  const [viewMode, setViewMode] = useState<'FOLDER' | 'TABLE'>('FOLDER');

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'TRAINER' | 'CAMPAIGN_MANAGER' | 'ORG_ADMIN'>('EMPLOYEE');
  const [password, setPassword] = useState('LockPhish2026!');
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Direct Admin Password Reset Modal (for any employee)
  const [resetTargetEmployee, setResetTargetEmployee] = useState<any>(null);
  const [selectedResetRequest, setSelectedResetRequest] = useState<any>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('NewPassword2026!');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  // Delete Employee Confirmation
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Direct Simulation Launch Modal
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [launchingSimId, setLaunchingSimId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [deptFilter, riskFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empSettled, deptsSettled, pwdSettled] = await Promise.allSettled([
        api.employees.list({
          department_id: deptFilter !== 'ALL' ? deptFilter : undefined,
          risk_level: riskFilter !== 'ALL' ? riskFilter : undefined,
          limit: 200
        }),
        api.org.getDepartments(),
        api.auth.getPasswordRequests()
      ]);

      if (empSettled.status === 'fulfilled') {
        setEmployees(empSettled.value.employees || []);
      }
      if (deptsSettled.status === 'fulfilled') {
        setDepartments(deptsSettled.value || []);
      }
      if (pwdSettled.status === 'fulfilled') {
        setPasswordRequests(pwdSettled.value || []);
      }
    } catch (err: any) {
      console.error('Failed to load employees data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = (targetDepartmentId?: string) => {
    if (targetDepartmentId) {
      setDepartmentId(targetDepartmentId);
    } else if (departments.length > 0) {
      setDepartmentId(departments[0].id);
    } else {
      setDepartmentId('');
    }
    setAddError('');
    setShowAddModal(true);
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setAddError('Please fill in employee name and corporate email address.');
      return;
    }

    setSaving(true);
    setAddError('');
    try {
      const targetDept = departmentId || (departments.length > 0 ? departments[0].id : undefined);
      const created = await api.employees.create({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        department_id: targetDept,
        job_title: jobTitle.trim() || 'Staff Member',
        role,
        password: password || undefined
      });

      // Update state immediately with new employee
      setEmployees(prev => [created, ...prev.filter(emp => emp.id !== created.id)]);

      setSaving(false);
      setShowAddModal(false);
      setSuccessNotice(`Employee ${created.first_name} ${created.last_name} (${created.email}) added successfully!`);
      setTimeout(() => setSuccessNotice(''), 5000);

      // Reset form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setJobTitle('');

      // Refresh data from server
      await loadData();
    } catch (err: any) {
      setSaving(false);
      setAddError(err.message || 'Employee could not be created. Please check that the email is unique.');
    }
  };

  const handleQuickAssignDepartment = async (employeeId: string, newDeptId: string) => {
    try {
      await api.employees.update(employeeId, { department_id: newDeptId });
      setSuccessNotice('Employee reassigned to department successfully!');
      setTimeout(() => setSuccessNotice(''), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to reassign department.');
    }
  };

  const handleLaunchDirectSimulation = async (emp: Employee) => {
    setLaunchingSimId(emp.id);
    try {
      const res = await api.simulations.launchEmployee(emp.id);
      setActiveSimulation(res.simulation);
    } catch (err: any) {
      alert(err.message || 'Failed to launch simulation.');
    } finally {
      setLaunchingSimId(null);
    }
  };

  const handleDirectPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword || adminNewPassword.length < 8) {
      setResetError('Password must be at least 8 characters long.');
      return;
    }

    setResettingPassword(true);
    setResetError('');
    try {
      if (selectedResetRequest) {
        const res = await api.auth.adminResetPassword({
          request_id: selectedResetRequest.id,
          email: selectedResetRequest.email,
          new_password: adminNewPassword
        });
        setSelectedResetRequest(null);
        setSuccessNotice(`Password updated for ${res.email}! Employee can log in with: ${adminNewPassword}`);
      } else if (resetTargetEmployee) {
        const res = await api.auth.adminResetPassword({
          email: resetTargetEmployee.email,
          new_password: adminNewPassword
        });
        setResetTargetEmployee(null);
        setSuccessNotice(`Password reset for ${res.email}! Employee can log in with: ${adminNewPassword}`);
      }
      setResettingPassword(false);
      setTimeout(() => setSuccessNotice(''), 8000);
      loadData();
    } catch (err: any) {
      setResettingPassword(false);
      setResetError(err.message || 'Failed to reset password.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.employees.deactivate(deleteTarget.id);
      setEmployees(prev => prev.filter(emp => emp.id !== deleteTarget.id));
      setDeleting(false);
      setSuccessNotice(`Employee ${deleteTarget.first_name} ${deleteTarget.last_name} removed from organization.`);
      setTimeout(() => setSuccessNotice(''), 5000);
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      setDeleting(false);
      alert(err.message || 'Failed to delete employee.');
    }
  };

  // Live search filtering across real employee data
  const filteredEmployees = employees.filter(e => {
    if (!search || !search.trim()) return true;
    const q = search.trim().toLowerCase();
    const fullName = `${e.first_name || ''} ${e.last_name || ''}`.trim().toLowerCase();
    return (
      fullName.includes(q) ||
      (e.first_name || '').toLowerCase().includes(q) ||
      (e.last_name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.job_title || '').toLowerCase().includes(q) ||
      (e.department_name || '').toLowerCase().includes(q) ||
      (e.user_role || '').toLowerCase().includes(q)
    );
  });

  // Calculate real-time dynamic employee groups & counts per department
  const departmentFolders = departments.map(d => {
    const members = filteredEmployees.filter(e => e.department_id === d.id);
    const avgScore = members.length > 0
      ? Math.round(members.reduce((acc, m) => acc + (m.current_risk_score || 100), 0) / members.length)
      : 100;

    return {
      id: d.id,
      name: d.name,
      manager_name: d.manager_name,
      description: d.description,
      members,
      member_count: members.length,
      avg_score: avgScore
    };
  });

  // Filter department folders based on the selected Department dropdown filter and Risk / Search filters
  const filteredDeptFolders = departmentFolders.filter(d => {
    // If specific department is chosen
    if (deptFilter !== 'ALL' && d.id !== deptFilter) return false;

    // If filtering by risk level or search keyword, only show department folders that contain matching staff!
    if ((riskFilter !== 'ALL' || (search && search.trim())) && d.member_count === 0) {
      return false;
    }

    return true;
  });

  const unassignedEmployees = filteredEmployees.filter(e => !e.department_id);

  // Workforce KPI calculations
  const totalStaffCount = employees.length;
  const avgOrgScore = employees.length > 0
    ? Math.round(employees.reduce((acc, e) => acc + (e.current_risk_score || 100), 0) / employees.length)
    : 100;
  const highRiskStaffCount = employees.filter(e => (e.current_risk_score || 100) < 65).length;

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Simulation Launcher Modal */}
      {activeSimulation && (
        <Modal
          isOpen={true}
          onClose={() => {
            setActiveSimulation(null);
            loadData();
          }}
          title={`Active Security Drill: ${activeSimulation.scenario_name || 'Simulation'}`}
          subtitle={`Target Employee: ${activeSimulation.first_name} ${activeSimulation.last_name} (${activeSimulation.email})`}
          maxWidth="2xl"
        >
          {activeSimulation.channel === 'EMAIL' ? (
            <EmailClientSimulator
              simulation={activeSimulation}
              onClose={() => {
                setActiveSimulation(null);
                loadData();
              }}
            />
          ) : activeSimulation.channel === 'SMS' ? (
            <SmsClientSimulator
              simulation={activeSimulation}
              onClose={() => {
                setActiveSimulation(null);
                loadData();
              }}
            />
          ) : activeSimulation.channel === 'VOICE' ? (
            <VoiceCallSimulator
              simulation={activeSimulation}
              onClose={() => {
                setActiveSimulation(null);
                loadData();
              }}
            />
          ) : (
            <MultiStageSimulator
              simulation={activeSimulation}
              onClose={() => {
                setActiveSimulation(null);
                loadData();
              }}
            />
          )}
        </Modal>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Workforce & Department Directory</h1>
            <Badge variant="low" size="sm">Enterprise Directory</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organized by department folders. Select a department to isolate workforce units or toggle to table list view.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Folders vs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('FOLDER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'FOLDER' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Department Folders ({departments.length})</span>
            </button>

            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table List ({employees.length})</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadData}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => handleOpenAddModal()}
          >
            + Add Employee
          </Button>
        </div>
      </div>

      {/* Workforce Metric KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Workforce</span>
            <div className="text-xl font-black text-slate-100 mt-0.5">{totalStaffCount} Staff Members</div>
            <span className="text-[10px] text-emerald-400 font-mono">100% Monitored</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operational Divisions</span>
            <div className="text-xl font-black text-slate-100 mt-0.5">{departments.length} Folders</div>
            <span className="text-[10px] text-slate-400">Targeted Units</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workforce Resilience</span>
            <div className="text-xl font-black text-sky-400 mt-0.5">{avgOrgScore}/100</div>
            <span className="text-[10px] text-slate-400">Human Security Score</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High-Risk Employees</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">{highRiskStaffCount} Flagged</div>
            <span className="text-[10px] text-slate-400">&lt; 65 Score Threshold</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice('')} className="text-emerald-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Pending Password Reset Requests Alert Banner */}
      {passwordRequests.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Pending Employee Password Reset Requests ({passwordRequests.length})</span>
            </div>
            <Badge variant="medium" size="sm">Action Required</Badge>
          </div>

          <div className="space-y-2">
            {passwordRequests.map((req) => (
              <div key={req.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-100">{req.employee_name}</span>
                  <span className="text-slate-400 font-mono ml-2">({req.email})</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedResetRequest(req);
                    setResetTargetEmployee(null);
                    setAdminNewPassword('LockPhish2026!');
                    setResetError('');
                  }}
                >
                  Approve & Reset Password
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <Input
            placeholder="Live search by name, email, department folder, job title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Department Filter with Dark Option Styling */}
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100 py-2">
              All Departments ({departments.length})
            </option>
            {departments.map(d => (
              <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100 py-2">
                {d.name}
              </option>
            ))}
          </select>

          {/* Risk Level Filter with Dark Option Styling */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100 py-2">All Risk Levels</option>
            <option value="LOW" className="bg-slate-900 text-slate-100 py-2">🟢 Low Risk (&gt;85)</option>
            <option value="MEDIUM" className="bg-slate-900 text-slate-100 py-2">🟡 Moderate Risk (65-84)</option>
            <option value="HIGH" className="bg-slate-900 text-slate-100 py-2">🔴 High Risk (40-64)</option>
            <option value="CRITICAL" className="bg-slate-900 text-slate-100 py-2">🟣 Critical Risk (&lt;40)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading workforce and department folders..." />
      ) : viewMode === 'FOLDER' ? (
        /* 1. DEPARTMENT FOLDERS VIEW (Scalable Enterprise Directory for 1000+ Staff) */
        <div className="space-y-6">
          {filteredDeptFolders.length === 0 ? (
            <EmptyState
              title={
                riskFilter !== 'ALL'
                  ? `No departments contain ${riskFilter === 'HIGH' ? 'High Risk (40-64 Score)' : riskFilter === 'CRITICAL' ? 'Critical Risk (<40 Score)' : riskFilter === 'MEDIUM' ? 'Moderate Risk (65-84 Score)' : 'Low Risk (>85 Score)'} employees`
                  : search
                  ? `No departments match search "${search}"`
                  : 'No department folders match filter'
              }
              description={
                riskFilter !== 'ALL'
                  ? 'All monitored staff members in your departments currently maintain different security scores.'
                  : 'Try clearing your search query or choosing All Departments.'
              }
              actionText="Reset All Filters"
              onAction={() => {
                setDeptFilter('ALL');
                setRiskFilter('ALL');
                setSearch('');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDeptFolders.map((folder) => {
                const countText = folder.member_count === 1 ? '1 Staff Member' : `${folder.member_count} Staff Members`;

                return (
                  <div
                    key={folder.id}
                    className="rounded-2xl border bg-slate-950/90 border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between p-5 space-y-4 hover:shadow-xl group"
                  >
                    {/* Department Card Header & Badges */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <div className="p-3 rounded-2xl shrink-0 bg-slate-900 text-amber-400 border border-slate-800 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
                            <Folder className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                              {folder.name}
                            </h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {folder.manager_name ? `Lead: ${folder.manager_name}` : 'Corporate division'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {folder.member_count > 0 ? (
                            <span className={`inline-block text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                              folder.avg_score >= 85 ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400' : 'bg-amber-950/80 border-amber-800 text-amber-400'
                            }`}>
                              {folder.avg_score} Score
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">0 Score</span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">
                        {folder.description || 'Handles corporate operations and department workflows.'}
                      </p>

                      <div>
                        <span className="inline-block text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                          {countText}
                        </span>
                      </div>
                    </div>

                    {/* Department Actions: View Dedicated Workforce Dashboard & Add Staff */}
                    <div className="space-y-2 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/workforce/department/${folder.id}`)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-all shadow-sm flex-1 justify-center"
                          title={`Open dedicated ${folder.name} workforce dashboard`}
                        >
                          <Users className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Show Employees ({folder.member_count})</span>
                        </button>

                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Plus className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenAddModal(folder.id)}
                        >
                          + Add Staff
                        </Button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => navigate('/admin/campaigns/create')}
                          className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
                        >
                          <Rocket className="w-3 h-3" />
                          <span>Launch Department Drill</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Unassigned Department Folder if any and ALL filter selected */}
              {deptFilter === 'ALL' && unassignedEmployees.length > 0 && (
                <div className="rounded-2xl border bg-slate-950/90 border-slate-800 hover:border-amber-700/60 transition-all overflow-hidden flex flex-col justify-between p-5 space-y-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
                        <Folder className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">Unassigned Staff</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">Staff without department assignment</p>
                        <span className="inline-block mt-2 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                          {unassignedEmployees.length === 1 ? '1 Staff Member' : `${unassignedEmployees.length} Staff Members`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => setViewMode('TABLE')}
                      className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border border-amber-500/30 transition-all"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>View Unassigned Staff in Table</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 2. TABLE LIST VIEW (High-Performance Enterprise Grid) */
        <Card title={`Monitored Staff List (${filteredEmployees.length} Members)`} subtitle="Full workforce directory with instant simulation launchers">
          {filteredEmployees.length === 0 ? (
            <EmptyState
              title="No employees found matching filter"
              description="Click '+ Add Employee' to provision staff profiles."
              actionText="Add Employee"
              onAction={() => handleOpenAddModal()}
            />
          ) : (
            <Table
              data={filteredEmployees}
              keyExtractor={e => e.id}
              onRowClick={e => navigate(`/admin/employees/${e.id}`)}
              columns={[
                {
                  header: 'Employee Name & Email',
                  accessor: e => (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                        {e.first_name?.charAt(0)}{e.last_name?.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-100 block truncate">{e.first_name} {e.last_name}</span>
                          {e.user_role === 'ORG_ADMIN' ? (
                            <Badge variant="info" size="sm">Admin</Badge>
                          ) : e.user_role === 'TRAINER' ? (
                            <Badge variant="medium" size="sm">Trainer</Badge>
                          ) : null}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono block truncate">{e.email}</span>
                      </div>
                    </div>
                  )
                },
                {
                  header: 'Department',
                  accessor: e => (
                    <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                      <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      {e.department_name || 'Unassigned'}
                    </span>
                  )
                },
                {
                  header: 'Job Title',
                  accessor: e => <span className="text-slate-400 text-xs">{e.job_title || 'Staff Member'}</span>
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
                      🛡️ {e.simulations_reported || 0} rep / ⚠️ {e.simulations_failed || 0} fail
                    </span>
                  )
                },
                {
                  header: 'Actions',
                  accessor: e => (
                    <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Rocket className="w-3.5 h-3.5 text-sky-400" />}
                        onClick={() => handleLaunchDirectSimulation(e)}
                        loading={launchingSimId === e.id}
                        title="Launch direct test simulation drill"
                      >
                        Drill
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/employees/${e.id}`)}
                      >
                        Profile
                      </Button>

                      <button
                        onClick={() => {
                          setResetTargetEmployee(e);
                          setSelectedResetRequest(null);
                          setAdminNewPassword('LockPhish2026!');
                          setResetError('');
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-950/40 rounded-lg transition-colors"
                        title="Reset password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(e)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
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
        </Card>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Monitored Employee"
        subtitle="Provision employee profile into department folder"
        maxWidth="md"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          {addError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{addError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name *"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Jane"
            />
            <Input
              label="Last Name *"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>

          <Input
            label="Corporate Email Address *"
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
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-slate-100">{d.name}</option>
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
                System Role Access
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="EMPLOYEE" className="bg-slate-900 text-slate-100">Standard Monitored Employee</option>
                <option value="TRAINER" className="bg-slate-900 text-slate-100">Security Trainer</option>
                <option value="CAMPAIGN_MANAGER" className="bg-slate-900 text-slate-100">Simulation Campaign Manager</option>
                <option value="ORG_ADMIN" className="bg-slate-900 text-slate-100">Organization Administrator</option>
              </select>
            </div>

            <Input
              label="Initial Password"
              type="text"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="LockPhish2026!"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Create Employee Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Direct Password Reset Modal */}
      {(resetTargetEmployee || selectedResetRequest) && (
        <Modal
          isOpen={true}
          onClose={() => {
            setResetTargetEmployee(null);
            setSelectedResetRequest(null);
          }}
          title="Direct Password Reset"
          subtitle={`Set a new corporate password for ${selectedResetRequest ? selectedResetRequest.employee_name : `${resetTargetEmployee?.first_name} ${resetTargetEmployee?.last_name}`} (${selectedResetRequest ? selectedResetRequest.email : resetTargetEmployee?.email})`}
          maxWidth="md"
        >
          <form onSubmit={handleDirectPasswordReset} className="space-y-4 text-xs">
            {resetError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed">
              Updating this password takes effect immediately. The employee will be able to log in with this new password right away.
            </div>

            <Input
              label="New Corporate Password *"
              type="text"
              required
              value={adminNewPassword}
              onChange={e => setAdminNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
            />

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setResetTargetEmployee(null);
                  setSelectedResetRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" loading={resettingPassword}>
                Update Password Immediately
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Employee Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Remove Monitored Employee"
        message={`Are you sure you want to remove ${deleteTarget?.first_name} ${deleteTarget?.last_name} (${deleteTarget?.email}) from the active workforce roster?`}
        confirmText="Remove Employee"
        variant="danger"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

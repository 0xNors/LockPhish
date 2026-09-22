import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  ArrowLeft,
  RotateCcw,
  Folder,
  Shield,
  Trash2,
  KeyRound,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  Building2,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmailClientSimulator } from '../../components/simulation/EmailClientSimulator';
import { SmsClientSimulator } from '../../components/simulation/SmsClientSimulator';
import { VoiceCallSimulator } from '../../components/simulation/VoiceCallSimulator';
import { MultiStageSimulator } from '../../components/simulation/MultiStageSimulator';
import { api } from '../../api/client';
import { Employee } from '../../types';

interface DepartmentWorkforcePageProps {
  departmentId: string;
  navigate: (path: string) => void;
}

export const DepartmentWorkforcePage: React.FC<DepartmentWorkforcePageProps> = ({
  departmentId,
  navigate
}) => {
  const [department, setDepartment] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'TRAINER' | 'CAMPAIGN_MANAGER' | 'ORG_ADMIN'>('EMPLOYEE');
  const [password, setPassword] = useState('LockPhish2026!');
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Direct Password Reset Modal
  const [resetTargetEmployee, setResetTargetEmployee] = useState<any>(null);
  const [adminNewPassword, setAdminNewPassword] = useState('NewPassword2026!');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  // Delete Confirmation
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Active Simulation Launch Modal
  const [activeSimulation, setActiveSimulation] = useState<any>(null);
  const [launchingSimId, setLaunchingSimId] = useState<string | null>(null);

  useEffect(() => {
    loadDepartmentData();
  }, [departmentId]);

  const loadDepartmentData = async () => {
    setLoading(true);
    try {
      const [depts, empRes] = await Promise.all([
        api.org.getDepartments(),
        api.employees.list({ department_id: departmentId, limit: 200 })
      ]);

      const foundDept = depts.find((d: any) => d.id === departmentId);
      setDepartment(foundDept || { id: departmentId, name: 'Department' });
      setDepartments(depts || []);
      setEmployees(empRes.employees || []);
    } catch (err) {
      console.error('Failed to load department workforce:', err);
    } finally {
      setLoading(false);
    }
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
      const created = await api.employees.create({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        department_id: departmentId,
        job_title: jobTitle.trim() || 'Staff Member',
        role,
        password: password || undefined
      });

      setEmployees(prev => [created, ...prev]);
      setSaving(false);
      setShowAddModal(false);
      setSuccessNotice(`Employee ${created.first_name} ${created.last_name} (${created.email}) added to ${department?.name || 'department'}!`);
      setTimeout(() => setSuccessNotice(''), 5000);

      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setJobTitle('');

      loadDepartmentData();
    } catch (err: any) {
      setSaving(false);
      setAddError(err.message || 'Failed to create employee. Please check that the email is unique.');
    }
  };

  const handleLaunchSimulation = async (emp: Employee) => {
    setLaunchingSimId(emp.id);
    try {
      const sim = await api.simulations.launchEmployee(emp.id);
      setLaunchingSimId(null);
      setActiveSimulation(sim);
    } catch (err: any) {
      setLaunchingSimId(null);
      alert(err.message || 'Failed to launch simulation drill.');
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
      const res = await api.auth.adminResetPassword({
        email: resetTargetEmployee.email,
        new_password: adminNewPassword
      });
      setResettingPassword(false);
      setResetTargetEmployee(null);
      setSuccessNotice(`Password updated for ${res.email}! Employee can log in with: ${adminNewPassword}`);
      setTimeout(() => setSuccessNotice(''), 6000);
      loadDepartmentData();
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
      setSuccessNotice(`Employee ${deleteTarget.first_name} ${deleteTarget.last_name} removed.`);
      setTimeout(() => setSuccessNotice(''), 5000);
      setDeleteTarget(null);
      loadDepartmentData();
    } catch (err: any) {
      setDeleting(false);
      alert(err.message || 'Failed to remove employee.');
    }
  };

  // Live real-time search across real employee records
  const filteredEmployees = employees.filter(e => {
    if (!search) return true;
    const q = search.trim().toLowerCase();
    return (
      (e.first_name || '').toLowerCase().includes(q) ||
      (e.last_name || '').toLowerCase().includes(q) ||
      (e.email || '').toLowerCase().includes(q) ||
      (e.job_title || '').toLowerCase().includes(q) ||
      `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <LoadingState message="Loading department workforce profiles..." />;
  }

  const staffCountText = employees.length === 1 ? '1 Staff Member' : `${employees.length} Staff Members`;

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/employees')}
          >
            Back to Departments
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">{department?.name || 'Department'}</h1>
              <Badge variant="low" size="sm">{staffCountText}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {department?.description || 'Corporate Division'} &bull; Department Workforce & Telemetry Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadDepartmentData}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setAddError('');
              setShowAddModal(true);
            }}
          >
            + Add Employee to {department?.name || 'Department'}
          </Button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice('')} className="text-emerald-400 font-bold hover:text-white px-1">✕</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-3">
        <div className="flex-1 w-full relative">
          <Input
            placeholder={`Search ${department?.name || 'department'} staff by name, email, job title...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 shrink-0">
          {filteredEmployees.length} of {employees.length} displayed
        </span>
      </div>

      {/* Employee List Grid */}
      {employees.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl space-y-3">
          <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">
            No employees are currently assigned to {department?.name || 'this department'}.
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click &quot;+ Add Employee&quot; above to create a real employee profile for this department.
          </p>
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowAddModal(true)}
            >
              + Add Employee to {department?.name || 'Department'}
            </Button>
          </div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <EmptyState
          title="No matching employees found"
          description={`No staff in ${department?.name} match your search "${search}".`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between shadow-lg"
            >
              {/* Employee Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 truncate">
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 shrink-0 mt-0.5">
                      {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-slate-100 hover:text-emerald-400 transition-colors truncate">
                        {emp.first_name} {emp.last_name}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono block truncate mt-0.5">{emp.email}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{emp.job_title || 'Staff Member'}</span>
                    </div>
                  </div>

                  <Badge variant={emp.current_risk_level?.toLowerCase() || 'low'} size="sm">
                    {emp.current_risk_level || 'LOW'}
                  </Badge>
                </div>

                {/* Score & Telemetry Mini-Strip */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Security Score:</span>
                    <span className="font-bold text-emerald-400">{emp.current_risk_score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Simulations:</span>
                    <span className="text-slate-300">{emp.simulations_reported || 0} rep / {emp.simulations_failed || 0} fail</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Training:</span>
                    <span className={emp.trainings_completed ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {emp.trainings_completed ? 'Completed' : emp.trainings_assigned ? 'In Progress' : 'Not Assigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/admin/employees/${emp.id}`)}
                >
                  View Profile
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="primary"
                    size="sm"
                    loading={launchingSimId === emp.id}
                    icon={<Play className="w-3 h-3" />}
                    onClick={() => handleLaunchSimulation(emp)}
                  >
                    Launch Simulation
                  </Button>

                  <button
                    onClick={() => {
                      setResetTargetEmployee(emp);
                      setAdminNewPassword('LockPhish2026!');
                      setResetError('');
                    }}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-950/40 rounded-lg transition-colors"
                    title="Set / Reset password"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(emp)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Permanently remove employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Add Employee to ${department?.name || 'Department'}`}
        subtitle={`Provisioning workforce member directly into ${department?.name}`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs font-sans">
          {addError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{addError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="e.g. Sahil"
            />
            <Input
              label="Last Name"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="e.g. Kumar"
            />
          </div>

          <Input
            label="Corporate Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="sahil@company.com"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Department Folder
              </label>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg font-bold text-emerald-400">
                {department?.name}
              </div>
            </div>

            <Input
              label="Job Title"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Security Analyst"
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
                <option value="EMPLOYEE">Employee (Monitored)</option>
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
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving} disabled={saving}>
              {saving ? 'Creating Employee...' : 'Create Employee Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Admin Reset Password Modal */}
      {resetTargetEmployee && (
        <Modal
          isOpen={Boolean(resetTargetEmployee)}
          onClose={() => setResetTargetEmployee(null)}
          title={`Set New Password for ${resetTargetEmployee.first_name} ${resetTargetEmployee.last_name}`}
          subtitle={`Account Email: ${resetTargetEmployee.email}`}
          maxWidth="md"
        >
          <form onSubmit={handleDirectPasswordReset} className="space-y-4 text-xs font-sans">
            {resetError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300 block">Target Employee Account:</span>
              <p className="text-slate-400">
                {resetTargetEmployee.first_name} {resetTargetEmployee.last_name} ({resetTargetEmployee.email}) &bull; {department?.name}
              </p>
            </div>

            <Input
              label="New Password for Employee"
              required
              value={adminNewPassword}
              onChange={e => setAdminNewPassword(e.target.value)}
              placeholder="Min 8 characters"
            />

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setResetTargetEmployee(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                loading={resettingPassword}
                icon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Approve & Update Password
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Employee Profile"
        message={`Are you sure you want to remove ${deleteTarget?.first_name} ${deleteTarget?.last_name} (${deleteTarget?.email}) from ${department?.name}?`}
        confirmText="Remove Employee"
        variant="danger"
        loading={deleting}
      />

      {/* Interactive Simulation Launcher Modal */}
      {activeSimulation && (
        <Modal
          isOpen={Boolean(activeSimulation)}
          onClose={() => {
            setActiveSimulation(null);
            loadDepartmentData();
          }}
          title={`Active Security Drill: ${activeSimulation.scenario_name || 'Simulation'}`}
          subtitle={`Target Employee: ${activeSimulation.first_name} ${activeSimulation.last_name} (${activeSimulation.email})`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {activeSimulation.channel === 'EMAIL' ? (
              <EmailClientSimulator
                simulation={activeSimulation}
                onClose={() => {
                  setActiveSimulation(null);
                  loadDepartmentData();
                }}
              />
            ) : activeSimulation.channel === 'SMS' ? (
              <SmsClientSimulator
                simulation={activeSimulation}
                onClose={() => {
                  setActiveSimulation(null);
                  loadDepartmentData();
                }}
              />
            ) : activeSimulation.channel === 'VOICE' ? (
              <VoiceCallSimulator
                simulation={activeSimulation}
                onClose={() => {
                  setActiveSimulation(null);
                  loadDepartmentData();
                }}
              />
            ) : (
              <MultiStageSimulator
                simulation={activeSimulation}
                onClose={() => {
                  setActiveSimulation(null);
                  loadDepartmentData();
                }}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

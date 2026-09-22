import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  Trash2,
  Shield,
  RotateCcw,
  Edit3,
  Rocket,
  ArrowRight,
  Award,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Search,
  Folder,
  BarChart3,
  BookOpen,
  LayoutGrid,
  List,
  UserCheck,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';

interface DepartmentsPageProps {
  navigate: (path: string) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ navigate }) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Modal State for Add / Edit Department
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [managerName, setManagerName] = useState('');
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const data = await api.org.getDepartments();
      setDepartments(data || []);
    } catch (err: any) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setName('');
    setDescription('');
    setManagerName('');
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (dept: any) => {
    setEditingDept(dept);
    setName(dept.name || '');
    setDescription(dept.description || '');
    setManagerName(dept.manager_name || '');
    setModalError('');
    setShowModal(true);
  };

  const handleSaveDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError('Department name is required.');
      return;
    }

    setSaving(true);
    setModalError('');
    try {
      if (editingDept) {
        await api.org.updateDepartment(editingDept.id, {
          name: name.trim(),
          description: description.trim(),
          manager_name: managerName.trim()
        });
        setSuccessNotice(`Department '${name}' updated successfully!`);
      } else {
        await api.org.createDepartment({
          name: name.trim(),
          description: description.trim(),
          manager_name: managerName.trim()
        });
        setSuccessNotice(`Department '${name}' created successfully!`);
      }
      setSaving(false);
      setShowModal(false);
      setTimeout(() => setSuccessNotice(''), 4000);
      loadDepartments();
    } catch (err: any) {
      setSaving(false);
      setModalError(err.message || 'Failed to save department.');
    }
  };

  const handleDelete = async (id: string, deptName: string) => {
    if (!confirm(`Are you sure you want to delete department '${deptName}'? Assigned staff will become unassigned.`)) return;
    try {
      await api.org.deleteDepartment(id);
      setSuccessNotice(`Department '${deptName}' removed.`);
      setTimeout(() => setSuccessNotice(''), 4000);
      loadDepartments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete department.');
    }
  };

  const totalStaff = departments.reduce((acc, d) => acc + (d.employee_count || 0), 0);
  const avgOrgScore = departments.length > 0
    ? Math.round(departments.reduce((acc, d) => acc + (d.avg_risk_score || 100), 0) / departments.length)
    : 100;
  const highRiskCount = departments.filter(d => (d.avg_risk_score || 100) < 75).length;

  const filteredDepartments = departments.filter(d => {
    if (!search || !search.trim()) return true;
    const q = search.toLowerCase().trim();
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.manager_name || '').toLowerCase().includes(q) ||
      (d.description || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Department Divisions</h1>
            <Badge variant="low" size="sm">{departments.length} Operational Units</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Organize workforce by business units, track department security scores, and launch targeted simulation campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Cards vs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'CARDS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Department Cards</span>
            </button>

            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Matrix Table</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadDepartments}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={handleOpenAddModal}
          >
            + Add Department
          </Button>
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

      {/* Division Overview KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Departments</span>
            <div className="text-xl font-black text-slate-100 mt-0.5">{departments.length} Departments</div>
            <span className="text-[10px] text-slate-400">Operational Divisions</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monitored Staff</span>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{totalStaff} Staff Members</div>
            <span className="text-[10px] text-emerald-400 font-mono">Assigned to Units</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Resilience</span>
            <div className="text-xl font-black text-sky-400 mt-0.5">{avgOrgScore}/100</div>
            <span className="text-[10px] text-slate-400">Organization Score</span>
          </div>
          <div className="p-3 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">High-Risk Units</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">{highRiskCount} Departments</div>
            <span className="text-[10px] text-slate-400">&lt; 75 Score Threshold</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center gap-3">
        <div className="flex-1 w-full relative">
          <Input
            placeholder="Search departments by name, division lead, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 shrink-0">
          {filteredDepartments.length} of {departments.length} departments
        </span>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading department divisions..." />
      ) : filteredDepartments.length === 0 ? (
        <EmptyState
          title="No departments found matching search"
          description="Create operational departments to organize employees and monitor team resilience."
          actionText="Add Department"
          onAction={handleOpenAddModal}
        />
      ) : viewMode === 'CARDS' ? (
        /* 1. CLEAN ENTERPRISE DEPARTMENT CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((dept) => {
            const countText = dept.employee_count === 1 ? '1 Staff Member' : `${dept.employee_count || 0} Staff Members`;
            const avgScore = Math.round((dept.avg_risk_score || 100) * 10) / 10;
            const isHealthy = avgScore >= 85;

            return (
              <div
                key={dept.id}
                className="rounded-2xl border bg-slate-950/90 border-slate-800 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between p-5 space-y-4 shadow-lg group hover:shadow-xl"
              >
                {/* Header & Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-2xl bg-slate-900 text-amber-400 border border-slate-800 group-hover:text-emerald-400 group-hover:border-emerald-800/60 transition-colors shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {dept.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {dept.manager_name ? `Lead: ${dept.manager_name}` : 'Corporate Department'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-black text-emerald-400 block">{avgScore}/100</span>
                      <Badge variant={avgScore >= 85 ? 'low' : avgScore >= 65 ? 'medium' : 'high'} size="sm" className="mt-0.5">
                        {avgScore >= 85 ? 'Low Risk' : avgScore >= 65 ? 'Moderate' : 'High Risk'}
                      </Badge>
                    </div>
                  </div>

                  {/* Mission / Description */}
                  <p className="text-xs text-slate-400 leading-relaxed min-h-[36px] line-clamp-2">
                    {dept.description || 'Handles operational division tasks and workflows.'}
                  </p>

                  {/* Department Practical Health Strip */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitored Staff</span>
                      <span className="text-xs font-bold text-slate-200 mt-0.5 block font-mono">{countText}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Security Status</span>
                      <span className={`text-xs font-bold mt-0.5 block ${isHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {isHealthy ? '🟢 Compliant' : '🟡 Needs Attention'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Division Action Controls */}
                <div className="space-y-2 pt-3 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/workforce/department/${dept.id}`)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-all shadow-sm"
                      title="View employees in this department"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Workforce ({dept.employee_count || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/admin/campaigns/create')}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold bg-sky-950/60 text-sky-300 hover:bg-sky-900/60 border border-sky-800/60 transition-all"
                      title="Launch targeted threat simulation for this department"
                    >
                      <Rocket className="w-3.5 h-3.5 text-sky-400" />
                      <span>Drill</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/training')}
                      className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Assign Training</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(dept)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                        title="Edit department details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(dept.id, dept.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete department"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. ENTERPRISE RISK MATRIX TABLE VIEW */
        <Card title={`Operational Departments (${filteredDepartments.length} Units)`} subtitle="Department overview, monitored staff counts, and security status">
          <Table
            data={filteredDepartments}
            keyExtractor={d => d.id}
            columns={[
              {
                header: 'Department Name',
                accessor: d => (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-100 block">{d.name}</span>
                      <span className="text-[11px] text-slate-400">{d.manager_name ? `Lead: ${d.manager_name}` : 'Operational Department'}</span>
                    </div>
                  </div>
                )
              },
              {
                header: 'Monitored Staff',
                accessor: d => (
                  <span className="font-mono text-slate-300 font-bold">
                    {d.employee_count === 1 ? '1 Staff Member' : `${d.employee_count || 0} Staff Members`}
                  </span>
                )
              },
              {
                header: 'Resilience Score',
                accessor: d => {
                  const score = Math.round((d.avg_risk_score || 100) * 10) / 10;
                  return (
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-100">{score}/100</span>
                      <Badge variant={score >= 85 ? 'low' : score >= 65 ? 'medium' : 'high'} size="sm">
                        {score >= 85 ? 'Low Risk' : score >= 65 ? 'Moderate' : 'High Risk'}
                      </Badge>
                    </div>
                  );
                }
              },
              {
                header: 'Security Status',
                accessor: d => {
                  const score = d.avg_risk_score || 100;
                  return (
                    <Badge variant={score >= 85 ? 'active' : 'paused'} size="sm">
                      {score >= 85 ? '🟢 Compliant' : '🟡 Needs Review'}
                    </Badge>
                  );
                }
              },
              {
                header: 'Actions',
                accessor: d => (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Users className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/admin/workforce/department/${d.id}`)}
                    >
                      View Workforce ({d.employee_count || 0})
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Rocket className="w-3.5 h-3.5 text-sky-400" />}
                      onClick={() => navigate('/admin/campaigns/create')}
                    >
                      Drill
                    </Button>

                    <button
                      onClick={() => handleOpenEditModal(d)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
                      title="Edit department"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(d.id, d.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              }
            ]}
          />
        </Card>
      )}

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? `Edit Department: ${editingDept.name}` : 'Add New Department'}
        subtitle="Configure department unit details, division lead, and operational purpose"
        maxWidth="md"
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4 text-xs">
          {modalError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <Input
            label="Department Name *"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Finance & Accounting"
          />

          <Input
            label="Department Head / Division Lead (Optional)"
            value={managerName}
            onChange={e => setManagerName(e.target.value)}
            placeholder="e.g. Alex Morgan (VP of Finance)"
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Department Description / Purpose</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Responsible for treasury management, wire authorizations, accounts payable, and quarterly compliance."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              {editingDept ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

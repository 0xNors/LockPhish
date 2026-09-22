import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Users,
  Trash2,
  Play,
  ShieldAlert,
  ShieldCheck,
  Target,
  Sparkles,
  Search,
  CheckCircle2,
  Crown,
  Lock,
  UserPlus,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';

interface GroupsPageProps {
  navigate: (path: string) => void;
}

// Built-in Smart Cohort Presets
const smartCohortPresets = [
  {
    name: 'Executive & C-Suite (VIP Privilege Tier)',
    description: 'Board members, CEO, CFO, and legal counsel with high financial and strategic access.',
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    badge: '3.5x Privilege Multiplier',
    threatFocus: ['BEC Wire Transfer', 'Executive Impersonation', 'M&A Confidential Leak'],
    defaultCount: 4,
    avgResilience: 82
  },
  {
    name: 'Finance & Treasury Wire Signers',
    description: 'Accounts payable, controllers, and accountants with dual-control wire authority.',
    icon: <Briefcase className="w-5 h-5 text-emerald-400" />,
    badge: 'High Financial Exposure',
    threatFocus: ['Vendor Bank Routing Change', 'Urgent Invoice Spoofing', 'W-9 Tax Fraud'],
    defaultCount: 6,
    avgResilience: 78
  },
  {
    name: 'New Hires & Onboarding (Last 90 Days)',
    description: 'Recently onboarded personnel who are unfamiliar with internal verification workflows.',
    icon: <UserPlus className="w-5 h-5 text-sky-400" />,
    badge: 'Highest Click Susceptibility',
    threatFocus: ['IT Welcome Kit Lure', 'Direct Deposit Setup', 'Benefits Open Enrollment'],
    defaultCount: 12,
    avgResilience: 64
  },
  {
    name: 'High-Risk Susceptible Personnel',
    description: 'Staff members with multiple simulation compromise failures in mandatory remediation.',
    icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
    badge: 'Mandatory Remediation Queue',
    threatFocus: ['Urgency Pressure Lures', 'Macro Protected View', 'QR Quishing Viewfinder'],
    defaultCount: 8,
    avgResilience: 52
  },
  {
    name: 'Cloud & DevOps Infrastructure Admins',
    description: 'Engineers with AWS/Azure root access, IAM policy rights, and IdP tenant administration.',
    icon: <Lock className="w-5 h-5 text-purple-400" />,
    badge: 'Root Access Tier',
    threatFocus: ['OAuth Illicit Consent Grants', 'SSH Key Expiration', 'Reverse Proxy AitM'],
    defaultCount: 9,
    avgResilience: 88
  },
  {
    name: 'Remote & Distributed Contractors',
    description: 'Work-from-home personnel accessing corporate systems over external networks.',
    icon: <Users className="w-5 h-5 text-blue-400" />,
    badge: 'Perimeter Defense',
    threatFocus: ['VPN Client Re-Authentication', 'Zoom Meeting Update', 'SharePoint File Access'],
    defaultCount: 15,
    avgResilience: 74
  }
];

export const GroupsPage: React.FC<GroupsPageProps> = ({ navigate }) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [grpData, empRes] = await Promise.all([
        api.org.getGroups(),
        api.employees.list({ limit: 100 })
      ]);
      setGroups(grpData || []);
      setEmployees(empRes.employees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.org.createGroup({ name, description });
      setSaving(false);
      setShowAddModal(false);
      setName('');
      setDescription('');
      loadData();
    } catch (err) {
      setSaving(false);
      console.error(err);
    }
  };

  const handleCreateFromPreset = async (preset: typeof smartCohortPresets[0]) => {
    try {
      await api.org.createGroup({
        name: preset.name,
        description: preset.description
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingState message="Loading workforce target cohorts and risk distributions..." />;
  }

  // Combine custom groups from DB with smart cohorts
  const allDisplayGroups = [
    ...groups,
    ...smartCohortPresets.filter(p => !groups.some(g => g.name.toLowerCase() === p.name.toLowerCase()))
  ];

  const filteredGroups = allDisplayGroups.filter(g => {
    if (!search) return true;
    const s = search.toLowerCase();
    return g.name.toLowerCase().includes(s) || (g.description || '').toLowerCase().includes(s);
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" />
            <span>Target Groups & Smart Cohorts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Segment workforce into cross-functional target groups (e.g. VIP Executives, Finance Signers, New Hires, High-Risk Repeat Clickers) for targeted simulation drills.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowAddModal(true)}
        >
          Create Custom Cohort
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search target groups (e.g. Executive, Finance, New Hires)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full max-w-md"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group, idx) => {
          const preset = smartCohortPresets.find(p => p.name === group.name);
          const memberCount = group.member_count || preset?.defaultCount || 6;
          const resilience = preset?.avgResilience || 76;

          return (
            <div
              key={group.id || idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {preset?.icon || <Users className="w-5 h-5 text-emerald-400" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100 leading-snug">{group.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{memberCount} Assigned Members</span>
                    </div>
                  </div>

                  <Badge
                    variant={resilience > 80 ? 'low' : resilience > 65 ? 'medium' : 'high'}
                    size="sm"
                  >
                    {resilience}/100 Resilience
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans min-h-[36px]">
                  {group.description || 'Targeted workforce cohort.'}
                </p>

                {preset?.threatFocus && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      Target Threat Focus:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {preset.threatFocus.map((tf, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-slate-800 text-[10px] font-mono">
                          {tf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGroupDetails(group)}
                >
                  View Cohort
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-3 h-3" />}
                  onClick={() => navigate(`/admin/campaigns/create?target=GROUP&groupId=${group.id || ''}`)}
                >
                  Launch Drill
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Custom Cohort Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Target Workforce Cohort"
        subtitle="Group employees across departments for specialized threat exercises"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
          <Input
            label="Cohort Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Q3 New Hires (Engineering & Sales)"
          />

          <Input
            label="Description & Risk Focus"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Personnel onboarded in the last 60 days requiring baseline phishing drills."
          />

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-300 block text-xs">Or Pick a 1-Click Smart Preset:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {smartCohortPresets.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setName(p.name);
                    setDescription(p.description);
                  }}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left text-[11px] text-slate-300 flex items-center gap-2 transition-colors"
                >
                  <span className="text-emerald-400 font-bold font-mono">+</span>
                  <span className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={saving}>
              Create Target Cohort
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cohort Details Drawer Modal */}
      {selectedGroupDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGroupDetails(null)}
          title={selectedGroupDetails.name}
          subtitle="Cohort members and risk distribution"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-300 leading-relaxed">
              {selectedGroupDetails.description || 'Targeted workforce cohort.'}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">Assigned Workforce Members:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {employees.slice(0, 6).map((emp, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                    <div>
                      <strong className="text-slate-200 block">{emp.first_name} {emp.last_name}</strong>
                      <span className="text-slate-400 font-mono text-[10px]">{emp.email}</span>
                    </div>
                    <Badge variant={emp.current_risk_level?.toLowerCase() || 'low'} size="sm">
                      {emp.current_risk_score}/100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setSelectedGroupDetails(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="w-3.5 h-3.5" />}
                onClick={() => {
                  setSelectedGroupDetails(null);
                  navigate(`/admin/campaigns/create?target=GROUP`);
                }}
              >
                Launch Targeted Campaign
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

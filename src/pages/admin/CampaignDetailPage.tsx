import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  Play,
  Pause,
  AlertOctagon,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Users,
  Eye,
  FileCheck2,
  Clock,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  Edit3,
  Trash2,
  Save,
  Info
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SimulationReplayModal } from '../../components/simulation/SimulationReplayModal';
import { api } from '../../api/client';
import { Campaign } from '../../types';

interface CampaignDetailPageProps {
  campaignId: string;
  navigate: (path: string) => void;
}

export const CampaignDetailPage: React.FC<CampaignDetailPageProps> = ({ campaignId, navigate }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  // Safety Review Modal
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [validating, setValidating] = useState(false);
  const [valResult, setValResult] = useState<any>(null);

  // Actions
  const [launching, setLaunching] = useState(false);
  const [showEmergencyStop, setShowEmergencyStop] = useState(false);
  const [stopping, setStopping] = useState(false);

  // Delete Campaign
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit Campaign Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('MEDIUM');
  const [editTrigger, setEditTrigger] = useState('URGENCY');
  const [editAutoAssign, setEditAutoAssign] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  // Target Filter
  const [targetFilter, setTargetFilter] = useState<'ALL' | 'PASSED' | 'COMPROMISED' | 'PENDING'>('ALL');
  const [targetSearch, setTargetSearch] = useState('');

  // Replay
  const [replayData, setReplayData] = useState<any>(null);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const data = await api.campaigns.get(campaignId);
      setCampaign(data);
      if (data) {
        setEditName(data.name || '');
        setEditDescription(data.description || '');
        setEditDifficulty(data.difficulty || 'MEDIUM');
        setEditTrigger(data.risk_policy?.psychological_trigger || 'URGENCY');
        setEditAutoAssign(data.training_auto_assign !== 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateReview = async () => {
    setValidating(true);
    try {
      const res = await api.campaigns.validate(campaignId);
      setValResult(res);
      setValidating(false);
      loadCampaign();
    } catch (err: any) {
      setValidating(false);
      alert(err.message || 'Validation failed. Please ensure active employees exist in the organization.');
    }
  };

  const handleComplete = async () => {
    if (!confirm(`Are you sure you want to mark campaign '${campaign?.name}' as COMPLETED? All remaining pending targets will be concluded.`)) return;
    try {
      await api.campaigns.complete(campaignId);
      loadCampaign();
    } catch (err: any) {
      alert(err.message || 'Failed to complete campaign.');
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await api.campaigns.launch(campaignId);
      setLaunching(false);
      setShowValidateModal(false);
      loadCampaign();
    } catch (err: any) {
      setLaunching(false);
      alert(err.message || 'Failed to launch campaign. Please ensure employees exist.');
    }
  };

  const handlePause = async () => {
    try {
      await api.campaigns.pause(campaignId);
      loadCampaign();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResume = async () => {
    try {
      await api.campaigns.resume(campaignId);
      loadCampaign();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmergencyStop = async () => {
    setStopping(true);
    try {
      await api.campaigns.emergencyStop(campaignId);
      setStopping(false);
      setShowEmergencyStop(false);
      loadCampaign();
    } catch (err) {
      setStopping(false);
    }
  };

  const handleDeleteCampaign = async () => {
    setDeleting(true);
    try {
      await api.campaigns.delete(campaignId);
      setDeleting(false);
      navigate('/admin/campaigns');
    } catch (err: any) {
      setDeleting(false);
      alert(err.message || 'Failed to delete campaign.');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setEditError('Campaign name is required.');
      return;
    }
    setSavingEdit(true);
    setEditError('');

    try {
      await api.campaigns.update(campaignId, {
        name: editName.trim(),
        description: editDescription.trim(),
        difficulty: editDifficulty,
        training_auto_assign: editAutoAssign,
        risk_policy: {
          ...campaign?.risk_policy,
          psychological_trigger: editTrigger
        }
      });
      setSavingEdit(false);
      setShowEditModal(false);
      loadCampaign();
    } catch (err: any) {
      setSavingEdit(false);
      setEditError(err.message || 'Failed to update campaign.');
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

  if (loading || !campaign) {
    return <LoadingState message="Loading campaign telemetry & results..." />;
  }

  const targets = campaign.targets || [];

  // Pass vs Fail stats calculation
  const totalTargets = campaign.target_count || targets.length;
  const openedTargets = targets.filter(t => t.opened_at || ['OPENED', 'LINK_CLICKED', 'CREDENTIALS_ENTERED', 'REPORTED', 'COMPLETED'].includes(t.simulation_status));
  const clickedTargets = targets.filter(t => t.clicked_at || ['LINK_CLICKED', 'CREDENTIALS_ENTERED', 'FAILED'].includes(t.simulation_status));
  const reportedTargets = targets.filter(t => t.simulation_status === 'REPORTED');
  const compromisedTargets = targets.filter(t => ['CREDENTIALS_ENTERED', 'LINK_CLICKED', 'FAILED'].includes(t.simulation_status));
  const pendingTargets = targets.filter(t => !['COMPLETED', 'REPORTED', 'CREDENTIALS_ENTERED', 'LINK_CLICKED', 'FAILED'].includes(t.simulation_status));

  const reportingRate = totalTargets > 0 ? Math.round((reportedTargets.length / totalTargets) * 100) : 0;
  const compromiseRate = totalTargets > 0 ? Math.round((compromisedTargets.length / totalTargets) * 100) : 0;

  // Filter targets for display
  const displayedTargets = targets.filter(t => {
    if (targetFilter === 'PASSED' && t.simulation_status !== 'REPORTED') return false;
    if (targetFilter === 'COMPROMISED' && !['CREDENTIALS_ENTERED', 'LINK_CLICKED', 'FAILED'].includes(t.simulation_status)) return false;
    if (targetFilter === 'PENDING' && ['REPORTED', 'CREDENTIALS_ENTERED', 'LINK_CLICKED', 'FAILED', 'COMPLETED'].includes(t.simulation_status)) return false;
    if (targetSearch) {
      const q = targetSearch.toLowerCase();
      return (
        (t.first_name || '').toLowerCase().includes(q) ||
        (t.last_name || '').toLowerCase().includes(q) ||
        (t.email || '').toLowerCase().includes(q) ||
        (t.department_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/campaigns')}
          >
            Back to Campaigns
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-100">{campaign.name}</h1>
              <Badge variant={campaign.status.toLowerCase()} size="md">{campaign.status}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Channel: {campaign.channel} &bull; Target Type: {campaign.target_type} &bull; Created by {campaign.creator_name || 'Admin'}
            </p>
          </div>
        </div>

        {/* Campaign Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadCampaign}
          >
            Refresh Results
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Edit3 className="w-3.5 h-3.5 text-amber-400" />}
            onClick={() => setShowEditModal(true)}
          >
            Edit
          </Button>

          {campaign.status === 'DRAFT' && (
            <Button
              variant="primary"
              size="sm"
              icon={<ShieldCheck className="w-4 h-4" />}
              onClick={() => {
                setShowValidateModal(true);
                handleValidateReview();
              }}
            >
              Safety Review & Launch Campaign
            </Button>
          )}

          {campaign.status === 'VALIDATED' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-4 h-4" />}
              onClick={handleLaunch}
              loading={launching}
            >
              Launch Simulation
            </Button>
          )}

          {campaign.status === 'RUNNING' && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={handleComplete}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40"
              >
                Complete Campaign
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Pause className="w-3.5 h-3.5" />}
                onClick={handlePause}
              >
                Pause
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<AlertOctagon className="w-3.5 h-3.5" />}
                onClick={() => setShowEmergencyStop(true)}
              >
                Kill Switch
              </Button>
            </>
          )}

          {campaign.status === 'PAUSED' && (
            <>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                onClick={handleComplete}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/40"
              >
                Complete Campaign
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Play className="w-3.5 h-3.5" />}
                onClick={handleResume}
              >
                Resume
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={<AlertOctagon className="w-3.5 h-3.5" />}
                onClick={() => setShowEmergencyStop(true)}
              >
                Kill Switch
              </Button>
            </>
          )}

          {campaign.status !== 'RUNNING' && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-800"
              title="Delete Campaign"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
            </button>
          )}
        </div>
      </div>

      {/* 6-Stage Behavioral Progression Funnel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100">6-Stage Campaign Behavioral Funnel</h3>
          <span className="text-xs font-mono text-emerald-400 font-bold">Real Telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">1. DELIVERED</span>
            <span className="text-lg font-bold text-slate-100 mt-1 block">{totalTargets}</span>
            <span className="text-[10px] text-slate-500">100% Sent</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">2. OPENED</span>
            <span className="text-lg font-bold text-sky-400 mt-1 block">{openedTargets.length}</span>
            <span className="text-[10px] text-slate-500">{totalTargets > 0 ? Math.round((openedTargets.length / totalTargets) * 100) : 0}% Open Rate</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">3. CLICKED</span>
            <span className="text-lg font-bold text-amber-400 mt-1 block">{clickedTargets.length}</span>
            <span className="text-[10px] text-slate-500">{totalTargets > 0 ? Math.round((clickedTargets.length / totalTargets) * 100) : 0}% Click Rate</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">4. INTERCEPTED</span>
            <span className="text-lg font-bold text-rose-400 mt-1 block">{compromisedTargets.length}</span>
            <span className="text-[10px] text-rose-400/80 font-mono">Zero Leaks</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">5. REPORTED</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">{reportedTargets.length}</span>
            <span className="text-[10px] text-emerald-400/80 font-mono">{reportingRate}% Resilience</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">6. REMEDIATED</span>
            <span className="text-lg font-bold text-purple-400 mt-1 block">{reportedTargets.length + compromisedTargets.length}</span>
            <span className="text-[10px] text-slate-500">Academy Active</span>
          </div>
        </div>
      </div>

      {/* Target Breakdown Table */}
      <Card
        title={`Employee Assessment Breakdown (${displayedTargets.length} of ${totalTargets})`}
        subtitle="Individual interaction statuses, pass/fail evaluations, and timeline replays"
        action={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search target employee..."
              value={targetSearch}
              onChange={e => setTargetSearch(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48"
            />
          </div>
        }
      >
        {targets.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-200">No targets generated yet</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              {campaign.status === 'DRAFT'
                ? 'Click "Safety Review & Launch Campaign" above to dispatch simulations to all targeted employees.'
                : 'No targets assigned to this campaign.'}
            </p>
          </div>
        ) : (
          <Table
            data={displayedTargets}
            keyExtractor={t => t.id}
            columns={[
              {
                header: 'Employee',
                accessor: t => (
                  <div>
                    <span className="font-bold text-slate-100 block">{t.first_name} {t.last_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{t.email}</span>
                  </div>
                )
              },
              {
                header: 'Department',
                accessor: t => <span className="text-slate-300">{t.department_name || 'General'}</span>
              },
              {
                header: 'Scenario Assigned',
                accessor: t => <span className="text-slate-200 font-medium">{t.scenario_name || 'Security Exercise'}</span>
              },
              {
                header: 'Pass / Fail Outcome',
                accessor: t => {
                  if (t.simulation_status === 'REPORTED') {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-bold text-xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        PASSED (Reported)
                      </span>
                    );
                  }
                  if (['CREDENTIALS_ENTERED', 'LINK_CLICKED', 'FAILED'].includes(t.simulation_status)) {
                    return (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/60 text-rose-300 font-bold text-xs">
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        FAILED (Compromised)
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-medium text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Action
                    </span>
                  );
                }
              },
              {
                header: 'Timeline',
                accessor: t => (
                  <span className="text-[11px] text-slate-400 font-mono">
                    {t.completed_at
                      ? `Done ${new Date(t.completed_at).toLocaleTimeString()}`
                      : t.clicked_at
                      ? `Clicked ${new Date(t.clicked_at).toLocaleTimeString()}`
                      : t.opened_at
                      ? `Opened ${new Date(t.opened_at).toLocaleTimeString()}`
                      : 'Delivered'}
                  </span>
                )
              },
              {
                header: 'Actions',
                accessor: t => (
                  t.simulation_id ? (
                    <Button variant="ghost" size="sm" onClick={() => handleOpenReplay(t.simulation_id)}>
                      Inspect Replay
                    </Button>
                  ) : <span className="text-slate-600">-</span>
                )
              }
            ]}
          />
        )}
      </Card>

      {/* Pre-Flight Safety Validation Modal */}
      <Modal
        isOpen={showValidateModal}
        onClose={() => setShowValidateModal(false)}
        title="Pre-Flight Safety Validation Review"
        subtitle="Mandatory security, recipient authorization, and safety policy check"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          {validating ? (
            <LoadingState message="Conducting pre-flight simulation safety checks..." />
          ) : (
            <>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300">Recipient Count Authorization:</span>
                  <span className="font-bold text-emerald-400">✓ {valResult?.target_count || 0} Targets Validated</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300">Domain Whitelist & Boundaries:</span>
                  <span className="font-bold text-emerald-400">✓ Authorized Internal Simulation Infrastructure</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-300">Sensitive-Data Redaction Engine:</span>
                  <span className="font-bold text-emerald-400">✓ ACTIVE (Zero Credential Storage Enforced)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Adaptive Remediation Engine:</span>
                  <span className="font-bold text-emerald-400">✓ ENABLED</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
                <p className="font-bold flex items-center gap-2 mb-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  Pre-Flight Safety Verification Passed
                </p>
                <p className="text-emerald-200/90 text-[11px]">
                  All scenarios in this campaign adhere to safe educational protocols. Launching will deliver simulated missions to all {valResult?.target_count} employees.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="outline" size="sm" onClick={() => setShowValidateModal(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleLaunch}
                  loading={launching}
                  icon={<Play className="w-3.5 h-3.5" />}
                >
                  Confirm & Launch Campaign
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Edit Campaign Modal */}
      {showEditModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          title={`Edit Campaign: ${campaign.name}`}
          subtitle={`Modify campaign configuration • Status: ${campaign.status}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-sans">
            {editError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-200 font-bold">
                {editError}
              </div>
            )}

            <Input
              label="Campaign Name *"
              required
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="e.g. Q3 Executive Wire Assessment"
            />

            <Input
              label="Description & Operational Purpose"
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              placeholder="e.g. Assessing department compliance..."
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={editDifficulty}
                  onChange={e => setEditDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="LOW">Low / Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High / Hard</option>
                  <option value="CRITICAL">Critical / Extreme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Psychological Trigger
                </label>
                <select
                  value={editTrigger}
                  onChange={e => setEditTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="URGENCY">Urgency & Expiration</option>
                  <option value="AUTHORITY">Executive Authority</option>
                  <option value="FINANCIAL">Financial / Payroll</option>
                  <option value="FEAR">Fear / Suspension</option>
                  <option value="ROUTINE">Routine / Workflow</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={editAutoAssign}
                onChange={e => setEditAutoAssign(e.target.checked)}
                className="rounded text-emerald-500 focus:ring-emerald-500 mt-0.5"
              />
              <div>
                <span className="font-bold text-slate-200 block">Auto-Assign Remedial Training Academy</span>
                <span className="text-[11px] text-slate-400">Automatically assign linked masterclasses to compromised employees.</span>
              </div>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" loading={savingEdit} icon={<Save className="w-3.5 h-3.5" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Campaign Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCampaign}
        title="Delete Simulation Campaign"
        message={`Are you sure you want to permanently delete campaign '${campaign.name}'? All associated simulation records and targets for this campaign will be removed.`}
        confirmText="Delete Campaign"
        variant="danger"
        loading={deleting}
      />

      {/* Emergency Stop Kill Switch Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showEmergencyStop}
        onClose={() => setShowEmergencyStop(false)}
        onConfirm={handleEmergencyStop}
        title="EMERGENCY CAMPAIGN STOP (KILL SWITCH)"
        message={`WARNING: You are triggering an immediate Emergency Kill Switch for campaign '${campaign.name}'. All pending simulation missions will be cancelled immediately and an audit event will be generated.`}
        confirmText="Trigger Emergency Kill Switch"
        variant="danger"
        loading={stopping}
      />

      {/* Safe Simulation Replay Modal */}
      <SimulationReplayModal
        isOpen={Boolean(replayData)}
        onClose={() => setReplayData(null)}
        replayData={replayData}
      />
    </div>
  );
};

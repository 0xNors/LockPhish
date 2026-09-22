import React, { useState, useEffect } from 'react';
import {
  Send,
  Plus,
  Play,
  Pause,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Filter,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  LayoutGrid,
  List,
  Search,
  Check,
  Award,
  Sparkles,
  BarChart3,
  Mail,
  Smartphone,
  PhoneCall,
  Layers,
  FileCheck2,
  Trash2,
  Edit3,
  Rocket,
  Info,
  Building2,
  Users,
  Target,
  Calendar,
  Globe,
  Lock,
  Save,
  FileText,
  Paperclip
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Table } from '../../components/common/Table';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { ProgressBar } from '../../components/common/ProgressBar';
import { api } from '../../api/client';
import { Campaign, Scenario } from '../../types';

interface CampaignsPageProps {
  navigate: (path: string) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ navigate }) => {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  // Emergency Stop Modal
  const [emergencyTarget, setEmergencyTarget] = useState<Campaign | null>(null);
  const [stopping, setStopping] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');

  // Delete Campaign Confirmation
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  // About / Full Details Dossier Modal
  const [aboutCampaign, setAboutCampaign] = useState<Campaign | null>(null);

  // Edit Campaign Modal
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDifficulty, setEditDifficulty] = useState('MEDIUM');
  const [editTrigger, setEditTrigger] = useState('URGENCY');
  const [editAutoAssign, setEditAutoAssign] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    loadCampaigns();
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    try {
      const [scenData, deptData] = await Promise.all([
        api.scenarios.list(),
        api.org.getDepartments()
      ]);
      setScenarios(scenData || []);
      setDepartments(deptData || []);
    } catch {}
  };

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await api.campaigns.list({ limit: 200 });
      setAllCampaigns(data || []);
    } catch (err: any) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteCampaign = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to mark campaign '${campaign.name}' as COMPLETED? All remaining pending targets will be concluded.`)) return;
    try {
      await api.campaigns.complete(campaign.id);
      setSuccessNotice(`Campaign '${campaign.name}' concluded successfully! Compliance metrics recorded.`);
      setTimeout(() => setSuccessNotice(''), 5000);
      loadCampaigns();
    } catch (err: any) {
      alert(err.message || 'Failed to complete campaign.');
    }
  };

  const handlePauseCampaign = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      await api.campaigns.pause(campaignId);
      loadCampaigns();
    } catch (err: any) {
      alert(err.message || 'Failed to pause campaign.');
    }
  };

  const handleResumeCampaign = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      await api.campaigns.resume(campaignId);
      loadCampaigns();
    } catch (err: any) {
      alert(err.message || 'Failed to resume campaign.');
    }
  };

  const handleLaunchCampaign = async (e: React.MouseEvent, campaignId: string) => {
    e.stopPropagation();
    try {
      await api.campaigns.validate(campaignId);
      await api.campaigns.launch(campaignId);
      setSuccessNotice('Campaign validated and launched successfully!');
      setTimeout(() => setSuccessNotice(''), 5000);
      loadCampaigns();
    } catch (err: any) {
      alert(err.message || 'Failed to launch campaign.');
    }
  };

  const handleEmergencyStop = async () => {
    if (!emergencyTarget) return;
    setStopping(true);
    try {
      await api.campaigns.emergencyStop(emergencyTarget.id);
      setStopping(false);
      setSuccessNotice(`Emergency Kill Switch triggered for '${emergencyTarget.name}'.`);
      setTimeout(() => setSuccessNotice(''), 5000);
      setEmergencyTarget(null);
      loadCampaigns();
    } catch (err: any) {
      setStopping(false);
      alert(err.message || 'Failed to trigger emergency stop.');
    }
  };

  // Fixed & Robust Delete Campaign Handler
  const handleDeleteCampaign = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.campaigns.delete(deleteTarget.id);
      setDeleting(false);
      setSuccessNotice(`Campaign '${deleteTarget.name}' deleted successfully.`);
      setTimeout(() => setSuccessNotice(''), 5000);
      setDeleteTarget(null);
      loadCampaigns();
    } catch (err: any) {
      setDeleting(false);
      alert(err.message || 'Failed to delete campaign.');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (e: React.MouseEvent, c: Campaign) => {
    e.stopPropagation();
    setEditCampaign(c);
    setEditName(c.name || '');
    setEditDescription(c.description || '');
    setEditDifficulty(c.difficulty || 'MEDIUM');
    setEditTrigger(c.risk_policy?.psychological_trigger || 'URGENCY');
    setEditAutoAssign(c.training_auto_assign !== 0);
    setEditError('');
  };

  // Save Edit Campaign
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCampaign) return;
    if (!editName.trim()) {
      setEditError('Campaign name is required.');
      return;
    }

    setSavingEdit(true);
    setEditError('');

    try {
      await api.campaigns.update(editCampaign.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        difficulty: editDifficulty,
        training_auto_assign: editAutoAssign,
        risk_policy: {
          ...editCampaign.risk_policy,
          psychological_trigger: editTrigger
        }
      });
      setSavingEdit(false);
      setEditCampaign(null);
      setSuccessNotice(`Campaign '${editName}' updated successfully!`);
      setTimeout(() => setSuccessNotice(''), 5000);
      loadCampaigns();
    } catch (err: any) {
      setSavingEdit(false);
      setEditError(err.message || 'Failed to update campaign.');
    }
  };

  // Status breakdown calculations across ALL campaigns
  const runningCount = allCampaigns.filter(c => c.status === 'RUNNING').length;
  const completedCount = allCampaigns.filter(c => c.status === 'COMPLETED').length;
  const stoppedCount = allCampaigns.filter(c => c.status === 'STOPPED').length;
  const draftCount = allCampaigns.filter(c => c.status === 'DRAFT' || c.status === 'VALIDATED').length;

  const totalDispatchedTargets = allCampaigns.reduce((acc, c) => acc + (c.target_count || 0), 0);
  const totalReported = allCampaigns.reduce((acc, c) => acc + (c.reported_count || 0), 0);
  const totalCompromised = allCampaigns.reduce((acc, c) => acc + (c.compromised_count || 0), 0);

  const overallReportingRate = totalDispatchedTargets > 0 ? Math.round((totalReported / totalDispatchedTargets) * 100) : 0;
  const overallCompromiseRate = totalDispatchedTargets > 0 ? Math.round((totalCompromised / totalDispatchedTargets) * 100) : 0;

  // Filter for display table / cards
  const displayedCampaigns = allCampaigns.filter(c => {
    if (statusFilter === 'RUNNING' && c.status !== 'RUNNING') return false;
    if (statusFilter === 'COMPLETED' && c.status !== 'COMPLETED') return false;
    if (statusFilter === 'STOPPED' && c.status !== 'STOPPED') return false;
    if (statusFilter === 'PAUSED' && c.status !== 'PAUSED') return false;
    if (statusFilter === 'DRAFT' && c.status !== 'DRAFT' && c.status !== 'VALIDATED') return false;
    if (channelFilter !== 'ALL' && c.channel !== channelFilter) return false;
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.creator_name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
              <Send className="w-6 h-6 text-emerald-400" />
              <span>Security Simulation Campaigns</span>
            </h1>
            <Badge variant="low" size="sm">{allCampaigns.length} Total Campaigns</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Execute multi-channel threat simulations, monitor real-time workforce actions, inspect full campaign blueprints, and manage lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'TABLE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table List</span>
            </button>

            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'CARDS' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Visual Cards</span>
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={loadCampaigns}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate('/admin/campaigns/create')}
          >
            + Create Campaign
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

      {/* Campaign Lifecycle Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter(statusFilter === 'RUNNING' ? 'ALL' : 'RUNNING')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'RUNNING'
              ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">🟢 Running (Active)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="text-2xl font-black text-emerald-300 mt-1 block font-mono">{runningCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Live in field</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'COMPLETED' ? 'ALL' : 'COMPLETED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'COMPLETED'
              ? 'bg-slate-900 border-teal-500 shadow-md ring-1 ring-teal-500/50'
              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">✅ Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <span className="text-2xl font-black text-teal-300 mt-1 block font-mono">{completedCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Fully concluded</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'STOPPED' ? 'ALL' : 'STOPPED')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'STOPPED'
              ? 'bg-slate-900 border-rose-500 shadow-md ring-1 ring-rose-500/50'
              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">🛑 Stopped (Killed)</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-rose-300 mt-1 block font-mono">{stoppedCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Kill-switch triggered</span>
        </div>

        <div
          onClick={() => setStatusFilter(statusFilter === 'DRAFT' ? 'ALL' : 'DRAFT')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'DRAFT'
              ? 'bg-slate-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
              : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">📋 Draft / Ready</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-300 mt-1 block font-mono">{draftCount}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">Awaiting launch</span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: `All Campaigns (${allCampaigns.length})` },
            { id: 'RUNNING', label: `🟢 Running (${runningCount})` },
            { id: 'COMPLETED', label: `✅ Completed (${completedCount})` },
            { id: 'STOPPED', label: `🛑 Stopped (${stoppedCount})` },
            { id: 'DRAFT', label: `📋 Draft (${draftCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <Input
              placeholder="Search campaigns..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100 py-2">All Channels</option>
            <option value="EMAIL" className="bg-slate-900 text-slate-100 py-2">📧 Email Phishing</option>
            <option value="SMS" className="bg-slate-900 text-slate-100 py-2">📱 SMS Smishing</option>
            <option value="VOICE" className="bg-slate-900 text-slate-100 py-2">📞 Voice Vishing</option>
            <option value="MULTI_STAGE" className="bg-slate-900 text-slate-100 py-2">🔀 Multi-Stage</option>
          </select>
        </div>
      </div>

      {/* Main Campaigns Content Area */}
      {loading ? (
        <LoadingState message="Loading simulation campaigns..." />
      ) : displayedCampaigns.length === 0 ? (
        <EmptyState
          title={allCampaigns.length === 0 ? "No campaigns created yet" : `No campaigns match filter '${statusFilter}'`}
          description={allCampaigns.length === 0 ? "Create your first security simulation campaign to assess and train employee behavior." : "Try choosing 'All Campaigns' to view your full campaign catalog."}
          actionText={allCampaigns.length === 0 ? "Create Campaign" : "View All Campaigns"}
          onAction={allCampaigns.length === 0 ? () => navigate('/admin/campaigns/create') : () => setStatusFilter('ALL')}
        />
      ) : viewMode === 'CARDS' ? (
        /* 1. INTERACTIVE VISUAL CAMPAIGN CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCampaigns.map((c) => {
            const targets = c.target_count || 0;
            const reported = c.reported_count || 0;
            const compromised = c.compromised_count || 0;
            const reportingPct = targets > 0 ? Math.round((reported / targets) * 100) : 0;
            const compromisePct = targets > 0 ? Math.round((compromised / targets) * 100) : 0;

            const isRunning = c.status === 'RUNNING';
            const isPaused = c.status === 'PAUSED';
            const isCompleted = c.status === 'COMPLETED';
            const isDraft = c.status === 'DRAFT' || c.status === 'VALIDATED';

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/campaigns/${c.id}`)}
                className={`rounded-2xl border p-5 space-y-4 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-xl group ${
                  isRunning
                    ? 'bg-slate-950/90 border-emerald-500/60 shadow-emerald-950/30'
                    : isCompleted
                    ? 'bg-slate-950/90 border-teal-800/60'
                    : isPaused
                    ? 'bg-slate-950/90 border-amber-800/60'
                    : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="info" size="sm">{c.channel}</Badge>
                      <Badge variant={c.difficulty?.toLowerCase() || 'medium'} size="sm">
                        {c.difficulty || 'MEDIUM'}
                      </Badge>
                    </div>

                    <Badge
                      variant={
                        isRunning ? 'running' : isCompleted ? 'completed' : isPaused ? 'paused' : c.status === 'STOPPED' ? 'stopped' : 'draft'
                      }
                      size="sm"
                    >
                      {c.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {c.description || 'Standard threat assessment campaign.'}
                    </p>
                  </div>

                  {/* Target & Metric Breakdown */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/90 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Targets</span>
                      <span className="font-bold text-slate-100 text-sm">{targets}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block font-sans">Reported</span>
                      <span className="font-bold text-emerald-300 text-sm">{reported} ({reportingPct}%)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block font-sans">Failed</span>
                      <span className="font-bold text-rose-400 text-sm">{compromised} ({compromisePct}%)</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-800/60 text-xs" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* COMPLETE BUTTON */}
                    {(isRunning || isPaused) && (
                      <button
                        type="button"
                        onClick={e => handleCompleteCampaign(e, c)}
                        className="px-2.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors text-xs flex items-center gap-1"
                        title="Mark campaign as complete"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>
                    )}

                    {isDraft && (
                      <button
                        type="button"
                        onClick={e => handleLaunchCampaign(e, c.id)}
                        className="px-2.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors text-xs flex items-center gap-1"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>Launch</span>
                      </button>
                    )}

                    {/* About / Inspect Details Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAboutCampaign(c); }}
                      className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="See About / Full Campaign Details"
                    >
                      <Info className="w-4 h-4 text-sky-400" />
                    </button>

                    {/* Edit Campaign Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(e, c)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Campaign Details"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" />
                    </button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/campaigns/${c.id}`)}
                    >
                      <span>Telemetry</span>
                    </Button>

                    {isRunning && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setEmergencyTarget(c);
                        }}
                        className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 text-rose-300 transition-colors"
                        title="Emergency Kill Switch"
                      >
                        <AlertOctagon className="w-4 h-4" />
                      </button>
                    )}

                    {!isRunning && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setDeleteTarget(c);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. HIGH-DENSITY ENTERPRISE TABLE LIST */
        <Table
          data={displayedCampaigns}
          keyExtractor={c => c.id}
          onRowClick={c => navigate(`/admin/campaigns/${c.id}`)}
          columns={[
            {
              header: 'Campaign Name & Details',
              accessor: c => (
                <div>
                  <span className="font-bold text-slate-100 block text-xs hover:text-emerald-400 transition-colors">{c.name}</span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">{c.description || 'Standard threat assessment'}</span>
                </div>
              )
            },
            {
              header: 'Channel',
              accessor: c => <Badge variant="info" size="sm">{c.channel}</Badge>
            },
            {
              header: 'Tier',
              accessor: c => <Badge variant={c.difficulty?.toLowerCase() || 'medium'} size="sm">{c.difficulty || 'MEDIUM'}</Badge>
            },
            {
              header: 'Status',
              accessor: c => (
                <Badge
                  variant={
                    c.status === 'RUNNING'
                      ? 'running'
                      : c.status === 'COMPLETED'
                      ? 'completed'
                      : c.status === 'STOPPED'
                      ? 'stopped'
                      : c.status === 'PAUSED'
                      ? 'paused'
                      : 'draft'
                  }
                  size="sm"
                >
                  {c.status}
                </Badge>
              )
            },
            {
              header: 'Targets',
              accessor: c => <span className="font-mono text-slate-200 font-bold">{c.target_count || 0}</span>
            },
            {
              header: 'Reported',
              accessor: c => {
                const total = c.target_count || 0;
                const rep = c.reported_count || 0;
                const pct = total > 0 ? Math.round((rep / total) * 100) : 0;
                return (
                  <span className="font-mono text-emerald-400 font-bold">
                    {rep} ({pct}%)
                  </span>
                );
              }
            },
            {
              header: 'Compromised',
              accessor: c => {
                const total = c.target_count || 0;
                const fail = c.compromised_count || 0;
                const pct = total > 0 ? Math.round((fail / total) * 100) : 0;
                return (
                  <span className="font-mono text-rose-400 font-bold">
                    {fail} ({pct}%)
                  </span>
                );
              }
            },
            {
              header: 'Actions',
              accessor: c => {
                const isRunning = c.status === 'RUNNING';
                const isPaused = c.status === 'PAUSED';
                const isDraft = c.status === 'DRAFT' || c.status === 'VALIDATED';

                return (
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    {/* COMPLETE BUTTON */}
                    {(isRunning || isPaused) && (
                      <button
                        type="button"
                        onClick={e => handleCompleteCampaign(e, c)}
                        className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
                        title="Mark campaign as complete"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Complete</span>
                      </button>
                    )}

                    {isDraft && (
                      <button
                        type="button"
                        onClick={e => handleLaunchCampaign(e, c.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Rocket className="w-3 h-3 text-emerald-400" />
                        <span>Launch</span>
                      </button>
                    )}

                    {/* About / Inspect Details Button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setAboutCampaign(c); }}
                      className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="See About / Full Campaign Details"
                    >
                      <Info className="w-4 h-4 text-sky-400" />
                    </button>

                    {/* Edit Campaign Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(e, c)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Campaign Details"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" />
                    </button>

                    {isRunning && (
                      <button
                        type="button"
                        onClick={() => setEmergencyTarget(c)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
                        title="Emergency Kill Switch"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/campaigns/${c.id}`)}
                    >
                      View
                    </Button>

                    {!isRunning && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-4 h-4 text-rose-400" />
                      </button>
                    )}
                  </div>
                );
              }
            }
          ]}
        />
      )}

      {/* SEE ABOUT / CAMPAIGN FULL DETAILS DOSSIER MODAL */}
      {aboutCampaign && (
        <Modal
          isOpen={true}
          onClose={() => setAboutCampaign(null)}
          title={`Campaign Blueprint Dossier: ${aboutCampaign.name}`}
          subtitle={`Campaign ID: ${aboutCampaign.id} • Channel: ${aboutCampaign.channel} • Status: ${aboutCampaign.status}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs font-sans">
            {/* Top Specification Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Attack Channel</span>
                <span className="font-bold text-emerald-400 text-sm block mt-0.5">{aboutCampaign.channel}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Difficulty Tier</span>
                <span className="font-bold text-amber-400 text-sm block mt-0.5">{aboutCampaign.difficulty || 'MEDIUM'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Target Count</span>
                <span className="font-bold text-slate-100 text-sm block mt-0.5">{aboutCampaign.target_count || 0} Staff</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Current Status</span>
                <span className="font-bold text-sky-400 text-sm block mt-0.5">{aboutCampaign.status}</span>
              </div>
            </div>

            {/* Description & Operational Purpose */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-slate-300 text-xs block">Operational Purpose & Description:</span>
              <p className="text-slate-400 leading-relaxed font-sans">
                {aboutCampaign.description || 'Simulated organizational social engineering drill assessing workforce vigilance.'}
              </p>
            </div>

            {/* Policy & Targeting Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-300 text-xs block font-mono">Targeting Scope</span>
                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div>Target Type: <strong className="text-slate-200">{aboutCampaign.target_type}</strong></div>
                  <div>Created By: <span className="text-slate-300">{aboutCampaign.creator_name || 'Admin'}</span></div>
                  <div>Created At: <span className="text-slate-300">{new Date(aboutCampaign.created_at).toLocaleString()}</span></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-300 text-xs block font-mono">Behavioral Guardrails</span>
                <div className="space-y-1 text-slate-400 text-[11px]">
                  <div>Psychological Trigger: <strong className="text-amber-400">{aboutCampaign.risk_policy?.psychological_trigger || 'URGENCY'}</strong></div>
                  <div>Auto-Assign Remediation: <span className="text-emerald-400 font-bold">{aboutCampaign.training_auto_assign ? '✓ ENABLED' : 'DISABLED'}</span></div>
                  <div>Zero-Credential Redaction: <span className="text-emerald-400 font-bold">✓ ACTIVE (In-Memory)</span></div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setAboutCampaign(null)}>
                Close Dossier
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit3 className="w-3.5 h-3.5 text-amber-400" />}
                  onClick={(e) => {
                    const c = aboutCampaign;
                    setAboutCampaign(null);
                    handleOpenEdit(e, c);
                  }}
                >
                  Edit Campaign
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const cId = aboutCampaign.id;
                    setAboutCampaign(null);
                    navigate(`/admin/campaigns/${cId}`);
                  }}
                >
                  View Live Telemetry
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT CAMPAIGN MODAL */}
      {editCampaign && (
        <Modal
          isOpen={true}
          onClose={() => setEditCampaign(null)}
          title={`Edit Campaign: ${editCampaign.name}`}
          subtitle={`Modify campaign configuration • Status: ${editCampaign.status}`}
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
              <Button variant="outline" size="sm" type="button" onClick={() => setEditCampaign(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" loading={savingEdit} icon={<Save className="w-3.5 h-3.5" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Emergency Stop Kill Switch Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(emergencyTarget)}
        onClose={() => setEmergencyTarget(null)}
        onConfirm={handleEmergencyStop}
        title="EMERGENCY CAMPAIGN STOP (KILL SWITCH)"
        message={`WARNING: You are triggering an immediate Emergency Kill Switch for campaign '${emergencyTarget?.name}'. All future scheduled simulation deliveries will be terminated immediately.`}
        confirmText="Trigger Emergency Stop"
        variant="danger"
        loading={stopping}
      />

      {/* Delete Campaign Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCampaign}
        title="Delete Simulation Campaign"
        message={`Are you sure you want to permanently delete campaign '${deleteTarget?.name}'? All associated simulation records and targets for this campaign will be removed.`}
        confirmText="Delete Campaign"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
};

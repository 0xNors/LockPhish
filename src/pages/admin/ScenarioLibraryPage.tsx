import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Shield,
  Eye,
  Send,
  Layers,
  Sparkles,
  Trash2,
  Mail,
  Smartphone,
  PhoneCall,
  Lock,
  Globe,
  Paperclip,
  CheckCircle2,
  Copy,
  Play,
  Zap,
  Tag,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { EmailClientSimulator } from '../../components/simulation/EmailClientSimulator';
import { SmsClientSimulator } from '../../components/simulation/SmsClientSimulator';
import { VoiceCallSimulator } from '../../components/simulation/VoiceCallSimulator';
import { MultiStageSimulator } from '../../components/simulation/MultiStageSimulator';
import { api } from '../../api/client';
import { Scenario, Simulation } from '../../types';

interface ScenarioLibraryPageProps {
  navigate: (path: string) => void;
}

// Category filter definitions with clean labels
const CATEGORY_FILTERS = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'MFA', label: 'MFA & Quishing' },
  { id: 'EXECUTIVE_IMPERSONATION', label: 'Executive (BEC)' },
  { id: 'IT_SUPPORT', label: 'IT Support & VPN' },
  { id: 'FINANCE', label: 'Finance & Invoices' },
  { id: 'PAYROLL', label: 'Payroll & HR' },
  { id: 'DELIVERY', label: 'Parcel & Shipping' },
  { id: 'ACCOUNT_SECURITY', label: 'Account Security' },
  { id: 'VENDOR', label: 'Vendor Wire Fraud' },
  { id: 'CLOUD_SECURITY', label: 'Cloud Infrastructure' }
];

export const ScenarioLibraryPage: React.FC<ScenarioLibraryPageProps> = ({ navigate }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeTab, setTypeTab] = useState<'ALL' | 'CUSTOM' | 'SYSTEM'>('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals & Sandbox Runner
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [sandboxSimulation, setSandboxSimulation] = useState<Simulation | null>(null);

  useEffect(() => {
    loadScenarios();
  }, [channelFilter, categoryFilter, difficultyFilter]);

  const loadScenarios = async () => {
    setLoading(true);
    try {
      const data = await api.scenarios.list({
        channel: channelFilter !== 'ALL' ? channelFilter : undefined,
        category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
        difficulty: difficultyFilter !== 'ALL' ? difficultyFilter : undefined,
        search: search || undefined
      });
      setScenarios(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScenario = async (scenId: string) => {
    if (!confirm('Are you sure you want to delete this custom scenario?')) return;
    try {
      await api.scenarios.delete(scenId);
      setSelectedScenario(null);
      loadScenarios();
    } catch (err: any) {
      alert(err.message || 'Failed to delete scenario.');
    }
  };

  // 1-Click Launch in Campaign
  const handleUseInCampaign = (scen: Scenario) => {
    navigate(`/admin/campaigns/create?scenarioId=${scen.id}&channel=${scen.channel}&difficulty=${scen.difficulty}`);
  };

  // Instant Sandbox Drill Runner
  const handleTestSandbox = (scen: Scenario) => {
    const mockSim: Simulation = {
      id: `sandbox-${scen.id}`,
      organization_id: 'sandbox-org',
      campaign_id: 'sandbox-camp',
      campaign_name: `Sandbox Drill: ${scen.name}`,
      employee_id: 'sandbox-emp',
      first_name: 'Security',
      last_name: 'Administrator',
      email: 'admin@company.com',
      scenario_id: scen.id,
      scenario_name: scen.name,
      scenario_category: scen.category,
      scenario_difficulty: scen.difficulty,
      channel: scen.channel,
      stage_number: 1,
      total_stages: scen.channel === 'MULTI_STAGE' ? 3 : 1,
      status: 'DELIVERED',
      sender_profile: scen.sender_profile,
      payload_config: scen.payload_config,
      learning_indicators: scen.learning_indicators,
      decision_tree: scen.decision_tree,
      created_at: new Date().toISOString()
    };
    setSandboxSimulation(mockSim);
  };

  const customCount = scenarios.filter(s => s.is_system_template === 0).length;
  const systemCount = scenarios.filter(s => s.is_system_template === 1).length;

  const displayedScenarios = scenarios.filter(s => {
    if (typeTab === 'CUSTOM' && s.is_system_template !== 0) return false;
    if (typeTab === 'SYSTEM' && s.is_system_template !== 1) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.sender_profile?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Scenario Master Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and inspect system threat templates, analyze spoofed envelope payloads, or build custom multi-channel phishing scenarios.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate('/admin/scenarios/create')}
        >
          Create Custom Scenario
        </Button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'ALL', label: `All Scenarios (${scenarios.length})` },
            { id: 'CUSTOM', label: `Custom Created (${customCount})` },
            { id: 'SYSTEM', label: `System Blueprints (${systemCount})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTypeTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                typeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <input
            type="text"
            placeholder="Search scenario name or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
          />

          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
          >
            <option value="ALL">All Channels</option>
            <option value="EMAIL">📧 Email Phishing</option>
            <option value="SMS">💬 SMS Smishing</option>
            <option value="VOICE">📞 Voice Vishing</option>
            <option value="MULTI_STAGE">⚡ Multi-Stage</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
          >
            <option value="ALL">All Difficulties</option>
            <option value="LOW">Low Difficulty</option>
            <option value="MEDIUM">Medium Difficulty</option>
            <option value="HIGH">High Difficulty</option>
            <option value="CRITICAL">Critical Difficulty</option>
          </select>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 shadow-sm'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <LoadingState message="Loading master scenario library..." />
      ) : displayedScenarios.length === 0 ? (
        <EmptyState
          title="No scenarios found"
          description={typeTab === 'CUSTOM' ? "You haven't created any custom scenarios yet. Click '+ Create Custom Scenario' to build one." : "No scenarios match your search filter."}
          actionText={typeTab === 'CUSTOM' ? "Create Custom Scenario" : "Show All Scenarios"}
          onAction={typeTab === 'CUSTOM' ? () => navigate('/admin/scenarios/create') : () => { setTypeTab('ALL'); setSearch(''); setCategoryFilter('ALL'); setChannelFilter('ALL'); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedScenarios.map((scen) => {
            const channelIcons: Record<string, React.ReactNode> = {
              EMAIL: <Mail className="w-4 h-4 text-emerald-400" />,
              SMS: <Smartphone className="w-4 h-4 text-sky-400" />,
              VOICE: <PhoneCall className="w-4 h-4 text-amber-400" />,
              MULTI_STAGE: <Layers className="w-4 h-4 text-purple-400" />
            };

            const indicatorsCount = scen.learning_indicators?.length || 2;

            return (
              <div
                key={scen.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                        {channelIcons[scen.channel] || <Shield className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 font-bold block">{scen.code}</span>
                        <h3 className="font-bold text-xs text-slate-100 group-hover:text-emerald-300 leading-snug line-clamp-1">
                          {scen.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {scen.is_system_template === 0 && (
                        <Badge variant="low" size="sm">Custom</Badge>
                      )}
                      <Badge variant={scen.difficulty.toLowerCase()} size="sm">{scen.difficulty}</Badge>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 min-h-[38px] leading-relaxed line-clamp-2 font-sans">
                    {scen.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel:</span>
                      <span className="font-bold text-slate-200">{scen.channel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-bold text-emerald-400">{scen.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sender / Display:</span>
                      <span className="text-slate-300 truncate max-w-[150px] font-sans">
                        {scen.sender_profile?.name || 'Corporate Security'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      {indicatorsCount} Red Flag Clues
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestSandbox(scen)}
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline font-sans flex items-center gap-0.5"
                    >
                      <Play className="w-2.5 h-2.5" /> Test Sandbox
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedScenario(scen)}
                    icon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Inspect Blueprint
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-3.5 h-3.5" />}
                    onClick={() => handleUseInCampaign(scen)}
                  >
                    Use in Campaign
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scenario Blueprint & Payload Inspector Modal */}
      {selectedScenario && (
        <Modal
          isOpen={Boolean(selectedScenario)}
          onClose={() => setSelectedScenario(null)}
          title={`Scenario Blueprint: ${selectedScenario.name}`}
          subtitle={`Code: ${selectedScenario.code} • Channel: ${selectedScenario.channel} • Category: ${selectedScenario.category} • ${selectedScenario.is_system_template === 0 ? 'Custom Organization Scenario' : 'System Template'}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs font-sans">
            {/* Sender Identity Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
              <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">Sender Envelope Profile</span>
              <div className="text-slate-300 space-y-1 text-xs">
                <div><strong>From Display Name:</strong> <span className="text-slate-100 font-bold">{selectedScenario.sender_profile?.name || 'N/A'}</span></div>
                <div><strong>Sender Address / Caller ID:</strong> <span className="text-emerald-400">{selectedScenario.sender_profile?.email || selectedScenario.sender_profile?.phone || selectedScenario.sender_profile?.caller_id || 'N/A'}</span></div>
                <div><strong>Lookalike Spoofed Domain:</strong> <span className="text-rose-400 font-bold">{selectedScenario.sender_profile?.spoofed_domain || 'N/A'}</span></div>
                {selectedScenario.sender_profile?.reply_to && (
                  <div><strong>Reply-To:</strong> <span className="text-amber-400">{selectedScenario.sender_profile?.reply_to}</span></div>
                )}
              </div>
            </div>

            {/* Email Payload Preview */}
            {selectedScenario.payload_config && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">Payload & Message Content</span>
                
                {selectedScenario.payload_config.subject && (
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase font-mono">Subject:</span>
                    <span className="text-slate-100 font-bold text-xs">{selectedScenario.payload_config.subject}</span>
                  </div>
                )}

                {selectedScenario.payload_config.body_html && (
                  <div className="p-4 bg-white text-slate-900 rounded-xl border border-slate-300 max-h-48 overflow-y-auto font-sans text-xs shadow-inner">
                    <div dangerouslySetInnerHTML={{ __html: selectedScenario.payload_config.body_html }} />
                  </div>
                )}

                {selectedScenario.payload_config.smish_text && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase font-sans">SMS Message Text:</span>
                    {selectedScenario.payload_config.smish_text}
                  </div>
                )}

                {selectedScenario.payload_config.voice_opening && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200">
                    <span className="text-slate-500 font-bold block text-[10px] uppercase font-sans">Voice Opening Pretext:</span>
                    &ldquo;{selectedScenario.payload_config.voice_opening}&rdquo;
                  </div>
                )}

                {selectedScenario.payload_config.attachment_name && (
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center gap-2 font-mono text-[11px] text-amber-300">
                    <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                    <span>Weaponized Attachment: {selectedScenario.payload_config.attachment_name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Mapped Learning Red Flags */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Concealed Red Flags in this Drill</span>
              <div className="space-y-2">
                {selectedScenario.learning_indicators?.map((ind: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="font-bold text-amber-400 block text-xs">{ind.title}</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed">{ind.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              {selectedScenario.is_system_template === 0 ? (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  onClick={() => handleDeleteScenario(selectedScenario.id)}
                >
                  Delete Scenario
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const s = selectedScenario;
                    setSelectedScenario(null);
                    handleTestSandbox(s);
                  }}
                >
                  Run Sandbox Test
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedScenario(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => {
                    const s = selectedScenario;
                    setSelectedScenario(null);
                    handleUseInCampaign(s);
                  }}
                >
                  Use in New Campaign
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Instant Sandbox Interactive Test Modal */}
      {sandboxSimulation && (
        <Modal
          isOpen={true}
          onClose={() => setSandboxSimulation(null)}
          title={`Sandbox Simulator Drill: ${sandboxSimulation.scenario_name}`}
          subtitle="Test employee experience in isolated simulation environment"
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {sandboxSimulation.channel === 'EMAIL' ? (
              <EmailClientSimulator
                simulation={sandboxSimulation}
                onEventRecorded={() => {}}
                onClose={() => setSandboxSimulation(null)}
              />
            ) : sandboxSimulation.channel === 'SMS' ? (
              <SmsClientSimulator
                simulation={sandboxSimulation}
                onEventRecorded={() => {}}
                onClose={() => setSandboxSimulation(null)}
              />
            ) : sandboxSimulation.channel === 'VOICE' ? (
              <VoiceCallSimulator
                simulation={sandboxSimulation}
                onEventRecorded={() => {}}
                onClose={() => setSandboxSimulation(null)}
              />
            ) : (
              <MultiStageSimulator
                simulation={sandboxSimulation}
                onEventRecorded={() => {}}
                onClose={() => setSandboxSimulation(null)}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

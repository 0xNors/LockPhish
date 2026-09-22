import React, { useState, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  Shield,
  Layers,
  Users,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Sparkles,
  QrCode,
  FileSpreadsheet,
  FileText,
  Smartphone,
  PhoneCall,
  Mail,
  Plus,
  Paperclip,
  Lock,
  Globe,
  Trash2,
  Save,
  Check,
  Rocket,
  Search,
  Building2,
  Clock,
  Play,
  RotateCcw,
  Target,
  Sliders,
  Bell,
  CheckCircle,
  HelpCircle,
  Eye,
  Calendar,
  Zap,
  Activity
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';
import { Scenario } from '../../types';

interface CampaignCreatePageProps {
  navigate: (path: string) => void;
}

const CAMPAIGN_PRESET_TEMPLATES = [
  {
    id: 'preset-bec-wire',
    name: 'Q3 Executive Wire & Acquisition Escrow Authorization',
    description: 'High-stakes executive impersonation evaluating financial dual-authorization compliance.',
    channel: 'EMAIL' as const,
    difficulty: 'HIGH',
    trigger: 'AUTHORITY',
    scenarioKeyword: 'wire'
  },
  {
    id: 'preset-qr-quishing',
    name: 'Microsoft 365 Authenticator Mobile QR Quishing Drill',
    description: 'Deceptive QR code lure evaluating smartphone scanning and MFA bypass resistance.',
    channel: 'EMAIL' as const,
    difficulty: 'HIGH',
    trigger: 'URGENCY',
    scenarioKeyword: 'qr'
  },
  {
    id: 'preset-payroll-deposit',
    name: 'Workday Direct Deposit & Annual Payroll Confirmation',
    description: 'Simulated payroll diversion notice testing credential verification on lookalike portal.',
    channel: 'EMAIL' as const,
    difficulty: 'MEDIUM',
    trigger: 'FINANCIAL',
    scenarioKeyword: 'payroll'
  },
  {
    id: 'preset-bank-smish',
    name: 'Commercial Banking $4,920 Fraud Hold Alert',
    description: 'High-urgency SMS smishing evaluating inbound callback caution and OTP disclosure.',
    channel: 'SMS' as const,
    difficulty: 'MEDIUM',
    trigger: 'FEAR',
    scenarioKeyword: 'bank'
  },
  {
    id: 'preset-voice-helpdesk',
    name: 'Emergency IT Helpdesk VPN Access & MFA Challenge Call',
    description: 'Controlled interactive AI voice call requesting 6-digit confirmation codes.',
    channel: 'VOICE' as const,
    difficulty: 'CRITICAL',
    trigger: 'URGENCY',
    scenarioKeyword: 'helpdesk'
  },
  {
    id: 'preset-aitm-proxy',
    name: 'Multi-Stage Reverse-Proxy (EvilProxy) Session Interception',
    description: 'Coordinated email notification followed by reverse-proxy single sign-on lure.',
    channel: 'MULTI_STAGE' as const,
    difficulty: 'CRITICAL',
    trigger: 'AUTHORITY',
    scenarioKeyword: 'session'
  }
];

export const CampaignCreatePage: React.FC<CampaignCreatePageProps> = ({ navigate }) => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [sourceScenario, setSourceScenario] = useState<Scenario | null>(null);

  // Step 1: Strategy & Identification
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'VOICE' | 'MULTI_STAGE'>('EMAIL');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [psychologicalTrigger, setPsychologicalTrigger] = useState('URGENCY');

  // Step 2: Target Scope & Exclusion
  const [targetType, setTargetType] = useState<'ALL' | 'DEPARTMENT' | 'CUSTOM'>('ALL');
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [excludeNewHires, setExcludeNewHires] = useState(false);
  const [empSearch, setEmpSearch] = useState('');

  // Step 3: Scenario Pool & Rotator
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [payloadRotationMode, setPayloadRotationMode] = useState<'RANDOM' | 'SINGLE'>('RANDOM');
  const [scenarioFilterCategory, setScenarioFilterCategory] = useState('ALL');

  // Step 4: Timing & Delivery Controls
  const [deliverySchedule, setDeliverySchedule] = useState<'STAGGERED' | 'IMMEDIATE' | 'SCHEDULED'>('STAGGERED');
  const [durationDays, setDurationDays] = useState(7);
  const [autoAssignTraining, setAutoAssignTraining] = useState(true);
  const [immediateDebrief, setImmediateDebrief] = useState(true);

  // In-Modal Custom Scenario Creator State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState('PAYROLL');
  const [customDifficulty, setCustomDifficulty] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [customSenderName, setCustomSenderName] = useState('');
  const [customSenderEmail, setCustomSenderEmail] = useState('');
  const [customSpoofedDomain, setCustomSpoofedDomain] = useState('');
  const [customReplyTo, setCustomReplyTo] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customBodyHtml, setCustomBodyHtml] = useState('');
  const [customAttachment, setCustomAttachment] = useState('');
  const [customLandingType, setCustomLandingType] = useState('MICROSOFT_SSO');
  const [customSmishText, setCustomSmishText] = useState('');
  const [customVoicePersona, setCustomVoicePersona] = useState('');
  const [customVoiceOpening, setCustomVoiceOpening] = useState('');
  const [savingCustomScen, setSavingCustomScen] = useState(false);
  const [customModalError, setCustomModalError] = useState('');

  // Scenario Preview Drawer
  const [previewScenario, setPreviewScenario] = useState<Scenario | null>(null);

  const [saving, setSaving] = useState(false);
  const [launchingNow, setLaunchingNow] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrerequisites();
  }, []);

  const loadPrerequisites = async () => {
    setLoading(true);
    try {
      const [deptData, empData, scenData] = await Promise.all([
        api.org.getDepartments(),
        api.employees.list({ limit: 500 }),
        api.scenarios.list()
      ]);
      setDepartments(deptData || []);
      setEmployees(empData.employees || []);
      const fetchedScenarios = scenData || [];
      setScenarios(fetchedScenarios);

      // Parse query string parameters (e.g. from Scenario Library "Use in Campaign")
      const searchParams = new URLSearchParams(window.location.search);
      const scenarioIdParam = searchParams.get('scenarioId');
      const channelParam = searchParams.get('channel') as any;
      const difficultyParam = searchParams.get('difficulty');
      const targetParam = searchParams.get('target');
      const groupIdParam = searchParams.get('groupId');
      const deptIdParam = searchParams.get('deptId');

      if (scenarioIdParam) {
        const matched = fetchedScenarios.find((s: Scenario) => s.id === scenarioIdParam || s.code === scenarioIdParam);
        if (matched) {
          setSourceScenario(matched);
          setName(`${matched.name} - Targeted Campaign`);
          setDescription(matched.description || `Targeted workforce drill simulating ${matched.channel} vector.`);
          setChannel(matched.channel);
          setDifficulty(matched.difficulty || 'MEDIUM');
          setSelectedScenarioIds([matched.id]);

          // Auto-map psychological trigger based on category
          const cat = (matched.category || '').toUpperCase();
          if (cat.includes('EXEC') || cat.includes('AUTHORITY')) setPsychologicalTrigger('AUTHORITY');
          else if (cat.includes('PAYROLL') || cat.includes('FINANCE')) setPsychologicalTrigger('FINANCIAL');
          else if (cat.includes('FEAR') || cat.includes('SUSPENSION')) setPsychologicalTrigger('FEAR');
          else if (cat.includes('ROUTINE') || cat.includes('DELIVERY')) setPsychologicalTrigger('ROUTINE');
          else setPsychologicalTrigger('URGENCY');
        }
      } else if (channelParam && ['EMAIL', 'SMS', 'VOICE', 'MULTI_STAGE'].includes(channelParam)) {
        setChannel(channelParam);
        if (difficultyParam) setDifficulty(difficultyParam);
        const matching = fetchedScenarios.filter((s: Scenario) => s.channel === channelParam);
        if (matching.length > 0) {
          setSelectedScenarioIds([matching[0].id]);
        }
      } else {
        // Auto-select first matching scenario
        const initialMatch = fetchedScenarios.filter((s: Scenario) => s.channel === 'EMAIL');
        if (initialMatch.length > 0) {
          setSelectedScenarioIds([initialMatch[0].id]);
        }
      }

      if (targetParam === 'DEPARTMENT' && deptIdParam) {
        setTargetType('DEPARTMENT');
        setSelectedDeptIds([deptIdParam]);
      }
    } catch (err: any) {
      console.error('Failed to load campaign prerequisites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPresetTemplate = (preset: (typeof CAMPAIGN_PRESET_TEMPLATES)[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setChannel(preset.channel);
    setDifficulty(preset.difficulty);
    setPsychologicalTrigger(preset.trigger);

    const matching = scenarios.filter(s => s.channel === preset.channel);
    if (matching.length > 0) {
      const specific = matching.find(s =>
        s.name.toLowerCase().includes(preset.scenarioKeyword) ||
        s.category.toLowerCase().includes(preset.scenarioKeyword)
      );
      setSelectedScenarioIds([specific ? specific.id : matching[0].id]);
    }
  };

  const filteredScenarios = scenarios.filter(s => {
    if (s.channel !== channel) return false;
    if (scenarioFilterCategory !== 'ALL' && s.category !== scenarioFilterCategory) return false;
    return true;
  });

  // Calculate total targeted staff count
  const computeTargetCount = () => {
    if (targetType === 'ALL') {
      return employees.length;
    }
    if (targetType === 'DEPARTMENT') {
      if (selectedDeptIds.length === 0) return 0;
      return employees.filter(e => e.department_id && selectedDeptIds.includes(e.department_id)).length;
    }
    if (targetType === 'CUSTOM') {
      return selectedEmployeeIds.length;
    }
    return 0;
  };

  const targetStaffCount = computeTargetCount();

  const handleToggleDepartment = (deptId: string) => {
    setSelectedDeptIds(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const handleToggleEmployee = (empId: string) => {
    setSelectedEmployeeIds(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  const handleSelectAllEmployees = () => {
    if (selectedEmployeeIds.length === employees.length) {
      setSelectedEmployeeIds([]);
    } else {
      setSelectedEmployeeIds(employees.map(e => e.id));
    }
  };

  const handleToggleScenario = (scenId: string) => {
    setSelectedScenarioIds(prev =>
      prev.includes(scenId)
        ? prev.filter(id => id !== scenId)
        : [...prev, scenId]
    );
  };

  // Submit Handler: Save Draft or Instant Launch
  const handleSubmit = async (launchImmediately = false) => {
    if (!name.trim()) {
      setError('Please provide an operational campaign name.');
      return;
    }

    if (selectedScenarioIds.length === 0) {
      setError('Please select at least one threat scenario for the payload pool.');
      return;
    }

    if (targetStaffCount === 0) {
      setError('Please select at least one active employee or department to target.');
      return;
    }

    setError('');
    if (launchImmediately) setLaunchingNow(true);
    else setSaving(true);

    try {
      // 1. Create Campaign
      const campaign = await api.campaigns.create({
        name: name.trim(),
        description: description.trim(),
        channel,
        target_type: targetType,
        target_filter: {
          department_ids: selectedDeptIds,
          employee_ids: selectedEmployeeIds,
          exclude_new_hires: excludeNewHires
        },
        scenario_ids: selectedScenarioIds,
        difficulty,
        training_auto_assign: autoAssignTraining,
        risk_policy: {
          psychological_trigger: psychologicalTrigger,
          delivery_schedule: deliverySchedule,
          duration_days: durationDays,
          immediate_debrief: immediateDebrief
        }
      });

      // 2. If Launch Immediately selected, validate and launch
      if (launchImmediately) {
        await api.campaigns.validate(campaign.id);
        await api.campaigns.launch(campaign.id);
      }

      setSaving(false);
      setLaunchingNow(false);
      navigate(`/admin/campaigns/${campaign.id}`);
    } catch (err: any) {
      setSaving(false);
      setLaunchingNow(false);
      setError(err.message || 'Failed to initialize campaign.');
    }
  };

  // Preset loader for custom scenario creator
  const applyPresetToCustomModal = (preset: 'QR_CODE' | 'MACRO_EXCEL' | 'DOCUSIGN' | 'EXEC_WIRE' | 'BANK_SMS' | 'IT_VOICE') => {
    if (preset === 'QR_CODE') {
      setCustomName('Microsoft Authenticator Mobile QR Quishing');
      setCustomCategory('MFA');
      setCustomDifficulty('HIGH');
      setCustomSenderName('Microsoft Identity Security');
      setCustomSenderEmail('mfa-sync@microsoft-auth-cloud.com');
      setCustomSpoofedDomain('microsoft-auth-cloud.com');
      setCustomReplyTo('support@mfa-sync-verify.net');
      setCustomSubject('Action Required: Scan QR code to synchronize Microsoft Authenticator');
      setCustomBodyHtml('<p>Hello <strong>{{first_name}}</strong>,</p><p>To maintain access to corporate services for <strong>{{company}}</strong>, scan your dedicated QR code below with your smartphone camera:</p><div style="text-align:center; padding:16px; background:#f8fafc; border:1px dashed #cbd5e1; margin:16px 0; border-radius:8px;"><p style="font-weight:bold; color:#334155;">Scan with Phone Camera:</p><div style="display:inline-block; border:2px solid #0078d4; padding:10px; background:white; margin:8px 0;">[QR CODE PREVIEW]</div><p><a href="{{simulation_link}}" style="color:#0078d4; font-weight:bold;">Or click here to verify in browser</a></p></div>');
      setCustomLandingType('MICROSOFT_SSO');
      setCustomAttachment('');
    } else if (preset === 'MACRO_EXCEL') {
      setCustomName('Q3 Executive Compensation & Variable Bonus Matrix (.xlsm)');
      setCustomCategory('FINANCE');
      setCustomDifficulty('HIGH');
      setCustomSenderName('Corporate Compensation Committee');
      setCustomSenderEmail('comp-review@corporate-rewards-advisory.com');
      setCustomSpoofedDomain('corporate-rewards-advisory.com');
      setCustomSubject('CONFIDENTIAL: Q3 Executive Compensation & Remuneration Allocation Matrix');
      setCustomBodyHtml('<p>Dear {{first_name}},</p><p>Attached is the approved executive compensation schedule for {{department}}. Please enable macros upon opening to decrypt the embedded spreadsheet calculations.</p>');
      setCustomAttachment('Q3_Executive_Bonus_Matrix.xlsm');
      setCustomLandingType('CUSTOM_PORTAL');
    } else if (preset === 'DOCUSIGN') {
      setCustomName('DocuSign Electronic NDA Review & Sign');
      setCustomCategory('EXECUTIVE_IMPERSONATION');
      setCustomDifficulty('MEDIUM');
      setCustomSenderName('DocuSign Signature Services');
      setCustomSenderEmail('dse@docusign-corporate-verify.com');
      setCustomSpoofedDomain('docusign-corporate-verify.com');
      setCustomSubject('Please DocuSign: Strategic Acquisition Non-Disclosure Agreement #NDA-99412');
      setCustomBodyHtml('<p>Legal Counsel requested your electronic signature on the confidential agreement.</p><p><a href="{{simulation_link}}">REVIEW & SIGN DOCUMENT</a></p>');
      setCustomLandingType('MICROSOFT_SSO');
      setCustomAttachment('');
    } else if (preset === 'BANK_SMS') {
      setCustomName('Commercial Bank Unauthorized Wire Dispute Alert');
      setCustomCategory('FINANCE');
      setCustomDifficulty('MEDIUM');
      setCustomSenderEmail('');
      setCustomSmishText('[SECURITY ALERT] Unauthorized wire of $4,850.00 initiated on your commercial account. If not authorized, cancel immediately at: {{simulation_link}} or reply STOP');
    } else if (preset === 'IT_VOICE') {
      setCustomName('IT Infrastructure Emergency VPN Sync Call');
      setCustomCategory('IT_SUPPORT');
      setCustomDifficulty('HIGH');
      setCustomVoicePersona('Alex Taylor, Senior Network Engineer');
      setCustomVoiceOpening('Hello {{first_name}}, this is Alex from corporate IT infrastructure. We are performing an emergency VPN router switchover for {{department}} and need your 6-digit MFA confirmation code.');
    }
  };

  const handleSaveAndAttachCustomScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setCustomModalError('Scenario name is required.');
      return;
    }

    setSavingCustomScen(true);
    setCustomModalError('');

    try {
      const payloadConfig: Record<string, any> = {};

      if (channel === 'EMAIL' || channel === 'MULTI_STAGE') {
        payloadConfig.subject = customSubject || `Important Notice for {{first_name}}`;
        payloadConfig.body_html = customBodyHtml || `<p>Dear {{first_name}}, please review account security at <a href="{{simulation_link}}">this portal</a>.</p>`;
        payloadConfig.fake_landing_type = customLandingType;
        payloadConfig.landing_url = `https://auth.corporate-security-verify.com/login`;
        if (customAttachment) payloadConfig.attachment_name = customAttachment;
      }

      if (channel === 'SMS' || channel === 'MULTI_STAGE') {
        payloadConfig.smish_text = customSmishText || `[ALERT] Action needed for {{first_name}}. Review at {{simulation_link}}`;
        payloadConfig.landing_url = `https://sec-verify.net/m`;
      }

      if (channel === 'VOICE' || channel === 'MULTI_STAGE') {
        payloadConfig.voice_persona = customVoicePersona || 'IT Support Specialist';
        payloadConfig.voice_opening = customVoiceOpening || `Hello {{first_name}}, this is IT support calling regarding a security alert on your workstation.`;
      }

      const newScenario = await api.scenarios.create({
        name: customName.trim(),
        channel,
        category: customCategory,
        difficulty: customDifficulty,
        description: 'Custom phishing vector created for campaign.',
        sender_profile: {
          name: customSenderName || 'Corporate Security Operations',
          email: customSenderEmail || 'alerts@company-security-verify.net',
          spoofed_domain: customSpoofedDomain || 'company-security-verify.net',
          reply_to: customReplyTo || undefined,
          caller_id: customSenderName || 'IT-SUPPORT-PRIORITY'
        },
        payload_config: payloadConfig,
        learning_indicators: [
          { title: 'Deceptive Lookalike Domain', description: 'Sender address uses an external unverified domain.' },
          { title: 'Urgent Request Tactic', description: 'Creates pressure to bypass standard verification.' }
        ],
        decision_tree: {
          nodes: [
            { id: '1', title: 'Initial Lure', description: 'Employee receives simulated drill', next_step_ids: ['2', '3'] },
            { id: '2', title: 'Report as Phish', description: 'Safe resolution', next_step_ids: [] },
            { id: '3', title: 'Link Clicked / Code Entered', description: 'Compromise event recorded', next_step_ids: [] }
          ]
        }
      });

      setScenarios(prev => [newScenario, ...prev]);
      setSelectedScenarioIds(prev => [...prev, newScenario.id]);
      setSavingCustomScen(false);
      setShowCustomModal(false);
    } catch (err: any) {
      setSavingCustomScen(false);
      setCustomModalError(err.message || 'Failed to create scenario.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading advanced campaign configuration studio..." />;
  }

  const filteredEmployeesForCustom = employees.filter(e => {
    if (!empSearch || !empSearch.trim()) return true;
    const q = empSearch.toLowerCase().trim();
    const fullName = `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase();
    return fullName.includes(q) || (e.email || '').toLowerCase().includes(q) || (e.job_title || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/admin/campaigns')}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Create Simulation Campaign</h1>
              <Badge variant="low" size="sm">Enterprise Campaign Studio</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure targeted workforce audience, select phishing scenarios, schedule delivery windows, and launch simulations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Target className="w-3.5 h-3.5" />
            <span>Targeting {targetStaffCount} Employees</span>
          </span>
        </div>
      </div>

      {/* Scope Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Scope</span>
            <span className="text-sm font-bold text-slate-100 mt-0.5 block">{targetStaffCount} Staff</span>
          </div>
          <Users className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Attack Channel</span>
            <span className="text-sm font-bold text-sky-400 mt-0.5 block">{channel}</span>
          </div>
          {channel === 'EMAIL' ? <Mail className="w-4 h-4 text-sky-400" /> : channel === 'SMS' ? <Smartphone className="w-4 h-4 text-sky-400" /> : channel === 'VOICE' ? <PhoneCall className="w-4 h-4 text-amber-400" /> : <Layers className="w-4 h-4 text-purple-400" />}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Difficulty Tier</span>
            <span className="text-sm font-bold text-amber-400 mt-0.5 block">{difficulty}</span>
          </div>
          <Zap className="w-4 h-4 text-amber-400" />
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Payload Pool</span>
            <span className="text-sm font-bold text-slate-100 mt-0.5 block">{selectedScenarioIds.length} Attached</span>
          </div>
          <Sparkles className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Auto-Configured from Scenario Blueprint Banner */}
      {sourceScenario && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-2 border-emerald-500/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              🎯
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono block">
                Auto-Filled Campaign from Scenario Blueprint:
              </span>
              <h3 className="font-bold text-slate-100 text-sm">{sourceScenario.name}</h3>
              <p className="text-[11px] text-slate-300">
                Channel: <strong className="text-emerald-400 font-mono">{sourceScenario.channel}</strong> &bull; Category: <strong className="text-slate-200">{sourceScenario.category}</strong> &bull; Tier: <strong className="text-amber-400 font-mono">{sourceScenario.difficulty}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              size="sm"
              icon={<Rocket className="w-3.5 h-3.5" />}
              loading={launchingNow}
              onClick={() => handleSubmit(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
            >
              Validate & Launch Campaign Now
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Quick-Start Preset Accelerators */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Sparkles className="w-4 h-4 text-amber-400" />
            1-Click Modern Attack Campaign Presets:
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Click any preset to auto-configure</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CAMPAIGN_PRESET_TEMPLATES.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleApplyPresetTemplate(preset)}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-bold text-slate-200 group-hover:text-emerald-300 block leading-snug line-clamp-2">
                  {preset.name}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-900">
                <span className="text-[9px] font-mono text-slate-500">{preset.channel}</span>
                <span className={`text-[9px] font-mono font-bold ${preset.difficulty === 'CRITICAL' ? 'text-purple-400' : 'text-amber-400'}`}>
                  {preset.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSubmit(false); }} className="space-y-6 text-xs">
        {/* Step 1: Campaign Strategy & Difficulty */}
        <Card title="1. Campaign Strategy & Threat Vector" subtitle="Name, operational purpose, psychological triggers, and difficulty tier">
          <div className="space-y-4">
            <Input
              label="Campaign Name *"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Q3 Executive Wire & Weaponized Attachment Assessment"
            />

            <Input
              label="Description / Operational Purpose (Optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Measuring workforce susceptibility to credential harvesting and deceptive file attachments."
            />

            {/* Difficulty Tier Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Simulation Campaign Difficulty Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'LOW', label: '🟢 Easy / Low', desc: 'Foundational lures & obvious spoofing' },
                  { id: 'MEDIUM', label: '🟡 Medium', desc: 'Realistic corporate SaaS & payroll lures' },
                  { id: 'HIGH', label: '🔴 Hard / High', desc: 'Technical BEC, QR quishing & macros' },
                  { id: 'CRITICAL', label: '🟣 Extreme / Critical', desc: 'AI deepfakes & AitM proxy evasion' }
                ].map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDifficulty(d.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      difficulty === d.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold text-xs text-slate-100">{d.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Attack Simulation Channel */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Attack Simulation Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'EMAIL', label: 'Email Phishing', desc: 'Attachments, QR & Link traps' },
                  { id: 'SMS', label: 'SMS Smishing', desc: 'Urgent mobile pre-texts' },
                  { id: 'VOICE', label: 'Voice (Vishing)', desc: 'Controlled AI voice calls' },
                  { id: 'MULTI_STAGE', label: 'Multi-Stage', desc: 'Cross-channel coordinated' }
                ].map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setChannel(ch.id as any);
                      const matching = scenarios.filter(s => s.channel === ch.id);
                      if (matching.length > 0) setSelectedScenarioIds([matching[0].id]);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      channel === ch.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-950/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="block font-bold text-xs text-slate-100">{ch.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-1">{ch.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Psychological Trigger Vector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Primary Psychological Trigger
                </label>
                <select
                  value={psychologicalTrigger}
                  onChange={e => setPsychologicalTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="URGENCY" className="bg-slate-900 text-slate-100 py-2">⏰ Extreme Urgency (24-Hour Expiration)</option>
                  <option value="AUTHORITY" className="bg-slate-900 text-slate-100 py-2">👔 Executive Authority (CFO / Board Request)</option>
                  <option value="FINANCIAL" className="bg-slate-900 text-slate-100 py-2">💰 Financial / Payroll Diversion</option>
                  <option value="FEAR" className="bg-slate-900 text-slate-100 py-2">⚠️ Account Suspension / Tax Audit</option>
                  <option value="ROUTINE" className="bg-slate-900 text-slate-100 py-2">📂 Routine Workflow / Shared Drive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Delivery Schedule Mode
                </label>
                <select
                  value={deliverySchedule}
                  onChange={e => setDeliverySchedule(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="STAGGERED" className="bg-slate-900 text-slate-100 py-2">⏱️ Smart Staggered Delivery (Business Hours)</option>
                  <option value="IMMEDIATE" className="bg-slate-900 text-slate-100 py-2">⚡ Instant Delivery (All Targets at Once)</option>
                  <option value="SCHEDULED" className="bg-slate-900 text-slate-100 py-2">📅 Multi-Day Campaign Window</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Campaign Active Window
                </label>
                <select
                  value={durationDays}
                  onChange={e => setDurationDays(parseInt(e.target.value, 10) || 7)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="3" className="bg-slate-900 text-slate-100 py-2">3 Days Active Assessment</option>
                  <option value="7" className="bg-slate-900 text-slate-100 py-2">7 Days Standard Window (Recommended)</option>
                  <option value="14" className="bg-slate-900 text-slate-100 py-2">14 Days Extended Monitoring</option>
                  <option value="30" className="bg-slate-900 text-slate-100 py-2">30 Days Comprehensive Audit</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2: Target Audience */}
        <Card title="2. Target Audience Scope & Exclusion Guardrails" subtitle="Select which employees and departments will receive this simulation drill">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'ALL', label: 'All Active Employees', desc: `Entire workforce (${employees.length} Staff Members)` },
                { id: 'DEPARTMENT', label: 'Target Specific Departments', desc: 'Isolate business divisions' },
                { id: 'CUSTOM', label: 'Custom Staff Selection', desc: 'Pick specific employees' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTargetType(t.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    targetType === t.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-slate-100">{t.label}</span>
                  <span className="text-[11px] text-slate-500 block mt-1">{t.desc}</span>
                </button>
              ))}
            </div>

            {/* Target Specific Departments View */}
            {targetType === 'DEPARTMENT' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Select Target Departments:</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {selectedDeptIds.length} of {departments.length} selected ({targetStaffCount} staff targeted)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {departments.map(dept => {
                    const isSelected = selectedDeptIds.includes(dept.id);
                    const staffInDept = employees.filter(e => e.department_id === dept.id).length;

                    return (
                      <div
                        key={dept.id}
                        onClick={() => handleToggleDepartment(dept.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Building2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-amber-400'}`} />
                          <div className="truncate">
                            <span className="text-xs block truncate">{dept.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {staffInDept === 1 ? '1 Staff Member' : `${staffInDept} Staff Members`}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Individual Selection View */}
            {targetType === 'CUSTOM' && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      placeholder="Search employees by name, email, job title..."
                      value={empSearch}
                      onChange={e => setEmpSearch(e.target.value)}
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={handleSelectAllEmployees}>
                      {selectedEmployeeIds.length === employees.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <span className="text-xs font-mono text-emerald-400 font-bold shrink-0">
                      {selectedEmployeeIds.length} Selected
                    </span>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {filteredEmployeesForCustom.map(emp => {
                    const isSelected = selectedEmployeeIds.includes(emp.id);
                    return (
                      <div
                        key={emp.id}
                        onClick={() => handleToggleEmployee(emp.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-200 shrink-0">
                            {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                          </div>
                          <div className="truncate">
                            <span className="block truncate">{emp.first_name} {emp.last_name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block truncate">{emp.email} &bull; {emp.department_name || 'General'}</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Step 3: Threat Scenario Pool */}
        <Card
          title="3. Threat Scenario Payload Pool"
          subtitle={`Select one or more ${channel} phishing lures for this simulation`}
          action={
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowCustomModal(true)}
            >
              + Build Custom Scenario
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">
                  {selectedScenarioIds.length} of {filteredScenarios.length} scenarios attached
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">Payload Distribution:</span>
                <select
                  value={payloadRotationMode}
                  onChange={e => setPayloadRotationMode(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-emerald-400 font-bold"
                >
                  <option value="RANDOM">🎲 Randomize Payloads across Staff</option>
                  <option value="SINGLE">🎯 Uniform Single Payload</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredScenarios.map(scen => {
                const isSelected = selectedScenarioIds.includes(scen.id);
                return (
                  <div
                    key={scen.id}
                    onClick={() => handleToggleScenario(scen.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-slate-100 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-100 text-xs block">{scen.name}</span>
                        <Badge variant={scen.difficulty.toLowerCase()} size="sm">{scen.difficulty}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scen.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Category: {scen.category}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewScenario(scen);
                          }}
                          className="text-sky-400 hover:text-sky-300 underline font-bold"
                        >
                          Preview Lure
                        </button>
                        <span className={`font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isSelected ? '✓ Attached' : '+ Attach'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Step 4: Safety Guardrails & Launch Triggers */}
        <Card title="4. Safety Guardrails & Launch Execution" subtitle="Pre-flight validation and execution triggers">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoAssignTraining}
                  onChange={e => setAutoAssignTraining(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-100 block">
                    Auto-Assign Remedial Training
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block leading-relaxed">
                    Automatically enroll employees in targeted remediation when compromised.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={immediateDebrief}
                  onChange={e => setImmediateDebrief(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-100 block">
                    Immediate In-Scenario Debrief
                  </span>
                  <span className="text-xs text-slate-400 mt-0.5 block leading-relaxed">
                    Display instant red-flag reveals and feedback upon simulation resolution.
                  </span>
                </div>
              </label>
            </div>

            {/* Safety Review Checklist Box */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Credential Storage Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Delivery Window Enforced</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Stage State Machine Ready</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-3">
          <Button variant="outline" size="md" type="button" onClick={() => navigate('/admin/campaigns')}>
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              type="button"
              loading={saving}
              onClick={() => handleSubmit(false)}
              icon={<Save className="w-4 h-4" />}
            >
              Save as Draft
            </Button>

            <Button
              variant="primary"
              size="md"
              type="button"
              loading={launchingNow}
              onClick={() => handleSubmit(true)}
              icon={<Rocket className="w-4 h-4" />}
              className="shadow-lg shadow-emerald-950/60 bg-emerald-600 hover:bg-emerald-500"
            >
              Validate & Launch Campaign Now
            </Button>
          </div>
        </div>
      </form>

      {/* SCENARIO PREVIEW MODAL */}
      {previewScenario && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewScenario(null)}
          title={`Scenario Preview: ${previewScenario.name}`}
          subtitle={`Channel: ${previewScenario.channel} • Category: ${previewScenario.category} • Tier: ${previewScenario.difficulty}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-300 leading-relaxed">{previewScenario.description}</p>
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <Button variant="primary" size="sm" onClick={() => setPreviewScenario(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* IMPORT / BUILD CUSTOM SCENARIO MODAL */}
      <Modal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        title="Create & Attach Custom Scenario to Campaign"
        subtitle={`Attack Channel: ${channel}`}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveAndAttachCustomScenario} className="space-y-4 text-xs">
          {customModalError && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
              {customModalError}
            </div>
          )}

          {/* 1-Click Preset Loaders */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              1-Click Modern Attack Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <Button type="button" variant="outline" size="sm" icon={<QrCode className="w-3 h-3 text-emerald-400" />} onClick={() => applyPresetToCustomModal('QR_CODE')}>
                QR Quishing (MFA)
              </Button>
              <Button type="button" variant="outline" size="sm" icon={<FileSpreadsheet className="w-3 h-3 text-amber-400" />} onClick={() => applyPresetToCustomModal('MACRO_EXCEL')}>
                Macro Excel (.xlsm)
              </Button>
              <Button type="button" variant="outline" size="sm" icon={<FileText className="w-3 h-3 text-sky-400" />} onClick={() => applyPresetToCustomModal('DOCUSIGN')}>
                DocuSign NDA
              </Button>
              <Button type="button" variant="outline" size="sm" icon={<Smartphone className="w-3 h-3 text-indigo-400" />} onClick={() => applyPresetToCustomModal('BANK_SMS')}>
                Bank SMS Dispute
              </Button>
              <Button type="button" variant="outline" size="sm" icon={<PhoneCall className="w-3 h-3 text-rose-400" />} onClick={() => applyPresetToCustomModal('IT_VOICE')}>
                Voice Vishing Call
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Custom Scenario Name *"
              required
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              placeholder="e.g. Urgent Q3 Compensation Bonus Matrix (.xlsm)"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Category
              </label>
              <select
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
              >
                <option value="MFA" className="bg-slate-900 text-slate-100">MFA & QR Quishing</option>
                <option value="FINANCE" className="bg-slate-900 text-slate-100">Finance & Invoices</option>
                <option value="PAYROLL" className="bg-slate-900 text-slate-100">Payroll & Direct Deposit</option>
                <option value="IT_SUPPORT" className="bg-slate-900 text-slate-100">IT Support & Passwords</option>
                <option value="EXECUTIVE_IMPERSONATION" className="bg-slate-900 text-slate-100">Executive Impersonation</option>
                <option value="DELIVERY" className="bg-slate-900 text-slate-100">Delivery & Packages</option>
                <option value="VENDOR" className="bg-slate-900 text-slate-100">Vendor Wire Fraud</option>
                <option value="CLOUD_SECURITY" className="bg-slate-900 text-slate-100">Cloud Infrastructure</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Sender Display Name"
              value={customSenderName}
              onChange={e => setCustomSenderName(e.target.value)}
              placeholder="e.g. Corporate IT Security"
            />
            <Input
              label="Sender Email Address"
              value={customSenderEmail}
              onChange={e => setCustomSenderEmail(e.target.value)}
              placeholder="e.g. alerts@company-security-verify.net"
            />
            <Input
              label="Lookalike Domain"
              value={customSpoofedDomain}
              onChange={e => setCustomSpoofedDomain(e.target.value)}
              placeholder="e.g. company-security-verify.net"
            />
          </div>

          {(channel === 'EMAIL' || channel === 'MULTI_STAGE') && (
            <div className="space-y-3">
              <Input
                label="Email Subject Line"
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                placeholder="e.g. Action Required: Confirm Account Details"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email HTML Content (Supports &#123;&#123;first_name&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;simulation_link&#125;&#125;)
                </label>
                <textarea
                  rows={3}
                  value={customBodyHtml}
                  onChange={e => setCustomBodyHtml(e.target.value)}
                  placeholder="<p>Dear {{first_name}}, please review at <a href='{{simulation_link}}'>this link</a></p>"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Fake Landing Portal
                  </label>
                  <select
                    value={customLandingType}
                    onChange={e => setCustomLandingType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="MICROSOFT_SSO" className="bg-slate-900 text-slate-100">Microsoft 365 SSO Login</option>
                    <option value="PAYROLL_PORTAL" className="bg-slate-900 text-slate-100">Corporate Payroll Portal</option>
                    <option value="CUSTOM_PORTAL" className="bg-slate-900 text-slate-100">Custom Corporate Portal</option>
                  </select>
                </div>

                <Input
                  label="Weaponized Attachment (e.g. Bonus.xlsm, invoice.pdf)"
                  value={customAttachment}
                  onChange={e => setCustomAttachment(e.target.value)}
                  placeholder="e.g. Bonus_Matrix.xlsm"
                />
              </div>
            </div>
          )}

          {(channel === 'SMS' || channel === 'MULTI_STAGE') && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                SMS Message Text
              </label>
              <textarea
                rows={2}
                value={customSmishText}
                onChange={e => setCustomSmishText(e.target.value)}
                placeholder="[ALERT] Action needed for {{first_name}}. Verify at {{simulation_link}}"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {(channel === 'VOICE' || channel === 'MULTI_STAGE') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Voice Agent Persona"
                value={customVoicePersona}
                onChange={e => setCustomVoicePersona(e.target.value)}
                placeholder="e.g. Alex Taylor, Infrastructure Lead"
              />
              <Input
                label="Voice Agent Opening Line"
                value={customVoiceOpening}
                onChange={e => setCustomVoiceOpening(e.target.value)}
                placeholder="e.g. Hello {{first_name}}, this is Alex from IT support..."
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowCustomModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={savingCustomScen} icon={<Plus className="w-3.5 h-3.5" />}>
              Save Scenario & Attach to Campaign
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

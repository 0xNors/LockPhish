import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  CheckCircle2,
  Lock,
  Save,
  Globe,
  AlertTriangle,
  Building2,
  Clock,
  Mail,
  Phone,
  Bell,
  Scale,
  RotateCcw,
  Zap,
  Radio,
  FileCheck2,
  FileText
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

interface OrganizationSettingsPageProps {
  navigate: (path: string) => void;
}

export const OrganizationSettingsPage: React.FC<OrganizationSettingsPageProps> = ({ navigate }) => {
  const { organization, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  // Section 1: Tenant Profile & Governance
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [sizeRange, setSizeRange] = useState('50-250');
  const [cisoEmail, setCisoEmail] = useState('');
  const [socPhone, setSocPhone] = useState('');
  const [timezone, setTimezone] = useState('UTC-5 (Eastern Time)');

  // Section 2: Mathematical Risk Formula Weights
  const [baseScore, setBaseScore] = useState(100);
  const [clickPenalty, setClickPenalty] = useState(25);
  const [credentialPenalty, setCredentialPenalty] = useState(40);
  const [voicePenalty, setVoicePenalty] = useState(45);
  const [reportReward, setReportReward] = useState(15);
  const [trainingReward, setTrainingReward] = useState(20);
  const [repeatMultiplier, setRepeatMultiplier] = useState(1.5);
  const [safeRecoveryRate, setSafeRecoveryRate] = useState(5);
  const [highRiskThreshold, setHighRiskThreshold] = useState(60);
  const [criticalRiskThreshold, setCriticalRiskThreshold] = useState(40);

  // Section 3: Simulation Windows & Safety Guardrails
  const [deliveryWindow, setDeliveryWindow] = useState('BUSINESS_HOURS');
  const [monthlyThrottle, setMonthlyThrottle] = useState(2);
  const [whitelistDomains, setWhitelistDomains] = useState('');
  const [bypassHeader, setBypassHeader] = useState('X-LockPhish-Simulation: true');

  // Section 4: Automated Remediation & Alerts
  const [autoRemediation, setAutoRemediation] = useState(true);
  const [mandatoryPassScore, setMandatoryPassScore] = useState(80);
  const [webhookUrl, setWebhookUrl] = useState('');

  // Section 5: Data Privacy & Audit
  const [auditRetention, setAuditRetention] = useState('1_YEAR');
  const [piiRedaction, setPiiRedaction] = useState(true);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const org = await api.org.getCurrent();
      setName(org.name || '');
      setIndustry(org.industry || 'Technology');
      setSizeRange(org.size_range || '50-250');

      const rp = org.risk_policy || {};
      setBaseScore(typeof rp.base_score === 'number' ? rp.base_score : 100);
      setClickPenalty(typeof rp.click_penalty === 'number' ? rp.click_penalty : 25);
      setCredentialPenalty(typeof rp.credential_penalty === 'number' ? rp.credential_penalty : 40);
      setVoicePenalty(typeof rp.voice_disclosure_penalty === 'number' ? rp.voice_disclosure_penalty : 45);
      setReportReward(typeof rp.report_reward === 'number' ? rp.report_reward : 15);
      setTrainingReward(typeof rp.training_reward === 'number' ? rp.training_reward : 20);
      setRepeatMultiplier(typeof rp.repeat_multiplier === 'number' ? rp.repeat_multiplier : 1.5);
      setSafeRecoveryRate(typeof rp.safe_recovery_rate === 'number' ? rp.safe_recovery_rate : 5);
      setHighRiskThreshold(typeof rp.high_risk_threshold === 'number' ? rp.high_risk_threshold : 60);
      setCriticalRiskThreshold(typeof rp.critical_risk_threshold === 'number' ? rp.critical_risk_threshold : 40);

      setCisoEmail(rp.ciso_email || `security@${org.domain || 'company.com'}`);
      setSocPhone(rp.soc_phone || '+1 (800) 555-0199');
      setTimezone(rp.timezone || 'UTC-5 (Eastern Time)');
      setDeliveryWindow(rp.delivery_window || 'BUSINESS_HOURS');
      setMonthlyThrottle(typeof rp.monthly_throttle === 'number' ? rp.monthly_throttle : 2);
      setWhitelistDomains(Array.isArray(org.safety_whitelist) ? org.safety_whitelist.join(', ') : (org.domain || 'company.com'));
      setBypassHeader(rp.bypass_header || 'X-LockPhish-Simulation: true');
      setAutoRemediation(rp.auto_remediation !== false);
      setMandatoryPassScore(typeof rp.mandatory_pass_score === 'number' ? rp.mandatory_pass_score : 80);
      setWebhookUrl(rp.webhook_url || '');
      setAuditRetention(rp.audit_retention || '1_YEAR');
      setPiiRedaction(rp.pii_redaction !== false);
    } catch (err: any) {
      console.error('Failed to load organization settings:', err);
      setErrorMsg(err.message || 'Unable to load organization settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Organization name is required.');
      return;
    }

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const whitelistArray = whitelistDomains
        .split(',')
        .map(d => d.trim().toLowerCase())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        industry,
        size_range: sizeRange,
        risk_policy: {
          base_score: baseScore,
          click_penalty: clickPenalty,
          credential_penalty: credentialPenalty,
          voice_disclosure_penalty: voicePenalty,
          report_reward: reportReward,
          training_reward: trainingReward,
          repeat_multiplier: repeatMultiplier,
          safe_recovery_rate: safeRecoveryRate,
          high_risk_threshold: highRiskThreshold,
          critical_risk_threshold: criticalRiskThreshold,
          ciso_email: cisoEmail.trim(),
          soc_phone: socPhone.trim(),
          timezone,
          delivery_window: deliveryWindow,
          monthly_throttle: monthlyThrottle,
          bypass_header: bypassHeader.trim(),
          auto_remediation: autoRemediation,
          mandatory_pass_score: mandatoryPassScore,
          webhook_url: webhookUrl.trim(),
          audit_retention: auditRetention,
          pii_redaction: piiRedaction
        },
        safety_whitelist: whitelistArray
      };

      await api.org.updateSettings(payload);
      if (refreshProfile) await refreshProfile();

      setSaving(false);
      setSuccessMsg('Organization settings and mathematical risk scoring policy updated successfully.');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setSaving(false);
      setErrorMsg(err.message || 'Failed to update organization settings.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading enterprise organization security settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Organization & Risk Policy Settings</h1>
            <Badge variant="low" size="sm">Enterprise Governance</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure corporate tenant details, mathematical risk-scoring algorithm weights, simulation safety windows, and compliance policies.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={loadSettings}
        >
          Refresh Settings
        </Button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-bold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Organization Profile & Executive Governance */}
        <Card
          title="1. Organization Profile & Executive Governance"
          subtitle="Primary corporate tenant identification and security response contacts"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Organization Legal Name *"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Acme Cyber Security Corp"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Primary Domain (Locked Tenant Domain)
                </label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs flex items-center justify-between">
                  <span>{organization?.domain || 'cyber.com'}</span>
                  <Badge variant="active" size="sm">Verified SSL / DKIM</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Industry Sector
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="Technology" className="bg-slate-900 text-slate-100 py-2">Technology & SaaS</option>
                  <option value="Financial Services" className="bg-slate-900 text-slate-100 py-2">Financial Services & Banking</option>
                  <option value="Healthcare" className="bg-slate-900 text-slate-100 py-2">Healthcare & Life Sciences</option>
                  <option value="Legal & Advisory" className="bg-slate-900 text-slate-100 py-2">Legal & Professional Advisory</option>
                  <option value="Manufacturing" className="bg-slate-900 text-slate-100 py-2">Manufacturing & Supply Chain</option>
                  <option value="Government & Defense" className="bg-slate-900 text-slate-100 py-2">Government & Public Sector</option>
                  <option value="Retail & E-Commerce" className="bg-slate-900 text-slate-100 py-2">Retail & Consumer Goods</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Workforce Size Range
                </label>
                <select
                  value={sizeRange}
                  onChange={e => setSizeRange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="1-50" className="bg-slate-900 text-slate-100 py-2">1 - 50 employees</option>
                  <option value="50-250" className="bg-slate-900 text-slate-100 py-2">50 - 250 employees</option>
                  <option value="250-1000" className="bg-slate-900 text-slate-100 py-2">250 - 1,000 employees</option>
                  <option value="1000-5000" className="bg-slate-900 text-slate-100 py-2">1,000 - 5,000 employees</option>
                  <option value="5000+" className="bg-slate-900 text-slate-100 py-2">5,000+ Enterprise Scale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Operating Timezone
                </label>
                <select
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="UTC-5 (Eastern Time)" className="bg-slate-900 text-slate-100 py-2">UTC-5 (US Eastern)</option>
                  <option value="UTC-8 (Pacific Time)" className="bg-slate-900 text-slate-100 py-2">UTC-8 (US Pacific)</option>
                  <option value="UTC+0 (GMT / London)" className="bg-slate-900 text-slate-100 py-2">UTC+0 (GMT / London)</option>
                  <option value="UTC+1 (CET / Paris)" className="bg-slate-900 text-slate-100 py-2">UTC+1 (CET / Berlin / Paris)</option>
                  <option value="UTC+5:30 (IST / India)" className="bg-slate-900 text-slate-100 py-2">UTC+5:30 (IST / India)</option>
                  <option value="UTC+8 (SGT / Singapore)" className="bg-slate-900 text-slate-100 py-2">UTC+8 (SGT / Singapore / HK)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Input
                label="CISO / Lead Security Officer Email"
                type="email"
                value={cisoEmail}
                onChange={e => setCisoEmail(e.target.value)}
                placeholder="ciso@company.com"
              />

              <Input
                label="24/7 SOC Emergency Response Hotline"
                value={socPhone}
                onChange={e => setSocPhone(e.target.value)}
                placeholder="+1 (800) 555-0199"
              />
            </div>
          </div>
        </Card>

        {/* 2. Mathematical Human Risk Engine Formula */}
        <Card
          title="2. Risk Engine Mathematical Formula & Penalty Weightings"
          subtitle="Configure algorithm weights for real-time human risk quantification and score adjustments"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-slate-200 block">Base Security Score</span>
                <span className="text-slate-500 text-[11px] block">Starting baseline score for employees</span>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={baseScore}
                  onChange={e => setBaseScore(parseInt(e.target.value, 10) || 100)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-bold font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-rose-400 block">Link Click Penalty</span>
                <span className="text-slate-500 text-[11px] block">Points deducted on phishing link click</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={clickPenalty}
                  onChange={e => setClickPenalty(parseInt(e.target.value, 10) || 25)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-rose-300 font-bold font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-rose-400 block">Credential Entry Penalty</span>
                <span className="text-slate-500 text-[11px] block">Deduction when submitting passwords</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={credentialPenalty}
                  onChange={e => setCredentialPenalty(parseInt(e.target.value, 10) || 40)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-rose-300 font-bold font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-rose-400 block">Voice Disclosure Penalty</span>
                <span className="text-slate-500 text-[11px] block">Deduction when disclosing codes on call</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={voicePenalty}
                  onChange={e => setVoicePenalty(parseInt(e.target.value, 10) || 45)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-rose-300 font-bold font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 block">Threat Report Reward</span>
                <span className="text-slate-500 text-[11px] block">Bonus for 1-Click phishing reporting</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={reportReward}
                  onChange={e => setReportReward(parseInt(e.target.value, 10) || 15)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-300 font-bold font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 block">Training Completion Reward</span>
                <span className="text-slate-500 text-[11px] block">Bonus points for passing masterclasses</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={trainingReward}
                  onChange={e => setTrainingReward(parseInt(e.target.value, 10) || 20)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-emerald-300 font-bold font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Advanced Multipliers */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Repeat Failure Multiplier</span>
                <select
                  value={repeatMultiplier}
                  onChange={e => setRepeatMultiplier(parseFloat(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-100 font-bold"
                >
                  <option value="1.0" className="bg-slate-900 text-slate-100">1.0x (Standard)</option>
                  <option value="1.5" className="bg-slate-900 text-slate-100">1.5x (Strict)</option>
                  <option value="2.0" className="bg-slate-900 text-slate-100">2.0x (Aggressive)</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block">30-Day Safe Recovery</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={safeRecoveryRate}
                  onChange={e => setSafeRecoveryRate(parseInt(e.target.value, 10) || 5)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-emerald-400 font-bold font-mono"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block">High Risk Threshold</span>
                <input
                  type="number"
                  value={highRiskThreshold}
                  onChange={e => setHighRiskThreshold(parseInt(e.target.value, 10) || 60)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-amber-400 font-bold font-mono"
                />
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block">Critical Risk Threshold</span>
                <input
                  type="number"
                  value={criticalRiskThreshold}
                  onChange={e => setCriticalRiskThreshold(parseInt(e.target.value, 10) || 40)}
                  className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-rose-400 font-bold font-mono"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 3. Simulation Delivery Windows & Whitelisting */}
        <Card
          title="3. Simulation Delivery Windows & Whitelist Guardrails"
          subtitle="Define operational boundaries and safety bypass headers for authorized threat drills"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Permitted Drill Delivery Window
                </label>
                <select
                  value={deliveryWindow}
                  onChange={e => setDeliveryWindow(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="BUSINESS_HOURS" className="bg-slate-900 text-slate-100 py-2">Business Hours (Mon-Fri 09:00 - 17:00)</option>
                  <option value="WEEKDAYS_EXTENDED" className="bg-slate-900 text-slate-100 py-2">Extended Weekdays (Mon-Fri 08:00 - 20:00)</option>
                  <option value="CONTINUOUS_247" className="bg-slate-900 text-slate-100 py-2">24/7 Continuous Automated Drills</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Monthly Simulation Frequency Throttle
                </label>
                <select
                  value={monthlyThrottle}
                  onChange={e => setMonthlyThrottle(parseInt(e.target.value, 10) || 2)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="1" className="bg-slate-900 text-slate-100 py-2">1 simulation drill / employee / month</option>
                  <option value="2" className="bg-slate-900 text-slate-100 py-2">2 simulation drills / employee / month (Recommended)</option>
                  <option value="4" className="bg-slate-900 text-slate-100 py-2">4 simulation drills / employee / month (Intensive)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Verified Target Domain Whitelist (Comma-separated)"
                value={whitelistDomains}
                onChange={e => setWhitelistDomains(e.target.value)}
                placeholder="e.g. cyber.com, corp.internal, partner.net"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Simulation Gateway Bypass Header
                </label>
                <input
                  type="text"
                  value={bypassHeader}
                  onChange={e => setBypassHeader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="X-LockPhish-Simulation: true"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 4. Automated Adaptive Remediation & Incident Notifications */}
        <Card
          title="4. Automated Adaptive Remediation & Alert Webhooks"
          subtitle="Trigger instant remedial training courses and push real-time threat notifications"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Auto-Assign Remedial Training</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Automatically assign targeted masterclass when an employee fails a drill
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRemediation(!autoRemediation)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${autoRemediation ? 'bg-emerald-600' : 'bg-slate-800'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white block absolute top-1 transition-transform ${autoRemediation ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Mandatory Assessment Passing Score
                </label>
                <select
                  value={mandatoryPassScore}
                  onChange={e => setMandatoryPassScore(parseInt(e.target.value, 10) || 80)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="75" className="bg-slate-900 text-slate-100 py-2">75% (Standard Baseline)</option>
                  <option value="80" className="bg-slate-900 text-slate-100 py-2">80% (NIST / SOC 2 Recommendation)</option>
                  <option value="90" className="bg-slate-900 text-slate-100 py-2">90% (Strict High-Assurance)</option>
                </select>
              </div>
            </div>

            <Input
              label="Real-Time Security Webhook URL (Slack / Microsoft Teams / SIEM)"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/T00/B00/XXXX or Teams Webhook"
            />
          </div>
        </Card>

        {/* 5. Data Privacy & Compliance Retention */}
        <Card
          title="5. Data Privacy & Compliance Retention"
          subtitle="Audit log storage windows and credential redaction enforcement"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Audit Log & Telemetry Retention Period
                </label>
                <select
                  value={auditRetention}
                  onChange={e => setAuditRetention(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 font-medium focus:outline-none focus:border-emerald-500"
                >
                  <option value="90_DAYS" className="bg-slate-900 text-slate-100 py-2">90 Days (Standard Audit)</option>
                  <option value="1_YEAR" className="bg-slate-900 text-slate-100 py-2">1 Year (ISO 27001 / SOC 2 Compliance)</option>
                  <option value="7_YEARS" className="bg-slate-900 text-slate-100 py-2">7 Years (Financial / Regulatory Mandate)</option>
                  <option value="INDEFINITE" className="bg-slate-900 text-slate-100 py-2">Indefinite (Full Archival)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Strict Credential Redaction</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Intercept and sanitize passwords to [REDACTED_BY_SECURITY_POLICY]
                  </span>
                </div>
                <Badge variant="active" size="sm">Always Enforced</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Bottom Save Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            type="submit"
            loading={saving}
            icon={<Save className="w-4 h-4" />}
            className="shadow-lg shadow-emerald-950/60 bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 font-bold"
          >
            Save Security Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

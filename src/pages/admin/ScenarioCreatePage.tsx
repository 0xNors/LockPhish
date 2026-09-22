import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Shield,
  Plus,
  Trash2,
  Save,
  Mail,
  Smartphone,
  PhoneCall,
  Layers,
  Globe,
  Lock,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileSpreadsheet,
  FileText,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { api } from '../../api/client';

interface ScenarioCreatePageProps {
  navigate: (path: string) => void;
}

export const ScenarioCreatePage: React.FC<ScenarioCreatePageProps> = ({ navigate }) => {
  const [channel, setChannel] = useState<'EMAIL' | 'SMS' | 'VOICE' | 'MULTI_STAGE'>('EMAIL');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('PAYROLL');
  const [difficulty, setDifficulty] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [description, setDescription] = useState('');

  // Sender Profile
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [spoofedDomain, setSpoofedDomain] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [returnPath, setReturnPath] = useState('');

  // Email Payload
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBodyHtml, setEmailBodyHtml] = useState('');
  const [landingType, setLandingType] = useState('MICROSOFT_SSO');
  const [landingUrl, setLandingUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // SMS Payload
  const [smishText, setSmishText] = useState('');

  // Voice Payload
  const [voicePersona, setVoicePersona] = useState('');
  const [voiceOpening, setVoiceOpening] = useState('');

  // Learning Indicators List
  const [indicators, setIndicators] = useState<Array<{ title: string; description: string }>>([
    { title: 'Deceptive Lookalike Domain', description: 'Sender address uses an external unverified domain.' }
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Preset Template Loader
  const applyPreset = (presetType: 'QR_CODE' | 'MACRO_EXCEL' | 'DOCUSIGN' | 'EXEC_WIRE' | 'BANK_SMS' | 'IT_VOICE') => {
    if (presetType === 'QR_CODE') {
      setChannel('EMAIL');
      setName('Microsoft 365 MFA Mobile QR Code Sync');
      setCategory('MFA');
      setDifficulty('HIGH');
      setDescription('Quishing attack prompting the employee to scan a deceptive QR code with their mobile phone camera.');
      setSenderName('Microsoft 365 Identity Protection');
      setSenderEmail('security-mfa@microsoft-auth-cloud.com');
      setSpoofedDomain('microsoft-auth-cloud.com');
      setReplyTo('support@mfa-sync-verify.net');
      setEmailSubject('Action Required: Scan QR Code to synchronize Microsoft Authenticator app');
      setEmailBodyHtml(`<p>Hello <strong>{{first_name}}</strong>,</p><p>To comply with updated zero-trust policies for <strong>{{company}}</strong>, scan your dedicated QR code with your mobile camera:</p><div style='text-align:center; padding:15px; background:#f8fafc; border:1px dashed #cbd5e1; margin:15px 0;'><p><strong>Scan with phone:</strong></p><div style='display:inline-block; border:2px solid #0078d4; padding:10px; background:white;'>[QR CODE PREVIEW]</div><p><a href='{{simulation_link}}'>Or verify manually in browser</a></p></div>`);
      setLandingType('MICROSOFT_SSO');
      setIndicators([
        { title: 'QR Code Attack Vector (Quishing)', description: 'QR codes evade traditional email text filters.' },
        { title: 'Deceptive Sender Domain', description: 'Sender uses microsoft-auth-cloud.com instead of genuine company tenant.' }
      ]);
    } else if (presetType === 'MACRO_EXCEL') {
      setChannel('EMAIL');
      setName('Confidential Executive Bonus Matrix (.xlsm)');
      setCategory('FINANCE');
      setDifficulty('HIGH');
      setDescription('Macro-enabled spreadsheet exploiting curiosity regarding executive compensation allocations.');
      setSenderName('Corporate Compensation Committee');
      setSenderEmail('comp-review@corporate-remuneration-advisory.com');
      setSpoofedDomain('corporate-remuneration-advisory.com');
      setAttachmentName('Q3_Executive_Bonus_Matrix.xlsm');
      setEmailSubject('CONFIDENTIAL: Q3 Executive Compensation & Variable Remuneration Allocation');
      setEmailBodyHtml(`<p>Dear {{first_name}},</p><p>Attached is the approved executive compensation schedule for {{department}}. Enable macros to decrypt embedded pivot tables.</p>`);
      setLandingType('CUSTOM_PORTAL');
      setIndicators([
        { title: 'Macro-Enabled File Extension (.xlsm)', description: 'Legitimate business files rarely require macro execution.' },
        { title: 'Curiosity Pretext', description: 'Attackers exploit sensitive salary curiosity.' }
      ]);
    } else if (presetType === 'DOCUSIGN') {
      setChannel('EMAIL');
      setName('DocuSign Non-Disclosure Agreement Sign Request');
      setCategory('EXECUTIVE_IMPERSONATION');
      setDifficulty('MEDIUM');
      setDescription('DocuSign electronic signature request regarding a confidential partnership agreement.');
      setSenderName('DocuSign Signature Services');
      setSenderEmail('dse@docusign-corporate-verify-gateway.com');
      setSpoofedDomain('docusign-corporate-verify-gateway.com');
      setEmailSubject('Please DocuSign: 2026 Strategic M&A Non-Disclosure Agreement #NDA-9941');
      setEmailBodyHtml(`<p>Legal Counsel sent you a confidential agreement to review and sign via DocuSign.</p><p><a href='{{simulation_link}}'>REVIEW DOCUMENT</a></p>`);
      setLandingType('MICROSOFT_SSO');
      setIndicators([
        { title: 'Spoofed DocuSign Domain', description: 'Sent from unverified gateway.' },
        { title: 'Unsolicited Legal Request', description: 'Unexpected contract without prior executive communication.' }
      ]);
    } else if (presetType === 'BANK_SMS') {
      setChannel('SMS');
      setName('Commercial Bank Unauthorized Wire Fraud Alert');
      setCategory('FINANCE');
      setDifficulty('MEDIUM');
      setDescription('Urgent SMS smishing alert regarding an unauthorized wire transfer.');
      setSenderPhone('+1 (888) 492-7104');
      setSmishText('[SECURITY ALERT] Unauthorized wire of $4,850.00 initiated on your commercial account. If not you, cancel immediately at: {{simulation_link}} or reply STOP');
      setIndicators([
        { title: 'Unverified SMS Shortcode', description: 'Bank alerts should be verified via card contact number.' },
        { title: 'Panic Shortlink', description: 'Uses link instead of official banking application.' }
      ]);
    } else if (presetType === 'IT_VOICE') {
      setChannel('VOICE');
      setName('IT Infrastructure Emergency VPN Switchover');
      setCategory('IT_SUPPORT');
      setDifficulty('HIGH');
      setDescription('Controlled voice vishing call where caller claims to need 6-digit MFA confirmation.');
      setSenderName('Corporate IT Infrastructure');
      setSenderPhone('+1 (415) 555-0192');
      setVoicePersona('Alex Taylor, Senior Infrastructure Engineer');
      setVoiceOpening('Hello {{first_name}}, this is Alex from corporate IT infrastructure. We are performing an emergency VPN router switchover for {{department}} and need to verify your session.');
      setIndicators([
        { title: 'MFA Code Request over Voice Call', description: 'Legitimate IT support will never ask you to speak an MFA code.' },
        { title: 'Urgency Pressure Tactic', description: 'Threatens access lockout to force compliance.' }
      ]);
    }
  };

  const handleAddIndicator = () => {
    setIndicators(prev => [...prev, { title: '', description: '' }]);
  };

  const handleRemoveIndicator = (index: number) => {
    setIndicators(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateIndicator = (index: number, field: 'title' | 'description', value: string) => {
    setIndicators(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const [launchingInCampaign, setLaunchingInCampaign] = useState(false);

  const handleSubmit = async (launchInCampaign = false) => {
    if (!name.trim()) {
      setError('Scenario name is required.');
      return;
    }

    if (launchInCampaign) setLaunchingInCampaign(true);
    else setSaving(true);
    setError('');

    try {
      const payloadConfig: Record<string, any> = {};

      if (channel === 'EMAIL' || channel === 'MULTI_STAGE') {
        payloadConfig.subject = emailSubject || `Important: Security Notice for {{first_name}}`;
        payloadConfig.body_html = emailBodyHtml || `<p>Dear {{first_name}}, please confirm your account details at <a href="{{simulation_link}}">this secure portal</a>.</p>`;
        payloadConfig.fake_landing_type = landingType;
        payloadConfig.landing_url = landingUrl || `https://auth.security-verify-gateway.com/login`;
        if (attachmentName) payloadConfig.attachment_name = attachmentName;
      }

      if (channel === 'SMS' || channel === 'MULTI_STAGE') {
        payloadConfig.smish_text = smishText || `[ALERT] Action needed for {{first_name}}. Verify at {{simulation_link}}`;
        payloadConfig.landing_url = landingUrl || `https://sec-verify.net/m`;
      }

      if (channel === 'VOICE' || channel === 'MULTI_STAGE') {
        payloadConfig.voice_persona = voicePersona || 'IT Helpdesk Senior Engineer';
        payloadConfig.voice_opening = voiceOpening || `Hello {{first_name}}, this is IT support regarding an urgent security patch for your workstation.`;
      }

      const senderProfile = {
        name: senderName || 'Corporate Security Gateway',
        email: senderEmail || 'alerts@company-security-verify.net',
        phone: senderPhone || '+1 (888) 555-0192',
        spoofed_domain: spoofedDomain || 'company-security-verify.net',
        reply_to: replyTo || undefined,
        return_path: returnPath || undefined,
        caller_id: senderName || 'IT-SUPPORT-PRIORITY'
      };

      const created = await api.scenarios.create({
        name,
        channel,
        category,
        difficulty,
        description: description || 'Custom organizational security awareness scenario.',
        sender_profile: senderProfile,
        payload_config: payloadConfig,
        learning_indicators: indicators.filter(i => i.title.trim().length > 0),
        decision_tree: { actions: ['OPEN', 'CLICK', 'REPORT', 'DISCLOSE'] }
      });

      setSaving(false);
      setLaunchingInCampaign(false);

      if (launchInCampaign && created && created.id) {
        navigate(`/admin/campaigns/create?scenarioId=${created.id}&channel=${created.channel}&difficulty=${created.difficulty}`);
      } else {
        navigate('/admin/scenarios');
      }
    } catch (err: any) {
      setSaving(false);
      setLaunchingInCampaign(false);
      setError(err.message || 'Failed to create scenario.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/admin/scenarios')}
        >
          Back to Scenarios
        </Button>
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Create Custom Simulation Scenario</h1>
          <p className="text-xs text-slate-400">Design your own phishing, QR quishing, weaponized macro, smishing, or voice scenario.</p>
        </div>
      </div>

      {/* 1-Click Modern Phishing Attack Preset Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">1-Click Modern Phishing Vector Presets</span>
        </div>
        <p className="text-[11px] text-slate-400">Quickly load realistic pretexts or customize every field below from scratch:</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" size="sm" icon={<QrCode className="w-3.5 h-3.5 text-emerald-400" />} onClick={() => applyPreset('QR_CODE')}>
            QR Quishing (MFA)
          </Button>
          <Button type="button" variant="outline" size="sm" icon={<FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />} onClick={() => applyPreset('MACRO_EXCEL')}>
            Macro Excel (.xlsm)
          </Button>
          <Button type="button" variant="outline" size="sm" icon={<FileText className="w-3.5 h-3.5 text-sky-400" />} onClick={() => applyPreset('DOCUSIGN')}>
            DocuSign NDA
          </Button>
          <Button type="button" variant="outline" size="sm" icon={<Smartphone className="w-3.5 h-3.5 text-indigo-400" />} onClick={() => applyPreset('BANK_SMS')}>
            Bank Fraud SMS
          </Button>
          <Button type="button" variant="outline" size="sm" icon={<PhoneCall className="w-3.5 h-3.5 text-rose-400" />} onClick={() => applyPreset('IT_VOICE')}>
            Voice Vishing Call
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSubmit(false); }} className="space-y-6 text-xs">
        {/* 1. Basic Scenario Configuration */}
        <Card title="1. Scenario Classification" subtitle="Define the threat vector, category, and target difficulty">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Attack Surface Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'EMAIL', label: 'Email Phishing', icon: <Mail className="w-4 h-4" /> },
                  { id: 'SMS', label: 'SMS Smishing', icon: <Smartphone className="w-4 h-4" /> },
                  { id: 'VOICE', label: 'Voice Vishing', icon: <PhoneCall className="w-4 h-4" /> },
                  { id: 'MULTI_STAGE', label: 'Multi-Stage', icon: <Layers className="w-4 h-4" /> }
                ].map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setChannel(ch.id as any)}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      channel === ch.id
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ch.icon}
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  label="Scenario Name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Microsoft Authenticator QR Sync Notice"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="MFA">MFA & Authenticator (Quishing)</option>
                  <option value="PAYROLL">Payroll & Direct Deposit</option>
                  <option value="IT_SUPPORT">IT Support & Passwords</option>
                  <option value="FINANCE">Finance & Invoices</option>
                  <option value="EXECUTIVE_IMPERSONATION">Executive Impersonation</option>
                  <option value="DELIVERY">Parcel & Delivery</option>
                  <option value="ACCOUNT_SECURITY">Account Security</option>
                  <option value="VENDOR">Vendor Fraud</option>
                  <option value="CLOUD_SECURITY">Cloud Infrastructure</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Simulation Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="LOW">Low (Obvious red flags)</option>
                  <option value="MEDIUM">Medium (Realistic corporate pretext)</option>
                  <option value="HIGH">High (Spear phishing & subtle spoofing)</option>
                  <option value="CRITICAL">Critical (Multi-channel high-pressure)</option>
                </select>
              </div>

              <Input
                label="Scenario Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. Tests employee caution when prompted for urgent QR codes."
              />
            </div>
          </div>
        </Card>

        {/* 2. Sender Profile Blueprint */}
        <Card title="2. Sender Identity & Envelope Profile" subtitle="Configure spoofed headers and display personas">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Sender Display Name / Caller ID"
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="e.g. Microsoft 365 Identity Security"
              />

              <Input
                label="Sender Email Address"
                value={senderEmail}
                onChange={e => setSenderEmail(e.target.value)}
                placeholder="e.g. security-sync@microsoft-identity-auth.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Lookalike Domain"
                value={spoofedDomain}
                onChange={e => setSpoofedDomain(e.target.value)}
                placeholder="e.g. microsoft-identity-auth.com"
              />

              <Input
                label="Reply-To Address (Optional)"
                value={replyTo}
                onChange={e => setReplyTo(e.target.value)}
                placeholder="e.g. support@external-relay.net"
              />

              <Input
                label="Caller Phone (For SMS / Voice)"
                value={senderPhone}
                onChange={e => setSenderPhone(e.target.value)}
                placeholder="e.g. +1 (888) 492-7104"
              />
            </div>
          </div>
        </Card>

        {/* 3. Attack Payload Configuration */}
        <Card title="3. Message Body & Landing Page Payload" subtitle="Design the visual presentation and landing interceptor">
          <div className="space-y-4">
            {(channel === 'EMAIL' || channel === 'MULTI_STAGE') && (
              <>
                <Input
                  label="Email Subject Line"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  placeholder="e.g. Action Required: Scan QR code to sync Authenticator"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email HTML Content (Supports variables: &#123;&#123;first_name&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;simulation_link&#125;&#125;)
                  </label>
                  <textarea
                    rows={4}
                    value={emailBodyHtml}
                    onChange={e => setEmailBodyHtml(e.target.value)}
                    placeholder="<p>Dear {{first_name}}, please scan the QR code to verify your account.</p>"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Simulated Fake Landing Page Type
                    </label>
                    <select
                      value={landingType}
                      onChange={e => setLandingType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="MICROSOFT_SSO">Microsoft 365 SSO Login Page</option>
                      <option value="PAYROLL_PORTAL">Corporate Payroll Portal</option>
                      <option value="CUSTOM_PORTAL">Custom Corporate Portal</option>
                    </select>
                  </div>

                  <Input
                    label="Attachment Name (e.g. invoice.pdf.exe, report.xlsm)"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="e.g. Bonus_Matrix.xlsm"
                  />
                </div>
              </>
            )}

            {(channel === 'SMS' || channel === 'MULTI_STAGE') && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  SMS Smishing Message Text
                </label>
                <textarea
                  rows={2}
                  value={smishText}
                  onChange={e => setSmishText(e.target.value)}
                  placeholder="e.g. [SECURITY ALERT] Unauthorized login for {{first_name}}. Cancel immediately at: {{simulation_link}}"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {(channel === 'VOICE' || channel === 'MULTI_STAGE') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Voice Agent Persona"
                  value={voicePersona}
                  onChange={e => setVoicePersona(e.target.value)}
                  placeholder="e.g. Alex Taylor, Infrastructure Lead"
                />
                <Input
                  label="Voice Agent Opening Line"
                  value={voiceOpening}
                  onChange={e => setVoiceOpening(e.target.value)}
                  placeholder="e.g. Hello {{first_name}}, this is Alex from IT support..."
                />
              </div>
            )}
          </div>
        </Card>

        {/* 4. Learning Red Flags */}
        <Card title="4. Mapped Learning Indicators & Red Flags" subtitle="Clues that will be highlighted in the post-simulation debrief">
          <div className="space-y-3">
            {indicators.map((ind, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Indicator Title (e.g. Lookalike Sender Domain)"
                    value={ind.title}
                    onChange={e => handleUpdateIndicator(idx, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Indicator Explanation (e.g. The sender address uses a typo-squatted domain)"
                    value={ind.description}
                    onChange={e => handleUpdateIndicator(idx, 'description', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveIndicator(idx)}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleAddIndicator}
            >
              Add Red Flag Clue
            </Button>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-3">
          <Button variant="outline" size="md" type="button" onClick={() => navigate('/admin/scenarios')}>
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
              Save & Publish Scenario
            </Button>

            <Button
              variant="primary"
              size="md"
              type="button"
              loading={launchingInCampaign}
              onClick={() => handleSubmit(true)}
              icon={<Sparkles className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950/60"
            >
              Save & Launch in Campaign Now
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

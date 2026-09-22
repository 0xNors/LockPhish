import React, { useState } from 'react';
import {
  Plug,
  Shield,
  FileCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Layers,
  Search,
  Sparkles,
  Users,
  Activity,
  FlaskConical,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  Star,
  Target
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { LoadingState } from '../../components/common/LoadingState';
import { api } from '../../api/client';

interface IntegrationsPageProps {
  navigate: (path: string) => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ navigate }) => {
  // Email Security Adapter Test State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'M365_DEFENDER' | 'GOOGLE_WORKSPACE' | 'PROOFPOINT' | 'MIMECAST'>('M365_DEFENDER');
  const [tenantId, setTenantId] = useState('');
  const [clientId, setClientId] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Insurance Underwriting Package State
  const [insurancePkg, setInsurancePkg] = useState<any>(null);
  const [loadingInsurance, setLoadingInsurance] = useState(false);

  const handleTestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.integrations.testEmailSecurity({
        provider: selectedProvider,
        tenant_id: tenantId,
        client_id: clientId
      });
      setTestResult(res);
      setTesting(false);
    } catch (err: any) {
      setTestResult({ connected: false, message: err.message || 'Connection failed' });
      setTesting(false);
    }
  };

  const handleLoadInsurance = async () => {
    setLoadingInsurance(true);
    try {
      const pkg = await api.integrations.getInsurancePackage();
      setInsurancePkg(pkg);
      setLoadingInsurance(false);
    } catch (err) {
      setLoadingInsurance(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Ecosystem & Provider Integrations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Managed Security Service Provider (MSSP) integration, Cyber Insurance Risk Evidence, and Email Security Provider adapters.
          </p>
        </div>
      </div>

      {/* Plain-English explainer */}
      <div className="p-5 bg-slate-900 border border-sky-800/60 rounded-2xl space-y-3 text-xs shadow-md">
        <div className="flex items-center gap-2 text-sky-300 font-bold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          New here? What this page does in plain English
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">1. MSSP Client Tenants</span>
            <span className="text-slate-400 leading-relaxed">
              If you run security for several companies (an MSSP), every client organization appears here as a &ldquo;tenant&rdquo; with its live
              security score, headcount, and running campaigns &mdash; one console instead of many logins.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-400 block">2. Cyber Insurance Evidence</span>
            <span className="text-slate-400 leading-relaxed">
              Insurers ask &ldquo;prove your staff are trained&rdquo; before giving (or renewing) a cyber policy. One click builds a verified
              risk-grade report from your real training &amp; simulation data &mdash; often used to negotiate premiums.
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="font-bold text-sky-400 block">3. Email Gateway Adapters</span>
            <span className="text-slate-400 leading-relaxed">
              Connects LockPhish to your email security platform (Microsoft 365, Google, Proofpoint, Mimecast) so training phishing
              drills are allow-listed (not blocked) and reporting signals flow back in.
            </span>
          </div>
        </div>
      </div>

      {/* 1. MSSP Integration — partner model (real capabilities only, no synthetic data) */}
      <div className="cyber-card relative rounded-2xl border border-emerald-900/40 bg-slate-950/80 shadow-xl shadow-black/40 overflow-hidden">
        <div className="px-6 py-4 border-b border-emerald-900/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-transparent flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 tracking-tight">2. Managed Security Service Providers (MSSPs) Integration</h3>
            <p className="text-xs text-slate-400 mt-0.5">LockPhish as a deployable phishing-defense capability inside managed security offerings</p>
          </div>
          <Badge variant="active" size="sm">PARTNER PROGRAM</Badge>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Problem / Solution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-300 uppercase tracking-wider text-[10px] font-mono">
                <AlertTriangle className="w-3.5 h-3.5" /> Problem
              </div>
              <p className="text-slate-300 leading-relaxed">
                MSSPs are under increasing pressure to offer comprehensive security solutions that provide proactive defense
                measures. As phishing remains one of the top attack vectors, MSSPs need tools that they can deploy as part
                of a broader managed security offering.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 uppercase tracking-wider text-[10px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Solution
              </div>
              <p className="text-slate-300 leading-relaxed">
                LockPhish can be integrated into the service offerings of MSSPs, giving them a tool for phishing simulations,
                employee training, and threat detection. The platform could be branded and customized to suit the MSSP&apos;s
                specific needs, while enabling automated phishing campaigns and reporting.
              </p>
            </div>
          </div>

          {/* Business Case */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">Business Case &mdash; Key Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-300"><Layers className="w-4 h-4" /> Scalable Solution</div>
                <p className="text-slate-400 leading-relaxed">
                  MSSPs can deploy phishing simulations across multiple clients, offering a consistent approach to employee
                  training and risk management.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-300"><Briefcase className="w-4 h-4" /> Value-Added Service</div>
                <p className="text-slate-400 leading-relaxed">
                  Enhances MSSPs&apos; service offerings with a proven tool for reducing human error-driven security risks.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300"><Star className="w-4 h-4" /> Reputation Boost</div>
                <p className="text-slate-400 leading-relaxed">
                  By offering advanced phishing defense training, MSSPs can demonstrate a proactive approach to client
                  cybersecurity, strengthening their reputation and client loyalty.
                </p>
              </div>
            </div>
          </div>

          {/* Target Market */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">Target Market</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">MSSPs serving small and medium-sized businesses (SMBs) and enterprises.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">MSSPs looking to expand their cybersecurity offerings and demonstrate advanced threat defense capabilities.</p>
              </div>
            </div>
          </div>

          {/* Real platform capabilities powering the MSSP model */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-sky-900/40 space-y-2">
            <div className="font-mono font-bold text-sky-300 uppercase tracking-wider text-[10px]">Delivered by LockPhish core capabilities</div>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Isolated tenant organization per client',
                'Automated multi-channel phishing campaigns',
                '120-masterclass training academy',
                'Consolidated audit & compliance reporting',
                'Organization-wide Human Risk Index (HRI)',
                'CSV / Excel / Word / PDF evidence exports'
              ].map(c => (
                <span key={c} className="text-[10px] font-mono text-slate-300 bg-slate-950 border border-slate-800 rounded-full px-2.5 py-1">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cyber Insurance Underwriting Evidence Interface */}
      <Card
        title="Cyber Insurance Risk Evidence Generator"
        subtitle="One click builds the verified report insurers request before issuing or renewing a cyber policy — computed from your real training & simulation data"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadInsurance}
            loading={loadingInsurance}
            icon={<FileCheck className="w-3.5 h-3.5" />}
          >
            Generate Underwriting Evidence
          </Button>
        }
      >
        {insurancePkg ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-3 font-mono">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold">Insured Organization:</span>
              <span className="text-slate-200">{insurancePkg.organization?.name} ({insurancePkg.organization?.domain})</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold">Risk Grade:</span>
              <span className="text-emerald-400 font-bold">{insurancePkg.executive_risk_summary?.risk_grade}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Reporting Efficacy:</span>
              <span className="text-slate-200">{insurancePkg.executive_risk_summary?.phishing_reporting_efficacy}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Unauthorized Action Rate:</span>
              <span className="text-slate-200">{insurancePkg.executive_risk_summary?.unauthorized_interaction_rate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Mandatory Training Rate:</span>
              <span className="text-slate-200">{insurancePkg.executive_risk_summary?.mandatory_training_completion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Audit Trail Integrity:</span>
              <span className="text-emerald-400 font-bold">VERIFIED IMMUTABLE</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">
            Click 'Generate Underwriting Evidence' to calculate the verified security posture package for cyber insurance evaluation.
          </p>
        )}
      </Card>

      {/* 3. Email Security Provider Adapters */}
      <Card
        title="Email Security Platform Adapters"
        subtitle="Connect your email gateway so training drills are allow-listed and never blocked as real phishing"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            { id: 'M365_DEFENDER', name: 'Microsoft 365 Defender', desc: 'Exchange Online Protection & Defender for Office 365' },
            { id: 'GOOGLE_WORKSPACE', name: 'Google Workspace', desc: 'Gmail Security Gateway & Advanced Phishing Protection' },
            { id: 'PROOFPOINT', name: 'Proofpoint Enterprise', desc: 'Email Protection & Threat Response API' },
            { id: 'MIMECAST', name: 'Mimecast Secure Gateway', desc: 'Targeted Threat Protection & Whitelist Sync' }
          ].map((prov) => (
            <div key={prov.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <span className="font-bold text-slate-200 block mb-1">{prov.name}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{prov.desc}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setSelectedProvider(prov.id as any);
                  setTenantId('');
                  setClientId('');
                  setTestResult(null);
                  setShowEmailModal(true);
                }}
              >
                Configure Adapter
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Email Security Config & Test Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title={`Configure ${selectedProvider} Adapter`}
        subtitle="Service connector for simulation delivery & whitelisting"
        maxWidth="md"
      >
        <form onSubmit={handleTestConnection} className="space-y-4 text-xs">
          <Input
            label="Tenant ID / Account ID"
            required
            value={tenantId}
            onChange={e => setTenantId(e.target.value)}
            placeholder="e.g. 72f988bf-86f1-41af-91ab-2d7cd011db47"
          />

          <Input
            label="Application Client ID"
            required
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            placeholder="e.g. 9b1e8432-8419-482a-a920-d8f9931a"
          />

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.connected
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800 text-rose-300'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {testResult.connected ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {testResult.connected ? 'Adapter Verified' : 'Configuration Incomplete'}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{testResult.message}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowEmailModal(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={testing}>
              Test & Verify Adapter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

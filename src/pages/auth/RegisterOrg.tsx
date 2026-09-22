import React, { useState } from 'react';
import { Shield, Building2, UserCircle, Lock, Mail, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { AuthShell } from '../../components/auth/AuthShell';

interface RegisterOrgProps {
  navigate: (path: string) => void;
}

export const RegisterOrg: React.FC<RegisterOrgProps> = ({ navigate }) => {
  const { registerOrg } = useAuth();

  const [orgName, setOrgName] = useState('');
  const [orgDomain, setOrgDomain] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [sizeRange, setSizeRange] = useState('50-250');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !orgDomain || !adminName || !adminEmail || !adminPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (adminPassword.length < 8) {
      setError('Administrator password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await registerOrg({
        org_name: orgName,
        org_domain: orgDomain,
        industry,
        size_range: sizeRange,
        admin_name: adminName,
        admin_email: adminEmail,
        admin_password: adminPassword
      });
      navigate('/admin/dashboard');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to register organization.');
    }
  };

  return (
    <AuthShell>
      {/* Register Card */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Register New Organization</h2>
            <p className="text-xs text-slate-400 mt-0.5">Initialize your isolated multi-tenant environment and initial admin</p>
          </div>
          <button
            onClick={() => navigate('/auth/login')}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
              Company Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Organization Name"
                required
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="Acme Global Inc"
              />

              <Input
                label="Corporate Domain"
                required
                value={orgDomain}
                onChange={e => setOrgDomain(e.target.value)}
                placeholder="acmeglobal.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Technology">Technology & SaaS</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Legal & Advisory">Legal & Advisory</option>
                  <option value="Retail & Commerce">Retail & Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Company Size
                </label>
                <select
                  value={sizeRange}
                  onChange={e => setSizeRange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="1-50">1-50 employees</option>
                  <option value="50-250">50-250 employees</option>
                  <option value="250-1000">250-1000 employees</option>
                  <option value="1000+">1000+ enterprise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[10px]">
              Initial Administrator Profile
            </span>

            <Input
              label="Full Administrator Name"
              required
              value={adminName}
              onChange={e => setAdminName(e.target.value)}
              placeholder="Jane Connor"
              icon={<UserCircle className="w-4 h-4" />}
            />

            <Input
              label="Admin Work Email"
              type="email"
              required
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              placeholder="admin@acmeglobal.com"
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Admin Password"
              type="password"
              required
              value={adminPassword}
              onChange={e => setAdminPassword(e.target.value)}
              placeholder="Min 8 characters"
              icon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center mt-2"
            loading={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create Organization & Access Dashboard
          </Button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-emerald-400 font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

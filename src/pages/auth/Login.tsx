import React, { useState } from 'react';
import { Shield, Lock, Mail, AlertCircle, Fingerprint, Info } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { AuthShell } from '../../components/auth/AuthShell';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  navigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ navigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const locked = params?.get('locked') === '1';
  const expired = params?.get('expired') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ email, password }, remember);
      const savedUser = JSON.parse(sessionStorage.getItem('lockphish_user') || localStorage.getItem('lockphish_user') || '{}');
      if (savedUser.role === 'EMPLOYEE') {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Invalid email or password credentials.');
    }
  };

  return (
    <AuthShell>
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/60 backdrop-blur-md space-y-6 relative">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent rounded-t-3xl" />

        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
            <Fingerprint className="w-3.5 h-3.5" /> Operator Authentication
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1.5">Sign in to your security portal</h2>
          <p className="text-xs text-slate-400 mt-0.5">Enter your corporate credentials. All access attempts are recorded in the immutable audit ledger.</p>
        </div>

        {(locked || expired) && !error && (
          <div className="p-3.5 rounded-xl bg-amber-950/50 border border-amber-800 text-amber-300 text-xs font-medium flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {locked
                ? 'Session locked. For your security, please re-authenticate to continue.'
                : 'Your session expired. Please sign in again.'}
            </span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Corporate Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            icon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={<Lock className="w-4 h-4" />}
          />

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="mt-0.5 w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Remember this device</strong> (not recommended on shared computers).
              When unchecked, closing this tab or restarting your computer will require a fresh login.
            </span>
          </label>

          <Button variant="primary" size="md" type="submit" loading={loading} className="w-full justify-center">
            Authenticate Securely
          </Button>

          <div className="flex items-center justify-between text-[11px]">
            <button type="button" onClick={() => navigate('/auth/forgot-password')} className="text-slate-400 hover:text-emerald-400 transition-colors">
              Forgot password?
            </button>
            <button type="button" onClick={() => navigate('/auth/register-org')} className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
              Register your organization →
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-500 space-y-1">
          <div className="flex justify-between"><span>BRUTE-FORCE PROTECTION</span><span className="text-emerald-400">5 ATTEMPTS → 15 MIN LOCK</span></div>
          <div className="flex justify-between"><span>IDLE AUTO-LOCK</span><span className="text-emerald-400">15 MINUTES</span></div>
          <div className="flex justify-between"><span>SESSION PERSISTENCE</span><span className={remember ? 'text-amber-400' : 'text-emerald-400'}>{remember ? 'THIS DEVICE' : 'EPHEMERAL'}</span></div>
        </div>
      </div>
    </AuthShell>
  );
};

import React, { useState } from 'react';
import { Shield, KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { api } from '../../api/client';
import { AuthShell } from '../../components/auth/AuthShell';

interface ForgotPasswordProps {
  navigate: (path: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please enter your corporate email address.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.auth.forgotPassword(email.trim());
      setLoading(false);
      setSubmitted(true);
      setMessage(res.message || 'Password reset request dispatched to your organization administrator.');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Unable to submit password reset request. Please check your network connection.');
    }
  };

  return (
    <AuthShell>

      <div className="w-full max-w-md bg-slate-900/90 light:bg-white border border-slate-800 light:border-slate-200 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 light:text-slate-900">
              Reset Account Password
            </h2>
            <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">
              Submit your email to request your administrator set a new password
            </p>
          </div>
          <button
            onClick={() => navigate('/auth/login')}
            className="text-xs text-slate-400 hover:text-slate-200 light:hover:text-slate-800 flex items-center gap-1 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 light:bg-rose-50 border border-rose-800 light:border-rose-300 text-rose-300 light:text-rose-700 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="p-5 rounded-2xl bg-emerald-950/40 light:bg-emerald-50 border border-emerald-800/60 light:border-emerald-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-300 light:text-emerald-800">
                Request Sent to Administrator!
              </h4>
              <p className="text-xs text-emerald-200/90 light:text-emerald-700 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="p-3 bg-slate-950 light:bg-slate-100 rounded-xl border border-slate-800 light:border-slate-200 text-[11px] text-slate-400 light:text-slate-600 text-left space-y-1">
              <span className="font-bold text-slate-300 light:text-slate-800 block">Next Steps:</span>
              <p>1. Your Company Admin will receive this request in their dashboard.</p>
              <p>2. Once your Admin sets your new password, you can sign in immediately.</p>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              onClick={() => navigate('/auth/login')}
            >
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
            <Input
              label="Corporate Email Address"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@company.com"
              icon={<Mail className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Submit Reset Request to Admin
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
};

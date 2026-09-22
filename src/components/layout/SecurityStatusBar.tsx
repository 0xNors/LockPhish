import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, Globe2, Fingerprint, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { session } from '../../utils/session';
import { Badge } from '../common/Badge';
import { RELEASE_TAG } from '../../release';

interface SecurityStatusBarProps {
  navigate: (path: string) => void;
}

/**
 * Slim SOC-style security strip rendered above every authenticated page:
 * live local clock, session posture (ephemeral vs remembered), manual
 * LOCK SESSION control, and stale-backend detection.
 */
export const SecurityStatusBar: React.FC<SecurityStatusBarProps> = ({ navigate }) => {
  const { user, organization, logout } = useAuth();
  const [now, setNow] = useState(new Date());
  const [serverRelease, setServerRelease] = useState<string>('');
  const remembered = session.isRemembered();

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setServerRelease(d.release || ''))
      .catch(() => {});
  }, []);

  const staleBackend = serverRelease !== '' && serverRelease !== RELEASE_TAG;

  const handleLock = () => {
    logout();
    navigate('/login?locked=1');
  };

  return (
    <div className="w-full bg-[#04070d] border-b border-emerald-900/40 px-4 py-1.5 flex items-center justify-between gap-3 text-[10px] font-mono text-slate-400 z-50">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          SECURE CHANNEL
        </span>
        <span className="hidden sm:flex items-center gap-1 truncate">
          <Fingerprint className="w-3 h-3 text-sky-400" />
          {user?.full_name || 'Operator'}
        </span>
        <Badge variant={user?.role === 'EMPLOYEE' ? 'medium' : 'low'} size="sm">{user?.role || 'USER'}</Badge>
        <span className="hidden md:flex items-center gap-1 truncate text-slate-500">
          <Globe2 className="w-3 h-3" /> {organization?.domain || '—'}
        </span>
      </div>

      <div className="flex items-center gap-3 whitespace-nowrap">
        {staleBackend && (
          <span className="flex items-center gap-1 text-rose-400 font-bold animate-pulse" title="The backend process is older than this UI. Restart the server (stop the old process, then npm start) so audit logging and new APIs activate.">
            <AlertTriangle className="w-3 h-3" /> SERVER OUTDATED — RESTART BACKEND
          </span>
        )}
        <span className={remembered ? 'text-amber-400' : 'text-emerald-400'}>
          {remembered ? '⚠ REMEMBERED DEVICE' : 'EPHEMERAL SESSION — re-login after close'}
        </span>
        <span className="hidden sm:inline text-slate-500">{now.toLocaleTimeString('en-GB', { hour12: false })} LOCAL</span>
        <button
          type="button"
          onClick={handleLock}
          className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-800/70 text-emerald-300 hover:bg-emerald-950/60 font-bold transition-colors"
          title="Immediately terminate this session"
        >
          <Lock className="w-3 h-3" /> LOCK SESSION
        </button>
      </div>
    </div>
  );
};

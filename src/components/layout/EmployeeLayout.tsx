import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Send,
  BookOpen,
  Trophy,
  History,
  UserCheck,
  LogOut,
  ArrowRightLeft,
  Menu,
  X,
  Target,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';
import { SecurityStatusBar } from './SecurityStatusBar';
import { useIdleLock } from '../../hooks/useIdleLock';

interface EmployeeLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  navigate: (path: string) => void;
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children, activePath = '/employee/dashboard', navigate }) => {
  const { user, organization, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Security hardening: auto-lock after 15 min inactivity
  useIdleLock(() => {
    logout();
    navigate('/login?locked=1');
  });

  const canSwitchToAdmin = user?.role && ['SUPER_ADMIN', 'ORG_ADMIN', 'CAMPAIGN_MANAGER', 'TRAINER'].includes(user.role);

  const navItems = [
    { label: 'My Dashboard', path: '/employee/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Assigned Missions', path: '/employee/missions', icon: <Target className="w-4 h-4" /> },
    { label: 'Training Center', path: '/employee/training', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'My Results', path: '/employee/results', icon: <History className="w-4 h-4" /> },
    { label: 'Security Score', path: '/employee/score', icon: <Trophy className="w-4 h-4" /> },
    { label: 'Profile & Settings', path: '/employee/profile', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#04070d] dark:bg-[#04070d] light:bg-slate-50 text-slate-100 dark:text-slate-100 flex flex-col">
      <SecurityStatusBar navigate={navigate} />
      <div className="flex flex-col lg:flex-row flex-1">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 z-40">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="LockPhish" className="w-8 h-8 rounded-lg    shadow-lg shadow-emerald-900/30 object-contain" />
          <span className="font-black text-base tracking-wider text-slate-100">
            LOCK<span className="text-emerald-400">PHISH</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-slate-200"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#050a12] border-r border-emerald-900/30 flex flex-col z-30 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="LockPhish" className="w-9 h-9 rounded-xl    shadow-lg shadow-emerald-900/40 border border-emerald-400/30 object-contain" />
            <div>
              <span className="font-black text-lg tracking-wider text-slate-100 block leading-none">
                LOCK<span className="text-emerald-400">PHISH</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mt-1">
                Security Hub
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>

        {/* Organization Name */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/70">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Company</p>
          <p className="text-xs font-bold text-slate-200 truncate mt-0.5">{organization?.name || 'My Organization'}</p>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item, idx) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={idx}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
          {canSwitchToAdmin && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-xs font-bold text-emerald-300 transition-colors"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Switch to Admin Portal
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">
                {user?.full_name?.charAt(0) || 'E'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Cybersecurity Mission Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-300" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs font-bold">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Security Awareness Active
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto cyber-grid">{children}</main>
      </div>
      </div>
    </div>
  );
};

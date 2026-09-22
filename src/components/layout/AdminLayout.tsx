import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  Layers,
  Send,
  BookOpen,
  FileCheck2,
  TrendingDown,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  Plug,
  History,
  Settings,
  LogOut,
  UserCircle,
  Menu,
  X,
  ExternalLink,
  AlertOctagon,
  LifeBuoy,
  Activity,
  Sun,
  Moon,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SecurityStatusBar } from './SecurityStatusBar';
import { useIdleLock } from '../../hooks/useIdleLock';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  navigate: (path: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activePath = '/admin/dashboard', navigate }) => {
  const { user, organization, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Security hardening: auto-lock after 15 min inactivity
  useIdleLock(() => {
    logout();
    navigate('/login?locked=1');
  });

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }
      ]
    },
    {
      title: 'ORGANIZATION',
      items: [
        { label: 'Employees', path: '/admin/employees', icon: <Users className="w-4 h-4" /> },
        { label: 'Departments', path: '/admin/departments', icon: <Building2 className="w-4 h-4" /> },
        { label: 'Organization Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> }
      ]
    },
    {
      title: 'SIMULATION CENTER',
      items: [
        { label: 'Campaigns', path: '/admin/campaigns', icon: <Send className="w-4 h-4" /> },
        { label: 'Scenario Library', path: '/admin/scenarios', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Simulation Results', path: '/admin/results', icon: <FileCheck2 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'TRAINING & BEHAVIOR',
      items: [
        { label: 'Training Center', path: '/admin/training', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Risk Management', path: '/admin/risk', icon: <TrendingDown className="w-4 h-4" /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'GOVERNANCE & AUDIT',
      items: [
        { label: 'Reports & Exports', path: '/admin/reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { label: 'Compliance Frameworks', path: '/admin/compliance', icon: <CheckCircle2 className="w-4 h-4" /> },
        { label: 'Integrations & MSSP', path: '/admin/integrations', icon: <Plug className="w-4 h-4" /> },
        { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="w-4 h-4" /> }
      ]
    }
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
                Enterprise Admin
              </span>
            </div>
          </div>

          {/* Theme Toggle Button in Sidebar */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>

        {/* Tenant Organization Indicator */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/70">
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Tenant Workspace</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-bold text-slate-200 truncate">{organization?.name || 'Enterprise'}</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Tenant active" />
          </div>
          <p className="text-[11px] text-slate-400 truncate">{organization?.domain || 'lockphish.internal'}</p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <p className="px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item, iIdx) => {
                  const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
                  return (
                    <button
                      key={iIdx}
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm shadow-emerald-950/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer & Switch to Employee portal */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/70 space-y-2">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            Switch to Employee View
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0">
                {user?.full_name?.charAt(0) || 'A'}
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-200 truncate">{user?.full_name}</p>
                <Badge variant="active" size="sm" className="mt-0.5">
                  {user?.role || 'ORG_ADMIN'}
                </Badge>
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
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Security Workspace</span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                {organization?.name || 'LockPhish Platform'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
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

            <Button
              variant="outline"
              size="sm"
              icon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => navigate('/admin/scenarios')}
            >
              Scenario Library
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => navigate('/admin/campaigns/create')}
            >
              Create Campaign
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto cyber-grid">{children}</main>
      </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Users,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  LogIn,
  Eye,
  AlertTriangle,
  ArrowRight,
  Clock,
  Radio,
  Monitor,
  Maximize2,
  Tv,
  Globe,
  Lock,
  PhoneCall,
  Mail,
  Smartphone,
  Folder,
  Play,
  Send,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { MetricCard } from '../../components/common/MetricCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingState } from '../../components/common/LoadingState';
import { Input } from '../../components/common/Input';
import { api } from '../../api/client';

interface ActivityMonitorPageProps {
  navigate: (path: string) => void;
}

export const ActivityMonitorPage: React.FC<ActivityMonitorPageProps> = ({ navigate }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    monitored_workforce: 0,
    total_actions_today: 0,
    high_risk_events_today: 0,
    reports_today: 0
  });
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // View Mode: 'STREAM' vs 'WORKFORCE' vs 'SHADOWING'
  const [viewTab, setViewTab] = useState<'STREAM' | 'WORKFORCE' | 'SHADOWING'>('STREAM');
  const [shadowingEmployee, setShadowingEmployee] = useState<any>(null);

  // Active Screen within Screen Shadowing Console
  const [activeScreenType, setActiveScreenType] = useState<'EMAIL' | 'SMS' | 'VOICE' | 'SSO_PORTAL'>('EMAIL');
  const [screenHoverUrl, setScreenHoverUrl] = useState<string | null>(null);
  const [shadowPasswordInput, setShadowPasswordInput] = useState('');
  const [shadowInterceptAlert, setShadowInterceptAlert] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Detail Modal
  const [selectedActivity, setSelectedActivity] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [categoryFilter, severityFilter]);

  // Real-time polling timer
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, categoryFilter, severityFilter, search]);

  const loadData = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const [streamData, statsData, empData] = await Promise.allSettled([
        api.activity.getStream({
          category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
          severity: severityFilter !== 'ALL' ? severityFilter : undefined,
          search: search || undefined,
          limit: 100
        }),
        api.activity.getStats(),
        api.employees.list({ limit: 100 })
      ]);

      if (streamData.status === 'fulfilled') {
        setActivities(streamData.value.activities || []);
        setTotal(streamData.value.total || 0);
      }
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value || {});
      }
      if (empData.status === 'fulfilled') {
        const emps = empData.value.employees || [];
        setEmployees(emps);
        if (emps.length > 0 && !shadowingEmployee) {
          setShadowingEmployee(emps[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load activity data:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStartShadowing = (emp: any) => {
    setShadowingEmployee(emp);
    setViewTab('SHADOWING');
  };

  const handleSimulateShadowPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShadowInterceptAlert(true);
    setTimeout(() => {
      setShadowInterceptAlert(false);
      setShadowPasswordInput('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Live Stream Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">Live User Activity & Workstation Monitor</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[11px] font-bold">
              <Radio className={`w-3 h-3 ${autoRefresh ? 'animate-pulse text-emerald-400' : 'text-slate-500'}`} />
              {autoRefresh ? 'LIVE MONITOR ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of employee logins, simulation clicks, credential entries, and live workstation screen shadowing.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Tab Switcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setViewTab('STREAM')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewTab === 'STREAM' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Live Event Feed</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab('WORKFORCE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewTab === 'WORKFORCE' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Workforce Roster ({employees.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewTab('SHADOWING')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                viewTab === 'SHADOWING' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>Screen Shadowing Monitor</span>
            </button>
          </div>

          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Auto-Refresh (5s)' : 'Paused'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => loadData(true)}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Monitoring KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monitored Workforce"
          value={stats?.monitored_workforce || employees.length}
          subtitle="Active employee profiles"
          icon={<Users className="w-5 h-5" />}
          variant="emerald"
        />

        <MetricCard
          title="User Actions Today"
          value={stats?.total_actions_today || activities.length}
          subtitle="Logins & simulation events"
          icon={<Activity className="w-5 h-5" />}
          variant="sky"
        />

        <MetricCard
          title="High-Risk Actions Today"
          value={stats?.high_risk_events_today || 0}
          subtitle="Clicks & credential submissions"
          icon={<ShieldAlert className="w-5 h-5" />}
          variant="rose"
        />

        <MetricCard
          title="Threat Reports Today"
          value={stats?.reports_today || 0}
          subtitle="Simulations safely reported"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="emerald"
        />
      </div>

      {viewTab === 'WORKFORCE' ? (
        /* 1. ACTIVE WORKFORCE ROSTER VIEW */
        <Card
          title={`Active Monitored Workforce (${employees.length} Employees)`}
          subtitle="Real-time employee monitoring statuses and security resilience scores"
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/employees')}>
              Manage Workforce Directory <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          }
        >
          {employees.length === 0 ? (
            <EmptyState
              title="No employees added yet"
              description="Add employee profiles to monitor their security score and launch targeted threat simulations."
              actionText="Add Employee"
              onAction={() => navigate('/admin/employees')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {employees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-200">
                        {emp.first_name?.charAt(0)}{emp.last_name?.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 block text-xs">{emp.first_name} {emp.last_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{emp.email}</span>
                      </div>
                    </div>
                    <Badge variant={emp.current_risk_level?.toLowerCase() || 'low'} size="sm">
                      {emp.current_risk_level || 'LOW'}
                    </Badge>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Department:</span>
                      <span className="text-slate-300 font-bold">{emp.department_name || 'General'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Security Score:</span>
                      <span className="text-emerald-400 font-bold">{emp.current_risk_score}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Simulations:</span>
                      <span className="text-slate-300">{emp.simulations_reported || 0} reported / {emp.simulations_failed || 0} failed</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Monitor className="w-3.5 h-3.5 text-emerald-400" />}
                      onClick={() => handleStartShadowing(emp)}
                    >
                      Screen Monitor
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/employees/${emp.id}`)}
                    >
                      Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : viewTab === 'SHADOWING' ? (
        /* 2. LIVE WORKSTATION SCREEN SHADOWING CONSOLE */
        <div className="space-y-4">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    Live Workstation Screen Shadowing Console
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-slate-400">
                    Target Workstation: <strong className="text-emerald-400">{shadowingEmployee ? `${shadowingEmployee.first_name} ${shadowingEmployee.last_name} (${shadowingEmployee.email})` : 'Workstation Display'}</strong>
                  </p>
                </div>
              </div>

              {/* Select Employee to Shadow & Screen Mode Buttons */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                {employees.length > 0 && (
                  <select
                    value={shadowingEmployee?.id || ''}
                    onChange={e => {
                      const found = employees.find(emp => emp.id === e.target.value);
                      if (found) setShadowingEmployee(found);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.first_name} {emp.last_name} ({emp.department_name || 'General'})
                      </option>
                    ))}
                  </select>
                )}

                {/* Screen Switcher */}
                <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveScreenType('EMAIL')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                      activeScreenType === 'EMAIL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Mail className="w-3 h-3" /> Webmail
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenType('SSO_PORTAL')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                      activeScreenType === 'SSO_PORTAL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Lock className="w-3 h-3" /> SSO Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenType('SMS')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                      activeScreenType === 'SMS' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" /> SMS Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScreenType('VOICE')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                      activeScreenType === 'VOICE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PhoneCall className="w-3 h-3" /> Voice Call
                  </button>
                </div>
              </div>
            </div>

            {/* Intercept Alert */}
            {shadowInterceptAlert && (
              <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>[SHIELD INTERCEPTION] Password submission intercepted on simulated phishing portal! Credential redacted and educational feedback triggered.</span>
              </div>
            )}

            {/* Simulated Desktop Screen View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Screen Preview Window */}
              <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-mono text-slate-400 ml-2">Workstation Live Screen #HOST-9412 &bull; {shadowingEmployee?.email || 'user@company.com'}</span>
                  </div>
                  <Badge variant="low" size="sm">REC 🔴 LIVE</Badge>
                </div>

                {/* Simulated Screen Canvas Body */}
                <div className="p-6 bg-[#0a0f1d] min-h-[380px] flex flex-col justify-between text-xs space-y-4 relative">
                  {activeScreenType === 'EMAIL' ? (
                    /* Webmail Screen */
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-slate-200 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-emerald-400" />
                          Outlook Web App Inbox
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">IP: 192.168.1.104</span>
                      </div>

                      <div className="p-4 bg-white text-slate-900 rounded-xl text-xs space-y-2 font-sans shadow-md">
                        <p className="font-bold text-slate-900">Subject: Action Required - Verify Microsoft 365 MFA Credentials</p>
                        <p className="text-slate-600 text-[11px]">From: IT Security Gateway &lt;helpdesk@microsoft-auth-cloud.com&gt;</p>
                        <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 text-slate-800 text-xs">
                          <p>Dear {shadowingEmployee?.first_name || 'Employee'}, your MFA credentials expire today.</p>
                          <a
                            href="#portal"
                            onMouseEnter={() => setScreenHoverUrl('https://login.microsoftonline.security-auth-check.org/v2')}
                            onMouseLeave={() => setScreenHoverUrl(null)}
                            onClick={(e) => { e.preventDefault(); setActiveScreenType('SSO_PORTAL'); }}
                            className="inline-block mt-2 font-bold text-blue-600 underline"
                          >
                            Click here to synchronize Microsoft Authenticator
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : activeScreenType === 'SSO_PORTAL' ? (
                    /* SSO Login Portal Screen */
                    <div className="max-w-md mx-auto p-6 bg-white text-slate-900 rounded-2xl shadow-xl space-y-3 font-sans">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-base text-slate-800">Microsoft Single Sign-On</span>
                      </div>
                      <p className="text-xs text-slate-600">Enter your credentials to continue</p>

                      <form onSubmit={handleSimulateShadowPassword} className="space-y-3 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={shadowingEmployee?.email || 'user@company.com'}
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-700 bg-slate-50"
                        />
                        <input
                          type="password"
                          required
                          value={shadowPasswordInput}
                          onChange={e => setShadowPasswordInput(e.target.value)}
                          placeholder="Password (test interception)"
                          className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                        />
                        <Button type="submit" variant="primary" size="sm" className="w-full justify-center">
                          Sign In & Verify
                        </Button>
                      </form>
                    </div>
                  ) : activeScreenType === 'SMS' ? (
                    /* Smartphone SMS Screen */
                    <div className="max-w-sm mx-auto p-4 bg-slate-950 border border-slate-800 rounded-3xl space-y-2 shadow-xl">
                      <div className="p-2 bg-slate-900 rounded-xl text-center text-xs font-bold text-slate-200">
                        💬 +1 (888) 492-7104 &bull; Bank Alert
                      </div>
                      <div className="p-3 bg-slate-800 text-slate-100 rounded-2xl text-xs space-y-2">
                        <p>[SECURITY ALERT] A wire of $4,850.00 to Global FX was initiated. Cancel: http://bank-verify.net/m</p>
                      </div>
                    </div>
                  ) : (
                    /* Voice Call Screen */
                    <div className="max-w-sm mx-auto p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500 mx-auto flex items-center justify-center text-emerald-400 animate-pulse">
                        <PhoneCall className="w-7 h-7" />
                      </div>
                      <h4 className="font-bold text-slate-100">Active Call: Corporate IT Support</h4>
                      <p className="text-xs text-emerald-400 font-mono">01:24 &bull; Voice Stream Live</p>
                    </div>
                  )}

                  {/* Hover tooltip if link hovered */}
                  {screenHoverUrl && (
                    <div className="absolute bottom-16 left-6 bg-slate-900 text-slate-100 p-2 rounded-lg border border-slate-700 font-mono text-[10px] flex items-center gap-1.5 shadow-2xl animate-fadeIn">
                      <Globe className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-slate-400">Target URL:</span>
                      <span className="text-rose-400 font-bold">{screenHoverUrl}</span>
                    </div>
                  )}

                  {/* Real-time Interaction Status Bar */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">Safety Interceptor: <strong className="text-emerald-400">Zero Credential Persistence Active</strong></span>
                    </div>
                    <span className="text-slate-400 font-mono">Workstation Status: Online</span>
                  </div>
                </div>
              </div>

              {/* Right Live Interaction Feed */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Live Workstation Action Log
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {activities.slice(0, 8).map((a, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-200">{a.user_name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{new Date(a.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setViewTab('STREAM')}
                >
                  View Full Event Stream
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 3. STANDARD UNIFIED ACTIVITY STREAM */
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
              <Input
                placeholder="Live search by employee name, email, action keyword..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
              <Button type="submit" variant="secondary" size="md">
                Filter
              </Button>
            </form>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Categories</option>
                <option value="SIMULATION">Simulations</option>
                <option value="TRAINING">Training</option>
                <option value="AUTH">Authentication</option>
                <option value="ADMIN">Administrative</option>
              </select>

              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical (Compromise / Attack)</option>
                <option value="HIGH">High (Link Click / Failed Login)</option>
                <option value="MEDIUM">Medium (Opened / Active)</option>
                <option value="LOW">Low (Reported / Passed)</option>
              </select>
            </div>
          </div>

          {/* Activity Stream Table */}
          {loading ? (
            <LoadingState message="Loading live user activity stream..." />
          ) : activities.length === 0 ? (
            <EmptyState
              title="No live activity recorded"
              description="User actions, logins, and simulation interactions will appear here in real-time as they occur."
            />
          ) : (
            <Card title={`Live Activity Feed (${total} Events)`} subtitle="Chronological stream of workforce interactions">
              <Table
                data={activities}
                keyExtractor={a => a.id}
                onRowClick={a => setSelectedActivity(a)}
                columns={[
                  {
                    header: 'Timestamp',
                    accessor: a => (
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        {new Date(a.timestamp).toLocaleTimeString()} &bull; {new Date(a.timestamp).toLocaleDateString()}
                      </span>
                    )
                  },
                  {
                    header: 'User / Employee',
                    accessor: a => (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                          {a.user_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{a.user_name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{a.user_email}</span>
                        </div>
                      </div>
                    )
                  },
                  {
                    header: 'Category',
                    accessor: a => <Badge variant="info" size="sm">{a.category}</Badge>
                  },
                  {
                    header: 'Activity Action',
                    accessor: a => (
                      <div>
                        <span className="font-bold text-slate-200 block text-xs">{a.title}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-sm block">{a.description}</span>
                      </div>
                    )
                  },
                  {
                    header: 'Severity',
                    accessor: a => (
                      <Badge variant={a.severity.toLowerCase()} size="sm">
                        {a.severity}
                      </Badge>
                    )
                  },
                  {
                    header: 'Risk Delta',
                    accessor: a => (
                      typeof a.risk_impact === 'number' && a.risk_impact !== 0 ? (
                        <span className={`font-mono font-bold text-xs ${a.risk_impact > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {a.risk_impact > 0 ? `+${a.risk_impact} pts` : `${a.risk_impact} pts`}
                        </span>
                      ) : <span className="text-slate-600">-</span>
                    )
                  },
                  {
                    header: 'Inspector',
                    accessor: a => (
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(a)}>
                          Inspect
                        </Button>
                        {a.employee_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/employees/${a.employee_id}`)}
                            title="View Profile"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    )
                  }
                ]}
              />
            </Card>
          )}
        </div>
      )}

      {/* Activity Event Inspector Modal */}
      {selectedActivity && (
        <Modal
          isOpen={Boolean(selectedActivity)}
          onClose={() => setSelectedActivity(null)}
          title="User Activity Event Inspector"
          subtitle={`Event ID: ${selectedActivity.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">User / Actor:</span>
                <span className="text-slate-100 font-bold">{selectedActivity.user_name} ({selectedActivity.user_email})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Department:</span>
                <span className="text-slate-200">{selectedActivity.department_name || 'General'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Category:</span>
                <Badge variant="info" size="sm">{selectedActivity.category}</Badge>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Action:</span>
                <span className="text-emerald-400 font-bold">{selectedActivity.action}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300">{new Date(selectedActivity.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Severity:</span>
                <Badge variant={selectedActivity.severity.toLowerCase()} size="sm">{selectedActivity.severity}</Badge>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-sans">
              <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Description</span>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedActivity.description}</p>
            </div>

            {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Safe Event Telemetry Metadata</span>
                <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-slate-900 rounded border border-slate-800">
                  {JSON.stringify(selectedActivity.metadata, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              {selectedActivity.employee_id ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate(`/admin/employees/${selectedActivity.employee_id}`);
                    setSelectedActivity(null);
                  }}
                >
                  View Full Employee Profile
                </Button>
              ) : <div />}

              <Button variant="secondary" size="sm" onClick={() => setSelectedActivity(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

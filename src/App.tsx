import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { EmployeeLayout } from './components/layout/EmployeeLayout';
import { LoadingState } from './components/common/LoadingState';

// Auth Pages
import { Login } from './pages/auth/Login';
import { RegisterOrg } from './pages/auth/RegisterOrg';
import { ForgotPassword } from './pages/auth/ForgotPassword';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EmployeesPage } from './pages/admin/EmployeesPage';
import { EmployeeDetailPage } from './pages/admin/EmployeeDetailPage';
import { DepartmentWorkforcePage } from './pages/admin/DepartmentWorkforcePage';
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { GroupsPage } from './pages/admin/GroupsPage';
import { OrganizationSettingsPage } from './pages/admin/OrganizationSettingsPage';
import { CampaignsPage } from './pages/admin/CampaignsPage';
import { CampaignCreatePage } from './pages/admin/CampaignCreatePage';
import { CampaignDetailPage } from './pages/admin/CampaignDetailPage';
import { ScenarioLibraryPage } from './pages/admin/ScenarioLibraryPage';
import { ScenarioCreatePage } from './pages/admin/ScenarioCreatePage';
import { SimulationResultsPage } from './pages/admin/SimulationResultsPage';
import { TrainingManagementPage } from './pages/admin/TrainingManagementPage';
import { CourseCreatePage } from './pages/admin/CourseCreatePage';
import { RiskManagementPage } from './pages/admin/RiskManagementPage';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { CompliancePage } from './pages/admin/CompliancePage';
import { IntegrationsPage } from './pages/admin/IntegrationsPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { ActivityMonitorPage } from './pages/admin/ActivityMonitorPage';

// Employee Pages
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { EmployeeMissionsPage } from './pages/employee/EmployeeMissionsPage';
import { EmployeeTrainingPage } from './pages/employee/EmployeeTrainingPage';
import { EmployeeResultsPage } from './pages/employee/EmployeeResultsPage';
import { EmployeeScorePage } from './pages/employee/EmployeeScorePage';
import { EmployeeProfilePage } from './pages/employee/EmployeeProfilePage';

function Router() {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060a14] flex items-center justify-center">
        <LoadingState message="Initializing LockPhish Security Platform..." />
      </div>
    );
  }

  // Unauthenticated routes
  if (!user) {
    if (currentPath === '/auth/register-org') {
      return <RegisterOrg navigate={navigate} />;
    }
    if (currentPath === '/auth/forgot-password') {
      return <ForgotPassword navigate={navigate} />;
    }
    return <Login navigate={navigate} />;
  }

  let effectivePath = currentPath;
  if (effectivePath === '/' || effectivePath === '') {
    effectivePath = user.role === 'EMPLOYEE' ? '/employee/dashboard' : '/admin/dashboard';
  }

  const [pathOnly, searchString] = effectivePath.split('?');

  // Employee Portal Routes
  if (pathOnly.startsWith('/employee') || pathOnly === '/lab' || pathOnly === '/email-lab' || pathOnly === '/sms-lab' || pathOnly === '/voice-lab' || pathOnly === '/url-lab') {
    let content = <EmployeeDashboard navigate={navigate} />;

    if (pathOnly === '/employee/missions') {
      content = <EmployeeMissionsPage navigate={navigate} />;
    } else if (pathOnly === '/employee/training' || pathOnly === '/lab' || pathOnly === '/email-lab' || pathOnly === '/sms-lab' || pathOnly === '/voice-lab' || pathOnly === '/url-lab') {
      content = <EmployeeTrainingPage navigate={navigate} />;
    } else if (pathOnly === '/employee/results') {
      content = <EmployeeResultsPage navigate={navigate} />;
    } else if (pathOnly === '/employee/score') {
      content = <EmployeeScorePage navigate={navigate} />;
    } else if (pathOnly === '/employee/profile') {
      content = <EmployeeProfilePage navigate={navigate} />;
    }

    return (
      <EmployeeLayout activePath={pathOnly.startsWith('/employee') ? pathOnly : '/employee/training'} navigate={navigate}>
        {content}
      </EmployeeLayout>
    );
  }

  // Admin Portal Routes
  let adminContent = <AdminDashboard navigate={navigate} />;

  if (pathOnly === '/admin/employees') {
    adminContent = <EmployeesPage navigate={navigate} />;
  } else if (pathOnly.startsWith('/admin/workforce/department/') || pathOnly.startsWith('/workforce/department/')) {
    const deptId = pathOnly.replace('/admin/workforce/department/', '').replace('/workforce/department/', '');
    adminContent = <DepartmentWorkforcePage departmentId={deptId} navigate={navigate} />;
  } else if (pathOnly.startsWith('/admin/employees/')) {
    const empId = pathOnly.replace('/admin/employees/', '');
    adminContent = <EmployeeDetailPage employeeId={empId} navigate={navigate} />;
  } else if (pathOnly === '/admin/departments') {
    adminContent = <DepartmentsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/groups') {
    adminContent = <GroupsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/settings') {
    adminContent = <OrganizationSettingsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/campaigns') {
    adminContent = <CampaignsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/campaigns/create') {
    adminContent = <CampaignCreatePage navigate={navigate} />;
  } else if (pathOnly.startsWith('/admin/campaigns/')) {
    const campId = pathOnly.replace('/admin/campaigns/', '');
    adminContent = <CampaignDetailPage campaignId={campId} navigate={navigate} />;
  } else if (pathOnly === '/admin/scenarios/create') {
    adminContent = <ScenarioCreatePage navigate={navigate} />;
  } else if (pathOnly === '/admin/scenarios') {
    adminContent = <ScenarioLibraryPage navigate={navigate} />;
  } else if (pathOnly === '/admin/results') {
    adminContent = <SimulationResultsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/training/create') {
    adminContent = <CourseCreatePage navigate={navigate} />;
  } else if (pathOnly === '/admin/training') {
    adminContent = <TrainingManagementPage navigate={navigate} />;
  } else if (pathOnly === '/admin/risk') {
    adminContent = <RiskManagementPage navigate={navigate} />;
  } else if (pathOnly === '/admin/analytics') {
    adminContent = <AnalyticsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/reports') {
    adminContent = <ReportsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/compliance') {
    adminContent = <CompliancePage navigate={navigate} />;
  } else if (pathOnly === '/admin/integrations') {
    adminContent = <IntegrationsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/audit-logs') {
    adminContent = <AuditLogsPage navigate={navigate} />;
  } else if (pathOnly === '/admin/activity') {
    adminContent = <ActivityMonitorPage navigate={navigate} />;
  }

  return (
    <AdminLayout activePath={pathOnly} navigate={navigate}>
      {adminContent}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  );
}

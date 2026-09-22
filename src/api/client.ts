// Type-Safe API Client for LockPhish
import { session } from '../utils/session';

const API_BASE = '/api';

export class ApiError extends Error {
  code?: string;
  status: number;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = session.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }

    if (response.status === 401) {
      // If token expired, clear token and redirect if needed
      session.clear();
    }

    throw new ApiError(
      errorData.error || 'An unexpected error occurred.',
      response.status,
      errorData.code,
      errorData.details
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

const toQueryString = (params?: Record<string, any>): string => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'undefined' && value !== 'null') {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
};

export const api = {
  // Auth
  auth: {
    registerOrg: (data: any) => request<any>('/auth/register-org', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => request<any>('/auth/me'),
    activateEmployee: (data: any) => request<any>('/auth/activate-employee', { method: 'POST', body: JSON.stringify(data) }),
    forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    getPasswordRequests: () => request<any[]>('/auth/password-requests'),
    adminResetPassword: (data: any) => request<any>('/auth/admin-reset-password', { method: 'POST', body: JSON.stringify(data) })
  },

  // Organizations & Structure
  org: {
    getCurrent: () => request<any>('/organizations/current'),
    updateSettings: (data: any) => request<any>('/organizations/current', { method: 'PUT', body: JSON.stringify(data) }),
    getDepartments: () => request<any[]>('/organizations/departments'),
    createDepartment: (data: any) => request<any>('/organizations/departments', { method: 'POST', body: JSON.stringify(data) }),
    updateDepartment: (id: string, data: any) => request<any>(`/organizations/departments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDepartment: (id: string) => request<any>(`/organizations/departments/${id}`, { method: 'DELETE' }),
    getGroups: () => request<any[]>('/organizations/groups'),
    createGroup: (data: any) => request<any>('/organizations/groups', { method: 'POST', body: JSON.stringify(data) })
  },

  // Employees
  employees: {
    list: (params?: any) =>
      request<{ employees: any[]; total: number; limit: number; offset: number }>(`/employees${toQueryString(params)}`),
    get: (id: string) => request<any>(`/employees/${id}`),
    create: (data: any) => request<any>('/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request<any>(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deactivate: (id: string) => request<any>(`/employees/${id}`, { method: 'DELETE' }),
    seedDepartment: (departmentId: string) =>
      request<{ success: boolean; count: number; employees: any[] }>('/employees/seed-department', {
        method: 'POST',
        body: JSON.stringify({ department_id: departmentId })
      })
  },

  // Scenarios
  scenarios: {
    list: (params?: any) =>
      request<any[]>(`/scenarios${toQueryString(params)}`),
    get: (id: string) => request<any>(`/scenarios/${id}`),
    create: (data: any) => request<any>('/scenarios', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/scenarios/${id}`, { method: 'DELETE' })
  },

  // Campaigns
  campaigns: {
    list: (params?: any) =>
      request<any[]>(`/campaigns${toQueryString(params)}`),
    get: (id: string) => request<any>(`/campaigns/${id}`),
    create: (data: any) => request<any>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    validate: (id: string) => request<any>(`/campaigns/${id}/validate`, { method: 'POST' }),
    launch: (id: string) => request<any>(`/campaigns/${id}/launch`, { method: 'POST' }),
    complete: (id: string) => request<any>(`/campaigns/${id}/complete`, { method: 'POST' }),
    pause: (id: string) => request<any>(`/campaigns/${id}/pause`, { method: 'POST' }),
    resume: (id: string) => request<any>(`/campaigns/${id}/resume`, { method: 'POST' }),
    emergencyStop: (id: string) => request<any>(`/campaigns/${id}/emergency-stop`, { method: 'POST' }),
    update: (id: string, data: any) => request<any>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<any>(`/campaigns/${id}`, { method: 'DELETE' })
  },

  // Simulations
  simulations: {
    getMyMissions: () => request<any[]>('/simulations/my-missions'),
    getAllResults: (params?: any) =>
      request<any[]>(`/simulations${toQueryString(params)}`),
    get: (id: string) => request<any>(`/simulations/${id}`),
    launchEmployee: (employeeId: string, scenarioId?: string) =>
      request<any>('/simulations/launch-employee', {
        method: 'POST',
        body: JSON.stringify({ employee_id: employeeId, scenario_id: scenarioId })
      }),
    recordEvent: (id: string, data: { event_type: string; raw_payload?: any }) =>
      request<any>(`/simulations/${id}/event`, { method: 'POST', body: JSON.stringify(data) }),
    getReplay: (id: string) => request<any>(`/simulations/${id}/replay`)
  },

  // Voice AI
  voice: {
    startSession: (simulation_id: string) => request<any>('/voice/session/start', { method: 'POST', body: JSON.stringify({ simulation_id }) }),
    sendUtterance: (sessionId: string, utterance: string) =>
      request<any>(`/voice/session/${sessionId}/utterance`, { method: 'POST', body: JSON.stringify({ utterance }) }),
    terminate: (sessionId: string, reason?: string) =>
      request<any>(`/voice/session/${sessionId}/terminate`, { method: 'POST', body: JSON.stringify({ reason }) }),
    decline: (simulation_id: string) =>
      request<any>('/voice/decline', { method: 'POST', body: JSON.stringify({ simulation_id }) })
  },

  // Training & Assessments
  training: {
    getCourses: () => request<any[]>('/training/courses'),
    getCourse: (id: string) => request<any>(`/training/courses/${id}`),
    createCourse: (data: any) => request<any>('/training/courses', { method: 'POST', body: JSON.stringify(data) }),
    assign: (data: any) => request<any>('/training/assign', { method: 'POST', body: JSON.stringify(data) }),
    getAllAssignments: (params?: any) =>
      request<any[]>(`/training/assignments${toQueryString(params)}`),
    deleteAssignment: (id: string) =>
      request<any>(`/training/assignments/${id}`, { method: 'DELETE' }),
    getMyAssignments: () => request<any[]>('/training/my-assignments'),
    updateProgress: (assignmentId: string, progress_percent: number) =>
      request<any>(`/training/assignments/${assignmentId}/progress`, { method: 'POST', body: JSON.stringify({ progress_percent }) }),
    submitAssessment: (data: any) => request<any>('/training/assessments/submit', { method: 'POST', body: JSON.stringify(data) }),
    getLearningPaths: () => request<any[]>('/training/learning-paths'),
    getCertificates: () => request<any[]>('/training/certificates'),
    getAchievements: () => request<any[]>('/training/achievements'),
    getResources: () => request<any[]>('/training/resources'),
    getAnalytics: () => request<any>('/training/analytics')
  },

  // Risk Management
  risk: {
    getOrgRisk: () => request<any>('/risk/organization'),
    recalculate: (employee_id: string) => request<any>('/risk/recalculate', { method: 'POST', body: JSON.stringify({ employee_id }) })
  },

  // Analytics
  analytics: {
    getOverview: () => request<any>('/analytics/overview'),
    getChannels: () => request<any>('/analytics/channels'),
    getDepartments: () => request<any[]>('/analytics/departments'),
    getTrends: (days = 30) => request<any[]>(`/analytics/trends?days=${days}`)
  },

  // Compliance
  compliance: {
    getStatus: () => request<any[]>('/compliance/status')
  },

  // Integrations
  integrations: {
    getMsspTenants: () => request<any[]>('/integrations/mssp/tenants'),
    getInsurancePackage: () => request<any>('/integrations/insurance/underwriting'),
    testEmailSecurity: (data: any) => request<any>('/integrations/email-security/test', { method: 'POST', body: JSON.stringify(data) })
  },

  // Audit Logs
  audit: {
    getLogs: (params?: any) => {
      // Strip empty/undefined params so they never reach the server as the
      // literal string "undefined" (which filtered the feed down to 0 rows).
      const clean: Record<string, string> = {};
      Object.entries(params || {}).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v) !== '') clean[k] = String(v);
      });
      const qs = new URLSearchParams(clean).toString();
      return request<{ logs: any[]; total: number; limit: number; offset: number }>(`/audit/logs${qs ? `?${qs}` : ''}`);
    }
  },

  // Live User Activity Monitoring
  activity: {
    getStream: (params?: any) => {
      const qs = new URLSearchParams(params || {}).toString();
      return request<{ activities: any[]; total: number; limit: number; offset: number }>(`/activity/stream${qs ? `?${qs}` : ''}`);
    },
    getStats: () => request<any>('/activity/stats')
  },

  // Downloads
  reports: {
    downloadCSVUrl: (type: string) => {
      const token = session.getToken() || '';
      return `${API_BASE}/reports/csv?type=${type}&token=${token}`;
    },
    downloadCSV: async (type: string) => {
      const token = session.getToken();
      const response = await fetch(`${API_BASE}/reports/csv?type=${type}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to generate CSV export.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockphish_${type.toLowerCase()}_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    downloadPDF: async () => {
      const token = session.getToken();
      const response = await fetch(`${API_BASE}/reports/pdf`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to generate PDF report.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lockphish_executive_report_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  }
};

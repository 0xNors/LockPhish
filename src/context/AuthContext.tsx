import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Organization } from '../types';
import { api, ApiError } from '../api/client';
import { session } from '../utils/session';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any, remember?: boolean) => Promise<void>;
  registerOrg: (data: any) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => session.getUser());
  const [organization, setOrganization] = useState<Organization | null>(() => session.getOrg());
  const [token, setToken] = useState<string | null>(() => session.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const refreshProfile = async () => {
    try {
      const meData = await api.auth.getMe();
      setUser(meData.user);

      let org: Organization | null = null;
      if (meData.user.organization_id) {
        org = await api.org.getCurrent();
        setOrganization(org);
      }
      session.saveProfile(meData.user, org || undefined);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
      }
    }
  };

  const login = async (credentials: any, remember = false) => {
    const res = await api.auth.login(credentials);
    setUser(res.user);
    setOrganization(res.organization);
    setToken(res.token);
    // Ephemeral sessionStorage by default; localStorage only on explicit opt-in.
    session.save(res.token, res.user, res.organization, remember);
  };

  const registerOrg = async (data: any) => {
    const res = await api.auth.registerOrg(data);
    setUser(res.user);
    setOrganization(res.organization);
    setToken(res.token);
    session.save(res.token, res.user, res.organization, false);
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setToken(null);
    session.clear();
  };

  return (
    <AuthContext.Provider value={{ user, organization, token, loading, login, registerOrg, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

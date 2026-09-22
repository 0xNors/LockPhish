// ============================================================================
// SESSION STORAGE STRATEGY (security hardening)
// ----------------------------------------------------------------------------
// Tokens live in sessionStorage BY DEFAULT: closing the tab or shutting the
// computer destroys the session, so the next visit always requires a fresh
// login (bank-grade behavior). Only when the user explicitly ticks
// "Remember this device" do we persist to localStorage.
// ============================================================================

const TOKEN_KEY = 'lockphish_token';
const USER_KEY = 'lockphish_user';
const ORG_KEY = 'lockphish_org';

export const session = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  getUser(): any {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  getOrg(): any {
    const raw = sessionStorage.getItem(ORG_KEY) || localStorage.getItem(ORG_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  save(token: string, user: any, org: any, remember: boolean): void {
    this.clear();
    const store = remember ? localStorage : sessionStorage;
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
    if (org) store.setItem(ORG_KEY, JSON.stringify(org));
  },

  saveProfile(user: any, org?: any): void {
    const store = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
    store.setItem(USER_KEY, JSON.stringify(user));
    if (org) store.setItem(ORG_KEY, JSON.stringify(org));
  },

  /** True when the user explicitly chose "Remember this device". */
  isRemembered(): boolean {
    return localStorage.getItem(TOKEN_KEY) !== null;
  },

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ORG_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ORG_KEY);
  }
};

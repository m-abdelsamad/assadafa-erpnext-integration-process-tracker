// If you set VITE_API_BASE_URL in your .env, it will use that.
// Otherwise it falls back to localhost:5000/api
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ??
  'http://localhost:5000/api';

export const AUDIT_HUB_URL = `${API_BASE_URL}/hubs/audit`;

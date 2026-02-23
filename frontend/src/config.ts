const _env = (import.meta as any).env || {};

// If VITE_ env vars are set (production build), use them. Otherwise
// fall back to proxied paths under /api so Vercel can proxy to backend.
export const ISSUANCE_URL = _env.VITE_ISSUANCE_URL || '/api/issuance';
export const VERIFICATION_URL = _env.VITE_VERIFICATION_URL || '/api/verification';

// Helpers to build endpoint URLs - ensure no double slashes
const joinPath = (base: string, path: string) => `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
export const issuanceEndpoint = (path: string) => joinPath(ISSUANCE_URL, path);
export const verificationEndpoint = (path: string) => joinPath(VERIFICATION_URL, path);

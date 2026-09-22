// Single source of truth for the release tag. Bundled into the client AND
// served by the backend /api/health so the UI can detect a stale (not
// restarted) backend process and tell the operator to restart it.
export const RELEASE_TAG = 'R-2026-08-28-audit-seed-v2';

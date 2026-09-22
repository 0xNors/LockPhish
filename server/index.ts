import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import authRoutes from './routes/authRoutes.js';
import orgRoutes from './routes/orgRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import scenarioRoutes from './routes/scenarioRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import riskRoutes from './routes/riskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import complianceRoutes from './routes/complianceRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { runMigrations } from './database/migrate.js';
import { BackgroundScheduler } from './services/backgroundScheduler.js';
import { AuditService } from './services/auditService.js';
import { all } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const server = http.createServer(app);

const PORT = parseInt(process.env.PORT || '3000', 10);
const distPath = path.join(ROOT_DIR, 'dist');
const hasDistBuild = fs.existsSync(path.join(distPath, 'index.html'));

// Determine production mode: either explicit NODE_ENV=production OR dist build is present
const isProduction = process.env.NODE_ENV === 'production' || (process.env.NODE_ENV !== 'development' && hasDistBuild);

// Basic security and parsing middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  if (!req.path.startsWith('/@') && !req.path.startsWith('/src') && !req.path.startsWith('/node_modules') && !req.path.startsWith('/assets')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// Mount Health checks (both /health and /api/health for UI probes)
app.use('/', healthRoutes);
app.use('/api', healthRoutes);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/activity', activityRoutes);

// Error Handling Middleware for API
app.use(errorHandler);

async function startServer() {
  // 1. Run database migrations & baseline scenario seeding
  try {
    await runMigrations();
  } catch (err) {
    console.error('Migration error on startup:', err);
  }

  // 2. Start Background Scheduler for campaign lifecycles
  BackgroundScheduler.start();

  // 2b. Platform-level audit events (organization-agnostic: shown in EVERY tenant's audit feed)
  try {
    await AuditService.log({ organization_id: null, actor_id: null, actor_name: 'LockPhish Core Engine', actor_role: 'SYSTEM', action: 'SYSTEM_STARTED', resource: 'PLATFORM', details: { mode: isProduction ? 'PRODUCTION' : 'DEVELOPMENT', port: PORT } });
    await AuditService.log({ organization_id: null, actor_id: null, actor_name: 'LockPhish Core Engine', actor_role: 'SYSTEM', action: 'MIGRATIONS_COMPLETED', resource: 'DATABASE', details: { database: 'data/lockphish.sqlite', tamper_evident: true } });
    await AuditService.log({ organization_id: null, actor_id: null, actor_name: 'Background Scheduler', actor_role: 'SYSTEM', action: 'SCHEDULER_STARTED', resource: 'PLATFORM', details: { job: 'campaign_lifecycle_and_risk_processing' } });

    // Guarantee no tenant ever sees an empty audit feed: initialize the ledger
    // for organizations that have no audit rows yet.
    const emptyOrgs = await all<any>('SELECT o.id FROM organizations o WHERE NOT EXISTS (SELECT 1 FROM audit_logs a WHERE a.organization_id = o.id)');
    for (const o of emptyOrgs) {
      await AuditService.log({ organization_id: o.id, actor_id: null, actor_name: 'LockPhish Core Engine', actor_role: 'SYSTEM', action: 'AUDIT_LEDGER_INITIALIZED', resource: 'PLATFORM', details: { note: 'Immutable audit ledger activated for this tenant' } });
    }
  } catch (err) {
    console.error('Startup audit logging error:', err);
  }

  // 3. Setup Frontend Serving (Vite dev middleware in Dev, Static in Prod)
  if (isProduction && hasDistBuild) {
    // Hashed assets can cache long-term; index.html must NEVER cache so new
    // deployments reach the browser immediately (prevents stale-bundle bugs).
    app.use(express.static(distPath, { index: false, maxAge: '30d', immutable: true }));
    app.get('*', (req, res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server } },
      appType: 'spa',
      root: ROOT_DIR
    });
    app.use(vite.middlewares);
  }

  // 4. Bind and listen on 0.0.0.0
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🛡️  LOCKPHISH SECURITY PLATFORM RUNNING`);
    console.log(`📡 URL: http://0.0.0.0:${PORT} (or http://localhost:${PORT})`);
    console.log(`🔒 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`=======================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

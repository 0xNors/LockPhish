import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, all } from './db.js';
import { seedMasterData } from './seedScenarios.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Self-healing schema repair: older deployments may have tables created by
 * previous releases with fewer columns (CREATE TABLE IF NOT EXISTS never
 * updates an existing table). Missing columns made every audit INSERT fail
 * silently — the classic "audit logs never appear" bug on upgraded systems.
 */
async function ensureTableColumns(table: string, expected: Array<{ name: string; ddl: string }>) {
  const cols = await all<any>(`PRAGMA table_info(${table})`);
  if (!cols || cols.length === 0) return; // table absent; schema.sql just created it fresh
  const have = new Set(cols.map((c: any) => c.name));
  for (const e of expected) {
    if (!have.has(e.name)) {
      console.log(`[migrate] repairing schema: adding missing column ${table}.${e.name}`);
      await exec(`ALTER TABLE ${table} ADD COLUMN ${e.ddl}`);
    }
  }
}

export async function runMigrations() {
  console.log('Running database migrations...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  await exec(sql);
  console.log('Schema initialized successfully.');

  // Repair drifted legacy tables so audit logging always works after upgrades
  await ensureTableColumns('audit_logs', [
    { name: 'organization_id', ddl: 'organization_id TEXT' },
    { name: 'actor_id', ddl: 'actor_id TEXT' },
    { name: 'actor_name', ddl: "actor_name TEXT NOT NULL DEFAULT 'system'" },
    { name: 'actor_role', ddl: "actor_role TEXT NOT NULL DEFAULT 'SYSTEM'" },
    { name: 'action', ddl: "action TEXT NOT NULL DEFAULT 'UNKNOWN'" },
    { name: 'resource', ddl: "resource TEXT NOT NULL DEFAULT 'PLATFORM'" },
    { name: 'resource_id', ddl: 'resource_id TEXT' },
    { name: 'ip_address', ddl: 'ip_address TEXT' },
    { name: 'user_agent', ddl: 'user_agent TEXT' },
    { name: 'details', ddl: "details TEXT DEFAULT '{}'" },
    { name: 'created_at', ddl: "created_at TEXT NOT NULL DEFAULT (DATETIME('now'))" }
  ]);

  await seedMasterData();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations()
    .then(() => {
      console.log('Migration completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

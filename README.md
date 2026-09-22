# 🛡️ LockPhish — Cybersecurity Human-Risk Management & Attack Simulation Platform

![LockPhish Logo](public/logo.png)

**Simulate → Train → Quantify → Evidence**

An enterprise-grade, multi-tenant cybersecurity awareness platform that combines realistic multi-channel phishing simulations, a 120-course Masterclass Academy, mathematical human-risk quantification (HRI), and auditor-ready compliance evidence — all backed by real SQLite telemetry (no fake data).



## ✨ Highlights

- **Multi-channel attack simulation** — spearphishing email, SMS smishing, voice vishing, QR quishing, OAuth consent-phishing, weaponized attachments (Protected-View macro lures), fake SaaS SSO portals and Adversary-in-the-Middle (AitM) demonstrations.
- **Masterclass Academy** — 120 structured courses across 16 learning paths & tiers; unified step-by-step modules (Core Threat Theory → Visual Spotter → Defense SOP → Practical Scenario); a **different live simulator for every course** (18 archetypes) and 120 topic-matched defense SOP runbooks.
- **Human Risk Index (HRI)** — `HRI = 0.35·CompromiseRate + 0.25·(100−ReportingRate) + 0.20·(100−TrainingCoverage) + 0.20·PrivilegeMultiplier`, recomputed after every event at employee / department / organization level.
- **Governance** — immutable audit ledger with CSV / Excel / Word / PDF forensic exports; evidence mapping for SOC 2, ISO/IEC 27001:2022, NIST SP 800-53, HIPAA, PCI DSS v4.0 and GDPR.
- **MSSP-ready multi-tenancy** — isolated organization per client, role-based access (SUPER_ADMIN / ORG_ADMIN / CAMPAIGN_MANAGER / TRAINER / EMPLOYEE), consolidated reporting.
- **Security-by-design** — zero-credential redaction (`[REDACTED_BY_SECURITY_POLICY]`), ephemeral sessions (re-login after tab close), 15-min idle auto-lock, brute-force lockout, self-healing migrations, port-safe restarts.

## 🧰 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · TypeScript · Vite 6 · Tailwind CSS 3 · lucide-react |
| Backend | Node.js 20 · Express 4 · tsx · bcryptjs · jsonwebtoken · zod |
| Database | SQLite (`data/lockphish.sqlite`, created by migrations) |
| Reporting | jsPDF + autotable · client-side CSV/Excel/Word · reportlab PDF |
| QA | 28-check automated verification suite (`npm test`) |

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the platform (runs migrations + seeds the academy catalog)
npm start          # → http://localhost:3000

# 3. Open http://localhost:3000 and click "Register your organization"
#    to provision your tenant, then sign in as its admin.
```

Useful scripts:

```bash
npm run migrate    # apply schema + seed 120 courses / assessments / paths
npm test           # 28-check verification suite (isolated test DB)
npm run dev        # development mode (Vite middleware)
```

> On first boot the platform writes baseline entries into the immutable audit
> ledger; every subsequent login, campaign, training step and export appears on
> the **Security Audit Logs** page and in the exports.

## 📁 Project Structure

```
src/
  pages/admin/          14 admin screens (dashboard → audit logs)
  pages/employee/       6 employee screens (defender console)
  pages/auth/           login shell · org registration · recovery
  components/training/  CoursePlayer, simulation/defense/deconstruction engines,
                        simulationMasterData (120 topic specs), defenseMasterData
  components/common/    cyber design system (cards, tables, badges, CyberHero…)
server/
  routes/               17 REST routers (/api/auth … /api/integrations)
  services/             auth, campaigns, simulations, training, riskEngine,
                        analytics, compliance, audit, reports, integrations
  database/             schema.sql · migrate.ts (self-healing) · trainingMasterData
scripts/                generators, verification, screenshots, docs builders
```

## 📚 Project Documentation (included in this repo)

| File | Contents |
|---|---|
| `LockPhish_Project.ipynb` | Runnable IPython notebook — live analysis of `data/lockphish.sqlite` |
| `LockPhish_Project_Report.pdf` | 24-page full project report with live figures & screenshots |
| `LockPhish_Project_Report.docx` | Word version of the report |
| `LockPhish_Project_Presentation.pptx` | 38-slide presentation with real product screenshots |
| `PROJECT_README.md` | Documentation-pack readme |

All figures, tables and screenshots in the documentation are generated from the
platform's **live database and running UI** at build time — no synthetic data.

## 🔐 Security Features

- Zero-credential boundary: secrets intercepted and redacted in volatile memory.
- Ephemeral sessions by default — closing the tab/computer always requires re-login; "Remember this device" is an explicit opt-in.
- 15-minute inactivity auto-lock + manual **LOCK SESSION** control.
- Brute-force protection: 5 failed logins → 15-minute lock; bcrypt at rest; short-lived JWT.
- Tenant isolation enforced at the API layer; violations recorded.
- Immutable, exportable audit ledger (CSV / Excel / Word / PDF).

## 🤝 MSSP Integration & Business Case

**Problem:** MSSPs are under increasing pressure to offer comprehensive security
solutions with proactive defense; phishing remains a top attack vector and MSSPs
need deployable tools.

**Solution:** LockPhish integrates into MSSP service offerings for phishing
simulations, employee training and threat detection — brandable and customizable,
with automated campaigns and reporting.

- **Scalable Solution** — consistent training & risk management across many clients.
- **Value-Added Service** — proven reduction of human error-driven security risks.
- **Reputation Boost** — demonstrable proactive client cybersecurity.
- **Target market** — MSSPs serving SMBs & enterprises; MSSPs expanding offerings.

## ✅ Quality Assurance

- 28-check automated suite covering auth, RBAC, campaigns, simulations, training, risk and audit.
- TypeScript strict mode across frontend & backend; production build validation per release.
- End-to-end HTTP verification of shipped features; schema self-healing migrations.

## 📄 License

MIT — Copyright (c) 2026  See [LICENSE](LICENSE).

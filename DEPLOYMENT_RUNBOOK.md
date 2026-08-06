# ServiGo Deployment Runbook

Date: 2026-07-31
Owner: Platform and Backend Team

## 1. Purpose

This runbook defines how to deploy ServiGo safely across development, staging, and production using the primary hosted stack:

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

Local Docker assets remain available for parity testing and observability experiments.
It covers:

- environment configuration
- release quality gates
- database migration and seeding behavior
- frontend and backend deployment
- backup and restore
- rollback procedures
- post-deploy verification

## 2. System Topology

Hosted services for the primary deployment stack:

- Vercel-hosted frontend
- Render-hosted backend
- Neon-managed PostgreSQL

Optional local parity services from [docker-compose.production.yml](docker-compose.production.yml):

- postgres: PostgreSQL 16
- backend: Node.js Express API on port 5005
- frontend: static frontend container served behind Caddy
- reverse-proxy: Caddy reverse proxy with automatic HTTPS support and redirect handling
- prometheus: metrics collection and rule evaluation
- alertmanager: alert routing
- grafana: SLI/SLO, performance, and log dashboards
- loki + promtail: centralized application log aggregation

Health and observability endpoints:

- frontend health: /healthz
- backend liveness: /health/live
- backend readiness: /health/ready
- backend startup: /health/startup
- backend metrics: /metrics

## 3. Environment Matrix

| Dimension | Development | Staging | Production |
|---|---|---|---|
| Primary goal | Fast local iteration | Pre-release validation | Customer traffic |
| Compose file | docker-compose.production.yml or local split run | docker-compose.staging.yml (optional local parity) | docker-compose.production.yml (optional local parity) |
| NODE_ENV | development | production | production |
| ENFORCE_HTTPS | false | true behind TLS proxy | true behind TLS proxy |
| CORS_ORIGIN | localhost UI origins | staging frontend domain | production frontend domain |
| DB data set | disposable or seeded test data | masked-like production data | real production data |
| Seeding policy | allowed | minimal, controlled | disabled unless explicitly required |
| CI gate requirement | recommended | mandatory | mandatory |
| Secret source | .env | secret manager preferred | secret manager required |

## 4. Required Environment Variables

Source references:

- [.env.example](.env.example)

Minimum required values for non-local environments:

| Variable | Required | Notes |
|---|---|---|
| DATABASE_URL | Yes | Postgres connection string |
| PGSSLMODE | Yes | Use require or verify-full when TLS is enabled |
| PORT | Yes | Backend listen port, default 5005 |
| NODE_ENV | Yes | production in staging and production |
| ENFORCE_HTTPS | Yes | true in staging and production behind trusted proxy |
| FRONTEND_URL | Yes | Public frontend URL used by auth/email flows |
| APP_ENV | Yes | development, staging, or production |
| SECRET_PROVIDER | Yes | env, vault, aws-secrets-manager, azure-key-vault, or gcp-secret-manager |
| SECRET_MANAGER_ENABLED | Yes | true when production secrets must be fetched remotely |
| SECRET_MAPPING_JSON | If secret manager used | JSON mapping of environment keys to remote secret references |
| JWT_SECRET | Yes | Strong random secret |
| JWT_REFRESH_SECRET | Yes | Strong random secret |
| JWT_EMAIL_SECRET | Yes | Strong random secret |
| JWT_EXPIRE | Yes | Access token lifetime |
| JWT_REFRESH_EXPIRE | Yes | Refresh token lifetime |
| EMAIL_VERIFICATION_EXPIRE | Yes | Email token lifetime |
| CORS_ORIGIN | Yes | Comma-separated allowlist |
| PASSWORD_RESET_DELIVERY_MODE | Yes | log, email, or disabled |
| SMTP_HOST | If email mode | Required when PASSWORD_RESET_DELIVERY_MODE=email |
| SMTP_PORT | If email mode | Required when PASSWORD_RESET_DELIVERY_MODE=email |
| SMTP_USER | If email mode | Required when PASSWORD_RESET_DELIVERY_MODE=email |
| SMTP_PASS | If email mode | Required when PASSWORD_RESET_DELIVERY_MODE=email |
| STRIPE_SECRET_KEY | If Stripe enabled | Required for payment intent creation |
| STRIPE_WEBHOOK_SECRET | If Stripe enabled | Required for webhook signature verification |
| FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON | If push notifications enabled | Required for FCM |
| SENTRY_DSN | Recommended | Enables production error tracking |
| SENTRY_TRACES_SAMPLE_RATE | Recommended | Controls trace volume |
| LOG_FILE_PATH | Recommended | Enables file-backed structured logs for log dashboards |

### Render and Vercel Env Checklist (Neon)

Render backend service (`render.yaml` + Render dashboard):

- Set `DATABASE_URL` to the Neon connection string from `neon env pull` or Neon dashboard.
- Keep `PGSSLMODE=require`.
- Set `FRONTEND_URL` and `CORS_ORIGIN` to the deployed Vercel URL.
- Set runtime secrets on Render: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EMAIL_SECRET`.
- Set optional integration secrets only when used (`SMTP_*`, `STRIPE_*`, `FIREBASE_*`, `SENTRY_DSN`).

Vercel frontend project:

- Set `VITE_API_URL` to the Render backend base URL (for example `https://<service>.onrender.com`).
- Set frontend-only variables such as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` when those integrations are enabled.
- Do not set backend-only secrets on Vercel (`DATABASE_URL`, `JWT_*`, `SMTP_*`, `STRIPE_*`).

### Secret Manager Modes

Local development:

- Use `.env` or `backend/.env`
- Set `SECRET_PROVIDER=env`
- Keep `SECRET_MANAGER_ENABLED=false`

Production and staging on Render:

- Default deployment uses Render-managed environment variables
- Optional secret-manager providers remain supported by application code when required later
- Keep bootstrap/runtime variables in Render environment settings and Vercel project settings

## 5. Release Quality Gates

CI workflow: [.github/workflows/production-hardening.yml](.github/workflows/production-hardening.yml)

Playwright frontend service startup workflow reference:

- [README.md - Playwright Service Runner](README.md#playwright-service-runner)

Blocking gates:

1. npm run lint:prod
2. npm run typecheck
3. npm run monitoring:validate
4. npm test
5. npm run build
6. npm run test:a11y
7. npm run test:lighthouse
8. npm run test:api:newman
9. npm run test:open-handles:smoke

Playwright startup validation in CI:

1. `npm run test:frontend:smoke:ci` starts backend and frontend automatically.
2. The startup runner polls both readiness targets and only then runs Playwright.
3. If either service never becomes healthy, the command fails and blocks the gate.

Failure diagnostics from startup runner:

- Timeout errors include:
   - failing service label (`Backend` or `Frontend`)
   - URL checked
   - timeout duration in milliseconds
   - last probe failure message
- Early-exit errors indicate a service process terminated before healthy state.

Expected warning messages during frontend Playwright checks:

- During anonymous route visits, `/api/favorites` may return 401 and be logged by backend middleware.
- This warning is expected in smoke/a11y public-page coverage and is acceptable when test assertions pass.
- Do not suppress globally unless a targeted filter preserves unexpected 4xx/5xx diagnostics.

Non-blocking legacy lint path:

- npm run lint:legacy (continue-on-error)

Do not deploy to staging or production if any blocking gate fails.

### Open Handle Diagnostics in CI

Default behavior in normal CI runs:

1. Run `npm run test:open-handles:smoke` from the main quality gate job.
2. Download artifact `open-handles-smoke-log` to inspect full output.

Fallback deep diagnostic (manual only):

1. Trigger `.github/workflows/production-hardening.yml` using `workflow_dispatch`.
2. Set input `run_open_handle_fallback=true`.
3. Download artifact `open-handles-force-exit-log` for the force-exit diagnostic run.

Operational note:

- Keep `test:open-handles:smoke:force-exit` as non-default fallback only.

## 6. Database Migration and Seed Policy

Migration runner:

- command: npm run db:migrate

CI seed script:

- command: npm run db:seed:ci

Container startup behavior:

- backend container runs migrations and seed script on start from [backend/Dockerfile](backend/Dockerfile)

Production recommendation:

- run migrations as a controlled pre-deploy step
- disable non-essential seeding in production unless it is strictly idempotent and required
- create and validate DB backup before migrations
- validate secret-manager bootstrap before migrations and seed steps

## 7. Deployment Procedures

### 7.1 Development

1. Install dependencies:
   - npm ci
2. Start backend and frontend together:
   - npm run dev:all
3. Optional local hardening checks:
   - npm run lint:prod
   - npm run typecheck
   - npm test

### 7.2 Staging

1. Ensure all blocking CI gates passed on the release commit.
2. Populate staging secrets and env values.
   - prefer secret manager references over plaintext runtime secrets
3. Pull release code.
4. Deploy backend to Render and frontend to Vercel.
5. Verify service health:
   - backend: GET /health/live and /health/ready
   - frontend: GET /healthz
6. Run regression:
   - npm run test:api:newman
7. Run smoke checks for login, booking, payment, and provider verification.
8. If using the optional local parity stack, verify monitoring services:
   - Prometheus target is up
   - Grafana dashboard loads
   - Loki log stream is receiving backend logs
   - Alertmanager route is healthy

### 7.3 Production

1. Confirm staging sign-off and CI gate pass for target commit.
2. Create pre-deploy database backup.
3. Validate Render backend domain, Vercel frontend domain, and HTTPS behavior.
4. Put deployment window banner/notice in place if needed.
4. Deploy backend on Render and frontend on Vercel.
5. Verify liveness/readiness and key API flows.
6. Verify metrics endpoint and dashboards.
7. Monitor error rate, latency, and booking/payment success for at least 30 minutes.
8. Confirm log ingestion and alert routing.

Environment verification commands:

- Development: `npm run verify:development`
- Staging: `npm run verify:staging`
- Production: `npm run verify:production`

Verifier result interpretation:

- `PASS`: environment is reachable and core endpoints are connected correctly
- `BLOCKED`: the Vercel or Render environment is not live yet or its routes are not fully provisioned
- `FAIL`: deployed environment is reachable but a required endpoint or integration is broken

## 8. Backup and Restore

### 8.1 Backup

Use pg_dump before schema or app changes:

- pg_dump --format=custom --no-owner --file servigo_predeploy.dump "$DATABASE_URL"

Optional plain SQL backup:

- pg_dump --format=plain --no-owner --file servigo_predeploy.sql "$DATABASE_URL"

Store backup artifacts in secure, access-controlled storage.

### 8.2 Restore

Custom format restore:

1. Drop and recreate target database (or restore to a recovery DB first).
2. Run:
   - pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URL" servigo_predeploy.dump

Plain SQL restore:

- psql "$DATABASE_URL" -f servigo_predeploy.sql

After restore, restart backend and verify:

- /health/ready
- critical API smoke tests

## 9. Rollback Strategy

### 9.1 Application Rollback

1. Identify previous known-good image/tag.
2. Redeploy previous frontend and backend images.
3. Validate health endpoints and smoke tests.

### 9.2 Database Rollback

If a migration is not backward compatible:

1. Stop write traffic if needed.
2. Restore from pre-deploy backup.
3. Redeploy previous application version.
4. Validate critical flows before reopening traffic.

### 9.3 Decision Rules

Trigger rollback when any of the following occur and cannot be mitigated quickly:

- sustained readiness failures
- payment or booking critical path failure
- elevated 5xx rate above SLO threshold
- data integrity regressions

## 10. Post-Deploy Verification Checklist

Execute all checks and record results:

1. Health endpoints return success.
2. Authentication works for client/provider/admin.
3. Service search and provider listing return expected data.
4. Booking create and status transition work.
5. Payment intent creation and webhook processing work.
6. Invoice PDF endpoint is reachable for valid payment.
7. Provider verification document upload works.
8. Notification retrieval and unread counts work.
9. Accessibility checks pass on key pages.
10. Metrics endpoint returns Prometheus payload.
11. Prometheus shows healthy backend scrape target.
12. Grafana dashboard shows request rate, latency, error rate, and log stream.
13. Alertmanager receives and routes a test alert.
14. Sentry receives a controlled validation exception when DSN is configured.

### 10.1 Deferred Scope Notes (Current Cycle)

- Decision: Payment validation is intentionally deferred for this cycle.
- Scope impact: Checklist items 5 and 6 are treated as `SKIPPED` for current sign-off.
- Rationale: Product direction changed payment gateway path and payment flow is not part of this release acceptance gate.
- Tracking artifacts:
   - `PAYMENT_P1_DEFECT_REPORT.md`
   - `PHASE2_UI_E2E_EXECUTION_SHEET.md`
- Re-entry criteria (next cycle):
   1. Finalize active payment gateway implementation.
   2. Validate checkout/intent and webhook/callback flow end-to-end.
   3. Re-run checklist items 5 and 6 with evidence.

## 11. Operational Notes and Known Caveats

- Local Windows Lighthouse runs may fail with EPERM during temp-file cleanup; treat as environment-specific if CI Linux passes.
- ENFORCE_HTTPS should be enabled only when TLS termination and trusted proxy headers are correctly configured.
- Secrets must not be committed in repository files; use deployment secret stores.
- Render and Vercel handle public HTTPS automatically in the hosted deployment path.

## 12. Ownership and Escalation

- Backend API owner: ServiGo backend maintainers
- Frontend owner: ServiGo frontend maintainers
- Database owner: Platform or DBA on-call

During incidents, capture:

- failing endpoint
- deploy version and timestamp
- recent migration identifiers
- rollback or hotfix decision and rationale

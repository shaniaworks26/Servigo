# ServiGo

ServiGo is a responsive React booking platform prototype built with JavaScript, HTML, and CSS.

## Features

- React Router navigation between 20 app screens
- Responsive layout for phones, tablets, and desktops
- Reusable UI components and organized project structure
- Dummy services and provider data for demonstration

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the URL shown by Vite (usually `http://localhost:5173`).

Frontend runtime environment for API calls:

- `VITE_API_URL`
   - Example local: `http://127.0.0.1:5005`
   - Example hosted: `https://your-render-service.onrender.com`

## Project Structure

- `src/`
  - `assets/` — placeholder images and icons
  - `components/` — reusable layout and UI components
  - `pages/` — screen components for routes
  - `styles/` — global styles and shared CSS files
  - `services/` — dummy data and helper services
  - `hooks/` — reusable custom hooks
  - `utils/` — utility functions
  - `App.jsx` — route configuration
  - `main.jsx` — application entry point

## Database Setup

This project now includes PostgreSQL database assets for the backend.

1. Copy [.env.example](.env.example) to .env.
2. Paste your Supabase PostgreSQL Connection Pooler URI into the `DATABASE_URL` value in `.env`.
3. Keep `PGSSLMODE=require` for Supabase TLS.
4. Run migrations:
   ```bash
   npm run db:migrate
   ```
5. If you want to install runtime dependencies, run:
   ```bash
   npm install
   ```

## Notes

This project is a functional frontend prototype with a pg-backed backend runtime wired for Neon PostgreSQL.

## Production Hardening Commands

- Lint
   - `npm run lint`
- Backend tests
   - `npm test`
- Build
   - `npm run build`
- Accessibility audit (axe + Playwright)
   - `npm run test:a11y`
- Frontend QA (accessibility + responsive checks)
   - `npm run test:frontend:qa`
   - `npm run test:frontend:qa:ci` (starts backend + frontend, then runs Playwright)
- Frontend smoke flow validation
   - `npm run test:frontend:smoke`
   - `npm run test:frontend:smoke:ci` (starts backend + frontend, then runs Playwright)
- Lighthouse CI assertions
   - `npm run test:lighthouse`
- API regression (starts backend, runs migrations/seed, executes Newman)
   - `npm run test:api:newman`
- Development environment verification
   - `npm run verify:development`
- Staging environment verification
   - `npm run verify:staging`
- Production environment verification
   - `npm run verify:production`
- Predeploy Render env guard (production profile)
   - `npm run predeploy:check-env`
- Predeploy Render env guard (staging profile)
   - `npm run predeploy:check-env:staging`

## Playwright Service Runner

Frontend Playwright scripts use a shared startup runner at [scripts/testing/run-playwright-with-services.mjs](scripts/testing/run-playwright-with-services.mjs).

What it does automatically:

- Starts backend with `npm run backend:ci`.
- Starts frontend with `npm run preview -- --host 127.0.0.1 --port 4173`.
- Polls both endpoints until healthy:
   - Backend: `http://127.0.0.1:5005/health/ready`
   - Frontend: `http://127.0.0.1:4173`
- Runs Playwright only after both services are healthy.
- Stops both services when tests finish (or on failure/interruption).

Environment variables:

- `PW_BACKEND_HEALTH_URL`
   - Override backend health URL.
   - Default: `http://127.0.0.1:5005/health/ready`
- `PW_FRONTEND_HEALTH_URL`
   - Override frontend health URL.
   - Default: `http://127.0.0.1:4173`
- `PW_STARTUP_TIMEOUT_MS`
   - Max wait time for service startup before failing.
   - Default: `180000`
- `PW_POLL_INTERVAL_MS`
   - Poll interval for health checks.
   - Default: `1500`

Local workflow commands:

- Smoke suite with managed startup:
   - `npm run test:frontend:smoke:ci`
- Playwright a11y/responsive suite with managed startup:
   - `npm run test:frontend:a11y:ci`

Health-gated execution behavior:

- The runner starts backend and frontend first.
- It polls both health URLs until both return successful responses.
- Playwright starts only after both health checks pass.
- If startup fails or times out, tests do not start.

Startup failure validation (negative test):

- PowerShell example:
   - `$env:PW_BACKEND_HEALTH_URL='http://127.0.0.1:5999/health/ready'; npm run test:frontend:smoke:ci; Remove-Item Env:PW_BACKEND_HEALTH_URL`
- Expected result:
   - command exits non-zero
   - error includes failing service (`Backend`), checked URL, and timeout duration in milliseconds

Troubleshooting:

- Timeout waiting for backend health:
   - verify Postgres is reachable
   - verify backend migration/seed scripts completed
   - check `PW_BACKEND_HEALTH_URL` value
- Timeout waiting for frontend health:
   - verify no startup errors from `npm run preview`
   - check `PW_FRONTEND_HEALTH_URL` value
- Port already in use:
   - runner attempts to reclaim ports 5005 and 4173 before startup
   - if port conflicts continue, stop unrelated local services and retry
- Expected warning noise during public-page smoke tests:
   - unauthenticated requests to `/api/favorites` may produce 401 logs
   - these are expected for anonymous page loads and are not test failures

## CI/CD and Deployment Assets

- Official hosted deployment stack
   - Frontend: Vercel via [vercel.json](vercel.json)
   - Backend runtime: Render via [render.yaml](render.yaml)
   - Database: Neon PostgreSQL (configure `DATABASE_URL` on Render)
- GitHub Actions production gates
   - [.github/workflows/production-hardening.yml](.github/workflows/production-hardening.yml)
- Backend container build/runtime
   - [backend/Dockerfile](backend/Dockerfile)
- Frontend container build/runtime
   - [Dockerfile](Dockerfile)
- Optional local production-parity stack
   - [docker-compose.production.yml](docker-compose.production.yml)
- Deployment runbook (dev/staging/prod, backup/restore, rollback)
   - [DEPLOYMENT_RUNBOOK.md](DEPLOYMENT_RUNBOOK.md)

## Production Security and Monitoring

- Secret-manager capable runtime bootstrap
   - [backend/config/runtimeSecrets.js](backend/config/runtimeSecrets.js)
- Secure reverse proxy with automatic HTTPS support
   - [docker/Caddyfile](docker/Caddyfile)
- Metrics, alerting, dashboards, and logs
   - [docker/prometheus.yml](docker/prometheus.yml)
   - [docker/alerts.yml](docker/alerts.yml)
   - [docker/alertmanager.yml](docker/alertmanager.yml)
   - [docker/grafana-servigo-dashboard.json](docker/grafana-servigo-dashboard.json)
   - [docker/loki-config.yml](docker/loki-config.yml)
   - [docker/promtail-config.yml](docker/promtail-config.yml)
- Error tracking
   - [backend/services/sentryService.js](backend/services/sentryService.js)

## Hosted Deployment Target

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Local Production Stack Quick Start

1. Build and start all services:
    ```bash
    docker compose -f docker-compose.production.yml up --build
    ```
2. Frontend endpoint:
   - https://localhost
3. Backend health/readiness:
   - https://localhost/health/live
   - https://localhost/health/ready
4. Monitoring endpoints:
   - Prometheus: http://localhost:9090
   - Grafana: http://localhost:3000

## Audit Report

- Full hardening audit report:
   - [PRODUCTION_HARDENING_AUDIT_REPORT.md](PRODUCTION_HARDENING_AUDIT_REPORT.md)

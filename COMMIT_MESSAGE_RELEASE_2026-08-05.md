Subject:
chore(release): harden deploy gates and finalize Neon/Render/Vercel production flow

Body:
- add deployment configs and env templates for hosted stack:
  - add render.yaml
  - add/refresh .env.example
  - update DEPLOYMENT_RUNBOOK.md and README.md for Neon + Render/Vercel env mapping

- harden runtime/database/deploy verification paths:
  - add backend/scripts/predeploy-env-check.mjs
  - add backend/scripts/verify-environment.mjs
  - add backend/scripts/run-migrations.mjs
  - add backend/scripts/seed-ci-data.mjs
  - enforce DATABASE_URL requirement for production-like migration/seed paths

- make local quality gates match CI blocking behavior:
  - update scripts/testing/run-monitoring-validate-if-available.mjs to fail when required files are missing
  - update scripts/testing/run-newman-if-available.mjs to fail when required files are missing
  - add required monitoring/api files so strict gates can pass:
    - backend/scripts/validate-monitoring.mjs
    - backend/config/runtimeSecrets.js
    - backend/services/metricsService.js
    - scripts/api/run-newman.mjs
    - docker/alerts.yml

- unblock eslint v9:
  - add eslint.config.js flat config

- production deployment validation completed:
  - Render deploy: dep-d9pv3gfavr4c73affidg
  - Vercel production deploy: servigo-jb34cm8ya-shaniachin123-7660s-projects.vercel.app
  - verify:production passed using
    - frontend: https://servigo-olive.vercel.app
    - backend: https://servigo-3y0z.onrender.com

Suggested commit command (focused to release hardening scope):

git add .gitignore DEPLOYMENT_RUNBOOK.md README.md package.json package-lock.json render.yaml .env.example eslint.config.js backend/config/database.js backend/config/runtimeSecrets.js backend/scripts/predeploy-env-check.mjs backend/scripts/run-migrations.mjs backend/scripts/seed-ci-data.mjs backend/scripts/validate-monitoring.mjs backend/scripts/verify-environment.mjs backend/services/metricsService.js scripts/testing/run-a11y-if-available.mjs scripts/testing/run-backend-ci-if-available.mjs scripts/testing/run-build-if-available.mjs scripts/testing/run-lighthouse-if-available.mjs scripts/testing/run-monitoring-validate-if-available.mjs scripts/testing/run-newman-if-available.mjs scripts/testing/run-playwright-with-services.mjs scripts/api/run-newman.mjs docker/alerts.yml RELEASE_RECORD_2026-08-05.md COMMIT_MESSAGE_RELEASE_2026-08-05.md

git commit -m "chore(release): harden deploy gates and finalize Neon/Render/Vercel production flow"

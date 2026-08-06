# Playwright Startup Reliability and CI Hardening

## Summary
Implemented a deterministic Playwright startup workflow that starts backend and frontend services, health-gates test start, handles port conflicts, and guarantees teardown on exit/failure. CI frontend Playwright gates now run through the same startup orchestrator.

## Completed Work
- Routed frontend Playwright scripts to managed startup runner in package.json.
- Removed conflicting Playwright-managed startup and retained base URL in playwright.config.js.
- Added startup orchestration, health polling, port reclamation, and teardown logic in scripts/testing/run-playwright-with-services.mjs.
- Added local usage, negative validation, and troubleshooting docs in README.md.
- Added deployment runbook startup diagnostics and warning expectations in DEPLOYMENT_RUNBOOK.md.
- Added CI frontend a11y/responsive Playwright gate alongside smoke in .github/workflows/production-hardening.yml.

## Validation Results
- npm run test:frontend:smoke:ci: PASS (3 passed)
- npm run test:frontend:a11y:ci: PASS (10 passed)
- Negative startup validation (invalid backend health URL): FAIL as expected with actionable timeout diagnostics and non-zero exit.

## CI Results
- Branch push successful.
- Workflow trigger requires pull_request or push to main/master.

## Files Changed
- .github/workflows/production-hardening.yml
- DEPLOYMENT_RUNBOOK.md
- README.md
- package.json
- playwright.config.js
- scripts/testing/run-playwright-with-services.mjs

## Known Issues and Notes
- Expected 401 log noise for anonymous /api/favorites access during public-page smoke/a11y checks remains acceptable and documented.
- GitHub CLI web auth has intermittently timed out in this environment; git push auth is confirmed working.

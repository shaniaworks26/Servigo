# ServiGo Release Record

Date: 2026-08-05
Branch: render-deploy-fix
Source Commit (before final commit): df1104828

## Deployment Targets

- Backend (Render): https://servigo-3y0z.onrender.com
- Frontend (Vercel canonical alias): https://servigo-olive.vercel.app
- Frontend (team alias): https://servigo-shaniachin123-7660s-projects.vercel.app

## Deployments Executed

### Render

- Service: Servigo
- Service ID: srv-d9pqubegekts73a3do80
- Triggered action: Manual Deploy -> Deploy latest commit
- Deploy page: https://dashboard.render.com/web/srv-d9pqubegekts73a3do80/deploys/dep-d9pv3gfavr4c73affidg
- Deploy ID: dep-d9pv3gfavr4c73affidg

### Vercel

- CLI: vercel@latest (58.7.1)
- Team: shaniachin123-7660s-projects
- Project: servigo
- Production deployment URL: https://servigo-jb34cm8ya-shaniachin123-7660s-projects.vercel.app
- Inspect URL: https://vercel.com/shaniachin123-7660s-projects/servigo/565ooxdMdHKcbbsGkbfowQyJuFEA
- Production alias applied: https://servigo-olive.vercel.app

## Verification Results

### Production verification command

npm run verify:production -- --frontend-url https://servigo-olive.vercel.app --backend-url https://servigo-3y0z.onrender.com

### Result

- backend-ping: PASS
- backend-live: PASS
- backend-ready: PASS
- frontend-root: PASS
- overall: PASS

### Staging-quality release gate chain executed locally

npm run lint; npm run typecheck; npm test; npm run build; npm run monitoring:validate; npm run test:api:newman; npm run verify:staging -- --frontend-url https://servigo.vercel.app --backend-url https://servigo-3y0z.onrender.com

Result: PASS

## Go/No-Go

GO

## Rollback Checkpoint

- Current Render deploy: dep-d9pv3gfavr4c73affidg
- Current Vercel production deploy: servigo-jb34cm8ya-shaniachin123-7660s-projects.vercel.app
- Keep previous known-good Vercel production deployment handy:
  - https://servigo-o955gsbu8-shaniachin123-7660s-projects.vercel.app

## Notes

- Use npm (not pm) for script execution.
- Use vercel@latest for login/deploy flows.
- Render free tier can cold start; verify script now retries with longer timeout in non-development environments.

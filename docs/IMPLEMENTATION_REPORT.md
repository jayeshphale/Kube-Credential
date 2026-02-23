# Implementation Report — Kube Credential

This document summarizes the implementation work, recent fixes, and current status of the Kube Credential project.

Overview of work performed
-------------------------
- Verified and hardened both backend services (`issuance-service`, `verification-service`) to be testable and container-friendly.
- Implemented a small React + Vite frontend that calls backend APIs and surfaces clear errors to the user.
- Added production-focused fixes: Vercel rewrites, Vite build script adjustments, Dockerfile fixes, and sqlite3 rebuild steps for container portability.

Chronological highlights
-----------------------
1) Repo inspection

- Located the two services and the frontend; identified missing or fragile build/deploy steps affecting Docker and Vercel.

2) Backend changes & verification

- Exported `app` in each service to support tests and programmatic imports.
- Made DB path configurable; tests use in-memory SQLite when `NODE_ENV=test`.
- Added `VERIFICATION_URL` usage in `issuance-service` to enable issuance→verification syncs; default kept for local dev.
- Confirmed persistence: I inspected the running `issuance` container and verified rows are written to `issuance.db`.
- Improved logging around verification sync attempts so failed syncs are visible in logs.

3) Frontend changes

- Built a Vite React frontend with two pages: Issue and Verify.
- `frontend/src/config.ts` now reads `VITE_` env vars and falls back to `/api/*` proxy paths.
- Fixed Vercel build issue by invoking Vite via Node in `package.json` scripts.

4) Container & build fixes

- Dockerfiles:
  - Added `npm rebuild sqlite3 --build-from-source || true` in Dockerfiles to avoid cross-arch sqlite binary issues.
  - Fixed `issuance-service/Dockerfile` `EXPOSE` to `5000` (previously `6000`).
- Created `frontend/vercel.json` (and project root `vercel.json`) to rewrite `/api/issuance` & `/api/verification` to the EC2 host to avoid mixed-content issues.

5) Tests

- Backend tests are present (Jest + ts-jest + Supertest). They run using in-memory DBs for fast CI-friendly runs.

Files added/modified (selected)
--------------------------------
- `frontend/` — Vite React app, `src/pages/IssuePage.tsx`, `src/pages/VerifyPage.tsx`, `src/config.ts`, `vercel.json`, `.env.example`.
- `issuance-service/` — exported `app`, tests, `Dockerfile` fix (EXPOSE 5000), DB config.
- `verification-service/` — exported `app`, tests, `Dockerfile` sqlite3 rebuild.
- `vercel.json` and `frontend/vercel.json` — rewrites to EC2 backend.
- `README.md` — full project README (added). 

Current status vs assignment requirements
----------------------------------------

- Backend services: implemented, containerized, and persisting data (SQLite). Verified by querying `issuance.db` inside the running container.
- Frontend: implemented, issues and verifies credentials locally. Vercel deployment requires redeploy to pick up rewrites and env changes.
- Docker: images build; Dockerfiles updated to address sqlite3 and port issues. Rebuild and redeploy recommended after pushing fixes.
- Kubernetes: `k8s/` manifests present (Deployments/Services); deployment instructions can be expanded.
- Tests: unit tests for both backends exist and run locally.

Recent fixes you should be aware of
----------------------------------
- `issuance-service/Dockerfile`: corrected `EXPOSE 5000`.
- `frontend/package.json`: run Vite via Node to avoid permission errors on Vercel.
- `vercel.json` (root + `frontend/`): rewrites added so frontend can call `/api/*` and Vercel proxies to `http://3.111.213.132:5000` and `http://3.111.213.132:6000`.
- Added `frontend/.env` example and fallback logic in `frontend/src/config.ts` to use `/api/*` when built on Vercel.

Outstanding items & recommended next steps
----------------------------------------
1. Rebuild and redeploy backend containers on EC2 with the fixed Dockerfile and correct `VERIFICATION_URL` environment variable.

```bash
# Example run on EC2
docker stop issuance verification || true
docker rm issuance verification || true
docker build -t issuance-service:latest ./issuance-service
docker build -t verification-service:latest ./verification-service
docker run -d --name verification -p 6000:6000 verification-service:latest
docker run -d --name issuance -p 5000:5000 -e VERIFICATION_URL='http://3.111.213.132:6000/verify/internal/store' issuance-service:latest
```

2. Push frontend changes and redeploy on Vercel (ensure Project Root is `frontend` if using `frontend/vercel.json`). Redeploy via Dashboard or `vercel --prod`.

3. Verify end-to-end:

```bash
# Test via Vercel proxy
curl -v -X POST https://kube-credential-three.vercel.app/api/issuance/issue -H "Content-Type: application/json" -d '{"id":"e2e-1","name":"E2E Tester","course":"K8s"}'

# Check issuance container DB for the new row
docker exec -it issuance node -e "const sqlite3=require('sqlite3').verbose();const db=new sqlite3.Database('./issuance.db');db.all('SELECT * FROM credentials',(e,r)=>{console.log(e||r);db.close();})"
```

4. Add CI to run tests and build images (recommended).

5. Finalize documentation: add `DEPLOYMENT.md` with step-by-step EC2/K8s/Vercel instructions and include screenshots in `docs/screenshots/`.

Summary
-------
The project meets the core assignment goals: two backend microservices and a frontend that issues and verifies JSON credentials. Most issues encountered were operational (Dockerfile ports, native sqlite3 binaries, Vercel build/permission and proxy configuration). Those have been fixed in the repository; the remaining steps are a rebuild/redeploy of containers on EC2 and a frontend redeploy on Vercel to activate rewrites and env settings.

If you'd like, I will now:
- Create `DEPLOYMENT.md` with full copy-paste commands for EC2 and Kubernetes, and add a small CI workflow to run tests on push.
- Produce the submission ZIP excluding `node_modules`.

Regards,
Jayesh Phale


# Kube Credential

This project implements a small credential issuance and verification system with two Node.js (TypeScript) microservices and a simple React (TypeScript) frontend.

Architecture
- `issuance-service`: issues credentials, persists to `issuance.db`, and forwards a copy to verification service.
- `verification-service`: stores credentials and verifies them.
- `frontend/`: simple React app with two pages: Issue and Verify.

Assumptions
- Worker identification uses the pod name available in `HOSTNAME`. In Kubernetes the pod's name will appear as `worker-n` if you name pods accordingly.
- Local dev: services run on ports `5000` (issuance) and `6000` (verification). Frontend runs on port `3000`.

Run locally (dev)

Start the backend services (from each service folder):

```bash
cd issuance-service
npm install
npm run dev

cd ../verification-service
npm install
npm run dev
```

Start frontend:

```bash
cd frontend
npm install
npm run dev
```

Docker & Kubernetes
- Docker build the services (examples):

```bash
docker build -t issuance-service:latest ./issuance-service
docker build -t verification-service:latest ./verification-service
```

# Kube Credential

This repository implements a credential issuance and verification system composed of two TypeScript Node.js microservices and a React TypeScript frontend. The project is structured to meet the assignment requirements for the Kube Credential task.

## Contents
- `issuance-service/` — Node.js + TypeScript Issuance API (SQLite persistence)
- `verification-service/` — Node.js + TypeScript Verification API (SQLite persistence)
- `frontend/` — React (TypeScript) frontend with Issue and Verify pages
- `k8s/` — Kubernetes manifests (Deployments + Services)
- `docs/` — placeholder for screenshots and other submission assets
- `IMPLEMENTATION_REPORT.md` — detailed log of changes and status
- `AWS_DEPLOYMENT.md` — concise AWS free-tier deployment guidance

## Assignment mapping and status
This project implements the assignment objectives as follows:

- Node.js (TypeScript) APIs and Dockerfiles: Dockerfiles are present for both services. (Cloud hosting not performed in-repo.)
- Two microservices (Issuance, Verification): Implemented in `issuance-service` and `verification-service`.
- Frontend pages (Issue, Verify): Implemented in `frontend/src/pages`.
- Independent scalability: Kubernetes `Deployment` manifests are included in `k8s/`.
- JSON-based endpoints: Both APIs accept JSON and return JSON.
- Issuance behavior: Issues credential; returns `{ message: "credential already issued" }` for duplicates and `credential issued by worker-<id>` on success.
- Verification behavior: Verifies credential and returns `{ valid: true, verifiedBy, timestamp }` when credential exists.
- Persistence: Both services use SQLite files; tests use in-memory DB for isolation.
- Error handling and UI feedback: Frontend shows HTTP status and network error hints; responsive UI.
- Unit tests: Jest + supertest tests for backend services are included.
- Kubernetes manifests: Deployments and Services included. Ingress is optional and not provided.

## Run locally

1. Start verification service
```powershell
cd verification-service
npm install
npm run dev
```

2. Start issuance service (point to local verification)
```powershell
$env:VERIFICATION_URL='http://localhost:6000/verify/internal/store'
cd issuance-service
npm install
npm run dev
```

3. Start frontend (Vite will proxy `/issue` and `/verify` to the backends)
```powershell
cd frontend
npm install
npm run dev
# open the printed Local URL in the terminal
```

## Tests
Run backend unit tests:
```bash
cd issuance-service && npm test
cd ../verification-service && npm test
```

## Hosted URLs (placeholders)
- Frontend (hosted): https://<your-frontend-host>
- Issuance API (hosted): https://<issuance-host>/issue
- Verification API (hosted): https://<verification-host>/verify

## Submission bundle
I will produce a ZIP suitable for submission that includes the required folders and files (excluding `node_modules`). The ZIP will contain:

- `frontend/`
- `issuance-service/`
- `verification-service/`
- `k8s/`
- `docs/` (screenshots placeholder)
- `README.md`, `IMPLEMENTATION_REPORT.md`, `AWS_DEPLOYMENT.md`

## Next steps and recommendations
- Add frontend unit tests (React Testing Library + Jest).
- Add Kubernetes Ingress manifest and TLS for production deployments.
- Capture screenshots in `docs/screenshots/` and add them to the submission ZIP.
- Deploy images to a container registry and update `k8s` manifests with image references for cloud deployment.

---

If you'd like, I'll now assemble the submission ZIP (excluding `node_modules`), place it at `d:/kube-credential/kube-credential-submission.zip`, and add screenshots if you provide them or I can create placeholder images. After that I can provide a short AWS free-tier deployment guide (already included in `AWS_DEPLOYMENT.md`).

# Kube Credential

A simple credential issuance and verification system implemented as two Node.js (TypeScript) microservices with a React (TypeScript) frontend. This project meets the requirements for the AtoZ Demand Gen Kube Credential assignment.

## Project Overview

Kube Credential is a microservice-based application that allows:
- Issuing credentials to users.
- Verifying credentials already issued.

It demonstrates backend API development, frontend integration, containerization, and Kubernetes deployment.

## Architecture

- **issuance-service**: Issues credentials, persists them in issuance.db, and forwards a copy to verification service.
- **verification-service**: Stores credentials and handles verification requests.
- **frontend/**: React (TypeScript) frontend with two pages:
  - **Issue Page**: Submit and issue credentials.
  - **Verify Page**: Verify credentials using JSON input.

## Assumptions

- Worker identification uses `HOSTNAME`. Pods named `worker-n` will return `worker-<n>`.
- Local development uses:
  - Issuance API: `http://localhost:5000`
  - Verification API: `http://localhost:6000`
  - Frontend: `http://localhost:3000`

## Project Structure
# Kube Credential

A simple credential issuance and verification system implemented as two Node.js (TypeScript) microservices with a React (TypeScript) frontend. This project meets the requirements for the AtoZ Demand Gen Kube Credential assignment.

## Project Overview

Kube Credential is a microservice-based application that allows:
- Issuing credentials to users.
- Verifying credentials already issued.

It demonstrates backend API development, frontend integration, containerization, and Kubernetes deployment.

## Architecture

- **issuance-service**: Issues credentials, persists them in issuance.db, and forwards a copy to verification service.
- **verification-service**: Stores credentials and handles verification requests.
- **frontend/**: React (TypeScript) frontend with two pages:
  - **Issue Page**: Submit and issue credentials.
  - **Verify Page**: Verify credentials using JSON input.

## Assumptions

- Worker identification uses `HOSTNAME`. Pods named `worker-n` will return `worker-<n>`.
- Local development uses:
  - Issuance API: `http://localhost:5000`
  - Verification API: `http://localhost:6000`
  - Frontend: `http://localhost:3000`

## Project Structure
kube-credential/
│
├─ issuance-service/ # Node.js TypeScript issuance microservice
├─ verification-service/ # Node.js TypeScript verification microservice
├─ frontend/ # React TypeScript frontend
├─ k8s/ # Kubernetes manifests (Deployments + Services)
├─ docs/ # Screenshots and documentation
└─ README.md # This file


## Assignment Mapping

- Node.js (TypeScript) backend APIs: Implemented in issuance-service and verification-service
- Docker containerization: Dockerfiles included for both services
- Two microservices (Issuance & Verification): Implemented
- Frontend pages (Issue & Verify): Implemented in React/TypeScript
- Independent scalability: Kubernetes Deployment manifests included
- JSON-based endpoints: Both APIs accept JSON
- Issuance behavior: Returns success or "already issued" message + worker ID
- Verification behavior: Returns credential validity, worker ID, timestamp
- Persistence: SQLite DB for each service; in-memory DB for unit tests
- Error handling & UI feedback: Frontend shows status & network errors
- Unit tests: Jest + supertest for both services
- Kubernetes manifests: Deployment and Services included. Ingress optional

## Local Development

### Start Backend Services

**Verification Service:**
```powershell
cd verification-service
npm install
npm run dev

Issuance Service (point to verification):

$env:VERIFICATION_URL='http://localhost:6000/verify/internal/store'
cd issuance-service
npm install
npm run dev

Start Frontend
cd frontend
npm install
npm run dev
# Open the printed URL in terminal (usually http://localhost:3000)
Unit Tests

Run tests for backend services:

cd issuance-service
npm test

cd ../verification-service
npm test

Tests cover credential issuance, duplicate handling, and verification flows.

Docker & Kubernetes
Build Docker Images
docker build -t issuance-service:latest ./issuance-service
docker build -t verification-service:latest ./verification-service
Kubernetes Manifests

k8s/issuance-deployment.yaml

k8s/verification-deployment.yaml

k8s/services.yaml

Ingress is optional and not included.

Hosted URLs (Optional)

- Frontend (deployed): https://kube-credential-three.vercel.app/

- Issuance API: https://<issuance-host>/issue

- Verification API: https://<verification-host>/verify

Submission Bundle

The submission ZIP will include (excluding node_modules):

frontend/

issuance-service/

verification-service/

k8s/

docs/ (screenshots)

README.md

## Deploying Frontend to Vercel (with backend on EC2)

1. In `frontend/src/config.ts` the app reads two Vite environment variables:

- `VITE_ISSUANCE_URL` — full URL for the issuance API (e.g. `http://3.111.213.132:5000`)
- `VITE_VERIFICATION_URL` — full URL for the verification API (e.g. `http://3.111.213.132:6000`)

2. On Vercel, set the Environment Variables (Project Settings → Environment Variables):

- `VITE_ISSUANCE_URL` = `http://<EC2_IP>:5000`
- `VITE_VERIFICATION_URL` = `http://<EC2_IP>:6000`

3. Build & deploy: Vercel will include the `VITE_` variables at build time and the frontend will call the backend using those URLs.

Notes:
- Ensure your EC2 instance accepts inbound traffic on the API ports (5000 and 6000) and that security groups allow Vercel's requests.
- For HTTPS in production, consider terminating TLS at a load balancer (ELB) and using secure backend URLs.

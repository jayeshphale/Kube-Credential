# AWS Free-Tier Deployment Guide (Concise)

This guide covers a simple path to deploy the services and frontend using AWS free-tier friendly options. It assumes you have an AWS account and AWS CLI configured.

Overview
- Build Docker images for `issuance-service` and `verification-service` and push to Amazon ECR.
- Deploy the services to a small EKS cluster or use ECS Fargate for a simpler setup. For reviewers, ECS/Fargate is quicker and lower maintenance.
- Serve the frontend via Vercel/Netlify (free-tier) or an S3 static site + CloudFront.

Steps (ECR + ECS Fargate)

1) Build and push images to ECR

```bash
# Create ECR repos (one-time)
aws ecr create-repository --repository-name issuance-service
aws ecr create-repository --repository-name verification-service

# Authenticate Docker to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com

# Build and push
docker build -t issuance-service:latest ./issuance-service
docker tag issuance-service:latest <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/issuance-service:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/issuance-service:latest

docker build -t verification-service:latest ./verification-service
docker tag verification-service:latest <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/verification-service:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<region>.amazonaws.com/verification-service:latest
```

2) Deploy with ECS Fargate (quick)

- Use the ECS console to create a cluster (Networking only / Fargate).
- Create Task Definitions for each service referencing the pushed ECR images. Set container ports 5000 and 6000 respectively. Configure environment variable `VERIFICATION_URL` for the issuance task to point to the verification task (use service discovery or internal ALB URL).
- Create Services for each Task Definition (desired count >=1). Attach to an Application Load Balancer (ALB) for routing.

3) Frontend hosting

- Build frontend: `npm run build` in `frontend/`.
- Deploy build directory to Netlify/Vercel for free hosting, or upload to S3 + CloudFront.

Notes and tips
- For reviewers who want a very simple demonstration, you can run services locally and expose using `ngrok` and point frontend to those URLs.
- EKS is more involved and may exceed the free-tier complexity; ECS/Fargate + ALB is simpler for a small demo.

# 🎓 Student Help Desk — Kubernetes Full-Stack Deployment

![Java](https://img.shields.io/badge/Java-17-007396?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-Latest-61DAFB?style=flat&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Manifests-326CE5?style=flat&logo=kubernetes&logoColor=white)

A full-stack CRUD web application for managing student help requests, built as a hands-on Kubernetes deployment project. The application demonstrates containerisation, orchestration, persistent storage, secrets management, and traffic routing using industry-standard tooling.


## Overview

The **Student Help Desk** is a CRUD web application that allows students to submit help requests and staff to manage them. The project is designed as a hands-on Kubernetes learning exercise, demonstrating real-world concepts including:

- Multi-container Kubernetes deployments
- Kubernetes Services (ClusterIP & LoadBalancer)
- ConfigMaps and Secrets for configuration management
- PersistentVolumes and PersistentVolumeClaims for stateful database storage
- NGINX Ingress routing for a single-entry-point architecture
- Liveness and Readiness health probes
- Resource requests and limits

---

## Tech Stack

| Layer       | Technology                          | Version         |
|-------------|-------------------------------------|-----------------|
| Frontend    | React + Vite + Axios                | React latest    |
| Backend     | Spring Boot (REST API)              | 3.3.5           |
| Language    | Java                                | 17              |
| Database    | MySQL                               | 8               |
| Build Tool  | Maven                               | (Spring wrapper)|
| Container   | Docker                              | —               |
| Orchestration | Kubernetes (Docker Desktop)       | —               |
| Ingress     | NGINX Ingress Controller            | —               |

---

## Architecture

```
                        ┌──────────────────────────────────────────────┐
                        │              Kubernetes Cluster               │
                        │          (Docker Desktop — localhost)         │
                        │                                               │
  Browser               │  ┌──────────────────────────────────────┐    │
  http://localhost ─────┼──► NGINX Ingress (helpdesk-ingress)      │    │
                        │  │  host: localhost                      │    │
                        │  │  /       → helpdesk-frontend svc:80   │    │
                        │  │  /api    → helpdesk-backend  svc:8080 │    │
                        │  └──────────────────────────────────────┘    │
                        │         │                    │                │
                        │         ▼                    ▼                │
                        │  ┌─────────────┐    ┌──────────────────┐     │
                        │  │  Frontend   │    │    Backend       │     │
                        │  │  Deployment │    │    Deployment    │     │
                        │  │  (React)    │    │  (Spring Boot)   │     │
                        │  │  Port 5173  │    │    Port 8080     │     │
                        │  └─────────────┘    └──────────────────┘     │
                        │   LoadBalancer              ClusterIP         │
                        │    svc:80→5173            svc:8080→8080      │
                        │                                │              │
                        │                               ▼              │
                        │                   ┌──────────────────────┐   │
                        │                   │   MySQL Deployment   │   │
                        │                   │   (mysql:8)          │   │
                        │                   │   Port 3306          │   │
                        │                   └──────────────────────┘   │
                        │                    ClusterIP (mysql-service)  │
                        │                             │                 │
                        │                        ┌────┴────┐            │
                        │                        │  mysql  │            │
                        │                        │   PVC   │            │
                        │                        │  10 Gi  │            │
                        │                        └─────────┘            │
                        └──────────────────────────────────────────────┘
```

---

## Project Structure

```
k8s-student-helpdesk/
│
├── .env                          # Local Docker Compose environment variables
├── .gitignore
├── docker-compose.yml            # Local development stack (MySQL + Backend + Frontend)
│
├── backend/                      # Spring Boot REST API
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/helpdesk/
│       │   ├── HelpdeskApplication.java          # Spring Boot entry point
│       │   ├── controller/
│       │   │   └── HelpRequestController.java    # REST endpoints
│       │   ├── model/
│       │   │   └── HelpRequest.java              # JPA Entity
│       │   ├── repository/
│       │   │   └── HelpRequestRepository.java    # Spring Data JPA repository
│       │   └── service/
│       │       └── HelpRequestService.java       # Business logic
│       └── resources/
│           └── application.properties            # App config (env-driven)
│
├── frontend/                     # React + Vite SPA
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── dist/                     # Pre-built production assets
│   └── src/
│       ├── main.jsx              # Root component (CRUD UI)
│       └── style.css
│
└── k8s/                          # Kubernetes manifests
    ├── ingress.yaml              # NGINX Ingress (routes / and /api)
    ├── config/
    │   ├── backend-config.yaml   # ConfigMap (DB_URL, DB_USERNAME)
    │   └── mysql-secret.yaml     # Secret (MYSQL_ROOT_PASSWORD — base64)
    ├── mysql/
    │   ├── mysql-pv.yaml         # PersistentVolume (10Gi, hostPath)
    │   ├── mysql-pvc.yaml        # PersistentVolumeClaim (10Gi)
    │   ├── mysql-deployment.yaml # MySQL 8 Deployment
    │   └── mysql-service.yaml    # ClusterIP Service (port 3306)
    ├── backend/
    │   ├── backend-deployment.yaml  # Spring Boot Deployment (liveness + readiness probes)
    │   └── backend-service.yaml     # ClusterIP Service (port 8080)
    └── frontend/
        ├── frontend-deployment.yaml # React/Vite Deployment
        └── frontend-service.yaml    # LoadBalancer Service (port 80 → 5173)
```

---

## Prerequisites

Make sure the following are installed and available on your machine before proceeding.

| Tool              | Purpose                                          | Check                        |
|-------------------|--------------------------------------------------|------------------------------|
| Docker Desktop    | Container runtime + Kubernetes cluster           | `docker --version`           |
| Kubernetes        | Enabled inside Docker Desktop Settings           | `kubectl version --client`   |
| kubectl           | CLI to interact with your cluster                | `kubectl cluster-info`       |
| Java 17           | Build the Spring Boot backend                    | `java -version`              |
| Maven             | Package the backend JAR                          | `mvn -version`               |
| Node.js 20+       | (Optional) Run frontend locally outside Docker   | `node --version`             |

> **Docker Desktop Kubernetes:** Go to **Docker Desktop → Settings → Kubernetes → Enable Kubernetes**, then click **Apply & Restart**. This gives you a single-node cluster running on `localhost` with full LoadBalancer support — no `minikube tunnel` required.

---

## Local Development with Docker Compose

For quick local development without Kubernetes, use Docker Compose. This spins up all three services together.

**1. Copy the environment file and set your credentials:**

```bash
cp .env .env.local   # or just edit .env directly
```

The `.env` file contains:

```env
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=helpdesk_db

DB_URL=jdbc:mysql://mysql:3306/helpdesk_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

**2. Build the backend JAR first:**

```bash
cd backend
mvn clean package -DskipTests
cd ..
```

**3. Start all services:**

```bash
docker compose up --build
```

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173         |
| Backend  | http://localhost:8080/api     |
| MySQL    | localhost:3307 (host-mapped)  |

**4. Stop services:**

```bash
docker compose down
```

To also remove the persisted MySQL volume:

```bash
docker compose down -v
```

---

## Kubernetes Deployment (Docker Desktop)

### 1. Enable Kubernetes in Docker Desktop

Open **Docker Desktop → Settings → Kubernetes** and tick **Enable Kubernetes**. Click **Apply & Restart** and wait for the green "Kubernetes is running" indicator.

Verify your context is pointing to Docker Desktop:

```bash
kubectl config current-context
# Expected output: docker-desktop
```

---

### 2. Install the NGINX Ingress Controller

The Ingress manifest uses `ingressClassName: nginx`. You must install the controller before applying the Ingress.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
```

Wait for the controller to be ready:

```bash
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

---

### 3. Build Docker Images Locally

> **Important:** Docker Desktop Kubernetes uses the **same Docker daemon** as Docker Desktop itself. You do not need to push images to a registry — build locally and they are immediately available to the cluster. All deployments use `imagePullPolicy: IfNotPresent`.

**Build the backend image:**

```bash
# Step 1: Package the JAR
cd backend
mvn clean package -DskipTests
cd ..

# Step 2: Build the Docker image
docker build -t helpdesk-backend:latest ./backend
```

**Build the frontend image:**

```bash
docker build -t helpdesk-frontend:latest ./frontend
```

**Verify images are available:**

```bash
docker images | grep helpdesk
# helpdesk-backend    latest   ...
# helpdesk-frontend   latest   ...
```

---

### 4. Apply Kubernetes Manifests

Apply the manifests in this exact order to respect dependencies (Secret and PV must exist before deployments that reference them).

```bash
# 1. Secrets and ConfigMaps
kubectl apply -f k8s/config/mysql-secret.yaml
kubectl apply -f k8s/config/backend-config.yaml

# 2. Persistent storage for MySQL
kubectl apply -f k8s/mysql/mysql-pv.yaml
kubectl apply -f k8s/mysql/mysql-pvc.yaml

# 3. MySQL (must be running before backend starts)
kubectl apply -f k8s/mysql/mysql-deployment.yaml
kubectl apply -f k8s/mysql/mysql-service.yaml

# 4. Backend
kubectl apply -f k8s/backend/backend-deployment.yaml
kubectl apply -f k8s/backend/backend-service.yaml

# 5. Frontend
kubectl apply -f k8s/frontend/frontend-deployment.yaml
kubectl apply -f k8s/frontend/frontend-service.yaml

# 6. Ingress (route traffic)
kubectl apply -f k8s/ingress.yaml
```

Or apply everything at once after the first deployment:

```bash
kubectl apply -f k8s/config/
kubectl apply -f k8s/mysql/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress.yaml
```

---

### 5. Verify the Deployment

**Check all resources are running:**

```bash
kubectl get all
```

Expected output (all pods should show `Running`):

```
NAME                                      READY   STATUS    RESTARTS   AGE
pod/helpdesk-backend-xxxxxxxxx-xxxxx      1/1     Running   0          2m
pod/helpdesk-frontend-xxxxxxxxx-xxxxx     1/1     Running   0          2m
pod/mysql-xxxxxxxxx-xxxxx                 1/1     Running   0          3m

NAME                        TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
service/helpdesk-backend    ClusterIP      10.xxx.xxx.xxx   <none>        8080/TCP
service/helpdesk-frontend   LoadBalancer   10.xxx.xxx.xxx   localhost     80:xxxxx/TCP
service/mysql-service       ClusterIP      10.xxx.xxx.xxx   <none>        3306/TCP

NAME                                 READY   UP-TO-DATE   AVAILABLE
deployment.apps/helpdesk-backend     1/1     1            1
deployment.apps/helpdesk-frontend    1/1     1            1
deployment.apps/mysql                1/1     1            1
```

**Check Ingress:**

```bash
kubectl get ingress
# NAME                CLASS   HOSTS       ADDRESS     PORTS
# helpdesk-ingress    nginx   localhost   localhost   80
```

**Check PersistentVolume and PVC are bound:**

```bash
kubectl get pv,pvc
# mysql-pv should be Bound to mysql-pvc
```

**Check ConfigMap and Secret:**

```bash
kubectl get configmap backend-config
kubectl get secret mysql-secret
```

---

### 6. Access the Application

Once all pods are `Running` and the Ingress is ready:

| Endpoint              | URL                                     |
|-----------------------|-----------------------------------------|
| Frontend (UI)         | http://localhost                        |
| Backend API           | http://localhost/api/requests           |
| Backend Health Check  | http://localhost/api/requests/health    |

> **Note:** The frontend `LoadBalancer` service is also directly accessible at `http://localhost:80`. Docker Desktop automatically binds LoadBalancer services to `localhost`.

**Alternative — port-forward (if Ingress is not needed):**

```bash
# Access frontend directly
kubectl port-forward service/helpdesk-frontend 5173:80

# Access backend directly
kubectl port-forward service/helpdesk-backend 8080:8080
```

---

## Kubernetes Manifest Reference

| File | Kind | Purpose |
|------|------|---------|
| `k8s/config/mysql-secret.yaml` | `Secret` | Stores `MYSQL_ROOT_PASSWORD` as a base64-encoded opaque secret |
| `k8s/config/backend-config.yaml` | `ConfigMap` | Stores `DB_URL` and `DB_USERNAME` for the backend |
| `k8s/mysql/mysql-pv.yaml` | `PersistentVolume` | 10Gi hostPath volume at `/mnt/data/mysql` for MySQL data |
| `k8s/mysql/mysql-pvc.yaml` | `PersistentVolumeClaim` | Claims 10Gi `ReadWriteOnce` storage |
| `k8s/mysql/mysql-deployment.yaml` | `Deployment` | Runs `mysql:8`, mounts PVC, injects secret |
| `k8s/mysql/mysql-service.yaml` | `Service` (ClusterIP) | Exposes MySQL on port `3306` as `mysql-service` within the cluster |
| `k8s/backend/backend-deployment.yaml` | `Deployment` | Runs `helpdesk-backend:latest` with liveness + readiness probes and resource limits |
| `k8s/backend/backend-service.yaml` | `Service` (ClusterIP) | Exposes Spring Boot on port `8080` as `helpdesk-backend` within the cluster |
| `k8s/frontend/frontend-deployment.yaml` | `Deployment` | Runs `helpdesk-frontend:latest` on port `5173` |
| `k8s/frontend/frontend-service.yaml` | `Service` (LoadBalancer) | Exposes the frontend externally at port `80` → `5173` |
| `k8s/ingress.yaml` | `Ingress` | NGINX routing: `/` → frontend, `/api` → backend, all on `localhost` |

### Health Probes (Backend)

The backend deployment is configured with Kubernetes health probes hitting the `/api/requests/health` endpoint:

```yaml
livenessProbe:
  httpGet:
    path: /api/requests/health
    port: 8080
  initialDelaySeconds: 180   # Spring Boot JVM startup time
  periodSeconds: 10
  failureThreshold: 5

readinessProbe:
  httpGet:
    path: /api/requests/health
    port: 8080
  initialDelaySeconds: 120
  periodSeconds: 10
```

### Resource Limits

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
|-----------|-------------|-----------|----------------|--------------|
| Backend   | 250m        | 500m      | 512Mi          | 1Gi          |
| Frontend  | 100m        | 250m      | 128Mi          | 256Mi        |
| MySQL     | 250m        | 500m      | 256Mi          | 512Mi        |

---

## API Reference

Base URL (via Ingress): `http://localhost/api`  
Base URL (direct): `http://localhost:8080/api`

| Method   | Endpoint                        | Description                         | Body                                                 |
|----------|---------------------------------|-------------------------------------|------------------------------------------------------|
| `GET`    | `/requests`                     | Get all help requests               | —                                                    |
| `POST`   | `/requests`                     | Create a new help request           | `{ studentName, category, description }`             |
| `PATCH`  | `/requests/{id}/status`         | Update status of a request          | `{ "status": "IN_PROGRESS" \| "DONE" \| "OPEN" }`   |
| `DELETE` | `/requests/{id}`                | Delete a help request               | —                                                    |
| `GET`    | `/requests/health`              | Backend health check                | —                                                    |

**Example — Create a Request:**

```bash
curl -X POST http://localhost/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Sudheera",
    "category": "Technical",
    "description": "Cannot access the student portal."
  }'
```

**Example — Update Status:**

```bash
curl -X PATCH http://localhost/api/requests/1/status \
  -H "Content-Type: application/json" \
  -d '{ "status": "IN_PROGRESS" }'
```

**Available Categories:**

- `Academic`
- `Technical`
- `Library`
- `Finance`

**Available Statuses:**

- `OPEN` (default on creation)
- `IN_PROGRESS`
- `DONE`

---

## Environment Variables

### Backend (`application.properties` / container env)

| Variable      | Description                     | Example                                      |
|---------------|---------------------------------|----------------------------------------------|
| `DB_URL`      | JDBC connection string to MySQL | `jdbc:mysql://mysql-service:3306/helpdesk_db`|
| `DB_USERNAME` | Database username               | `root`                                       |
| `DB_PASSWORD` | Database password               | Injected from `mysql-secret`                 |

> In Kubernetes, `DB_URL` and `DB_USERNAME` come from the `backend-config` ConfigMap. `DB_PASSWORD` is injected from the `mysql-secret` Secret.

### Frontend (Vite env)

| Variable            | Description                   | Default                     |
|---------------------|-------------------------------|-----------------------------|
| `VITE_API_BASE_URL` | Backend API base URL          | `http://localhost:8080/api` |

> When deployed via Ingress, the frontend makes API calls to `/api` (same origin). You can override the API URL by setting `VITE_API_BASE_URL` as a build argument.

---

## Configuration & Secrets

### Re-generating the MySQL Secret

The `mysql-secret.yaml` stores the password as a base64-encoded value. To use your own password:

```bash
echo -n "your_new_password" | base64
# Copy the output and replace the value in k8s/config/mysql-secret.yaml
```

Then re-apply:

```bash
kubectl apply -f k8s/config/mysql-secret.yaml
```

> **Security note:** Never commit real credentials to version control. The `.env` file is listed in `.gitignore`. For production use, consider [Kubernetes External Secrets](https://external-secrets.io/) or a vault solution.

---

## Troubleshooting

### Pods stuck in `Pending` or `CrashLoopBackOff`

```bash
# Check pod status and events
kubectl get pods
kubectl describe pod <pod-name>

# Stream logs from a pod
kubectl logs <pod-name> --follow
kubectl logs <pod-name> --previous   # logs from a crashed container
```

---

### Backend pod keeps restarting

The backend has a `180s` `initialDelaySeconds` on its liveness probe — the Spring Boot JVM needs time to start. If it keeps crashing, check:

```bash
kubectl logs deployment/helpdesk-backend
```

Common causes:
- MySQL is not yet ready. The backend connects to `mysql-service:3306` — make sure the MySQL pod is `Running` first.
- The `mysql-secret` was not applied before the backend deployment.

---

### Images not found (`ErrImagePull` / `ImagePullBackOff`)

Docker Desktop Kubernetes uses the same Docker daemon as Docker Desktop. If you see image pull errors:

```bash
# Make sure images are built and visible
docker images | grep helpdesk

# Confirm imagePullPolicy is IfNotPresent (not Always) in your manifests
kubectl describe deployment helpdesk-backend | grep "Image Pull"
```

---

### MySQL PVC stuck in `Pending`

The PV uses a `hostPath` of `/mnt/data/mysql`. On Docker Desktop (Windows/Mac), this path lives inside the Docker VM, not your host OS — it will be created automatically when MySQL starts. If the PVC remains pending:

```bash
kubectl describe pvc mysql-pvc
kubectl describe pv mysql-pv
```

Make sure the `accessModes` and `storage` in the PVC exactly match the PV.

---

### `http://localhost` shows 404 or nginx error

The Ingress needs the NGINX controller to be running. Check:

```bash
kubectl get pods -n ingress-nginx
# The controller pod must be Running

kubectl describe ingress helpdesk-ingress
```

If the controller is not installed, re-run [Step 2](#2-install-the-nginx-ingress-controller).

---

### Tear down the entire deployment

```bash
kubectl delete -f k8s/ingress.yaml
kubectl delete -f k8s/frontend/
kubectl delete -f k8s/backend/
kubectl delete -f k8s/mysql/
kubectl delete -f k8s/config/
```

Or delete everything at once (be careful — this removes PVs and PVCs too, which deletes your database data):

```bash
kubectl delete -f k8s/ -R
```

---

## Database

- **Engine:** MySQL 8
- **Database name:** `helpdesk_db`
- **Table:** `help_requests` (auto-created by Hibernate on first run via `ddl-auto=update`)
- **Schema:**

| Column        | Type           | Notes                      |
|---------------|----------------|----------------------------|
| `id`          | BIGINT (PK)    | Auto-increment             |
| `studentName` | VARCHAR        | Required                   |
| `category`    | VARCHAR        | Academic / Technical / etc.|
| `description` | VARCHAR(1000)  | Required                   |
| `status`      | VARCHAR        | OPEN / IN_PROGRESS / DONE  |
| `createdAt`   | DATETIME       | Set on creation            |
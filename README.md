# 🎓 Student Help Desk - Kubernetes Full-Stack Deployment

**Docker • Kubernetes • Java • Spring Boot • React • MySQL**

A full-stack CRUD web application for managing student help requests, built as a hands-on Kubernetes deployment project. The application demonstrates containerisation, orchestration, persistent storage, secrets management, and traffic routing using industry-standard tooling.

---

# 📌 Overview

The Student Help Desk is a CRUD web application that allows students to submit help requests and staff to manage them.

This project was designed as a practical Kubernetes learning exercise and demonstrates:

* Multi-container Kubernetes deployments
* Kubernetes Services (ClusterIP & LoadBalancer)
* ConfigMaps and Secrets
* PersistentVolumes (PV) and PersistentVolumeClaims (PVC)
* NGINX Ingress routing
* Health Probes (Liveness & Readiness)
* Resource Requests and Limits
* Docker containerisation

---

# 🛠 Tech Stack

| Layer            | Technology                  | Version |
| ---------------- | --------------------------- | ------- |
| Frontend         | React + Vite + Axios        | Latest  |
| Backend          | Spring Boot (REST API)      | 3.3.5   |
| Language         | Java                        | 17      |
| Database         | MySQL                       | 8       |
| Build Tool       | Maven                       | Latest  |
| Containerisation | Docker                      | Latest  |
| Orchestration    | Kubernetes (Docker Desktop) | Latest  |
| Ingress          | NGINX Ingress Controller    | Latest  |

---

# 🏗 Architecture

```text
                        ┌──────────────────────────────────────────────┐
                        │              Kubernetes Cluster               │
                        │          (Docker Desktop - localhost)         │
                        │                                               │
 Browser                │  ┌──────────────────────────────────────┐    │
 http://localhost ──────┼─►│ NGINX Ingress (helpdesk-ingress)      │    │
                        │  │ host: localhost                      │    │
                        │  │ /     → helpdesk-frontend :80        │    │
                        │  │ /api  → helpdesk-backend  :8080      │    │
                        │  └──────────────────────────────────────┘    │
                        │              │                 │              │
                        │              ▼                 ▼              │
                        │   ┌────────────────┐   ┌────────────────┐    │
                        │   │ Frontend       │   │ Backend        │    │
                        │   │ Service        │   │ Service        │    │
                        │   │                │   │ ClusterIP      │    │
                        │   └────────────────┘   └────────────────┘    │
                        │            │                  │              │
                        │            ▼                  ▼              │
                        │   ┌────────────────┐   ┌────────────────┐    │
                        │   │ Frontend Pod   │   │ Backend Pod    │    │
                        │   │ (React / Vite) │   │ (Spring Boot)  │    │
                        │   └────────────────┘   └────────────────┘    │
                        │                               │              │
                        │                               ▼              │
                        │                     ┌────────────────┐       │
                        │                     │ MySQL Service  │       │
                        │                     │ ClusterIP      │       │
                        │                     └────────────────┘       │
                        │                               │              │
                        │                               ▼              │
                        │                     ┌────────────────┐       │
                        │                     │ MySQL Pod      │       │
                        │                     │ mysql:8        │       │
                        │                     └────────────────┘       │
                        │                               │              │
                        │                               ▼              │
                        │                     ┌────────────────┐       │
                        │                     │ PVC (10Gi)     │       │
                        │                     └────────────────┘       │
                        │                               │              │
                        │                               ▼              │
                        │                     ┌────────────────┐       │
                        │                     │ PV             │       │
                        │                     └────────────────┘       │
                        └──────────────────────────────────────────────┘
```

---

# 📂 Project Structure

```text
k8s-student-helpdesk/
│
├── .env
├── .gitignore
├── docker-compose.yml
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/helpdesk/
│       │   ├── HelpdeskApplication.java
│       │   ├── controller/
│       │   │   └── HelpRequestController.java
│       │   ├── model/
│       │   │   └── HelpRequest.java
│       │   ├── repository/
│       │   │   └── HelpRequestRepository.java
│       │   └── service/
│       │       └── HelpRequestService.java
│       └── resources/
│           └── application.properties
│
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── style.css
│
└── k8s/
    ├── ingress.yaml
    ├── config/
    ├── mysql/
    ├── backend/
    └── frontend/
```

---

# ✅ Prerequisites

| Tool           | Purpose                        |
| -------------- | ------------------------------ |
| Docker Desktop | Container Runtime + Kubernetes |
| kubectl        | Kubernetes CLI                 |
| Java 17        | Backend Development            |
| Maven          | Build Spring Boot Application  |
| Node.js 20+    | Frontend Development           |

Verify installation:

```bash
docker --version
kubectl version --client
kubectl cluster-info
java -version
mvn -version
node --version
```

---

# 🚀 Local Development (Docker Compose)

## 1. Configure Environment Variables

Create or edit `.env`

```env
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=helpdesk_db

DB_URL=jdbc:mysql://mysql:3306/helpdesk_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## 2. Build Backend

```bash
cd backend
mvn clean package -DskipTests
cd ..
```

---

  ## 3. Start Services

```bash
docker compose up --build
```

### Services

| Service  | URL                       |
| -------- | ------------------------- |
| Frontend | http://localhost:5173     |
| Backend  | http://localhost:8080/api |
| MySQL    | localhost:3307            |

---

## 4. Stop Services

```bash
docker compose down
```

Remove volumes:

```bash
docker compose down -v
```

---

# ☸ Kubernetes Deployment

## 1. Enable Kubernetes

Docker Desktop → Settings → Kubernetes → Enable Kubernetes

Verify:

```bash
kubectl config current-context
```

Expected:

```text
docker-desktop
```

---

## 2. Install NGINX Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml
```

Wait until ready:

```bash
kubectl wait --namespace ingress-nginx \
--for=condition=ready pod \
--selector=app.kubernetes.io/component=controller \
--timeout=120s
```

---

## 3. Build Docker Images

### Backend

```bash
cd backend
mvn clean package -DskipTests
docker build -t helpdesk-backend:latest .
cd ..
```

### Frontend

```bash
cd frontend
docker build -t helpdesk-frontend:latest .
cd ..
```

Verify:

```bash
Linux
docker images | grep helpdesk
```
```bash
Windows
docker images | Select-String helpdesk
```

---

## 4. Apply Kubernetes Resources

### Configurations

```bash
kubectl apply -f k8s/config/mysql-secret.yaml
kubectl apply -f k8s/config/backend-config.yaml
```

### Persistent Storage

```bash
kubectl apply -f k8s/mysql/mysql-pv.yaml
kubectl apply -f k8s/mysql/mysql-pvc.yaml
```

### MySQL

```bash
kubectl apply -f k8s/mysql/mysql-deployment.yaml
kubectl apply -f k8s/mysql/mysql-service.yaml
```

### Backend

```bash
kubectl apply -f k8s/backend/backend-deployment.yaml
kubectl apply -f k8s/backend/backend-service.yaml
```

### Frontend

```bash
kubectl apply -f k8s/frontend/frontend-deployment.yaml
kubectl apply -f k8s/frontend/frontend-service.yaml
```

### Ingress

```bash
kubectl apply -f k8s/ingress.yaml
```
### apply all

```bash
kubectl apply -R -f k8s/
```
---

# 🔍 Verification

Check resources:

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

Check ingress:

```bash
kubectl get ingress
```

Check storage:

```bash
kubectl get pv,pvc
```

Check ConfigMap:

```bash
kubectl get configmap backend-config
```

Check Secret:

```bash
kubectl get secret mysql-secret
```

---

# 🌐 Access the Application

| Endpoint     | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | http://localhost                     |
| Backend API  | http://localhost/api/requests        |
| Health Check | http://localhost/api/requests/health |

---
**Alternative - port-forward (if Ingress is not needed):**

```bash
# Access frontend directly
kubectl port-forward service/helpdesk-frontend 5173:80

# Access backend directly
kubectl port-forward service/helpdesk-backend 8080:8080
```

# 🩺 Health Probes

```yaml
livenessProbe:
  httpGet:
    path: /api/requests/health
    port: 8080
  initialDelaySeconds: 180
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /api/requests/health
    port: 8080
  initialDelaySeconds: 120
  periodSeconds: 10
```

---

# 📊 Resource Limits

| Component | CPU Request | CPU Limit | Memory Request | Memory Limit |
| --------- | ----------- | --------- | -------------- | ------------ |
| Backend   | 250m        | 500m      | 512Mi          | 1Gi          |
| Frontend  | 100m        | 250m      | 128Mi          | 256Mi        |
| MySQL     | 250m        | 500m      | 256Mi          | 512Mi        |

---

# 📡 API Endpoints

Base URL (via Ingress):

```text
http://localhost/api
```

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | /requests             | Get all requests      |
| POST   | /requests             | Create request        |
| PATCH  | /requests/{id}/status | Update request status |
| DELETE | /requests/{id}        | Delete request        |
| GET    | /requests/health      | Health check          |

---

## Create Request

Windows PowerShell
```bash
Invoke-RestMethod `
-Method POST `
-Uri "http://localhost/api/requests" `
-ContentType "application/json" `
-Body '{
  "studentName":"Sudheera",
  "category":"Technical",
  "description":"Cannot access student portal"
}'
```
Linux/macOS/GitBash
```bash
curl -X POST http://localhost/api/requests \
-H "Content-Type: application/json" \
-d '{
  "studentName":"Sudheera",
  "category":"Technical",
  "description":"Cannot access student portal"
}'
```

---

## Update Status

Windows PowerShell
```bash
Invoke-RestMethod `
-Method PATCH `
-Uri "http://localhost/api/requests/1/status" `
-ContentType "application/json" `
-Body '{"status":"IN_PROGRESS"}'  
```
Linux/macOS/Git Bash

```bash
curl -X PATCH http://localhost/api/requests/1/status \
-H "Content-Type: application/json" \
-d '{ "status":"IN_PROGRESS" }'
```

---

# 📋 Categories

* Academic
* Technical
* Library
* Finance

---

# 📋 Status Values

* OPEN
* IN_PROGRESS
* DONE

---

# 🔐 Environment Variables

## Backend

| Variable    | Description       |
| ----------- | ----------------- |
| DB_URL      | MySQL JDBC URL    |
| DB_USERNAME | Database Username |
| DB_PASSWORD | Database Password |

---

## Frontend

| Variable          | Description     |
| ----------------- | --------------- |
| VITE_API_BASE_URL | Backend API URL |

---

# 🔒 Configuration & Secrets

Generate Base64 Secret:

Linux/macOS/Git Bash
```bash
echo -n "your_password" | base64
```
Windows PowerShell
```bash
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your_password"))
```

Apply Secret:

```bash
kubectl apply -f k8s/config/mysql-secret.yaml
```

---

# 🛠 Troubleshooting

### Pod Issues

```bash
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl logs <pod-name> --previous
```

### Backend Restarting

Check logs:

```bash
kubectl logs deployment/helpdesk-backend
```

Common reasons:

* MySQL not ready
* Missing Secret
* Wrong database configuration

### Image Pull Errors

Linux/MacOS/GitBash
```bash
docker images | grep helpdesk
```
Windows powershell
```bash
docker images | Select-String helpdesk
```
Verify:

```yaml
imagePullPolicy: IfNotPresent
```

### PVC Pending

```bash
kubectl describe pvc mysql-pvc
kubectl describe pv mysql-pv
```

### Ingress Errors

```bash
kubectl get ingress
kubectl get pods -n ingress-nginx
kubectl describe ingress helpdesk-ingress
```

---

# 🧹 Cleanup

Delete all Kubernetes resources:

```bash
kubectl delete -R -f k8s/
```

Or delete individually:

```bash
kubectl delete -f k8s/ingress.yaml
kubectl delete -f k8s/frontend/
kubectl delete -f k8s/backend/
kubectl delete -f k8s/mysql/
kubectl delete -f k8s/config/
```

---

# 🗄 Database

**Engine:** MySQL 8

**Database:** helpdesk_db

**Table:** help_requests

Hibernate automatically creates and updates the schema using:

```properties
spring.jpa.hibernate.ddl-auto=update
```

### Schema

| Column      | Type          | Notes                                    |
| ----------- | ------------- | ---------------------------------------- |
| id          | BIGINT        | Primary Key                              |
| studentName | VARCHAR       | Required                                 |
| category    | VARCHAR       | Academic / Technical / Library / Finance |
| description | VARCHAR       | Required                                 |
| status      | VARCHAR       | OPEN / IN_PROGRESS / DONE                |
| createdAt   | DATETIME      | Auto-generated                           |

---

# Student Help Desk App

A simple full-stack app for Kubernetes practice.

## Stack

- Frontend: React + Vite
- Backend: Spring Boot + Spring Data JPA
- Database: MySQL

## Local setup

### 1. Create MySQL database

Login to MySQL and run:

```sql
CREATE DATABASE helpdesk_db;
```

Default backend DB credentials are in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

Change them if your MySQL password is different.

### 2. Run backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

Health endpoint:

```text
http://localhost:8080/api/requests/health
```

### 3. Run frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## API endpoints

- `GET /api/requests` - get all help requests
- `POST /api/requests` - create request
- `PATCH /api/requests/{id}/status` - update status
- `DELETE /api/requests/{id}` - delete request

## Next step

After local run works, create Dockerfiles and Kubernetes YAML files yourself:

- MySQL Deployment + Service + PersistentVolumeClaim
- Backend Deployment + Service + ConfigMap + Secret
- Frontend Deployment + Service
- Ingress

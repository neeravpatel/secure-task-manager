# SecureTaskManager

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

Run `npx nx graph` to visually explore what got created. Now, let's get you up to speed!

# Secure Task Manager

A secure, role-based task management system built with Nx monorepo, NestJS backend, and a modular architecture.

---

## Setup Instructions

### Backend

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your environment variables (e.g., database path, JWT secret, port).

3. **Database setup:**
   - The backend uses SQLite by default. No manual setup is needed for dev.
   - To seed the database with sample data:
     ```sh
     npm run seed
     ```

4. **Run the API server:**
   ```sh
   npx nx serve api
   ```
   The API will be available at `http://localhost:3000`.

### Frontend

> **Note:** If you have a frontend app, add setup instructions here.  
> _Example:_
>
> ```sh
> npx nx serve web
> # or
> cd apps/web && npm start
> ```

---

## Architecture Overview

This project uses an Nx monorepo structure:

```
secure-task-manager/
├── apps/
│   ├── api/         # NestJS backend application
│   └── api-e2e/     # End-to-end tests for the API
├── libs/
│   ├── auth/        # Shared authentication logic (decorators, guards, DTOs)
│   └── data/        # Shared data models, enums, and interfaces
├── node_modules/
├── package.json
├── nx.json
└── ...
```

- **apps/api**: Main backend app (NestJS, TypeORM, RBAC, REST API)
- **libs/auth**: Guards, decorators, and DTOs for authentication/authorization
- **libs/data**: TypeScript interfaces, enums, and DTOs shared across backend and frontend

---

## Access Control Design & Data Models

### Access Control

- **Role-based access control (RBAC)** is enforced using NestJS guards and decorators.
- **Roles:** `OWNER`, `ADMIN`, `VIEWER`
- **Permissions:** Fine-grained, e.g., `CREATE_TASK`, `EDIT_TASK`, `VIEW_TASK`, etc.
- **Scoping:**
  - Owners/Admins can see and manage all tasks in their organization.
  - Viewers can only see their own tasks.

### Data Models

- **User**
  - `id`, `email`, `passwordHash`, `organizationId`, `roleId`, `createdAt`, `updatedAt`
- **Organization**
  - `id`, `name`, `parentOrganizationId`, `createdAt`, `updatedAt`
- **Role**
  - `id`, `name`, `organizationId`, `permissions`, `createdAt`, `updatedAt`
- **Task**
  - `id`, `title`, `description`, `userId`, `organizationId`, `status`, `createdAt`, `updatedAt`
- **Permission**
  - `id`, `name`, `description`

---

## Sample API Requests/Responses

### Login

**Request:**

```http
POST /auth/login
Content-Type: application/json

{
	"email": "alice@technova.com",
	"password": "alice12345"
}
```

**Response:**

```json
{
  "access_token": "JWT_TOKEN",
  "user": {
    "id": "user-uuid",
    "email": "alice@technova.com",
    "organizationId": "org-uuid",
    "roleId": "role-uuid"
  }
}
```

### Get Tasks (as Admin/Owner)

**Request:**

```http
GET /tasks
Authorization: Bearer JWT_TOKEN
```

**Response:**

```json
[
	{
		"id": "task-uuid",
		"title": "Prepare HR security onboarding",
		"description": "Guide for new hires on security best practices.",
		"userId": "carol-uuid",
		"organizationId": "hr-uuid",
		"status": "PENDING",
		"createdAt": "...",
		"updatedAt": "..."
	},
	...
]
```

### Get Tasks (as Viewer)

**Request:**

```http
GET /tasks
Authorization: Bearer JWT_TOKEN
```

**Response:**  
Returns only tasks assigned to the authenticated user.

---

## Potential Future Enhancements

- **Security:**
  - Add 2FA/MFA for user accounts
  - Rate limiting and brute-force protection
  - Audit logging for sensitive actions
- **Scalability:**
  - Support for PostgreSQL or other RDBMS
  - Horizontal scaling with stateless JWT auth
  - Caching for frequent queries
- **Features:**
  - Task comments, attachments, and notifications
  - Organization hierarchy and cross-org permissions
  - Admin UI for managing users, roles, and permissions
- **DevOps:**
  - Dockerization and CI/CD pipelines
  - Automated database migrations

---

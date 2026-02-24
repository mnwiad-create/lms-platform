# Product Requirements Document
# Corporate Learning Management System (LMS)

> **Version:** v1.0 — aligned with Master Plan v3.1
> **Date:** February 20, 2026
> **Status:** Ready for Implementation ✅
> **Deploy Target:** On-Prem First → SaaS Ready
> **Concurrent Users:** 300
> **Classification:** Confidential — Internal Use Only

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [User Personas & Roles](#3-user-personas--roles)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Tech Stack](#6-tech-stack)
7. [API Endpoints](#7-api-endpoints)
8. [Feature Roadmap & Sprint Timeline](#8-feature-roadmap--sprint-timeline)
9. [Out of Scope](#9-out-of-scope)
10. [Risks & Mitigations](#10-risks--mitigations)
11. [Pre-Sprint Checklist](#11-pre-sprint-checklist)
12. [Glossary](#12-glossary)

---

## 1. Executive Summary

A corporate LMS built for internal use to manage employee training, course delivery, assessments, and certification. The system targets **300 concurrent users** and is architected as row-level multi-tenant from day one — supporting on-prem deployment immediately and SaaS expansion later without architectural change.

### Objectives

- Centralize course management, training delivery, and assessment into a single platform
- Provide real-time progress tracking across all organizational levels
- Enable offline learning for employees in low-connectivity environments
- Automate certificate issuance and support HR compliance reporting
- Maintain a full audit trail for regulatory and internal audit requirements

### Key Architecture Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| Frontend | Vite + React 19 SPA | Internal app — no SEO/SSR needed; SPA is lighter and simpler |
| Backend | Node.js + Hono | Lightweight, TypeScript-first, middleware-friendly |
| Database | PostgreSQL 16 + Row-level multi-tenant (`orgId`) | Single DB supports both On-Prem and SaaS |
| Auth | 4 providers: Local, AD/LDAP, Azure AD, Google | Covers all enterprise auth scenarios |
| Video | YouTube/Vimeo embed + HLS.js + JWT (5–15 min TTL) | Flexible, secure, works with internal video server |
| Offline | PWA + Workbox + Dexie.js (IndexedDB) | Students can learn without internet |
| i18n | Thai + English (react-i18next) | Bilingual from day one |
| Essay Grading | Manual by Instructor (AI deferred to V3) | Reduces MVP complexity |
| Multi-tenancy | Row-level (`orgId` on all data tables) | On-Prem = 1 org; SaaS = multiple orgs in one DB |

---

## 2. Problem Statement

### Current Pain Points

- Training management is fragmented across Excel, Email, and Google Drive — making progress tracking difficult
- No central repository for training content; files are resent repeatedly for every session
- No systematic way to measure compliance or training effectiveness
- Employees in remote branches with unstable internet cannot participate in online training
- HR and compliance audits require significant manual effort to compile records

### Goals

- Single platform for course management, training delivery, and assessments
- Real-time progress tracking per employee, department, and division
- Offline learning support for remote employees, with sync when back online
- Automated digital certificate issuance after passing assessments
- Built-in audit log and compliance reporting for HR and Legal teams

---

## 3. User Personas & Roles

The system has **5 roles**. When a user belongs to multiple AD groups, the highest priority role wins.

| Role | AD Security Group | Priority | Who | Core Capabilities |
|------|------------------|:---:|-----|-------------------|
| **System Admin** | `LMS_System_Admin` | 1 (highest) | IT Admin / System Owner | Full system control: user CRUD, org structure, system config, all analytics, audit log |
| **Course Admin** | `LMS_Course_Admin` | 2 | HR / Training Manager | Course CRUD (own courses), assign instructors, manage enrollments, export reports |
| **Instructor** | `LMS_Instructor` | 3 | Trainer / Subject Expert | Grade essays, give feedback, view progress of assigned courses |
| **Student** | `LMS_Student` | 4 | General Employee | Learn, take quizzes, download certificates, offline learning |
| **Auditor/Viewer** | *(manual assign)* | — | Compliance Officer | Read-only: org analytics, compliance reports, audit log, data export |

### Role Assignment Rules

- Multiple AD groups → highest priority role wins
- No AD group match → default role: **Student**
- Google OAuth login → default role: **Student** (System Admin can toggle Gmail on/off per domain)
- Mapping is configurable via System Admin UI through the `AdRoleMapping` table

### Permission Matrix

```
                           SysAdmin  CourseAdmin  Instructor  Student  Auditor
User CRUD                     ✅         ❌          ❌         ❌       ❌
Org Structure                 ✅         ❌          ❌         ❌       ❌
System Config                 ✅         ❌          ❌         ❌       ❌
Course CRUD                   ✅       ✅(own)       ❌         ❌       ❌
Quiz CRUD                     ✅       ✅(own)       ❌         ❌       ❌
Assign Instructor             ✅       ✅(own)       ❌         ❌       ❌
Enrollment Mgmt               ✅       ✅(own)       ❌         ❌       ❌
Grade Essay                   ✅       ✅(own)    ✅(assigned)  ❌       ❌
Give Feedback                 ✅       ✅(own)    ✅(assigned)  ❌       ❌
View Progress              ✅(all)    ✅(own)    ✅(assigned) ✅(own)  ✅(read)
Learn / Take Quiz             ❌         ❌          ❌         ✅       ❌
Download Certificate          ❌         ❌          ❌         ✅       ❌
Offline Download              ❌         ❌          ❌         ✅       ❌
Org Analytics                 ✅         ❌          ❌         ❌       ✅
Audit Log                     ✅         ❌          ❌         ❌     ✅(read)
Export Reports                ✅       ✅(own)       ❌         ❌       ✅
```

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization

The system supports 4 login providers. All converge to the same JWT session.

| Provider | Endpoint | Mechanism | Notes |
|----------|----------|-----------|-------|
| Local (Email/Password) | `POST /api/v1/auth/login` | bcrypt verify → JWT | For system-created accounts |
| On-prem AD/LDAP | `POST /api/v1/auth/ldap` | LDAP bind → read AD groups → map role → JWT | Port 636 (LDAPS); IT must open firewall |
| Azure AD (OIDC) | `GET /api/v1/auth/azure` | OIDC redirect → callback → JWT | Azure AD app registration required |
| Google OAuth | `GET /api/v1/auth/google` | OAuth redirect → callback → JWT | Admin toggle: all Gmail or specific domains only |

**Session & Security:**
- JWT stored in **httpOnly cookie only** (secure, sameSite: strict) — never in localStorage
- Refresh token rotation for long sessions
- Frontend uses TanStack Query `useAuth()` hook → `GET /api/v1/auth/me`

---

### 4.2 User Management & Organization Structure

**Organization Hierarchy:** Three-level structure — Division → Department → Team

- Backed by a self-referencing `OrgUnit` table (`parent_id` FK), extensible to N levels
- Enrollment supports any level: assign a course to an entire Division or a specific Team
- System Admin manages the org tree via UI

**User Management (System Admin only):**
- Create / Edit / Disable users (soft delete via `status` field)
- Assign role and org unit per user
- `UNIQUE(email, orgId)` — same email can exist across tenants but not within the same org

---

### 4.3 Course Management

| Feature | Who Can Use | Details |
|---------|-------------|---------|
| Course CRUD | System Admin, Course Admin (own) | `title_th/en`, `description_th/en`, category, status (Draft / Published / Archived), self-enroll toggle |
| Module & Lesson | System Admin, Course Admin | Course → Module(s) → Lesson(s), orderable |
| Assign Instructor | System Admin, Course Admin | Many-to-Many: Course ↔ Instructor; per-instructor `permissions` stored as JSONB |
| Video Content | System Admin, Course Admin | YouTube embed, Vimeo embed, Internal HLS (.m3u8), Internal MP4 — auto-detected from URL |
| File / PDF Upload | System Admin, Course Admin | Upload via MinIO (max 50 MB), linked to lesson |
| Self-Enrollment | Student | Toggled per course by admin |

---

### 4.4 Enrollment & Progress Tracking

- **Manual enrollment:** System Admin / Course Admin assigns users or entire org units
- **Self-enrollment:** Student registers independently if the course flag is enabled
- **Progress tracking:** `LessonProgress` per lesson → rolled up to `progress_pct` in `Enrollment`
- **Status flow:** `NOT_STARTED` → `IN_PROGRESS` → `COMPLETED`
- **Student dashboard:** courses to complete, overall progress, upcoming deadlines

---

### 4.5 Video System

4 video types, auto-detected from URL:

| Type | Detection | Player | Security |
|------|-----------|--------|----------|
| YouTube | URL contains `youtube.com` or `youtu.be` | iframe (youtube-nocookie.com) | Public / Unlisted |
| Vimeo | URL contains `vimeo.com` | iframe | Vimeo privacy settings |
| Internal HLS | URL ends with `.m3u8` | HLS.js | JWT Signed URL |
| Internal MP4 | URL ends with `.mp4` | `<video>` element | JWT Signed URL |

**JWT Video Signing:**
```
Algorithm   : HS256
Payload     : { sub, course_id, lesson_id, video_path, exp }
TTL         : 5–15 minutes (configurable, default 900s)
Auto-refresh: triggered when < 2 minutes remaining
Base URL    : https://video.company.local
Secret      : shared with Video Server team (VIDEO_SIGNING_SECRET env var)
```

---

### 4.6 Quiz Engine

4 question types:

| Type | Auto-grade | Config (JSONB) | Notes |
|------|:----------:|----------------|-------|
| MCQ (Multiple Choice) | ✅ | `choices[], correct_index, explanation` | Supports multiple correct answers |
| Essay (Open-ended) | ❌ Manual | `word_limit, rubric` | Graded by Instructor / Course Admin; AI deferred to V3 |
| Matching | ✅ | `left_items[], right_items[], pairs[]` | Drag-and-drop UI |
| Drag & Drop (Ordering) | ✅ | `items[], correct_order[]` | Powered by @dnd-kit/core |

**Quiz Settings:** `passing_score`, `time_limit`, `max_attempts`, `randomize_questions`, `show_results_after`

**Quiz Timer:** Redis-backed (server-side) to prevent client-side manipulation

**Essay Grading Flow:** Submission queued in BullMQ → Instructor grades in UI → automated feedback email sent

---

### 4.7 Certificate

- Issued automatically when a Student passes a quiz (meets `passing_score`)
- PDF generated via `@react-pdf/renderer` inside a BullMQ worker
- Stored in MinIO; URL saved to `Certificate` record
- Unique `certificate_no` per enrollment
- Student downloads from their dashboard
- **No QR Code** (decision finalized)

---

### 4.8 Offline / PWA

Students can pre-download content and complete lessons without internet.

**Supported offline:** Lesson text, PDF content, MCQ / Matching / Drag & Drop quizzes, personal progress view

**Not supported offline:** Video streaming, enrollment, certificate download, any admin functions

**Tech stack:** Workbox (Service Worker) + Dexie.js (IndexedDB) + Background Sync API

**Sync:** `POST /api/v1/sync/push` | `GET /api/v1/sync/pull`

**Conflict resolution:** first-sync-wins

---

### 4.9 Analytics & Reporting

**Analytics (System Admin + Auditor):**
- Org-level overview: completion rate, active users, average score
- Course-level: enrollment count, progress distribution, quiz pass rate
- Instructor-level: grading turnaround time, SLA compliance
- Export: CSV / Excel via `/api/v1/analytics/*` endpoints

**Audit Log:**
- Auto-generated by middleware on every mutation — no manual logging needed in routes
- Fields: `user_id`, `action`, `entity_type`, `entity_id`, `old_value (JSONB)`, `new_value (JSONB)`, `ip`, `created_at`
- Immutable — records must never be deleted
- Default retention: 365 days (configurable)

---

### 4.10 Data Retention

| Entity | Default (days) | Action | Notes |
|--------|:--------------:|--------|-------|
| Audit Log | 365 | Delete | Configurable |
| Quiz Attempts | 730 | Archive | Configurable |
| Essay Submissions | 730 | Archive | Configurable |
| Notifications | 90 | Delete | Configurable |
| Login History | 180 | Delete | Configurable |
| Certificate Records | 0 (permanent) | — | Never deleted |
| Course Completion | 0 (permanent) | — | Never deleted |

Cleanup job: BullMQ cron runs daily at **02:00**. A value of `0` means keep forever.

---

### 4.11 Notifications & Email

- Email delivered via organization SMTP server (nodemailer)
- Triggers: essay grading complete, enrollment confirmed, certificate issued, deadline reminders
- In-app notifications stored in `Notification` table with per-user read/unread tracking

---

## 5. Non-Functional Requirements

| Category | Requirement | Verification |
|----------|-------------|--------------|
| Performance | 300 concurrent users without degradation | Load test before Go-Live |
| Availability | Fully operational on LAN even when internet is down | Network isolation test |
| Security | JWT httpOnly cookie, RBAC on every endpoint, Zod validation on all inputs | Security review before deploy |
| Multi-tenancy | `orgId` isolation on all queries — no data leakage across tenants | Integration tests per tenant |
| Accessibility | WCAG AA contrast, keyboard navigation, visible focus rings | Automated a11y audit |
| Mobile | Responsive from 375px+; touch targets ≥ 44px | Device testing |
| Internationalization | TH/EN switchable on every page with graceful fallback | Language toggle QA pass |
| Offline | Full lesson completable offline; sync must be accurate | Offline E2E test |
| Maintainability | TypeScript strict mode, Zod validators, ESLint, modular structure | Code review gate |
| Backup | Deferred — ownership not yet assigned | V3+ |

---

## 6. Tech Stack

### 6.1 Frontend (`apps/web`)

| Library | Version | Purpose |
|---------|---------|---------|
| Vite | 6 | Build tool, HMR < 100ms |
| React | 19 | UI framework |
| React Router | 7 | SPA routing + role-based guards |
| TanStack Query | v5 | All server state — cache, refetch, optimistic updates |
| TanStack Table | latest | Data tables with sorting, pagination, filtering |
| Tailwind CSS | 3.4 | Utility-first styling |
| Shadcn/ui | latest | Radix-based accessible components |
| react-i18next | latest | TH/EN internationalization |
| react-hook-form + zod | latest | Form handling and type-safe validation |
| HLS.js | latest | Internal HLS video streaming |
| @dnd-kit/core | latest | Drag & drop for quiz types |
| Recharts | latest | Analytics charts |
| Workbox | latest | PWA / Service Worker |
| Dexie.js | latest | IndexedDB offline storage |
| Zustand | latest | UI-only state (modals, sidebar open state, etc.) |
| Sonner | latest | Toast notifications |
| Lucide React | latest | Icon set |
| dayjs | latest | Date formatting |

### 6.2 Backend (`apps/api`)

| Library | Version | Purpose |
|---------|---------|---------|
| Node.js | 22 LTS | Runtime |
| Hono | latest | HTTP framework — lightweight, TypeScript-first |
| Prisma | latest | Type-safe ORM with migrations |
| PostgreSQL | 16 | Primary relational database |
| Redis | 7 | Session store, quiz timer, rate limiting |
| BullMQ | latest | Job queue — cert gen, email, future AI grading |
| jose | latest | JWT — video signed URLs and session tokens |
| bcrypt | latest | Password hashing for local auth |
| nodemailer | latest | Organization SMTP email delivery |
| ldapjs | latest | On-prem Active Directory (LDAPS) |
| MinIO SDK | latest | S3-compatible on-prem file storage |
| @react-pdf/renderer | latest | Certificate PDF generation (in BullMQ worker) |

### 6.3 Infrastructure (Docker Compose)

| Service | Image | Role |
|---------|-------|------|
| nginx | `nginx:alpine` | Serve static frontend + reverse proxy `/api/*` → `api:3001` |
| api | Custom Dockerfile | Hono Node.js server (port 3001) |
| postgres | `postgres:16-alpine` | Primary database |
| redis | `redis:7-alpine` | Cache + session + BullMQ |
| minio | `minio/minio` | Object storage (console port 9001) |

**Server Spec:** 8 cores | 16 GB RAM | 200 GB SSD | 1 Gbps | Ubuntu 22.04 LTS

**Package Manager:** pnpm (workspaces) | **Monorepo Tool:** Turborepo

---

## 7. API Endpoints

### 7.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Local auth → JWT |
| POST | `/api/v1/auth/ldap` | LDAP bind → JWT |
| GET | `/api/v1/auth/azure` | Redirect to Azure AD |
| GET | `/api/v1/auth/azure/callback` | OIDC callback → JWT |
| GET | `/api/v1/auth/google` | Redirect to Google |
| GET | `/api/v1/auth/google/callback` | OAuth callback → JWT |
| GET | `/api/v1/auth/me` | Current user + role |
| POST | `/api/v1/auth/refresh` | Token rotation |
| POST | `/api/v1/auth/logout` | Clear session |

### 7.2 Resources

| Endpoint | Allowed Roles |
|----------|---------------|
| `/api/v1/users` | System Admin |
| `/api/v1/org-units` | System Admin |
| `/api/v1/org-units/tree` | System Admin, Course Admin |
| `/api/v1/courses` | All (data filtered by role) |
| `/api/v1/courses/:id/enroll` | System Admin, Course Admin |
| `/api/v1/course-instructors` | System Admin, Course Admin |
| `/api/v1/quizzes/:id/attempt` | Student (enrolled only) |
| `/api/v1/quizzes/:id/submit` | Student (enrolled only) |
| `/api/v1/grading/pending` | Instructor, Course Admin |
| `/api/v1/grading/:answerId` | Instructor, Course Admin |
| `/api/v1/video/signed-url` | Student (enrolled only) |
| `/api/v1/sync/push` | Student |
| `/api/v1/sync/pull` | Student |
| `/api/v1/analytics/overview` | System Admin, Auditor |
| `/api/v1/analytics/course/:id` | System Admin, Course Admin, Instructor, Auditor |
| `/api/v1/system-config` | System Admin |
| `/api/v1/retention/policies` | System Admin |

---

## 8. Feature Roadmap & Sprint Timeline

### 🟢 MVP — Month 1–3 (Sprint 1–6)

| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| M1 S1 | Foundation | Turborepo monorepo, Vite + React, Hono API, Prisma schema, Docker Compose, Tailwind + Shadcn/ui + Glassmorphism tokens, i18n |
| M1 S2 | Auth | Local + Azure AD + Google OAuth, JWT (httpOnly cookie), RBAC middleware, AD group mapping |
| M2 S3 | User & Org | User CRUD, 3-level org tree UI, role assignment |
| M2 S4 | Course | Course CRUD, video embed (YouTube/Vimeo), PDF upload, categories |
| M3 S5 | Enrollment | Manual enrollment, student dashboard, progress tracking |
| M3 S6 | Quiz & Deploy | MCQ + Essay quiz, instructor grading UI, email notifications, On-Prem deploy |

### 🟡 V2 — Month 4–5 (Sprint 7–10)

| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| M4 S7 | Advanced Quiz + Video | Matching + Drag & Drop quiz; HLS.js + JWT signed URL |
| M4 S8 | Certificate & Analytics | Certificate PDF gen, self-enrollment, analytics dashboards |
| M5 S9 | LDAP + Audit | On-prem AD (LDAP), Auditor panel, Audit Log UI |
| M5 S10 | Config & Reports | Data retention config, Google Gmail toggle, CSV/Excel export |

### 🔴 V3 — Month 6+ (Sprint 11–12+)

| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| M6 S11 | PWA | Workbox, Service Worker, content pre-download |
| M6 S12 | Offline Sync + UAT | Sync, conflict resolution, performance tuning, UAT |
| V3+ | Future | AI essay grading, learning paths, SCORM, mobile app, HR integration, backup |

---

## 9. Out of Scope

| Item | Status | Notes |
|------|--------|-------|
| AI Essay Grading | Deferred → V3 | Manual grading first; see Section 4.6 |
| SCORM Support | Deferred → V3+ | No clear requirements yet |
| Mobile Native App | Deferred → V3+ | PWA covers offline needs |
| Backup Strategy | Deferred | Ownership not assigned |
| QR Code on Certificates | Will not build | Decision finalized |
| SSR / SEO | Will not build | Internal app — no public indexing needed |
| Public (unauthenticated) pages | Will not build | Every page is login-gated |
| HR System Integration | Deferred → V3+ | No API contract yet |
| Learning Paths / Sequences | Deferred → V3+ | Deprioritized for V1/V2 |

---

## 10. Risks & Mitigations

| Risk | Level | Mitigation |
|------|:-----:|------------|
| LDAP port 636 blocked by firewall | 🔴 High | IT must open port before Sprint 9 — verify before starting LDAP work |
| Offline sync conflict causing data loss | 🔴 High | first-sync-wins strategy + E2E tests before V3 release |
| JWT video token leak | 🔴 High | Short TTL (5–15 min) + bind `userId` + `courseId` in payload |
| AD group name mismatch | 🟡 Medium | Admin-configurable via `AdRoleMapping` table — never hardcode group names |
| Video server CORS headers misconfigured | 🟡 Medium | Verify with Video Server team before Sprint 7 |
| Essay grading bottleneck (instructor backlog) | 🟡 Medium | BullMQ queue + automated SLA reminder emails |
| Glassmorphism performance on low-end devices | 🟡 Medium | `prefers-reduced-motion` CSS fallback already in stylesheet |

---

## 11. Pre-Sprint Checklist

> All items must be completed before Sprint 1 begins.

### IT Infrastructure

- [ ] Open LDAP port 636 on firewall (required for Sprint 9)
- [ ] Create AD Security Groups: `LMS_System_Admin`, `LMS_Course_Admin`, `LMS_Instructor`, `LMS_Student`
- [ ] Provision server: 8 cores / 16 GB RAM / 200 GB SSD / Ubuntu 22.04
- [ ] Verify internal video server: CORS headers, HLS support, JWT verify endpoint
- [ ] Confirm SMTP server settings

### External Services

- [ ] Register Azure AD app (Client ID, Client Secret, Tenant ID)
- [ ] Register Google OAuth app (Client ID, Client Secret)
- [ ] Agree on `VIDEO_SIGNING_SECRET` shared secret with Video Server team

### Development Setup

- [ ] Initialize Git repository (monorepo structure)
- [ ] `pnpm create vite` → `apps/web`
- [ ] `npx shadcn@latest init`
- [ ] `prisma init` → `apps/api/prisma`
- [ ] Create `.env` from `.env.example` at repo root

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **SPA** | Single Page Application — loads once, navigates via JavaScript without full page reloads |
| **JWT** | JSON Web Token — standard token format for authentication and authorization |
| **RBAC** | Role-Based Access Control — restricting access based on assigned roles |
| **HLS** | HTTP Live Streaming — adaptive video streaming using `.m3u8` playlist files |
| **PWA** | Progressive Web App — web app with offline capability and native-like behavior |
| **LDAP / LDAPS** | Lightweight Directory Access Protocol — connects to Active Directory (S = SSL, port 636) |
| **OIDC** | OpenID Connect — identity layer on OAuth 2.0, used for SSO with Azure AD |
| **Row-level Multi-tenancy** | Isolating tenant data using an `orgId` column per row instead of separate databases |
| **BullMQ** | Redis-backed job queue — handles background jobs like certificate generation and email |
| **MinIO** | S3-compatible open-source object storage for on-prem file hosting |
| **orgId** | Organization ID — present on all data tables to isolate data between tenants |
| **TTL** | Time To Live — maximum age of a token or cache entry before expiry |
| **Turborepo** | Monorepo build tool with intelligent caching and parallel task execution |
| **Workbox** | Google's library for Service Worker strategies and PWA caching |
| **Dexie.js** | Developer-friendly wrapper around the browser IndexedDB API |
| **first-sync-wins** | Conflict resolution strategy: the first data received during sync takes precedence |

---

*Document aligned with LMS Master Plan v3.1 — February 20, 2026*
*Companion docs: `DOC_1_DATABASE_SCHEMA.md` | `DOC_2_SPRINT_BREAKDOWN.md` | `DOC_3_API_CONTRACT.md`*

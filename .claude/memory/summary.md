# Project Summary

## Project Overview
- Name: LMS Platform
- Type: Enterprise Learning Management System
- Tech Stack: Vite + React 19, Tailwind CSS, shadcn/ui, Zustand, React Router 7, Recharts
- Backend: Hono + Prisma + PostgreSQL (apps/api)
- Design Pattern: Pattern E - Corporate/Enterprise

## Architecture
- Monorepo (pnpm + turbo)
  - `apps/web` - Frontend (Vite + React, port 5173)
  - `apps/api` - Backend (Hono, port 3001)
  - `packages/shared` - Shared types, validators, constants

## Completed Features

### Admin Portal (6 pages) - `/admin/*`
- Dark sidebar (slate-900) with collapsible nav
- Dashboard, Courses, Course Detail, Users, Enrollments, Settings

### Student Portal (6 pages) - `/student/*`
- White sidebar with blue-600 accent
- Dashboard, My Courses, Course Player, Quiz Taking, Certificates, Profile

### Instructor Portal (5 pages) - `/instructor/*`
- Indigo-950 sidebar (dark indigo theme)
- Dashboard (course performance + recent activity)
- My Teaching Courses (filter tabs + stats)
- Course Management (3 tabs: Content, Students, Quizzes)
- Grading (quiz submissions with filter)
- Instructor Profile (teaching stats)

### Auditor Portal (2 pages) - `/auditor/*`
- Teal-950 sidebar (dark teal theme) with read-only badge
- Auditor Dashboard (compliance metrics, enrollment breakdown, dept performance, course completion table)
- Audit Reports (2 tabs: Enrollment Records + User Directory with search/filter/export)

### Shared Infrastructure
- 18 shadcn/ui components
- Zustand auth store with login/logout + role persistence
- Role-based routing: /admin, /student, /instructor, /auditor
- Mock API layer (15 users, 8 courses, 20 enrollments, 4 quizzes)
- Responsive design (mobile-first)

## Key Files
- `apps/web/src/App.tsx` - 4-portal role-based router
- `apps/web/src/stores/auth-store.ts` - Auth state
- `apps/web/src/lib/mock-data.ts` - All mock data + types
- `apps/web/src/lib/api.ts` - Mock API functions
- `apps/web/src/components/layout/` - Admin + Student + Instructor + Auditor layouts
- `apps/web/src/pages/auditor/` - 2 auditor pages

## Login Credentials
| Role | Email | Password | Portal |
|------|-------|----------|--------|
| SYSTEM_ADMIN | test@test.com | admin123 | /admin |
| COURSE_ADMIN | sarah.johnson@acme.com | password123 | /admin |
| INSTRUCTOR | michael.brown@acme.com | password123 | /instructor |
| INSTRUCTOR | emily.davis@acme.com | password123 | /instructor |
| STUDENT | john.smith@acme.com | password123 | /student |
| AUDITOR | james.martin@acme.com | password123 | /auditor |

## Build Status
- Build passes: `npx vite build` + `npx tsc --noEmit` = zero errors

---
*Last updated: 2026-02-24*

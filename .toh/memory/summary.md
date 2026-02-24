# Project Summary

## Project Overview
- Name: LMS Platform (Corporate Internal)
- Tech Stack: Vite + React 19 SPA, Hono API, Prisma, PostgreSQL 16, Redis, MinIO, Turborepo monorepo
- Deploy: On-Prem (Docker Compose) -> SaaS (future)
- Users: 300 concurrent, 5 roles (SYSTEM_ADMIN, COURSE_ADMIN, INSTRUCTOR, STUDENT, AUDITOR)

## Monorepo Structure
```
lms-platform/
├── apps/web        (Vite + React 19 SPA)
├── apps/api        (Hono + Node.js 22)
└── packages/shared (TypeScript types, Zod validators, constants)
```

## Completed Features
- packages/shared scaffold (types, validators, constants)

## Important Notes
- JWT in httpOnly cookie only (never localStorage)
- Row-level multi-tenant via orgId on all data tables
- pnpm monorepo (Turborepo)
- No SSR/SEO - pure SPA
- TH/EN bilingual (dual columns: title_th, title_en)
- Glassmorphism UI design system

---
*Last updated: 2026-02-23*

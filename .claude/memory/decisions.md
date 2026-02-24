# Key Decisions

## Architecture Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-23 | Use Toh Framework | AI-Orchestration Driven Development |
| 2026-02-24 | Vite + React (not Next.js) | Existing project setup uses Vite + React Router |
| 2026-02-24 | Local types in mock-data.ts | Avoid @lms/shared import issues in Vite bundler |
| 2026-02-24 | Auth store with login() method | Cleaner than manual setUser() with hardcoded data |
| 2026-02-24 | Role-based routing /admin + /student + /instructor | Separate layouts and access per role |
| 2026-02-24 | 3 protected layouts | AdminProtected, StudentProtected, InstructorProtected |

## Design Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-24 | Pattern E: Corporate/Enterprise | LMS is B2B enterprise software |
| 2026-02-24 | Admin: Dark sidebar (slate-900) | Professional enterprise feel |
| 2026-02-24 | Student: White sidebar + blue accent | Lighter, friendlier student experience |
| 2026-02-24 | Instructor: Indigo-950 sidebar | Distinct from admin, warm academic feel |
| 2026-02-24 | Blue-600 primary for Admin+Student | Trust, corporate |
| 2026-02-24 | Indigo-600 accent for Instructor | Differentiated but cohesive |

## Business Logic
| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-24 | Multi-tenant with orgId | Enterprise feature |
| 2026-02-24 | 5 roles: SysAdmin/CourseAdmin/Instructor/Student/Auditor | Complete hierarchy |
| 2026-02-24 | Bilingual (TH/EN) data fields | Thai enterprise market |
| 2026-02-24 | UI First: build all role UIs before backend | Faster visual progress |
| 2026-02-24 | Instructor sees own courses only | createdBy === user.id filter |

## Auditor Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-24 | Dedicated /auditor portal (not shared with admin) | Auditors need read-only view with different UI emphasis |
| 2026-02-24 | Teal-950 sidebar for Auditor | Distinct from admin (slate), student (white), instructor (indigo) |
| 2026-02-24 | Read-only badge in sidebar | Clear visual indicator that auditor cannot modify data |
| 2026-02-24 | 2 pages: Dashboard + Reports | Compliance overview + detailed drilldown covers audit needs |

## Rejected Ideas
| Date | Idea | Why Rejected |
|------|------|--------------|
| 2026-02-24 | Import from @lms/shared in web | Vite module resolution issues |
| 2026-02-24 | Instructor uses admin portal | Better UX with dedicated portal |
| 2026-02-24 | Auditor uses admin portal | Auditor needs read-only emphasis, separate from admin CRUD |

---
*Last updated: 2026-02-24*

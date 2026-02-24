# Key Decisions

## Architecture Decisions
| Date | Decision | Reason |
|------|----------|--------|
| 2026-02-23 | Use Toh Framework | AI-Orchestration Driven Development |
| 2026-02-23 | Vite + React SPA (not Next.js) | Internal app, no SEO/SSR needed - locked decision |
| 2026-02-23 | Hono for API (not Express/Fastify) | Lightweight, TypeScript-first - locked decision |
| 2026-02-23 | Row-level multi-tenant via orgId | On-Prem + SaaS in same DB - locked decision |
| 2026-02-23 | JWT in httpOnly cookie only | Security requirement - locked decision |
| 2026-02-23 | pnpm monorepo (Turborepo) | Build cache + workspace management |
| 2026-02-23 | packages/shared uses NodeNext module resolution | Required for pnpm monorepo compatibility with both FE and BE |
| 2026-02-23 | Zod validators typed with z.infer (not manual interfaces) | Single source of truth for input types |

| 2026-02-24 | Admin routes under /admin/* prefix, student routes under /student/* | Role-based routing: students and admins have separate layouts and navigation trees |
| 2026-02-24 | StudentLayout uses same useAppStore (shared sidebar collapse state) | Simpler than separate store; sidebar collapse preference is per-device not per-role |
| 2026-02-24 | Student sidebar: white bg + blue-600 left border (not dark like admin) | Students are learners, not managers - friendlier, lighter feel while still professional |
| 2026-02-24 | Instructor sidebar: bg-indigo-950 (warm deep indigo, not slate-900) | Differentiates from admin (dark slate) and student (white) - instructors are content creators, distinct identity |
| 2026-02-24 | Instructor routes under /instructor/* prefix (separate from /admin) | Instructors have different workflow than admins; giving them own portal avoids permission complexity |

---
*Last updated: 2026-02-24*

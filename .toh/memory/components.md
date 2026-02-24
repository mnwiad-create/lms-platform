# Component Registry

> Quick reference for all project components, hooks, and utilities
> **Update:** After creating/modifying any component, hook, or utility

---

## Pages

| Route | File | Description | Key Dependencies |
|-------|------|-------------|------------------|
| `/login` | `pages/login/login-page.tsx` | Login form, demo credentials hint | useAuthStore, @lms/shared |
| `/` | `pages/dashboard/dashboard-page.tsx` | 4 KPI cards, activity chart placeholder, recent activity feed | lucide-react |
| `/courses` | `pages/courses/courses-page.tsx` | Course grid with search + filter | Button, Input, Select, Card, Badge |
| `/courses/:id` | `pages/courses/course-detail-page.tsx` | Course detail stub with back nav | useParams, useNavigate |
| `/users` | `pages/users/users-page.tsx` | Users table with role/status filters, pagination | Table, Badge, Avatar, DropdownMenu |
| `/enrollments` | `pages/enrollments/enrollments-page.tsx` | Enrollment table with progress bars, status badges | Progress, Badge, Avatar, Table |
| `/settings` | `pages/settings/settings-page.tsx` | 4-tab settings: profile, notifications, security, org | useAuthStore |

---

## Components

### Layout Components

| Component | Location | Key Props | Used By |
|-----------|----------|-----------|---------|
| DashboardLayout | `components/layout/dashboard-layout.tsx` | children | ProtectedLayout in App.tsx |
| Sidebar | `components/layout/sidebar.tsx` | - (reads from useAppStore, useAuthStore) | DashboardLayout |
| Header | `components/layout/header.tsx` | - (reads from useAuthStore, useAppStore) | DashboardLayout |

### UI Base Components (shadcn/ui)

| Component | Location | Notes |
|-----------|----------|-------|
| Button | `components/ui/button.tsx` | 6 variants, 4 sizes |
| Card, CardHeader, CardTitle, CardContent, CardFooter | `components/ui/card.tsx` | Full card family |
| Input | `components/ui/input.tsx` | Styled HTML input |
| Label | `components/ui/label.tsx` | Radix Label |
| Badge | `components/ui/badge.tsx` | 4 variants |
| Avatar, AvatarImage, AvatarFallback | `components/ui/avatar.tsx` | Radix Avatar |
| Dialog, DialogTrigger, DialogContent... | `components/ui/dialog.tsx` | Radix Dialog |
| DropdownMenu, DropdownMenuContent, DropdownMenuItem... | `components/ui/dropdown-menu.tsx` | Radix DropdownMenu |
| Select, SelectTrigger, SelectContent, SelectItem... | `components/ui/select.tsx` | Radix Select |
| Separator | `components/ui/separator.tsx` | Radix Separator |
| Switch | `components/ui/switch.tsx` | Radix Switch |
| Tabs, TabsList, TabsTrigger, TabsContent | `components/ui/tabs.tsx` | Radix Tabs |
| Tooltip, TooltipTrigger, TooltipContent, TooltipProvider | `components/ui/tooltip.tsx` | Radix Tooltip |
| Progress | `components/ui/progress.tsx` | Radix Progress |
| Table, TableHeader, TableBody, TableHead, TableRow, TableCell | `components/ui/table.tsx` | Pure HTML table |
| Popover, PopoverTrigger, PopoverContent | `components/ui/popover.tsx` | Radix Popover |
| Skeleton | `components/ui/skeleton.tsx` | Pulse animation |
| ScrollArea, ScrollBar | `components/ui/scroll-area.tsx` | Radix ScrollArea |

---

## Zustand Stores

| Store | Location | State Shape | Key Actions |
|-------|----------|-------------|-------------|
| useAuthStore | `stores/auth-store.ts` | user: User\|null, isAuthenticated: boolean, isLoading: boolean | login(email,pw)->Promise<bool>, logout(), setUser(), setLoading() |
| useAppStore | `stores/app-store.ts` | sidebarCollapsed: boolean, sidebarMobileOpen: boolean, sidebarOpen: boolean | toggleSidebar(), setSidebarCollapsed(), setSidebarMobileOpen(), setSidebarOpen() |

---

## Utility Functions & Data Files

| File | Purpose | Key Exports |
|------|---------|-------------|
| `lib/utils.ts` | Tailwind class merging | cn(...inputs) |
| `lib/mock-data.ts` | All local types + mock data (no @lms/shared) | Role, UserStatus, AuthProvider, CourseStatus, VideoType, EnrollmentStatusEnum, QuizType enums; User, Course, Module, Lesson, Enrollment, Quiz, Organization, OrgUnit interfaces; mockUsers, mockCourses, mockEnrollments, mockQuizzes, mockDashboardStats, mockCredentials, mockEnrollmentTrends, mockCategoryDistribution, mockRecentEnrollments, mockPopularCourses |
| `lib/api.ts` | Mock API functions with realistic delays | getCourses, getCourse, createCourse, updateCourse, deleteCourse, getUsers, getUser, getUserByEmail, getEnrollments, getUserEnrollments, getQuizzes, getQuiz, getDashboardStats |

---

## Component Statistics

| Category | Count |
|----------|-------|
| Pages | 7 (login, dashboard, courses, course-detail, users, enrollments, settings) |
| Layout | 3 (DashboardLayout, Sidebar, Header) |
| UI Base | 18 (shadcn/ui components) |
| Stores | 2 (useAuthStore, useAppStore) |
| Lib Files | 3 (utils, mock-data, api) |

---
*Last updated: 2026-02-24*

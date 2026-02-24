import {
  mockCourses,
  mockUsers,
  mockEnrollments,
  mockDashboardStats,
  mockQuizzes,
} from '@/lib/mock-data';
import type {
  Course,
  User,
  Enrollment,
  Quiz,
  ApiResponse,
  PaginationMeta,
  PaginationParams,
  DashboardStats,
} from '@/lib/mock-data';

// Re-export types for consumers
export type { Course, User, Enrollment, Quiz, ApiResponse, PaginationMeta, PaginationParams, DashboardStats };

// Simulated network latency (200-400ms range)
const delay = (ms: number = 300) => new Promise<void>((r) => setTimeout(r, ms));

// Helper: apply search filter across a string record
function matchesSearch(item: Record<string, unknown>, search: string): boolean {
  const q = search.toLowerCase();
  return Object.values(item).some((v) => {
    if (typeof v === 'string') return v.toLowerCase().includes(q);
    return false;
  });
}

// Helper: build paginated ApiResponse
function paginate<T>(
  items: T[],
  params: PaginationParams = {},
): ApiResponse<T[]> {
  const { page = 1, limit = 20, search, sortBy, sortOrder = 'asc' } = params;

  let filtered = [...items];

  // Search filter
  if (search) {
    filtered = filtered.filter((item) =>
      matchesSearch(item as Record<string, unknown>, search),
    );
  }

  // Sort
  if (sortBy) {
    filtered.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy];
      const bVal = (b as Record<string, unknown>)[sortBy];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal);
        return sortOrder === 'desc' ? -cmp : cmp;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePageNum = Math.min(Math.max(1, page), totalPages);
  const start = (safePageNum - 1) * limit;
  const end = start + limit;

  const meta: PaginationMeta = {
    total,
    page: safePageNum,
    limit,
    totalPages,
  };

  return { data: filtered.slice(start, end), meta };
}

// ============================================================
// COURSE API
// ============================================================

/** Fetch a paginated list of courses. Supports search, sort, and pagination. */
export async function getCourses(params?: PaginationParams): Promise<ApiResponse<Course[]>> {
  await delay(280);
  return paginate(mockCourses, params);
}

/** Fetch a single course by ID (includes modules and lessons). Returns null if not found. */
export async function getCourse(id: string): Promise<Course | null> {
  await delay(200);
  return mockCourses.find((c) => c.id === id) ?? null;
}

/** Create a new course (mock - returns the created object without persisting). */
export async function createCourse(input: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | '_count'>): Promise<Course> {
  await delay(400);
  return {
    ...input,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _count: { enrollments: 0 },
  };
}

/** Update a course by ID (mock - returns merged object). */
export async function updateCourse(id: string, input: Partial<Course>): Promise<Course | null> {
  await delay(350);
  const existing = mockCourses.find((c) => c.id === id);
  if (!existing) return null;
  return { ...existing, ...input, updatedAt: new Date().toISOString() };
}

/** Delete a course by ID (mock - returns success boolean). */
export async function deleteCourse(id: string): Promise<boolean> {
  await delay(300);
  return mockCourses.some((c) => c.id === id);
}

// ============================================================
// USER API
// ============================================================

/** Fetch a paginated list of users. Supports search, sort, and pagination. */
export async function getUsers(params?: PaginationParams): Promise<ApiResponse<User[]>> {
  await delay(280);
  return paginate(mockUsers, params);
}

/** Fetch a single user by ID. Returns null if not found. */
export async function getUser(id: string): Promise<User | null> {
  await delay(200);
  return mockUsers.find((u) => u.id === id) ?? null;
}

/** Fetch a single user by email. Returns null if not found. */
export async function getUserByEmail(email: string): Promise<User | null> {
  await delay(200);
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

// ============================================================
// ENROLLMENT API
// ============================================================

/** Fetch a paginated list of enrollments. Optionally filter by userId or courseId. */
export async function getEnrollments(
  params?: PaginationParams & { userId?: string; courseId?: string },
): Promise<ApiResponse<Enrollment[]>> {
  await delay(280);
  let items = [...mockEnrollments];

  if (params?.userId) {
    items = items.filter((e) => e.userId === params.userId);
  }
  if (params?.courseId) {
    items = items.filter((e) => e.courseId === params.courseId);
  }

  // Hydrate course and user references for convenience
  const hydrated = items.map((e) => ({
    ...e,
    course: mockCourses.find((c) => c.id === e.courseId),
    user: mockUsers.find((u) => u.id === e.userId),
  }));

  return paginate(hydrated, params);
}

/** Fetch enrollments for a specific user (with course data populated). */
export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  await delay(250);
  return mockEnrollments
    .filter((e) => e.userId === userId)
    .map((e) => ({
      ...e,
      course: mockCourses.find((c) => c.id === e.courseId),
      user: mockUsers.find((u) => u.id === e.userId),
    }));
}

// ============================================================
// QUIZ API
// ============================================================

/** Fetch all quizzes (optionally filter by courseId). */
export async function getQuizzes(courseId?: string): Promise<Quiz[]> {
  await delay(250);
  if (courseId) {
    return mockQuizzes.filter((q) => q.courseId === courseId);
  }
  return mockQuizzes;
}

/** Fetch a single quiz by ID. Returns null if not found. */
export async function getQuiz(id: string): Promise<Quiz | null> {
  await delay(200);
  return mockQuizzes.find((q) => q.id === id) ?? null;
}

// ============================================================
// DASHBOARD API
// ============================================================

/** Fetch aggregated dashboard statistics. */
export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(350);
  return mockDashboardStats;
}

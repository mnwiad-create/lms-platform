// ============================================================
// LOCAL TYPE DEFINITIONS
// Mirror @lms/shared types locally to avoid module resolution
// issues in the Vite/bundler environment.
// ============================================================

export enum Role {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  COURSE_ADMIN = 'COURSE_ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
  AUDITOR = 'AUDITOR',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  LDAP = 'LDAP',
  AZURE_AD = 'AZURE_AD',
  GOOGLE = 'GOOGLE',
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum VideoType {
  YOUTUBE = 'YOUTUBE',
  VIMEO = 'VIMEO',
  HLS = 'HLS',
  MP4 = 'MP4',
}

export enum EnrollmentStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum QuizType {
  MCQ = 'MCQ',
  ESSAY = 'ESSAY',
  MATCHING = 'MATCHING',
  DRAG_DROP = 'DRAG_DROP',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameTh: string | null;
  lastNameTh: string | null;
  role: Role;
  orgUnitId: string | null;
  orgId: string;
  avatarUrl: string | null;
  status: UserStatus;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: string;
}

export interface OrgUnit {
  id: string;
  nameTh: string;
  nameEn: string;
  parentId: string | null;
  orgId: string;
  level: number;
  sortOrder: number;
  children?: OrgUnit[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  titleTh: string;
  titleEn: string;
  contentTh: string | null;
  contentEn: string | null;
  videoUrl: string | null;
  videoType: VideoType | null;
  fileUrl: string | null;
  sortOrder: number;
  durationMinutes: number | null;
}

export interface CourseModule {
  id: string;
  courseId: string;
  titleTh: string;
  titleEn: string;
  sortOrder: number;
  lessons?: Lesson[];
}

export interface Course {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string | null;
  descriptionEn: string | null;
  category: string | null;
  status: CourseStatus;
  selfEnroll: boolean;
  thumbnailUrl: string | null;
  orgId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  modules?: CourseModule[];
  _count?: { enrollments: number };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatusEnum;
  progressPct: number;
  enrolledAt: string;
  completedAt: string | null;
  orgId: string;
  course?: Course;
  user?: User;
}

export interface McqConfig {
  choices: { text_th: string; text_en: string }[];
  correctIndices: number[];
  explanation_th?: string;
  explanation_en?: string;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuizType;
  questionTh: string;
  questionEn: string;
  config: McqConfig;
  points: number;
  sortOrder: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  titleTh: string;
  titleEn: string;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
  randomizeQuestions: boolean;
  showResultsAfter: boolean;
  orgId: string;
  questions?: Question[];
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardStats {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  completionRate: number;
  activeUsers: number;
  coursesThisMonth: number;
  // Legacy fields kept for dashboard chart compatibility
  coursesDelta?: number;
  studentsDelta?: number;
  enrollmentsDelta?: number;
  completionDelta?: number;
}

// ============================================================
// ORGANIZATION
// ============================================================

export const mockOrganization: Organization = {
  id: 'org-001',
  name: 'Acme Corporation',
  slug: 'acme-corp',
  logoUrl: null,
  createdAt: '2025-01-01T00:00:00.000Z',
};

// ============================================================
// ORG UNITS
// ============================================================

export const mockOrgUnits: OrgUnit[] = [
  { id: 'unit-001', nameTh: 'วิศวกรรม', nameEn: 'Engineering', parentId: null, orgId: 'org-001', level: 1, sortOrder: 1 },
  { id: 'unit-002', nameTh: 'การตลาด', nameEn: 'Marketing', parentId: null, orgId: 'org-001', level: 1, sortOrder: 2 },
  { id: 'unit-003', nameTh: 'การขาย', nameEn: 'Sales', parentId: null, orgId: 'org-001', level: 1, sortOrder: 3 },
  { id: 'unit-004', nameTh: 'ทรัพยากรบุคคล', nameEn: 'HR', parentId: null, orgId: 'org-001', level: 1, sortOrder: 4 },
  { id: 'unit-005', nameTh: 'การเงิน', nameEn: 'Finance', parentId: null, orgId: 'org-001', level: 1, sortOrder: 5 },
  { id: 'unit-006', nameTh: 'ปฏิบัติการ', nameEn: 'Operations', parentId: null, orgId: 'org-001', level: 1, sortOrder: 6 },
];

// ============================================================
// USERS (15 total: 1 SYSTEM_ADMIN, 1 COURSE_ADMIN, 2 INSTRUCTOR,
//         10 STUDENT, 1 AUDITOR)
// Default login: test@test.com / admin123
// ============================================================

export const mockUsers: User[] = [
  {
    id: 'user-001',
    email: 'test@test.com',
    firstName: 'Admin',
    lastName: 'System',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.SYSTEM_ADMIN,
    orgUnitId: null,
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'user-002',
    email: 'sarah.johnson@acme.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.COURSE_ADMIN,
    orgUnitId: 'unit-004',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-01-05T08:00:00.000Z',
    updatedAt: '2025-06-10T09:30:00.000Z',
  },
  {
    id: 'user-003',
    email: 'michael.brown@acme.com',
    firstName: 'Michael',
    lastName: 'Brown',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.INSTRUCTOR,
    orgUnitId: 'unit-001',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'user-004',
    email: 'emily.davis@acme.com',
    firstName: 'Emily',
    lastName: 'Davis',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.INSTRUCTOR,
    orgUnitId: 'unit-002',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.AZURE_AD,
    createdAt: '2025-02-01T08:00:00.000Z',
    updatedAt: '2025-11-15T14:00:00.000Z',
  },
  {
    id: 'user-005',
    email: 'john.smith@acme.com',
    firstName: 'John',
    lastName: 'Smith',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-001',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-02-15T08:00:00.000Z',
    updatedAt: '2025-12-01T09:00:00.000Z',
  },
  {
    id: 'user-006',
    email: 'jessica.williams@acme.com',
    firstName: 'Jessica',
    lastName: 'Williams',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-002',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-12-05T11:00:00.000Z',
  },
  {
    id: 'user-007',
    email: 'david.miller@acme.com',
    firstName: 'David',
    lastName: 'Miller',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-003',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.AZURE_AD,
    createdAt: '2025-03-10T08:00:00.000Z',
    updatedAt: '2025-11-20T16:00:00.000Z',
  },
  {
    id: 'user-008',
    email: 'amanda.wilson@acme.com',
    firstName: 'Amanda',
    lastName: 'Wilson',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-004',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-04-01T08:00:00.000Z',
    updatedAt: '2025-12-10T10:00:00.000Z',
  },
  {
    id: 'user-009',
    email: 'robert.taylor@acme.com',
    firstName: 'Robert',
    lastName: 'Taylor',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-005',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-04-15T08:00:00.000Z',
    updatedAt: '2025-12-12T14:30:00.000Z',
  },
  {
    id: 'user-010',
    email: 'jennifer.anderson@acme.com',
    firstName: 'Jennifer',
    lastName: 'Anderson',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-006',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-05-01T08:00:00.000Z',
    updatedAt: '2025-12-15T09:00:00.000Z',
  },
  {
    id: 'user-011',
    email: 'christopher.thomas@acme.com',
    firstName: 'Christopher',
    lastName: 'Thomas',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-001',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.INACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-05-10T08:00:00.000Z',
    updatedAt: '2025-10-01T09:00:00.000Z',
  },
  {
    id: 'user-012',
    email: 'lisa.jackson@acme.com',
    firstName: 'Lisa',
    lastName: 'Jackson',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-002',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.GOOGLE,
    createdAt: '2025-06-01T08:00:00.000Z',
    updatedAt: '2025-12-18T11:00:00.000Z',
  },
  {
    id: 'user-013',
    email: 'mark.white@acme.com',
    firstName: 'Mark',
    lastName: 'White',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-003',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-06-15T08:00:00.000Z',
    updatedAt: '2025-12-20T10:30:00.000Z',
  },
  {
    id: 'user-014',
    email: 'patricia.harris@acme.com',
    firstName: 'Patricia',
    lastName: 'Harris',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.STUDENT,
    orgUnitId: 'unit-005',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.SUSPENDED,
    authProvider: AuthProvider.LOCAL,
    createdAt: '2025-07-01T08:00:00.000Z',
    updatedAt: '2025-11-01T09:00:00.000Z',
  },
  {
    id: 'user-015',
    email: 'james.martin@acme.com',
    firstName: 'James',
    lastName: 'Martin',
    firstNameTh: null,
    lastNameTh: null,
    role: Role.AUDITOR,
    orgUnitId: 'unit-005',
    orgId: 'org-001',
    avatarUrl: null,
    status: UserStatus.ACTIVE,
    authProvider: AuthProvider.LDAP,
    createdAt: '2025-01-20T08:00:00.000Z',
    updatedAt: '2025-12-01T09:00:00.000Z',
  },
];

// ============================================================
// COURSES (8 courses with modules and lessons)
// ============================================================

export const mockCourses: Course[] = [
  // 1. Onboarding Program
  {
    id: 'course-001',
    titleTh: 'โปรแกรมปฐมนิเทศ',
    titleEn: 'Onboarding Program',
    descriptionTh: 'คู่มือสำหรับพนักงานใหม่เพื่อทำความเข้าใจวัฒนธรรมและกระบวนการขององค์กร',
    descriptionEn: 'A comprehensive guide for new employees to understand company culture, policies, and processes.',
    category: 'Compliance',
    status: CourseStatus.PUBLISHED,
    selfEnroll: true,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-002',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-06-01T10:00:00.000Z',
    _count: { enrollments: 12 },
    modules: [
      {
        id: 'mod-001-1',
        courseId: 'course-001',
        titleTh: 'ยินดีต้อนรับสู่ Acme',
        titleEn: 'Welcome to Acme',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-001-1-1',
            moduleId: 'mod-001-1',
            titleTh: 'ประวัติและวิสัยทัศน์',
            titleEn: 'Company History & Vision',
            contentTh: 'ประวัติความเป็นมาและวิสัยทัศน์ขององค์กร',
            contentEn: "Learn about Acme Corporation's history, mission, and vision for the future.",
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 15,
          },
          {
            id: 'les-001-1-2',
            moduleId: 'mod-001-1',
            titleTh: 'โครงสร้างองค์กร',
            titleEn: 'Organizational Structure',
            contentTh: 'โครงสร้างองค์กรและทีมงาน',
            contentEn: 'Understand the company structure, departments, and key teams.',
            videoUrl: null,
            videoType: null,
            fileUrl: 'https://example.com/files/org-chart.pdf',
            sortOrder: 2,
            durationMinutes: 10,
          },
        ],
      },
      {
        id: 'mod-001-2',
        courseId: 'course-001',
        titleTh: 'นโยบายและขั้นตอน',
        titleEn: 'Policies & Procedures',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-001-2-1',
            moduleId: 'mod-001-2',
            titleTh: 'นโยบายการทำงาน',
            titleEn: 'Workplace Policies',
            contentTh: 'นโยบายการทำงานและข้อบังคับ',
            contentEn: 'Review key workplace policies including attendance, leave, and code of conduct.',
            videoUrl: null,
            videoType: null,
            fileUrl: 'https://example.com/files/policies.pdf',
            sortOrder: 1,
            durationMinutes: 20,
          },
          {
            id: 'les-001-2-2',
            moduleId: 'mod-001-2',
            titleTh: 'สวัสดิการและผลประโยชน์',
            titleEn: 'Benefits & Perks',
            contentTh: 'สวัสดิการและผลประโยชน์ที่พนักงานจะได้รับ',
            contentEn: 'Overview of employee benefits including health insurance, retirement plans, and more.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 15,
          },
        ],
      },
      {
        id: 'mod-001-3',
        courseId: 'course-001',
        titleTh: 'เครื่องมือและระบบ',
        titleEn: 'Tools & Systems',
        sortOrder: 3,
        lessons: [
          {
            id: 'les-001-3-1',
            moduleId: 'mod-001-3',
            titleTh: 'ระบบ IT และการเข้าถึง',
            titleEn: 'IT Systems & Access',
            contentTh: 'วิธีการเข้าถึงระบบและเครื่องมือต่างๆ',
            contentEn: 'How to access company systems, set up your workstation, and use collaboration tools.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 25,
          },
        ],
      },
    ],
  },

  // 2. Cybersecurity Basics
  {
    id: 'course-002',
    titleTh: 'ความรู้พื้นฐานด้านความปลอดภัยทางไซเบอร์',
    titleEn: 'Cybersecurity Basics',
    descriptionTh: 'เรียนรู้วิธีปกป้องข้อมูลและระบบจากภัยคุกคามทางไซเบอร์',
    descriptionEn: 'Essential knowledge to protect company data and systems from cyber threats.',
    category: 'Compliance',
    status: CourseStatus.PUBLISHED,
    selfEnroll: false,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-003',
    createdAt: '2025-02-01T08:00:00.000Z',
    updatedAt: '2025-09-15T10:00:00.000Z',
    _count: { enrollments: 14 },
    modules: [
      {
        id: 'mod-002-1',
        courseId: 'course-002',
        titleTh: 'ภัยคุกคามและการโจมตี',
        titleEn: 'Threats & Attacks',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-002-1-1',
            moduleId: 'mod-002-1',
            titleTh: 'ฟิชชิ่งและวิศวกรรมสังคม',
            titleEn: 'Phishing & Social Engineering',
            contentTh: null,
            contentEn: 'Recognize and avoid phishing emails, phone scams, and social engineering attacks.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 20,
          },
          {
            id: 'les-002-1-2',
            moduleId: 'mod-002-1',
            titleTh: 'มัลแวร์และแรนซัมแวร์',
            titleEn: 'Malware & Ransomware',
            contentTh: null,
            contentEn: 'Understand malware types, how they spread, and how to prevent infections.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 18,
          },
        ],
      },
      {
        id: 'mod-002-2',
        courseId: 'course-002',
        titleTh: 'แนวทางปฏิบัติที่ดี',
        titleEn: 'Best Practices',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-002-2-1',
            moduleId: 'mod-002-2',
            titleTh: 'การจัดการรหัสผ่าน',
            titleEn: 'Password Management',
            contentTh: null,
            contentEn: 'Create strong passwords, use password managers, and enable two-factor authentication.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 12,
          },
          {
            id: 'les-002-2-2',
            moduleId: 'mod-002-2',
            titleTh: 'ความปลอดภัยของข้อมูล',
            titleEn: 'Data Security',
            contentTh: null,
            contentEn: 'Handle sensitive data responsibly, understand data classification, and proper disposal.',
            videoUrl: null,
            videoType: null,
            fileUrl: 'https://example.com/files/data-security-guide.pdf',
            sortOrder: 2,
            durationMinutes: 15,
          },
        ],
      },
    ],
  },

  // 3. Leadership Skills
  {
    id: 'course-003',
    titleTh: 'ทักษะการเป็นผู้นำ',
    titleEn: 'Leadership Skills',
    descriptionTh: 'พัฒนาทักษะการเป็นผู้นำที่มีประสิทธิภาพสำหรับผู้จัดการและหัวหน้าทีม',
    descriptionEn: 'Develop effective leadership skills for managers and team leads to inspire and guide their teams.',
    category: 'Leadership',
    status: CourseStatus.PUBLISHED,
    selfEnroll: true,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-003',
    createdAt: '2025-03-01T08:00:00.000Z',
    updatedAt: '2025-10-01T10:00:00.000Z',
    _count: { enrollments: 8 },
    modules: [
      {
        id: 'mod-003-1',
        courseId: 'course-003',
        titleTh: 'รูปแบบการเป็นผู้นำ',
        titleEn: 'Leadership Styles',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-003-1-1',
            moduleId: 'mod-003-1',
            titleTh: 'รู้จักสไตล์ผู้นำของคุณ',
            titleEn: 'Discovering Your Leadership Style',
            contentTh: null,
            contentEn: 'Assess your natural leadership tendencies and understand different leadership models.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 30,
          },
          {
            id: 'les-003-1-2',
            moduleId: 'mod-003-1',
            titleTh: 'การปรับแต่งสไตล์ผู้นำ',
            titleEn: 'Adaptive Leadership',
            contentTh: null,
            contentEn: 'Learn to adapt your leadership approach based on team needs and situational context.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 25,
          },
        ],
      },
      {
        id: 'mod-003-2',
        courseId: 'course-003',
        titleTh: 'การสร้างแรงบันดาลใจทีม',
        titleEn: 'Team Motivation',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-003-2-1',
            moduleId: 'mod-003-2',
            titleTh: 'ทฤษฎีแรงจูงใจ',
            titleEn: 'Motivation Theories',
            contentTh: null,
            contentEn: 'Understand key motivation theories and apply them to boost team performance.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 20,
          },
          {
            id: 'les-003-2-2',
            moduleId: 'mod-003-2',
            titleTh: 'การให้ Feedback ที่มีประสิทธิภาพ',
            titleEn: 'Effective Feedback',
            contentTh: null,
            contentEn: 'Master the art of giving constructive feedback that improves performance and morale.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 22,
          },
        ],
      },
    ],
  },

  // 4. Project Management 101
  {
    id: 'course-004',
    titleTh: 'การบริหารโครงการ 101',
    titleEn: 'Project Management 101',
    descriptionTh: 'เรียนรู้หลักการพื้นฐานของการบริหารโครงการและเครื่องมือที่ใช้งาน',
    descriptionEn: 'Foundational project management principles, methodologies, and tools for successful project delivery.',
    category: 'Technical',
    status: CourseStatus.PUBLISHED,
    selfEnroll: true,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-004',
    createdAt: '2025-03-15T08:00:00.000Z',
    updatedAt: '2025-11-01T10:00:00.000Z',
    _count: { enrollments: 10 },
    modules: [
      {
        id: 'mod-004-1',
        courseId: 'course-004',
        titleTh: 'พื้นฐานการบริหารโครงการ',
        titleEn: 'PM Fundamentals',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-004-1-1',
            moduleId: 'mod-004-1',
            titleTh: 'วงจรชีวิตโครงการ',
            titleEn: 'Project Lifecycle',
            contentTh: null,
            contentEn: 'Understand the five phases of a project: initiation, planning, execution, monitoring, and closure.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 25,
          },
          {
            id: 'les-004-1-2',
            moduleId: 'mod-004-1',
            titleTh: 'ขอบเขตและกำหนดการ',
            titleEn: 'Scope & Schedule',
            contentTh: null,
            contentEn: 'Define project scope, create work breakdown structures, and build realistic schedules.',
            videoUrl: null,
            videoType: null,
            fileUrl: 'https://example.com/files/pm-templates.pdf',
            sortOrder: 2,
            durationMinutes: 30,
          },
        ],
      },
      {
        id: 'mod-004-2',
        courseId: 'course-004',
        titleTh: 'Agile และ Scrum',
        titleEn: 'Agile & Scrum',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-004-2-1',
            moduleId: 'mod-004-2',
            titleTh: 'หลักการ Agile',
            titleEn: 'Agile Principles',
            contentTh: null,
            contentEn: 'Learn the Agile manifesto, core values, and how Agile differs from Waterfall.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 20,
          },
          {
            id: 'les-004-2-2',
            moduleId: 'mod-004-2',
            titleTh: 'Scrum Framework',
            titleEn: 'Scrum Framework',
            contentTh: null,
            contentEn: 'Understand Scrum roles, ceremonies, and artifacts for iterative project delivery.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 28,
          },
        ],
      },
    ],
  },

  // 5. Data Analytics Fundamentals
  {
    id: 'course-005',
    titleTh: 'พื้นฐานการวิเคราะห์ข้อมูล',
    titleEn: 'Data Analytics Fundamentals',
    descriptionTh: 'ทำความเข้าใจหลักการวิเคราะห์ข้อมูลและการใช้เครื่องมือสมัยใหม่',
    descriptionEn: 'Introduction to data analytics concepts, visualization, and decision-making with data.',
    category: 'Technical',
    status: CourseStatus.PUBLISHED,
    selfEnroll: true,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-003',
    createdAt: '2025-04-01T08:00:00.000Z',
    updatedAt: '2025-10-15T10:00:00.000Z',
    _count: { enrollments: 9 },
    modules: [
      {
        id: 'mod-005-1',
        courseId: 'course-005',
        titleTh: 'บทนำสู่การวิเคราะห์ข้อมูล',
        titleEn: 'Introduction to Data Analytics',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-005-1-1',
            moduleId: 'mod-005-1',
            titleTh: 'ข้อมูลคืออะไร',
            titleEn: 'What is Data?',
            contentTh: null,
            contentEn: 'Explore types of data, data sources, and the analytics lifecycle.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 15,
          },
          {
            id: 'les-005-1-2',
            moduleId: 'mod-005-1',
            titleTh: 'สถิติเบื้องต้น',
            titleEn: 'Basic Statistics',
            contentTh: null,
            contentEn: 'Learn mean, median, mode, standard deviation, and correlation.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 25,
          },
        ],
      },
      {
        id: 'mod-005-2',
        courseId: 'course-005',
        titleTh: 'การแสดงผลข้อมูล',
        titleEn: 'Data Visualization',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-005-2-1',
            moduleId: 'mod-005-2',
            titleTh: 'หลักการออกแบบ Dashboard',
            titleEn: 'Dashboard Design Principles',
            contentTh: null,
            contentEn: 'Design clear, effective dashboards that communicate insights at a glance.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 20,
          },
        ],
      },
    ],
  },

  // 6. Customer Service Excellence
  {
    id: 'course-006',
    titleTh: 'ความเป็นเลิศในการบริการลูกค้า',
    titleEn: 'Customer Service Excellence',
    descriptionTh: 'เทคนิคการบริการลูกค้าที่ยอดเยี่ยมเพื่อสร้างความพึงพอใจสูงสุด',
    descriptionEn: 'Techniques and mindsets for delivering exceptional customer experiences at every touchpoint.',
    category: 'Soft Skills',
    status: CourseStatus.PUBLISHED,
    selfEnroll: true,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-004',
    createdAt: '2025-05-01T08:00:00.000Z',
    updatedAt: '2025-11-20T10:00:00.000Z',
    _count: { enrollments: 11 },
    modules: [
      {
        id: 'mod-006-1',
        courseId: 'course-006',
        titleTh: 'ทัศนคติการบริการ',
        titleEn: 'Service Mindset',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-006-1-1',
            moduleId: 'mod-006-1',
            titleTh: 'ลูกค้าคือใคร',
            titleEn: 'Understanding Your Customer',
            contentTh: null,
            contentEn: 'Develop empathy for customers and understand what drives their satisfaction.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 18,
          },
          {
            id: 'les-006-1-2',
            moduleId: 'mod-006-1',
            titleTh: 'การสื่อสารเชิงบวก',
            titleEn: 'Positive Communication',
            contentTh: null,
            contentEn: 'Use language and tone that builds trust, resolves issues, and leaves customers feeling valued.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 22,
          },
        ],
      },
      {
        id: 'mod-006-2',
        courseId: 'course-006',
        titleTh: 'การจัดการข้อร้องเรียน',
        titleEn: 'Handling Complaints',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-006-2-1',
            moduleId: 'mod-006-2',
            titleTh: 'กระบวนการแก้ปัญหา',
            titleEn: 'Problem Resolution Process',
            contentTh: null,
            contentEn: 'Step-by-step approach to de-escalating issues and finding satisfactory resolutions.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 25,
          },
        ],
      },
    ],
  },

  // 7. Compliance Training
  {
    id: 'course-007',
    titleTh: 'การฝึกอบรมด้านการปฏิบัติตามกฎระเบียบ',
    titleEn: 'Compliance Training',
    descriptionTh: 'ทำความเข้าใจกฎหมาย ระเบียบ และมาตรฐานที่บริษัทต้องปฏิบัติตาม',
    descriptionEn: 'Mandatory training covering legal requirements, industry regulations, and company compliance standards.',
    category: 'Compliance',
    status: CourseStatus.PUBLISHED,
    selfEnroll: false,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-002',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2025-12-01T10:00:00.000Z',
    _count: { enrollments: 15 },
    modules: [
      {
        id: 'mod-007-1',
        courseId: 'course-007',
        titleTh: 'กฎหมายและระเบียบ',
        titleEn: 'Laws & Regulations',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-007-1-1',
            moduleId: 'mod-007-1',
            titleTh: 'กฎหมายคุ้มครองข้อมูลส่วนบุคคล',
            titleEn: 'Data Privacy Laws',
            contentTh: null,
            contentEn: 'Understand PDPA, GDPR, and other data privacy regulations affecting our business.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 30,
          },
          {
            id: 'les-007-1-2',
            moduleId: 'mod-007-1',
            titleTh: 'ป้องกันการทุจริตและติดสินบน',
            titleEn: 'Anti-Corruption & Anti-Bribery',
            contentTh: null,
            contentEn: 'Recognize and report corruption, bribery, and conflicts of interest.',
            videoUrl: null,
            videoType: null,
            fileUrl: 'https://example.com/files/anti-corruption-policy.pdf',
            sortOrder: 2,
            durationMinutes: 25,
          },
        ],
      },
      {
        id: 'mod-007-2',
        courseId: 'course-007',
        titleTh: 'มาตรฐานสถานที่ทำงาน',
        titleEn: 'Workplace Standards',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-007-2-1',
            moduleId: 'mod-007-2',
            titleTh: 'ความปลอดภัยและอาชีวอนามัย',
            titleEn: 'Health & Safety',
            contentTh: null,
            contentEn: 'Workplace safety standards, emergency procedures, and occupational health requirements.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            videoType: VideoType.YOUTUBE,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 20,
          },
          {
            id: 'les-007-2-2',
            moduleId: 'mod-007-2',
            titleTh: 'ความเท่าเทียมและการไม่เลือกปฏิบัติ',
            titleEn: 'Equality & Non-Discrimination',
            contentTh: null,
            contentEn: 'Promote an inclusive workplace free from discrimination, harassment, and bias.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 18,
          },
        ],
      },
    ],
  },

  // 8. Effective Communication (DRAFT)
  {
    id: 'course-008',
    titleTh: 'การสื่อสารที่มีประสิทธิภาพ',
    titleEn: 'Effective Communication',
    descriptionTh: 'พัฒนาทักษะการสื่อสารทั้งในและนอกสถานที่ทำงาน',
    descriptionEn: 'Build strong communication skills for presentations, meetings, emails, and difficult conversations.',
    category: 'Soft Skills',
    status: CourseStatus.DRAFT,
    selfEnroll: false,
    thumbnailUrl: null,
    orgId: 'org-001',
    createdBy: 'user-004',
    createdAt: '2025-11-01T08:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z',
    _count: { enrollments: 0 },
    modules: [
      {
        id: 'mod-008-1',
        courseId: 'course-008',
        titleTh: 'การสื่อสารด้วยวาจา',
        titleEn: 'Verbal Communication',
        sortOrder: 1,
        lessons: [
          {
            id: 'les-008-1-1',
            moduleId: 'mod-008-1',
            titleTh: 'ศิลปะการนำเสนอ',
            titleEn: 'The Art of Presentation',
            contentTh: null,
            contentEn: 'Structure and deliver compelling presentations that engage and persuade your audience.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 35,
          },
          {
            id: 'les-008-1-2',
            moduleId: 'mod-008-1',
            titleTh: 'การฟังอย่างตั้งใจ',
            titleEn: 'Active Listening',
            contentTh: null,
            contentEn: 'Develop active listening skills to improve understanding, relationships, and problem-solving.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 2,
            durationMinutes: 20,
          },
        ],
      },
      {
        id: 'mod-008-2',
        courseId: 'course-008',
        titleTh: 'การสื่อสารเป็นลายลักษณ์อักษร',
        titleEn: 'Written Communication',
        sortOrder: 2,
        lessons: [
          {
            id: 'les-008-2-1',
            moduleId: 'mod-008-2',
            titleTh: 'การเขียนอีเมลอย่างมืออาชีพ',
            titleEn: 'Professional Email Writing',
            contentTh: null,
            contentEn: 'Write clear, concise, and professional emails that get results.',
            videoUrl: null,
            videoType: null,
            fileUrl: null,
            sortOrder: 1,
            durationMinutes: 15,
          },
        ],
      },
    ],
  },
];

// ============================================================
// ENROLLMENTS (20 total with varied statuses)
// ============================================================

export const mockEnrollments: Enrollment[] = [
  // John Smith (user-005)
  { id: 'enroll-001', userId: 'user-005', courseId: 'course-001', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-02-20T08:00:00.000Z', completedAt: '2025-03-01T16:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-002', userId: 'user-005', courseId: 'course-002', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-03-05T08:00:00.000Z', completedAt: '2025-03-20T14:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-003', userId: 'user-005', courseId: 'course-004', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 60, enrolledAt: '2025-09-01T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Jessica Williams (user-006)
  { id: 'enroll-004', userId: 'user-006', courseId: 'course-001', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-03-05T08:00:00.000Z', completedAt: '2025-03-18T11:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-005', userId: 'user-006', courseId: 'course-003', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 45, enrolledAt: '2025-10-10T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  { id: 'enroll-006', userId: 'user-006', courseId: 'course-006', status: EnrollmentStatusEnum.NOT_STARTED, progressPct: 0, enrolledAt: '2025-12-01T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // David Miller (user-007)
  { id: 'enroll-007', userId: 'user-007', courseId: 'course-001', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-03-12T08:00:00.000Z', completedAt: '2025-03-25T15:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-008', userId: 'user-007', courseId: 'course-007', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-04-01T08:00:00.000Z', completedAt: '2025-04-15T10:00:00.000Z', orgId: 'org-001' },
  // Amanda Wilson (user-008)
  { id: 'enroll-009', userId: 'user-008', courseId: 'course-001', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-04-05T08:00:00.000Z', completedAt: '2025-04-20T14:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-010', userId: 'user-008', courseId: 'course-007', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 50, enrolledAt: '2025-11-01T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Robert Taylor (user-009)
  { id: 'enroll-011', userId: 'user-009', courseId: 'course-002', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-05-01T08:00:00.000Z', completedAt: '2025-05-15T16:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-012', userId: 'user-009', courseId: 'course-005', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 30, enrolledAt: '2025-10-20T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Jennifer Anderson (user-010)
  { id: 'enroll-013', userId: 'user-010', courseId: 'course-001', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-05-05T08:00:00.000Z', completedAt: '2025-05-20T12:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-014', userId: 'user-010', courseId: 'course-006', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 75, enrolledAt: '2025-11-10T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Lisa Jackson (user-012)
  { id: 'enroll-015', userId: 'user-012', courseId: 'course-003', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-06-10T08:00:00.000Z', completedAt: '2025-07-01T14:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-016', userId: 'user-012', courseId: 'course-005', status: EnrollmentStatusEnum.NOT_STARTED, progressPct: 0, enrolledAt: '2025-12-10T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Mark White (user-013)
  { id: 'enroll-017', userId: 'user-013', courseId: 'course-004', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-07-01T08:00:00.000Z', completedAt: '2025-08-01T16:00:00.000Z', orgId: 'org-001' },
  { id: 'enroll-018', userId: 'user-013', courseId: 'course-002', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 80, enrolledAt: '2025-11-15T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
  // Sarah Johnson (user-002) - mandatory compliance
  { id: 'enroll-019', userId: 'user-002', courseId: 'course-007', status: EnrollmentStatusEnum.COMPLETED, progressPct: 100, enrolledAt: '2025-01-20T08:00:00.000Z', completedAt: '2025-02-01T10:00:00.000Z', orgId: 'org-001' },
  // Christopher Thomas (user-011, INACTIVE) - stalled
  { id: 'enroll-020', userId: 'user-011', courseId: 'course-001', status: EnrollmentStatusEnum.IN_PROGRESS, progressPct: 20, enrolledAt: '2025-05-15T08:00:00.000Z', completedAt: null, orgId: 'org-001' },
];

// ============================================================
// QUIZZES (4 quizzes linked to courses)
// ============================================================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-001',
    courseId: 'course-002',
    titleTh: 'แบบทดสอบความปลอดภัยไซเบอร์',
    titleEn: 'Cybersecurity Knowledge Check',
    passingScore: 70,
    timeLimit: 30,
    maxAttempts: 3,
    randomizeQuestions: true,
    showResultsAfter: true,
    orgId: 'org-001',
    questions: [
      {
        id: 'q-001-1',
        quizId: 'quiz-001',
        type: QuizType.MCQ,
        questionTh: 'ข้อใดคือสัญญาณของอีเมลฟิชชิ่ง?',
        questionEn: 'Which of the following is a sign of a phishing email?',
        config: {
          choices: [
            { text_th: 'มาจากที่อยู่อีเมลที่คุ้นเคย', text_en: 'Comes from a familiar email address' },
            { text_th: 'มีลิงค์ที่น่าสงสัยหรือขอข้อมูลส่วนตัว', text_en: 'Contains suspicious links or requests personal information' },
            { text_th: 'มีการสะกดคำที่ถูกต้องทั้งหมด', text_en: 'Has perfect spelling and grammar' },
            { text_th: 'ส่งมาในเวลาทำการปกติ', text_en: 'Sent during normal business hours' },
          ],
          correctIndices: [1],
          explanation_en: 'Phishing emails often contain suspicious links, urgent requests, or ask for personal information.',
        },
        points: 10,
        sortOrder: 1,
      },
      {
        id: 'q-001-2',
        quizId: 'quiz-001',
        type: QuizType.MCQ,
        questionTh: 'รหัสผ่านที่ปลอดภัยควรมีลักษณะอย่างไร?',
        questionEn: 'What makes a strong password?',
        config: {
          choices: [
            { text_th: 'ใช้ชื่อและวันเกิด', text_en: 'Uses your name and birthday' },
            { text_th: 'มีความยาวอย่างน้อย 12 ตัวอักษรและผสมตัวอักษร ตัวเลข และสัญลักษณ์', text_en: 'At least 12 characters with letters, numbers, and symbols' },
            { text_th: 'ใช้รหัสผ่านเดียวกันสำหรับทุกบัญชี', text_en: 'Same password for all accounts' },
            { text_th: 'ความยาวแค่ 6 ตัวอักษร', text_en: 'Only 6 characters long' },
          ],
          correctIndices: [1],
          explanation_en: 'A strong password should be at least 12 characters and include a mix of uppercase, lowercase, numbers, and special characters.',
        },
        points: 10,
        sortOrder: 2,
      },
    ],
  },
  {
    id: 'quiz-002',
    courseId: 'course-007',
    titleTh: 'แบบทดสอบการปฏิบัติตามกฎระเบียบ',
    titleEn: 'Compliance Knowledge Assessment',
    passingScore: 80,
    timeLimit: 45,
    maxAttempts: 2,
    randomizeQuestions: false,
    showResultsAfter: true,
    orgId: 'org-001',
    questions: [
      {
        id: 'q-002-1',
        quizId: 'quiz-002',
        type: QuizType.MCQ,
        questionTh: 'PDPA ย่อมาจากอะไร?',
        questionEn: 'What does PDPA stand for?',
        config: {
          choices: [
            { text_th: 'Personal Data Protection Act', text_en: 'Personal Data Protection Act' },
            { text_th: 'Public Data Privacy Agreement', text_en: 'Public Data Privacy Agreement' },
            { text_th: 'Protected Database Processing Authority', text_en: 'Protected Database Processing Authority' },
            { text_th: 'Private Data Preservation Act', text_en: 'Private Data Preservation Act' },
          ],
          correctIndices: [0],
          explanation_en: 'PDPA stands for Personal Data Protection Act, which regulates how organizations collect, use, and store personal data.',
        },
        points: 10,
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'quiz-003',
    courseId: 'course-003',
    titleTh: 'แบบทดสอบทักษะผู้นำ',
    titleEn: 'Leadership Skills Quiz',
    passingScore: 70,
    timeLimit: 20,
    maxAttempts: 3,
    randomizeQuestions: true,
    showResultsAfter: true,
    orgId: 'org-001',
    questions: [
      {
        id: 'q-003-1',
        quizId: 'quiz-003',
        type: QuizType.MCQ,
        questionTh: 'ผู้นำแบบ Servant Leadership มุ่งเน้นสิ่งใดเป็นหลัก?',
        questionEn: 'What is the primary focus of servant leadership?',
        config: {
          choices: [
            { text_th: 'การควบคุมและสั่งการ', text_en: 'Control and command' },
            { text_th: 'การรับใช้และพัฒนาทีม', text_en: 'Serving and developing the team' },
            { text_th: 'การบรรลุเป้าหมายส่วนตัว', text_en: 'Personal goal achievement' },
            { text_th: 'การสร้างกำไรสูงสุด', text_en: 'Maximizing profits' },
          ],
          correctIndices: [1],
          explanation_en: 'Servant leadership prioritizes the growth and well-being of team members, enabling them to perform at their best.',
        },
        points: 10,
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'quiz-004',
    courseId: 'course-004',
    titleTh: 'แบบทดสอบการบริหารโครงการ',
    titleEn: 'Project Management Quiz',
    passingScore: 75,
    timeLimit: 30,
    maxAttempts: 3,
    randomizeQuestions: true,
    showResultsAfter: true,
    orgId: 'org-001',
    questions: [
      {
        id: 'q-004-1',
        quizId: 'quiz-004',
        type: QuizType.MCQ,
        questionTh: 'ขั้นตอนแรกของวงจรชีวิตโครงการคืออะไร?',
        questionEn: 'What is the first phase of the project lifecycle?',
        config: {
          choices: [
            { text_th: 'การวางแผน', text_en: 'Planning' },
            { text_th: 'การดำเนินการ', text_en: 'Execution' },
            { text_th: 'การริเริ่ม', text_en: 'Initiation' },
            { text_th: 'การปิดโครงการ', text_en: 'Closure' },
          ],
          correctIndices: [2],
          explanation_en: "The project lifecycle begins with Initiation, where the project's feasibility, goals, and stakeholders are identified.",
        },
        points: 10,
        sortOrder: 1,
      },
    ],
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================

export const mockDashboardStats: DashboardStats = {
  totalCourses: mockCourses.length,
  totalUsers: mockUsers.length,
  totalEnrollments: mockEnrollments.length,
  completionRate: Math.round(
    (mockEnrollments.filter((e) => e.status === EnrollmentStatusEnum.COMPLETED).length /
      mockEnrollments.length) *
      100,
  ),
  activeUsers: mockUsers.filter((u) => u.status === UserStatus.ACTIVE).length,
  coursesThisMonth: mockCourses.filter(
    (c) => new Date(c.createdAt) >= new Date('2026-01-01T00:00:00.000Z'),
  ).length,
  // Legacy delta fields for dashboard chart compatibility
  coursesDelta: 2,
  studentsDelta: 18,
  enrollmentsDelta: 12,
  completionDelta: 5,
};

// ============================================================
// LEGACY CHART DATA (kept for dashboard compatibility)
// ============================================================

// Enrollment trends - last 6 months (Sep 2025 - Feb 2026)
export const mockEnrollmentTrends = [
  { month: 'Sep', newEnrollments: 28, completions: 18 },
  { month: 'Oct', newEnrollments: 35, completions: 22 },
  { month: 'Nov', newEnrollments: 31, completions: 27 },
  { month: 'Dec', newEnrollments: 20, completions: 19 },
  { month: 'Jan', newEnrollments: 42, completions: 31 },
  { month: 'Feb', newEnrollments: 38, completions: 29 },
];

// Course category distribution
export const mockCategoryDistribution = [
  { name: 'Technical', value: 35, color: '#2563eb' },
  { name: 'Leadership', value: 25, color: '#0891b2' },
  { name: 'Compliance', value: 20, color: '#0d9488' },
  { name: 'Soft Skills', value: 20, color: '#7c3aed' },
];

// Recent enrollments (for dashboard table display)
export type RecentEnrollmentStatus = 'Completed' | 'In Progress' | 'Not Started';

export interface RecentEnrollment {
  id: string;
  studentName: string;
  courseName: string;
  progress: number;
  status: RecentEnrollmentStatus;
  enrolledAt: string;
}

export const mockRecentEnrollments: RecentEnrollment[] = [
  { id: 'enr-001', studentName: 'Sarah Johnson', courseName: 'Cybersecurity Basics', progress: 100, status: 'Completed', enrolledAt: '2026-02-18' },
  { id: 'enr-002', studentName: 'Michael Brown', courseName: 'Project Management 101', progress: 65, status: 'In Progress', enrolledAt: '2026-02-20' },
  { id: 'enr-003', studentName: 'Emily Davis', courseName: 'Compliance Training', progress: 40, status: 'In Progress', enrolledAt: '2026-02-21' },
  { id: 'enr-004', studentName: 'David Miller', courseName: 'Leadership Skills', progress: 0, status: 'Not Started', enrolledAt: '2026-02-22' },
  { id: 'enr-005', studentName: 'Amanda Wilson', courseName: 'Effective Communication', progress: 88, status: 'In Progress', enrolledAt: '2026-02-23' },
];

// Popular courses (for dashboard display)
export interface PopularCourse {
  id: string;
  name: string;
  enrollments: number;
  rating: number;
  category: string;
}

export const mockPopularCourses: PopularCourse[] = [
  { id: 'crs-001', name: 'Cybersecurity Basics', enrollments: 89, rating: 4.8, category: 'Technical' },
  { id: 'crs-002', name: 'Compliance Training', enrollments: 74, rating: 4.6, category: 'Compliance' },
  { id: 'crs-003', name: 'Leadership Skills', enrollments: 61, rating: 4.7, category: 'Leadership' },
  { id: 'crs-004', name: 'Project Management 101', enrollments: 58, rating: 4.5, category: 'Technical' },
  { id: 'crs-005', name: 'Effective Communication', enrollments: 52, rating: 4.4, category: 'Soft Skills' },
];

// ============================================================
// CREDENTIAL STORE (for mock auth validation)
// ============================================================

interface MockCredential {
  email: string;
  password: string;
  userId: string;
}

export const mockCredentials: MockCredential[] = [
  { email: 'test@test.com', password: 'admin123', userId: 'user-001' },
  { email: 'sarah.johnson@acme.com', password: 'password123', userId: 'user-002' },
  { email: 'michael.brown@acme.com', password: 'password123', userId: 'user-003' },
  { email: 'emily.davis@acme.com', password: 'password123', userId: 'user-004' },
  { email: 'john.smith@acme.com', password: 'password123', userId: 'user-005' },
  { email: 'james.martin@acme.com', password: 'password123', userId: 'user-015' },
];

import { Role } from '../types/auth';

export const ROLE_PRIORITY: Record<Role, number> = {
  [Role.SYSTEM_ADMIN]: 1,
  [Role.COURSE_ADMIN]: 2,
  [Role.INSTRUCTOR]: 3,
  [Role.STUDENT]: 4,
  [Role.AUDITOR]: 99,
};

export const ROLE_LABELS: Record<Role, { th: string; en: string }> = {
  [Role.SYSTEM_ADMIN]: { th: 'ผู้ดูแลระบบ', en: 'System Admin' },
  [Role.COURSE_ADMIN]: { th: 'ผู้จัดการหลักสูตร', en: 'Course Admin' },
  [Role.INSTRUCTOR]: { th: 'ผู้สอน', en: 'Instructor' },
  [Role.STUDENT]: { th: 'ผู้เรียน', en: 'Student' },
  [Role.AUDITOR]: { th: 'ผู้ตรวจสอบ', en: 'Auditor' },
};

export const AD_GROUP_MAPPING: Record<string, Role> = {
  LMS_System_Admin: Role.SYSTEM_ADMIN,
  LMS_Course_Admin: Role.COURSE_ADMIN,
  LMS_Instructor: Role.INSTRUCTOR,
  LMS_Student: Role.STUDENT,
};

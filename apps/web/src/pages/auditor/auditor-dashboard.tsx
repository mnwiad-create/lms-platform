import {
  ShieldCheck,
  BookOpen,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import {
  mockCourses,
  mockEnrollments,
  mockUsers,
  mockOrgUnits,
  EnrollmentStatusEnum,
  CourseStatus,
  UserStatus,
  Role,
} from '@/lib/mock-data';

// ============================================================
// COMPUTED AUDIT STATS
// ============================================================

const totalCourses = mockCourses.length;
const publishedCourses = mockCourses.filter((c) => c.status === CourseStatus.PUBLISHED).length;
const draftCourses = mockCourses.filter((c) => c.status === CourseStatus.DRAFT).length;

const totalEnrollments = mockEnrollments.length;
const completedEnrollments = mockEnrollments.filter((e) => e.status === EnrollmentStatusEnum.COMPLETED).length;
const inProgressEnrollments = mockEnrollments.filter((e) => e.status === EnrollmentStatusEnum.IN_PROGRESS).length;
const notStartedEnrollments = mockEnrollments.filter((e) => e.status === EnrollmentStatusEnum.NOT_STARTED).length;

const totalStudents = mockUsers.filter((u) => u.role === Role.STUDENT).length;
const activeStudents = mockUsers.filter((u) => u.role === Role.STUDENT && u.status === UserStatus.ACTIVE).length;
const inactiveStudents = mockUsers.filter((u) => u.role === Role.STUDENT && u.status === UserStatus.INACTIVE).length;
const suspendedStudents = mockUsers.filter((u) => u.role === Role.STUDENT && u.status === UserStatus.SUSPENDED).length;

const completionRate = totalEnrollments > 0
  ? Math.round((completedEnrollments / totalEnrollments) * 100)
  : 0;

// Compliance courses (Compliance category)
const complianceCourses = mockCourses.filter((c) => c.category === 'Compliance');
const complianceEnrollments = mockEnrollments.filter((e) =>
  complianceCourses.some((c) => c.id === e.courseId)
);
const complianceCompleted = complianceEnrollments.filter(
  (e) => e.status === EnrollmentStatusEnum.COMPLETED
).length;
const complianceRate = complianceEnrollments.length > 0
  ? Math.round((complianceCompleted / complianceEnrollments.length) * 100)
  : 0;

// Per-department stats
const departmentStats = mockOrgUnits.map((unit) => {
  const deptUsers = mockUsers.filter((u) => u.orgUnitId === unit.id && u.role === Role.STUDENT);
  const deptEnrollments = mockEnrollments.filter((e) =>
    deptUsers.some((u) => u.id === e.userId)
  );
  const deptCompleted = deptEnrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.COMPLETED
  ).length;

  return {
    department: unit.nameEn,
    students: deptUsers.length,
    enrollments: deptEnrollments.length,
    completed: deptCompleted,
    rate: deptEnrollments.length > 0 ? Math.round((deptCompleted / deptEnrollments.length) * 100) : 0,
  };
});

// Per-course completion stats
const courseCompletionStats = mockCourses
  .filter((c) => c.status === CourseStatus.PUBLISHED)
  .map((course) => {
    const courseEnrollments = mockEnrollments.filter((e) => e.courseId === course.id);
    const courseCompleted = courseEnrollments.filter(
      (e) => e.status === EnrollmentStatusEnum.COMPLETED
    ).length;
    return {
      id: course.id,
      title: course.titleEn,
      category: course.category ?? 'Uncategorized',
      totalEnrollments: courseEnrollments.length,
      completed: courseCompleted,
      rate: courseEnrollments.length > 0 ? Math.round((courseCompleted / courseEnrollments.length) * 100) : 0,
    };
  })
  .sort((a, b) => b.totalEnrollments - a.totalEnrollments);

// ============================================================
// STAT CARD DATA
// ============================================================

interface StatCard {
  label: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const statCards: StatCard[] = [
  {
    label: 'Overall Completion',
    value: `${completionRate}%`,
    detail: `${completedEnrollments} of ${totalEnrollments} enrollments`,
    icon: TrendingUp,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    label: 'Compliance Rate',
    value: `${complianceRate}%`,
    detail: `${complianceCompleted} of ${complianceEnrollments.length} compliance enrollments`,
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Published Courses',
    value: `${publishedCourses}`,
    detail: `${draftCourses} draft, ${totalCourses} total`,
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Active Students',
    value: `${activeStudents}`,
    detail: `${inactiveStudents} inactive, ${suspendedStudents} suspended`,
    icon: Users,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
];

// ============================================================
// COMPONENT
// ============================================================

export function AuditorDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Read-only notice */}
      <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5">
        <ShieldCheck className="h-4 w-4 text-teal-600" />
        <p className="text-sm text-teal-700">
          <span className="font-medium">Auditor View</span> — You have read-only access to platform data for compliance and audit purposes.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Enrollment Status Breakdown + Department Performance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Enrollment status breakdown */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Enrollment Status Breakdown</h2>
          <div className="space-y-3">
            <StatusBar
              label="Completed"
              count={completedEnrollments}
              total={totalEnrollments}
              color="bg-emerald-500"
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
            />
            <StatusBar
              label="In Progress"
              count={inProgressEnrollments}
              total={totalEnrollments}
              color="bg-blue-500"
              icon={<Clock className="h-4 w-4 text-blue-500" />}
            />
            <StatusBar
              label="Not Started"
              count={notStartedEnrollments}
              total={totalEnrollments}
              color="bg-amber-500"
              icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
            />
          </div>
        </div>

        {/* Department performance */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Completion Rate by Department</h2>
          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div key={dept.department} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground truncate">
                  {dept.department}
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-teal-500 transition-all"
                    style={{ width: `${dept.rate}%` }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-semibold text-foreground">
                  {dept.rate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course completion table */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Course Completion Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Course</th>
                <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                <th className="pb-3 text-center text-xs font-medium text-muted-foreground">Enrolled</th>
                <th className="pb-3 text-center text-xs font-medium text-muted-foreground">Completed</th>
                <th className="pb-3 text-right text-xs font-medium text-muted-foreground">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courseCompletionStats.map((course) => (
                <tr key={course.id} className="group">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-foreground">{course.title}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-3 text-center text-muted-foreground">{course.totalEnrollments}</td>
                  <td className="py-3 text-center text-muted-foreground">{course.completed}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`text-xs font-semibold ${
                        course.rate >= 80
                          ? 'text-emerald-600'
                          : course.rate >= 50
                          ? 'text-amber-600'
                          : 'text-red-500'
                      }`}
                    >
                      {course.rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENT: Status Bar
// ============================================================

function StatusBar({
  label,
  count,
  total,
  color,
  icon,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  icon: React.ReactNode;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">
            {count} ({pct}%)
          </span>
        </div>
        <div className="relative h-2 rounded-full bg-muted">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${color} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router';
import {
  BookOpen,
  Users,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
  Activity,
  UserPlus,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/auth-store';
import {
  mockCourses,
  mockEnrollments,
  EnrollmentStatusEnum,
  CourseStatus,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

// Hardcoded mock recent activity
const recentActivity = [
  {
    text: 'Mark White submitted Cybersecurity Quiz',
    time: '2 hours ago',
    type: 'submission',
  },
  {
    text: 'John Smith completed Project Management 101',
    time: '5 hours ago',
    type: 'completion',
  },
  {
    text: 'Jessica Williams enrolled in Leadership Skills',
    time: '1 day ago',
    type: 'enrollment',
  },
  {
    text: 'Robert Taylor reached 30% in Data Analytics',
    time: '2 days ago',
    type: 'progress',
  },
];

type ActivityType = 'submission' | 'completion' | 'enrollment' | 'progress';

function getActivityIcon(type: ActivityType): React.ElementType {
  switch (type) {
    case 'submission':
      return ClipboardCheck;
    case 'completion':
      return CheckCircle2;
    case 'enrollment':
      return UserPlus;
    case 'progress':
    default:
      return BarChart3;
  }
}

function getActivityIconStyle(type: ActivityType): string {
  switch (type) {
    case 'submission':
      return 'bg-amber-50 text-amber-600';
    case 'completion':
      return 'bg-emerald-50 text-emerald-600';
    case 'enrollment':
      return 'bg-indigo-50 text-indigo-600';
    case 'progress':
    default:
      return 'bg-blue-50 text-blue-600';
  }
}

export function InstructorDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Derive instructor-specific data from mock data
  const myCourses = mockCourses.filter((c) => c.createdBy === user?.id);
  const myEnrollments = mockEnrollments.filter((e) =>
    myCourses.some((c) => c.id === e.courseId),
  );

  // Unique student count across all enrollments
  const uniqueStudentIds = new Set(myEnrollments.map((e) => e.userId));
  const totalStudents = uniqueStudentIds.size;

  // Average completion rate: % of COMPLETED enrollments
  const completedCount = myEnrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.COMPLETED,
  ).length;
  const avgCompletionRate =
    myEnrollments.length > 0
      ? Math.round((completedCount / myEnrollments.length) * 100)
      : 0;

  // Published courses only (for performance section)
  const publishedCourses = myCourses.filter(
    (c) => c.status === CourseStatus.PUBLISHED,
  );

  // Stat cards config
  const statCards = [
    {
      label: 'Total Courses',
      value: String(myCourses.length),
      icon: BookOpen,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
    {
      label: 'Total Students',
      value: String(totalStudents),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg. Completion Rate',
      value: `${avgCompletionRate}%`,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Pending Grading',
      value: '3',
      icon: ClipboardCheck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user?.firstName ?? 'Instructor'}!
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Here's your teaching overview.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-lg shrink-0',
                  card.iconBg,
                )}
              >
                <card.icon className={cn('h-5 w-5', card.iconColor)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lower section: 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance - 2 cols */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {publishedCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 mb-3">
                    <BookOpen className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No published courses yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Publish a course to see performance data here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedCourses.map((course) => {
                    const courseEnrollments = myEnrollments.filter(
                      (e) => e.courseId === course.id,
                    );
                    const enrollmentCount = courseEnrollments.length;
                    const completedInCourse = courseEnrollments.filter(
                      (e) => e.status === EnrollmentStatusEnum.COMPLETED,
                    ).length;
                    const completionRate =
                      enrollmentCount > 0
                        ? Math.round(
                            (completedInCourse / enrollmentCount) * 100,
                          )
                        : 0;

                    return (
                      <div
                        key={course.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-indigo-50/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm font-semibold text-slate-900 leading-snug truncate">
                              {course.titleEn}
                            </span>
                            <div className="flex items-center gap-2">
                              {course.category && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0 border-slate-300 text-slate-600"
                                >
                                  {course.category}
                                </Badge>
                              )}
                              <span className="text-xs text-slate-500">
                                {enrollmentCount}{' '}
                                {enrollmentCount === 1 ? 'student' : 'students'}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 h-8 text-xs border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400"
                            onClick={() =>
                              navigate(`/instructor/courses/${course.id}`)
                            }
                          >
                            Manage
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={completionRate}
                            className="flex-1 h-2 bg-slate-200 [&>div]:bg-indigo-600"
                          />
                          <span className="text-xs font-semibold text-indigo-600 w-10 text-right">
                            {completionRate}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {completedInCourse} of {enrollmentCount} students
                          completed
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity - 1 col */}
        <div>
          <Card className="border border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {recentActivity.map((item, idx) => {
                  const Icon = getActivityIcon(item.type as ActivityType);
                  const iconStyle = getActivityIconStyle(
                    item.type as ActivityType,
                  );
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          iconStyle,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {item.text}
                        </p>
                        <span className="text-xs text-slate-400">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

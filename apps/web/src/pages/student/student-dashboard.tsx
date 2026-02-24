import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserEnrollments } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { EnrollmentStatusEnum } from '@/lib/mock-data';
import type { Enrollment } from '@/lib/api';
import { cn } from '@/lib/utils';

// Hardcoded upcoming deadlines (mock)
const upcomingDeadlines = [
  {
    id: 'deadline-001',
    title: 'Project Management 101 - Final Quiz',
    dueDate: '2026-03-15',
    courseId: 'course-004',
    urgency: 'medium' as const,
  },
  {
    id: 'deadline-002',
    title: 'Compliance Training - Annual Renewal',
    dueDate: '2026-03-31',
    courseId: 'course-007',
    urgency: 'low' as const,
  },
  {
    id: 'deadline-003',
    title: 'Data Analytics - Module 2 Assessment',
    dueDate: '2026-03-08',
    courseId: 'course-005',
    urgency: 'high' as const,
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    setIsLoading(true);
    getUserEnrollments(user.id)
      .then((data) => {
        if (!cancelled) setEnrollments(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Derived stats
  const totalEnrolled = enrollments.length;
  const inProgress = enrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.IN_PROGRESS,
  );
  const completed = enrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.COMPLETED,
  );
  const avgProgress =
    totalEnrolled > 0
      ? Math.round(
          enrollments.reduce((sum, e) => sum + e.progressPct, 0) / totalEnrolled,
        )
      : 0;

  const statCards = [
    {
      label: 'Enrolled Courses',
      value: isLoading ? '...' : String(totalEnrolled),
      icon: BookOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'In Progress',
      value: isLoading ? '...' : String(inProgress.length),
      icon: TrendingUp,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Completed',
      value: isLoading ? '...' : String(completed.length),
      icon: Award,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Avg. Progress',
      value: isLoading ? '...' : `${avgProgress}%`,
      icon: Clock,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back, {user?.firstName ?? 'Learner'}!
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Track your learning progress and pick up where you left off.
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

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning - takes 2 cols */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Continue Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-lg bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : inProgress.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-3">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No courses in progress
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    All your active courses will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inProgress.map((enrollment) => {
                    const course = enrollment.course;
                    if (!course) return null;
                    return (
                      <div
                        key={enrollment.id}
                        className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm font-medium text-slate-900 truncate">
                              {course.titleEn}
                            </span>
                            {course.category && (
                              <Badge
                                variant="secondary"
                                className="w-fit text-xs px-2 py-0"
                              >
                                {course.category}
                              </Badge>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                            onClick={() =>
                              navigate(`/student/courses/${enrollment.courseId}`)
                            }
                          >
                            Continue
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={enrollment.progressPct}
                            className="flex-1 h-2 bg-slate-200 [&>div]:bg-blue-600"
                          />
                          <span className="text-xs font-semibold text-blue-600 w-9 text-right">
                            {enrollment.progressPct}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => {
                  const daysLeft = getDaysUntil(deadline.dueDate);
                  const isUrgent = daysLeft <= 7;
                  const isSoon = daysLeft <= 14;
                  return (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-sm font-medium text-slate-800 truncate">
                          {deadline.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          Due {formatDate(deadline.dueDate)}
                        </span>
                      </div>
                      <Badge
                        className={cn(
                          'shrink-0 text-xs font-semibold border-0',
                          isUrgent
                            ? 'bg-red-100 text-red-700'
                            : isSoon
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600',
                        )}
                      >
                        {daysLeft <= 0
                          ? 'Overdue'
                          : daysLeft === 1
                            ? '1 day left'
                            : `${daysLeft} days left`}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Completions - 1 col */}
        <div>
          <Card className="border border-slate-200 shadow-sm h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Recent Completions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 rounded-lg bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : completed.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 mb-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    No completed courses yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Courses you finish will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completed.map((enrollment) => {
                    const course = enrollment.course;
                    if (!course) return null;
                    return (
                      <div
                        key={enrollment.id}
                        className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium text-slate-800 leading-snug">
                            {course.titleEn}
                          </span>
                          {enrollment.completedAt && (
                            <span className="text-xs text-slate-400">
                              Completed {formatDate(enrollment.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

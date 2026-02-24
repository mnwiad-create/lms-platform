import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getUserEnrollments } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { EnrollmentStatusEnum } from '@/lib/mock-data';
import type { Enrollment } from '@/lib/api';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'in_progress' | 'completed' | 'not_started';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'not_started', label: 'Not Started' },
];

function getStatusConfig(status: EnrollmentStatusEnum): {
  label: string;
  badgeClass: string;
  buttonLabel: string;
  buttonIcon: React.ElementType;
} {
  switch (status) {
    case EnrollmentStatusEnum.COMPLETED:
      return {
        label: 'Completed',
        badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        buttonLabel: 'View Certificate',
        buttonIcon: CheckCircle2,
      };
    case EnrollmentStatusEnum.IN_PROGRESS:
      return {
        label: 'In Progress',
        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
        buttonLabel: 'Continue',
        buttonIcon: ArrowRight,
      };
    case EnrollmentStatusEnum.NOT_STARTED:
    default:
      return {
        label: 'Not Started',
        badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
        buttonLabel: 'Start',
        buttonIcon: PlayCircle,
      };
  }
}

function CourseCard({
  enrollment,
  onAction,
}: {
  enrollment: Enrollment;
  onAction: (courseId: string) => void;
}) {
  const course = enrollment.course;
  if (!course) return null;

  const statusConfig = getStatusConfig(enrollment.status);
  const ButtonIcon = statusConfig.buttonIcon;

  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 flex flex-col">
      {/* Card top accent bar based on status */}
      <div
        className={cn('h-1 w-full rounded-t-lg', {
          'bg-emerald-500': enrollment.status === EnrollmentStatusEnum.COMPLETED,
          'bg-blue-600': enrollment.status === EnrollmentStatusEnum.IN_PROGRESS,
          'bg-slate-300': enrollment.status === EnrollmentStatusEnum.NOT_STARTED,
        })}
      />
      <CardContent className="flex flex-col gap-4 p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2">
              {course.titleEn}
            </h3>
            {course.category && (
              <Badge
                variant="outline"
                className="w-fit text-xs px-2 py-0 border-slate-300 text-slate-600"
              >
                {course.category}
              </Badge>
            )}
          </div>
          <Badge
            className={cn(
              'shrink-0 text-xs font-semibold rounded-md px-2 py-0.5',
              statusConfig.badgeClass,
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Description */}
        {course.descriptionEn && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.descriptionEn}
          </p>
        )}

        {/* Progress section */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Progress</span>
            <span
              className={cn('text-xs font-semibold', {
                'text-emerald-600':
                  enrollment.status === EnrollmentStatusEnum.COMPLETED,
                'text-blue-600':
                  enrollment.status === EnrollmentStatusEnum.IN_PROGRESS,
                'text-slate-500':
                  enrollment.status === EnrollmentStatusEnum.NOT_STARTED,
              })}
            >
              {enrollment.progressPct}%
            </span>
          </div>
          <Progress
            value={enrollment.progressPct}
            className={cn('h-2', {
              'bg-emerald-100 [&>div]:bg-emerald-500':
                enrollment.status === EnrollmentStatusEnum.COMPLETED,
              'bg-blue-100 [&>div]:bg-blue-600':
                enrollment.status === EnrollmentStatusEnum.IN_PROGRESS,
              'bg-slate-200 [&>div]:bg-slate-400':
                enrollment.status === EnrollmentStatusEnum.NOT_STARTED,
            })}
          />
        </div>

        {/* Action button */}
        <Button
          size="sm"
          onClick={() => onAction(enrollment.courseId)}
          className={cn('w-full h-9 text-xs font-medium', {
            'bg-emerald-600 hover:bg-emerald-700 text-white':
              enrollment.status === EnrollmentStatusEnum.COMPLETED,
            'bg-blue-600 hover:bg-blue-700 text-white':
              enrollment.status === EnrollmentStatusEnum.IN_PROGRESS,
            'bg-slate-800 hover:bg-slate-900 text-white':
              enrollment.status === EnrollmentStatusEnum.NOT_STARTED,
          })}
        >
          {statusConfig.buttonLabel}
          <ButtonIcon className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function MyCourses() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

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

  // Filtered enrollments
  const filteredEnrollments = enrollments.filter((e) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'in_progress')
      return e.status === EnrollmentStatusEnum.IN_PROGRESS;
    if (activeFilter === 'completed')
      return e.status === EnrollmentStatusEnum.COMPLETED;
    if (activeFilter === 'not_started')
      return e.status === EnrollmentStatusEnum.NOT_STARTED;
    return true;
  });

  // Tab counts
  const counts: Record<FilterTab, number> = {
    all: enrollments.length,
    in_progress: enrollments.filter(
      (e) => e.status === EnrollmentStatusEnum.IN_PROGRESS,
    ).length,
    completed: enrollments.filter(
      (e) => e.status === EnrollmentStatusEnum.COMPLETED,
    ).length,
    not_started: enrollments.filter(
      (e) => e.status === EnrollmentStatusEnum.NOT_STARTED,
    ).length,
  };

  function handleCourseAction(courseId: string) {
    navigate(`/student/courses/${courseId}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Courses</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          All courses you are enrolled in, with your progress at a glance.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 -mb-px transition-colors',
              activeFilter === tab.id
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50',
            )}
          >
            {tab.label}
            {!isLoading && (
              <span
                className={cn(
                  'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600',
                )}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Course grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-lg border border-slate-200 bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 mb-4">
            <BookOpen className="h-7 w-7 text-blue-600" />
          </div>
          <h3 className="text-base font-medium text-slate-900 mb-1">
            {activeFilter === 'all'
              ? 'No courses yet'
              : `No ${FILTER_TABS.find((t) => t.id === activeFilter)?.label.toLowerCase()} courses`}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            {activeFilter === 'all'
              ? 'Courses that you are enrolled in will appear here.'
              : 'Try switching to a different filter to see your other courses.'}
          </p>
          {activeFilter !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-blue-600 border-blue-300 hover:bg-blue-50"
              onClick={() => setActiveFilter('all')}
            >
              View all courses
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEnrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              enrollment={enrollment}
              onAction={handleCourseAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

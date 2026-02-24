import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, Users, Plus, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
import type { Course } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type FilterTab = 'all' | 'published' | 'draft';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Draft' },
];

function getStatusBadgeClass(status: CourseStatus): string {
  switch (status) {
    case CourseStatus.PUBLISHED:
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case CourseStatus.DRAFT:
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case CourseStatus.ARCHIVED:
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

function getStatusLabel(status: CourseStatus): string {
  switch (status) {
    case CourseStatus.PUBLISHED:
      return 'Published';
    case CourseStatus.DRAFT:
      return 'Draft';
    case CourseStatus.ARCHIVED:
      return 'Archived';
  }
}

function getTopBarClass(status: CourseStatus): string {
  switch (status) {
    case CourseStatus.PUBLISHED:
      return 'bg-indigo-600';
    case CourseStatus.DRAFT:
      return 'bg-amber-400';
    case CourseStatus.ARCHIVED:
    default:
      return 'bg-slate-300';
  }
}

interface CourseCardProps {
  course: Course;
  enrollmentCount: number;
  completionRate: number;
  onManage: (courseId: string) => void;
}

function CourseCard({
  course,
  enrollmentCount,
  completionRate,
  onManage,
}: CourseCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex flex-col">
      {/* Top accent bar based on status */}
      <div className={cn('h-1 w-full rounded-t-lg', getTopBarClass(course.status))} />
      <CardContent className="flex flex-col gap-4 p-5 flex-1">
        {/* Header row: title + status badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 min-w-0">
            {course.titleEn}
          </h3>
          <Badge
            className={cn(
              'shrink-0 text-xs font-semibold rounded-md px-2 py-0.5 border',
              getStatusBadgeClass(course.status),
            )}
          >
            {getStatusLabel(course.status)}
          </Badge>
        </div>

        {/* Category badge */}
        {course.category && (
          <Badge
            variant="outline"
            className="w-fit text-xs px-2 py-0 border-slate-300 text-slate-600"
          >
            {course.category}
          </Badge>
        )}

        {/* Description */}
        {course.descriptionEn && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.descriptionEn}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {enrollmentCount}{' '}
            {enrollmentCount === 1 ? 'student' : 'students'}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {completionRate}% completion
          </span>
        </div>

        {/* Progress bar (only for published with enrollments) */}
        {course.status === CourseStatus.PUBLISHED && enrollmentCount > 0 && (
          <div className="flex flex-col gap-1.5 mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Avg. completion</span>
              <span className="text-xs font-semibold text-indigo-600">
                {completionRate}%
              </span>
            </div>
            <Progress
              value={completionRate}
              className="h-2 bg-slate-200 [&>div]:bg-indigo-600"
            />
          </div>
        )}

        {/* Manage button */}
        <Button
          size="sm"
          onClick={() => onManage(course.id)}
          className={cn('w-full h-9 text-xs font-medium mt-auto', {
            'bg-indigo-600 hover:bg-indigo-700 text-white':
              course.status === CourseStatus.PUBLISHED,
            'bg-amber-500 hover:bg-amber-600 text-white':
              course.status === CourseStatus.DRAFT,
            'bg-slate-600 hover:bg-slate-700 text-white':
              course.status === CourseStatus.ARCHIVED,
          })}
        >
          Manage
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function MyTeachingCourses() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // Derive instructor courses from mock data
  const myCourses = mockCourses.filter((c) => c.createdBy === user?.id);

  // Filter by active tab
  const filteredCourses = myCourses.filter((course) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'published')
      return course.status === CourseStatus.PUBLISHED;
    if (activeFilter === 'draft') return course.status === CourseStatus.DRAFT;
    return true;
  });

  // Tab counts
  const counts: Record<FilterTab, number> = {
    all: myCourses.length,
    published: myCourses.filter((c) => c.status === CourseStatus.PUBLISHED)
      .length,
    draft: myCourses.filter((c) => c.status === CourseStatus.DRAFT).length,
  };

  // Build per-course stats
  function getCourseStats(courseId: string): {
    enrollmentCount: number;
    completionRate: number;
  } {
    const courseEnrollments = mockEnrollments.filter(
      (e) => e.courseId === courseId,
    );
    const enrollmentCount = courseEnrollments.length;
    const completedCount = courseEnrollments.filter(
      (e) => e.status === EnrollmentStatusEnum.COMPLETED,
    ).length;
    const completionRate =
      enrollmentCount > 0
        ? Math.round((completedCount / enrollmentCount) * 100)
        : 0;
    return { enrollmentCount, completionRate };
  }

  function handleManage(courseId: string) {
    navigate(`/instructor/courses/${courseId}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and monitor all the courses you teach.
          </p>
        </div>
        <Button
          disabled
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-9 text-xs shrink-0 opacity-50 cursor-not-allowed"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create Course
        </Button>
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
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                activeFilter === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-600',
              )}
            >
              {counts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 mb-4">
            <BookOpen className="h-7 w-7 text-indigo-600" />
          </div>
          <h3 className="text-base font-medium text-slate-900 mb-1">
            {activeFilter === 'all'
              ? 'No courses yet'
              : `No ${FILTER_TABS.find((t) => t.id === activeFilter)?.label.toLowerCase()} courses`}
          </h3>
          <p className="text-sm text-slate-500 max-w-xs">
            {activeFilter === 'all'
              ? 'Courses you create will appear here.'
              : 'Try switching to a different filter to see your other courses.'}
          </p>
          {activeFilter !== 'all' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              onClick={() => setActiveFilter('all')}
            >
              View all courses
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => {
            const { enrollmentCount, completionRate } = getCourseStats(
              course.id,
            );
            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollmentCount={enrollmentCount}
                completionRate={completionRate}
                onManage={handleManage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

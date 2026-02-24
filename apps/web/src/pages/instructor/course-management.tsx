import { useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  mockCourses,
  mockEnrollments,
  mockUsers,
  mockQuizzes,
  EnrollmentStatusEnum,
  type Course,
  type Quiz,
} from '@/lib/mock-data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TabId = 'content' | 'students' | 'quizzes';

interface EnrichedEnrollment {
  id: string;
  studentName: string;
  email: string;
  progress: number;
  status: EnrollmentStatusEnum;
  enrolledAt: string;
}

interface MockSubmission {
  studentName: string;
  score: number;
  passed: boolean;
  date: string;
  maxScore: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type CourseStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

function getLessonIcon(lesson: { videoUrl: string | null; fileUrl: string | null }) {
  if (lesson.videoUrl) return <Video className="h-3.5 w-3.5 text-indigo-500" />;
  if (lesson.fileUrl) return <FileText className="h-3.5 w-3.5 text-amber-500" />;
  return <BookOpen className="h-3.5 w-3.5 text-slate-400" />;
}

function getLessonType(lesson: { videoUrl: string | null; fileUrl: string | null }): string {
  if (lesson.videoUrl) return 'Video';
  if (lesson.fileUrl) return 'File';
  return 'Reading';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadge(status: EnrollmentStatusEnum) {
  switch (status) {
    case EnrollmentStatusEnum.COMPLETED:
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
          Completed
        </Badge>
      );
    case EnrollmentStatusEnum.IN_PROGRESS:
      return (
        <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50">
          In Progress
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50">
          Not Started
        </Badge>
      );
  }
}

function getStatusLabel(status: CourseStatus): string {
  switch (status) {
    case 'PUBLISHED':
      return 'Published';
    case 'DRAFT':
      return 'Draft';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return status;
  }
}

// ---------------------------------------------------------------------------
// Mock quiz submissions
// ---------------------------------------------------------------------------

const mockSubmissions: MockSubmission[] = [
  { studentName: 'John Smith', score: 90, passed: true, date: '2025-03-18', maxScore: 100 },
  { studentName: 'Robert Taylor', score: 80, passed: true, date: '2025-05-14', maxScore: 100 },
  { studentName: 'Mark White', score: 60, passed: false, date: '2025-12-20', maxScore: 100 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ContentTab({ course }: { course: Course }) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  function toggleModule(moduleId: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Course info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Title</p>
              <p className="text-sm font-medium text-slate-900">{course.titleEn}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Category</p>
              <p className="text-sm text-slate-900">{course.category ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
              <Badge
                className={cn(
                  'hover:bg-inherit',
                  course.status === 'PUBLISHED' &&
                    'bg-emerald-50 text-emerald-700 border-emerald-200',
                  course.status === 'DRAFT' && 'bg-amber-50 text-amber-700 border-amber-200',
                  course.status === 'ARCHIVED' && 'bg-slate-50 text-slate-600 border-slate-200',
                )}
              >
                {getStatusLabel(course.status as CourseStatus)}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Self Enrollment</p>
              <p className="text-sm text-slate-900">{course.selfEnroll ? 'Enabled' : 'Disabled'}</p>
            </div>
          </div>
          {course.descriptionEn && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed">{course.descriptionEn}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700">
            Course Content ({course.modules?.length ?? 0} modules)
          </h3>
          <Button
            size="sm"
            disabled
            className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Module
          </Button>
        </div>

        {!course.modules || course.modules.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-slate-500 text-sm">
              No modules yet. Add your first module to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {course.modules
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((mod) => {
                const isExpanded = expandedModules.has(mod.id);
                const lessonCount = mod.lessons?.length ?? 0;

                return (
                  <Card key={mod.id} className="overflow-hidden">
                    {/* Module header */}
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center">
                          {mod.sortOrder}
                        </span>
                        <span className="text-sm font-medium text-slate-900">{mod.titleEn}</span>
                        <span className="text-xs text-slate-500">
                          {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 px-2.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border-0 disabled:opacity-50"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Lesson
                        </Button>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Lessons list */}
                    {isExpanded && (
                      <>
                        <Separator />
                        {!mod.lessons || mod.lessons.length === 0 ? (
                          <div className="px-4 py-4 text-xs text-slate-500 text-center">
                            No lessons in this module.
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-100">
                            {mod.lessons
                              .slice()
                              .sort((a, b) => a.sortOrder - b.sortOrder)
                              .map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 px-4 py-3 pl-14 hover:bg-slate-50/50"
                                >
                                  <span className="flex-shrink-0">
                                    {getLessonIcon(lesson)}
                                  </span>
                                  <span className="flex-1 text-sm text-slate-700 min-w-0 truncate">
                                    {lesson.titleEn}
                                  </span>
                                  <span className="text-xs text-slate-400 flex-shrink-0 bg-slate-100 px-2 py-0.5 rounded">
                                    {getLessonType(lesson)}
                                  </span>
                                  {lesson.durationMinutes && (
                                    <span className="text-xs text-slate-400 flex-shrink-0 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {lesson.durationMinutes}m
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentsTab({ enrollments }: { enrollments: EnrichedEnrollment[] }) {
  const total = enrollments.length;
  const completed = enrollments.filter((e) => e.status === EnrollmentStatusEnum.COMPLETED).length;
  const inProgress = enrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.IN_PROGRESS,
  ).length;
  const notStarted = enrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.NOT_STARTED,
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{total}</p>
                <p className="text-xs text-slate-500">Total Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completed}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{inProgress}</p>
                <p className="text-xs text-slate-500">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{notStarted}</p>
                <p className="text-xs text-slate-500">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students table */}
      <Card>
        <CardContent className="p-0">
          {enrollments.length === 0 ? (
            <div className="py-14 text-center text-slate-500 text-sm">
              No students enrolled in this course yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="pl-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Progress
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Enrolled
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => (
                  <TableRow
                    key={enrollment.id}
                    className="hover:bg-slate-50/60 border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {enrollment.studentName}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-600">{enrollment.email}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <Progress
                          value={enrollment.progress}
                          className="h-1.5 flex-1 bg-slate-100"
                        />
                        <span className="text-xs font-medium text-slate-600 w-9 text-right flex-shrink-0">
                          {enrollment.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(enrollment.status)}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(enrollment.enrolledAt)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuizzesTab({ quiz }: { quiz: Quiz | undefined }) {
  if (!quiz) {
    return (
      <Card>
        <CardContent className="py-16 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 mb-1">No Quiz Attached</p>
            <p className="text-xs text-slate-500">
              This course does not have a quiz yet. Create one to assess student knowledge.
            </p>
          </div>
          <Button
            disabled
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz info card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            Quiz Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Quiz Title</p>
              <p className="text-sm font-medium text-slate-900">{quiz.titleEn}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Passing Score</p>
              <p className="text-sm text-slate-900">{quiz.passingScore}%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Time Limit</p>
              <p className="text-sm text-slate-900">
                {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Max Attempts</p>
              <p className="text-sm text-slate-900">{quiz.maxAttempts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          Student Submissions ({mockSubmissions.length})
        </h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="pl-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Score
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Result
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((sub, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-slate-50/60 border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4">
                      <span className="text-sm font-medium text-slate-900">{sub.studentName}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-700">
                        {sub.score}/{sub.maxScore}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {sub.passed ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Pass
                        </Badge>
                      ) : (
                        <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50 gap-1">
                          <XCircle className="h-3 w-3" />
                          Fail
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-500">
                        {formatDate(sub.date)}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="h-7 px-3 text-xs border-slate-200 text-slate-600 disabled:opacity-50"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CourseManagement() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('content');

  // Load data from mock
  const course = mockCourses.find((c) => c.id === courseId);
  const quiz = mockQuizzes.find((q) => q.courseId === courseId);

  // Build enriched enrollments
  const enrollments: EnrichedEnrollment[] = mockEnrollments
    .filter((e) => e.courseId === courseId)
    .map((e) => {
      const user = mockUsers.find((u) => u.id === e.userId);
      return {
        id: e.id,
        studentName: user ? `${user.firstName} ${user.lastName}` : 'Unknown Student',
        email: user?.email ?? '',
        progress: e.progressPct,
        status: e.status,
        enrolledAt: e.enrolledAt,
      };
    });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4 p-8">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-slate-400" />
        </div>
        <p className="text-sm text-slate-600">Course not found.</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    {
      id: 'content',
      label: 'Content',
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: 'students',
      label: `Students (${enrollments.length})`,
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'quizzes',
      label: 'Quizzes',
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-full hover:bg-slate-100 flex-shrink-0 mt-0.5"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-slate-900 truncate">{course.titleEn}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Course Management
            {course.category && (
              <span className="ml-2 text-slate-400">· {course.category}</span>
            )}
          </p>
        </div>
      </div>

      {/* Simple button tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab panels */}
      <div>
        {activeTab === 'content' && <ContentTab course={course} />}
        {activeTab === 'students' && <StudentsTab enrollments={enrollments} />}
        {activeTab === 'quizzes' && <QuizzesTab quiz={quiz} />}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Users,
  FileText,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Video,
  BookOpen,
  HelpCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  CalendarDays,
  User,
  RefreshCw,
  ToggleRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Lesson {
  id: string;
  titleEn: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
}

interface Module {
  id: string;
  titleEn: string;
  sortOrder: number;
  lessons: Lesson[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  enrolledAt: string;
}

interface CourseDetail {
  id: string;
  titleEn: string;
  descriptionEn: string;
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  selfEnroll: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  enrollmentCount: number;
  completionRate: number;
  totalDuration: string;
  modules: Module[];
  students: Student[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const courseDetail: CourseDetail = {
  id: '1',
  titleEn: 'Onboarding Program',
  descriptionEn:
    'A comprehensive onboarding program designed to help new employees understand company culture, policies, and their role within the organization. This course covers everything from HR policies to team dynamics.',
  category: 'Compliance',
  status: 'PUBLISHED',
  selfEnroll: true,
  createdBy: 'John Smith',
  createdAt: '2025-08-15',
  updatedAt: '2026-01-20',
  enrollmentCount: 45,
  completionRate: 78,
  totalDuration: '4h 30m',
  modules: [
    {
      id: 'm1',
      titleEn: 'Welcome & Introduction',
      sortOrder: 1,
      lessons: [
        { id: 'l1', titleEn: 'Welcome Message', type: 'video', duration: '10 min' },
        { id: 'l2', titleEn: 'Company Overview', type: 'video', duration: '20 min' },
        { id: 'l3', titleEn: 'Meet the Team', type: 'document', duration: '15 min' },
      ],
    },
    {
      id: 'm2',
      titleEn: 'Policies & Procedures',
      sortOrder: 2,
      lessons: [
        { id: 'l4', titleEn: 'HR Policies', type: 'document', duration: '25 min' },
        { id: 'l5', titleEn: 'Code of Conduct', type: 'video', duration: '15 min' },
        { id: 'l6', titleEn: 'Policy Quiz', type: 'quiz', duration: '10 min' },
      ],
    },
    {
      id: 'm3',
      titleEn: 'Tools & Systems',
      sortOrder: 3,
      lessons: [
        { id: 'l7', titleEn: 'Email & Communication Tools', type: 'video', duration: '20 min' },
        { id: 'l8', titleEn: 'Project Management Software', type: 'video', duration: '25 min' },
        { id: 'l9', titleEn: 'IT Security Setup', type: 'document', duration: '15 min' },
      ],
    },
  ],
  students: [
    {
      id: 's1',
      name: 'Emily Davis',
      email: 'emily.davis@acme.com',
      progress: 100,
      status: 'COMPLETED',
      enrolledAt: '2025-09-01',
    },
    {
      id: 's2',
      name: 'Michael Brown',
      email: 'michael.brown@acme.com',
      progress: 75,
      status: 'IN_PROGRESS',
      enrolledAt: '2025-10-15',
    },
    {
      id: 's3',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@acme.com',
      progress: 45,
      status: 'IN_PROGRESS',
      enrolledAt: '2025-11-02',
    },
    {
      id: 's4',
      name: 'David Lee',
      email: 'david.lee@acme.com',
      progress: 90,
      status: 'IN_PROGRESS',
      enrolledAt: '2025-12-01',
    },
    {
      id: 's5',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@acme.com',
      progress: 0,
      status: 'NOT_STARTED',
      enrolledAt: '2026-01-15',
    },
  ],
};

function getCourseById(_id: string): CourseDetail {
  // In a real app this would fetch by id; for now return the mock
  return courseDetail;
}

// ---------------------------------------------------------------------------
// Small reusable components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: CourseDetail['status'] }) {
  if (status === 'PUBLISHED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Published
      </span>
    );
  }
  if (status === 'DRAFT') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Draft
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Archived
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colorMap: Record<string, string> = {
    Compliance: 'bg-blue-50 text-blue-700 border-blue-200',
    Technical: 'bg-violet-50 text-violet-700 border-violet-200',
    Leadership: 'bg-amber-50 text-amber-700 border-amber-200',
    'Soft Skills': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  const colorClass = colorMap[category] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${colorClass}`}
    >
      {category}
    </span>
  );
}

function LessonTypeIcon({ type }: { type: Lesson['type'] }) {
  if (type === 'video') return <Video className="h-3.5 w-3.5 text-blue-500" />;
  if (type === 'document') return <BookOpen className="h-3.5 w-3.5 text-violet-500" />;
  return <HelpCircle className="h-3.5 w-3.5 text-amber-500" />;
}

function StudentStatusBadge({ status }: { status: Student['status'] }) {
  if (status === 'COMPLETED') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </span>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-500">
      Not Started
    </span>
  );
}

// ---------------------------------------------------------------------------
// Enrollment bar chart (pure CSS/Tailwind, no external charting library)
// ---------------------------------------------------------------------------

const monthlyEnrollments = [
  { month: 'Aug', value: 8 },
  { month: 'Sep', value: 12 },
  { month: 'Oct', value: 7 },
  { month: 'Nov', value: 10 },
  { month: 'Dec', value: 5 },
  { month: 'Jan', value: 3 },
];

function EnrollmentBarChart() {
  const max = Math.max(...monthlyEnrollments.map((d) => d.value));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-2" style={{ height: '96px' }}>
        {monthlyEnrollments.map((d) => (
          <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
            <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
              <div
                className="w-full rounded-t bg-primary/70 transition-all"
                style={{ height: `${Math.max(4, (d.value / max) * 80)}px` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground leading-none">{d.month}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center">New enrollments per month</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Module accordion row
// ---------------------------------------------------------------------------

function ModuleRow({ module }: { module: Module }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
            {module.sortOrder}
          </span>
          <span className="font-medium text-sm text-foreground">{module.titleEn}</span>
          <span className="text-xs text-muted-foreground">
            {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
          </span>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {open && (
        <div className="divide-y divide-border">
          {module.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LessonTypeIcon type={lesson.type} />
                <span className="text-sm text-foreground">{lesson.titleEn}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {lesson.duration}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail row helper
// ---------------------------------------------------------------------------

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page export
// ---------------------------------------------------------------------------

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const course = getCourseById(id ?? '1');
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back navigation */}
      <button
        onClick={() => navigate('/admin/courses')}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </button>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground leading-tight">
            {course.titleEn}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={course.status} />
            <CategoryBadge category={course.category} />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            Edit Course
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules &amp; Lessons</TabsTrigger>
          <TabsTrigger value="students">
            Students
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold h-4 min-w-[16px] px-1">
              {course.students.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ============================================================== */}
        {/* Tab: Overview                                                    */}
        {/* ============================================================== */}
        <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
          {/* Description */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {course.descriptionEn}
              </p>
            </CardContent>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Enrolled</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{course.enrollmentCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">students</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Lessons</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{totalLessons}</p>
                <p className="text-xs text-muted-foreground mt-0.5">total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{course.totalDuration}</p>
                <p className="text-xs text-muted-foreground mt-0.5">estimated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Completion</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{course.completionRate}%</p>
                <p className="text-xs text-muted-foreground mt-0.5">rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Two-column details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Course Details</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <DetailRow
                  icon={<User className="h-4 w-4" />}
                  label="Created by"
                  value={course.createdBy}
                />
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={course.createdAt}
                />
                <DetailRow
                  icon={<RefreshCw className="h-4 w-4" />}
                  label="Last Updated"
                  value={course.updatedAt}
                />
                <DetailRow
                  icon={<ToggleRight className="h-4 w-4" />}
                  label="Self-Enrollment"
                  value={course.selfEnroll ? 'Enabled' : 'Disabled'}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Enrollment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <EnrollmentBarChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* Tab: Modules & Lessons                                          */}
        {/* ============================================================== */}
        <TabsContent value="modules" className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {course.modules.length} modules &middot; {totalLessons} lessons
            </p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Module
            </Button>
          </div>
          <div className="flex flex-col gap-3">
            {course.modules.map((module) => (
              <ModuleRow key={module.id} module={module} />
            ))}
          </div>
        </TabsContent>

        {/* ============================================================== */}
        {/* Tab: Students                                                   */}
        {/* ============================================================== */}
        <TabsContent value="students" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Enrolled Students
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({course.students.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Name
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                        Email
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Progress
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                        Enrolled
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {course.students.map((student) => (
                      <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                {student.name.charAt(0)}
                              </span>
                            </div>
                            <span className="font-medium text-foreground whitespace-nowrap">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground hidden sm:table-cell">
                          {student.email}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Progress value={student.progress} className="flex-1 h-1.5" />
                            <span className="text-xs text-muted-foreground w-9 text-right tabular-nums">
                              {student.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StudentStatusBadge status={student.status} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground hidden md:table-cell whitespace-nowrap">
                          {student.enrolledAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

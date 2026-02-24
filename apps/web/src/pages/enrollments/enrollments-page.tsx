import { useState } from 'react';
import {
  UserPlus,
  Search,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Types ---

type EnrollmentStatus = 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';

interface Enrollment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  progress: number;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt: string | null;
}

// --- Mock Data ---

const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@acme.com',
    courseName: 'Onboarding Program',
    progress: 100,
    status: 'COMPLETED',
    enrolledAt: '2025-09-01',
    completedAt: '2025-10-15',
  },
  {
    id: '2',
    studentName: 'Michael Brown',
    studentEmail: 'michael.brown@acme.com',
    courseName: 'Cybersecurity Basics',
    progress: 75,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-10-15',
    completedAt: null,
  },
  {
    id: '3',
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@acme.com',
    courseName: 'Leadership Skills',
    progress: 45,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-11-02',
    completedAt: null,
  },
  {
    id: '4',
    studentName: 'David Lee',
    studentEmail: 'david.lee@acme.com',
    courseName: 'Onboarding Program',
    progress: 90,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-12-01',
    completedAt: null,
  },
  {
    id: '5',
    studentName: 'Jessica Taylor',
    studentEmail: 'jessica.taylor@acme.com',
    courseName: 'Data Analytics Fundamentals',
    progress: 100,
    status: 'COMPLETED',
    enrolledAt: '2025-08-20',
    completedAt: '2025-11-30',
  },
  {
    id: '6',
    studentName: 'Robert Anderson',
    studentEmail: 'robert.anderson@acme.com',
    courseName: 'Compliance Training',
    progress: 60,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-11-15',
    completedAt: null,
  },
  {
    id: '7',
    studentName: 'Lisa Thomas',
    studentEmail: 'lisa.thomas@acme.com',
    courseName: 'Customer Service Excellence',
    progress: 100,
    status: 'COMPLETED',
    enrolledAt: '2025-07-10',
    completedAt: '2025-09-20',
  },
  {
    id: '8',
    studentName: 'James Martinez',
    studentEmail: 'james.martinez@acme.com',
    courseName: 'Effective Communication',
    progress: 30,
    status: 'IN_PROGRESS',
    enrolledAt: '2026-01-05',
    completedAt: null,
  },
  {
    id: '9',
    studentName: 'Amanda Garcia',
    studentEmail: 'amanda.garcia@acme.com',
    courseName: 'Project Management 101',
    progress: 0,
    status: 'NOT_STARTED',
    enrolledAt: '2026-02-01',
    completedAt: null,
  },
  {
    id: '10',
    studentName: 'Daniel White',
    studentEmail: 'daniel.white@acme.com',
    courseName: 'Cybersecurity Basics',
    progress: 55,
    status: 'IN_PROGRESS',
    enrolledAt: '2025-12-10',
    completedAt: null,
  },
  {
    id: '11',
    studentName: 'Jennifer Harris',
    studentEmail: 'jennifer.harris@acme.com',
    courseName: 'Onboarding Program',
    progress: 100,
    status: 'COMPLETED',
    enrolledAt: '2025-06-15',
    completedAt: '2025-08-01',
  },
  {
    id: '12',
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@acme.com',
    courseName: 'Leadership Skills',
    progress: 20,
    status: 'IN_PROGRESS',
    enrolledAt: '2026-01-20',
    completedAt: null,
  },
];

// --- Summary Stats ---

const summaryStats = [
  {
    label: 'Total Enrollments',
    value: 156,
    icon: BookOpen,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
  },
  {
    label: 'In Progress',
    value: 89,
    icon: TrendingUp,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
  },
  {
    label: 'Completed',
    value: 52,
    icon: CheckCircle2,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-50',
  },
  {
    label: 'Not Started',
    value: 15,
    icon: Clock,
    colorClass: 'text-slate-500',
    bgClass: 'bg-slate-50',
  },
];

// Unique course names for the dropdown filter
const courseNames = Array.from(
  new Set(mockEnrollments.map((e) => e.courseName))
).sort();

// --- Helper Functions ---

function getStatusConfig(status: EnrollmentStatus): {
  label: string;
  className: string;
} {
  const map: Record<EnrollmentStatus, { label: string; className: string }> = {
    COMPLETED: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
    NOT_STARTED: {
      label: 'Not Started',
      className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
    },
  };
  return map[status];
}

function getProgressColor(progress: number): string {
  if (progress > 75) return '[&>div]:bg-green-500';
  if (progress > 25) return '[&>div]:bg-blue-500';
  return '[&>div]:bg-slate-400';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// --- Component ---

export function EnrollmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  const filtered = mockEnrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.studentName.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      enrollment.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || enrollment.status === statusFilter;
    const matchesCourse =
      courseFilter === 'all' || enrollment.courseName === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Enrollments
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track student course enrollments
          </p>
        </div>
        <Button
          onClick={() => toast.info('Enroll Students dialog would open here')}
          className="w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Enroll Students
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between px-4 pb-2 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgClass}`}>
                  <Icon className={`h-4 w-4 ${stat.colorClass}`} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  {stat.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Course filter */}
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courseNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="hidden md:table-cell">Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Enrolled Date
                </TableHead>
                <TableHead className="hidden lg:table-cell pr-6">
                  Completed Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No enrollments found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((enrollment) => {
                  const statusConfig = getStatusConfig(enrollment.status);
                  return (
                    <TableRow key={enrollment.id}>
                      {/* Student */}
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
                              {getInitials(enrollment.studentName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {enrollment.studentName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {enrollment.studentEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Course */}
                      <TableCell className="max-w-[200px]">
                        <p className="truncate text-sm text-foreground">
                          {enrollment.courseName}
                        </p>
                      </TableCell>

                      {/* Progress */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-3">
                          <Progress
                            value={enrollment.progress}
                            className={`h-2 w-24 ${getProgressColor(enrollment.progress)}`}
                          />
                          <span className="min-w-[2.5rem] text-right text-xs font-medium text-muted-foreground">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs font-medium ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </Badge>
                      </TableCell>

                      {/* Enrolled Date */}
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {formatDate(enrollment.enrolledAt)}
                      </TableCell>

                      {/* Completed Date */}
                      <TableCell className="hidden pr-6 text-sm text-muted-foreground lg:table-cell">
                        {enrollment.completedAt
                          ? formatDate(enrollment.completedAt)
                          : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">{filtered.length}</span>{' '}
        of{' '}
        <span className="font-medium text-foreground">
          {mockEnrollments.length}
        </span>{' '}
        enrollments
      </p>
    </div>
  );
}

import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Eye, FileQuestion } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GradingStatus = 'graded' | 'pending';
type FilterTab = 'all' | 'pending' | 'graded';

interface GradingEntry {
  id: string;
  studentName: string;
  courseName: string;
  quizName: string;
  score: number;
  maxScore: number;
  passed: boolean;
  date: string;
  status: GradingStatus;
}

// ---------------------------------------------------------------------------
// Mock grading data
// ---------------------------------------------------------------------------

const mockGradingData: GradingEntry[] = [
  {
    id: 'sub-001',
    studentName: 'John Smith',
    courseName: 'Cybersecurity Basics',
    quizName: 'Cybersecurity Knowledge Check',
    score: 90,
    maxScore: 100,
    passed: true,
    date: '2025-03-18',
    status: 'graded',
  },
  {
    id: 'sub-002',
    studentName: 'Robert Taylor',
    courseName: 'Cybersecurity Basics',
    quizName: 'Cybersecurity Knowledge Check',
    score: 80,
    maxScore: 100,
    passed: true,
    date: '2025-05-14',
    status: 'graded',
  },
  {
    id: 'sub-003',
    studentName: 'Mark White',
    courseName: 'Cybersecurity Basics',
    quizName: 'Cybersecurity Knowledge Check',
    score: 60,
    maxScore: 100,
    passed: false,
    date: '2025-12-20',
    status: 'pending',
  },
  {
    id: 'sub-004',
    studentName: 'Jessica Williams',
    courseName: 'Leadership Skills',
    quizName: 'Leadership Skills Quiz',
    score: 85,
    maxScore: 100,
    passed: true,
    date: '2025-11-15',
    status: 'graded',
  },
  {
    id: 'sub-005',
    studentName: 'Lisa Jackson',
    courseName: 'Leadership Skills',
    quizName: 'Leadership Skills Quiz',
    score: 95,
    maxScore: 100,
    passed: true,
    date: '2025-07-01',
    status: 'graded',
  },
  {
    id: 'sub-006',
    studentName: 'John Smith',
    courseName: 'Data Analytics Fundamentals',
    quizName: 'Data Analytics Quiz',
    score: 0,
    maxScore: 100,
    passed: false,
    date: '2025-12-22',
    status: 'pending',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function InstructorGrading() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const totalSubmissions = mockGradingData.length;
  const needsReview = mockGradingData.filter((s) => s.status === 'pending').length;
  const passed = mockGradingData.filter((s) => s.passed).length;
  const failed = mockGradingData.filter((s) => !s.passed).length;

  const filteredData = mockGradingData.filter((entry) => {
    if (activeFilter === 'all') return true;
    return entry.status === activeFilter;
  });

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'graded', label: 'Graded' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Grading</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Review and grade student submissions
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <ClipboardCheck className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalSubmissions}</p>
                <p className="text-xs text-slate-500">Total Submissions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{needsReview}</p>
                <p className="text-xs text-slate-500">Needs Review</p>
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
                <p className="text-2xl font-bold text-slate-900">{passed}</p>
                <p className="text-xs text-slate-500">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{failed}</p>
                <p className="text-xs text-slate-500">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter tabs + table */}
      <Card>
        {/* Filter tabs */}
        <div className="px-4 pt-4 border-b border-slate-100">
          <nav className="flex gap-1 -mb-px">
            {filterTabs.map((tab) => {
              const count =
                tab.id === 'all'
                  ? totalSubmissions
                  : tab.id === 'pending'
                  ? needsReview
                  : totalSubmissions - needsReview;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                    activeFilter === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium min-w-[20px]',
                      activeFilter === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Table */}
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <FileQuestion className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No submissions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="pl-6 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Course
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Quiz
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
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((entry) => (
                  <TableRow
                    key={entry.id}
                    className="hover:bg-slate-50/60 border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="pl-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {entry.studentName}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-700">{entry.courseName}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-slate-600 max-w-[180px] truncate block">
                        {entry.quizName}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {entry.score}
                        <span className="text-slate-400 font-normal">/{entry.maxScore}</span>
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      {entry.passed ? (
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
                      <span className="text-sm text-slate-500">{formatDate(entry.date)}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      {entry.status === 'pending' ? (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-50 gap-1">
                          <Eye className="h-3 w-3" />
                          Graded
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="h-7 px-3 text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                      >
                        Review
                      </Button>
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

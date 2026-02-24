import { useState } from 'react';
import {
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import {
  mockCourses,
  mockEnrollments,
  mockUsers,
  mockOrgUnits,
  EnrollmentStatusEnum,
  UserStatus,
  Role,
} from '@/lib/mock-data';

// ============================================================
// TYPES
// ============================================================

type TabKey = 'enrollments' | 'users';

interface EnrollmentRow {
  id: string;
  studentName: string;
  email: string;
  department: string;
  courseName: string;
  category: string;
  status: EnrollmentStatusEnum;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: UserStatus;
  enrollmentCount: number;
  completedCount: number;
  joinedAt: string;
}

// ============================================================
// HYDRATED DATA
// ============================================================

const enrollmentRows: EnrollmentRow[] = mockEnrollments.map((e) => {
  const user = mockUsers.find((u) => u.id === e.userId);
  const course = mockCourses.find((c) => c.id === e.courseId);
  const unit = mockOrgUnits.find((ou) => ou.id === user?.orgUnitId);

  return {
    id: e.id,
    studentName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
    email: user?.email ?? '',
    department: unit?.nameEn ?? 'Unassigned',
    courseName: course?.titleEn ?? 'Unknown Course',
    category: course?.category ?? 'Uncategorized',
    status: e.status,
    progress: e.progressPct,
    enrolledAt: e.enrolledAt,
    completedAt: e.completedAt,
  };
});

const userRows: UserRow[] = mockUsers.map((u) => {
  const unit = mockOrgUnits.find((ou) => ou.id === u.orgUnitId);
  const userEnrollments = mockEnrollments.filter((e) => e.userId === u.id);
  const completedCount = userEnrollments.filter(
    (e) => e.status === EnrollmentStatusEnum.COMPLETED
  ).length;

  return {
    id: u.id,
    name: `${u.firstName} ${u.lastName}`,
    email: u.email,
    role: u.role.replace(/_/g, ' '),
    department: unit?.nameEn ?? 'Unassigned',
    status: u.status,
    enrollmentCount: userEnrollments.length,
    completedCount,
    joinedAt: u.createdAt,
  };
});

// ============================================================
// COMPONENT
// ============================================================

export function AuditReports() {
  const [activeTab, setActiveTab] = useState<TabKey>('enrollments');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border">
        <TabButton
          label="Enrollment Records"
          active={activeTab === 'enrollments'}
          onClick={() => { setActiveTab('enrollments'); setSearchQuery(''); setStatusFilter('all'); }}
        />
        <TabButton
          label="User Directory"
          active={activeTab === 'users'}
          onClick={() => { setActiveTab('users'); setSearchQuery(''); setStatusFilter('all'); }}
        />
      </div>

      {/* Toolbar: search + filter + export */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={activeTab === 'enrollments' ? 'Search student or course...' : 'Search user...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30"
            >
              <option value="all">All Status</option>
              {activeTab === 'enrollments' ? (
                <>
                  <option value="COMPLETED">Completed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="NOT_STARTED">Not Started</option>
                </>
              ) : (
                <>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </>
              )}
            </select>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent">
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table content */}
      {activeTab === 'enrollments' ? (
        <EnrollmentTable searchQuery={searchQuery} statusFilter={statusFilter} />
      ) : (
        <UserTable searchQuery={searchQuery} statusFilter={statusFilter} />
      )}
    </div>
  );
}

// ============================================================
// TAB BUTTON
// ============================================================

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? 'text-teal-600'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t" />
      )}
    </button>
  );
}

// ============================================================
// ENROLLMENT TABLE
// ============================================================

function EnrollmentTable({
  searchQuery,
  statusFilter,
}: {
  searchQuery: string;
  statusFilter: string;
}) {
  const filtered = enrollmentRows.filter((row) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      row.studentName.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.courseName.toLowerCase().includes(q) ||
      row.department.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Student</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Progress</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Enrolled</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No enrollment records found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{row.studentName}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.department}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{row.courseName}</p>
                      <p className="text-xs text-muted-foreground">{row.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <EnrollmentStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="relative h-1.5 w-16 rounded-full bg-muted">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                            row.progress === 100
                              ? 'bg-emerald-500'
                              : row.progress > 0
                              ? 'bg-blue-500'
                              : 'bg-muted'
                          }`}
                          style={{ width: `${row.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                        {row.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(row.enrolledAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.completedAt ? formatDate(row.completedAt) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {enrollmentRows.length} records
        </p>
      </div>
    </div>
  );
}

// ============================================================
// USER TABLE
// ============================================================

function UserTable({
  searchQuery,
  statusFilter,
}: {
  searchQuery: string;
  statusFilter: string;
}) {
  const filtered = userRows.filter((row) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.role.toLowerCase().includes(q) ||
      row.department.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Department</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Enrollments</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">Completed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                      {row.role.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.department}</td>
                  <td className="px-4 py-3 text-center">
                    <UserStatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.enrollmentCount}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{row.completedCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(row.joinedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {userRows.length} records
        </p>
      </div>
    </div>
  );
}

// ============================================================
// BADGE COMPONENTS
// ============================================================

function EnrollmentStatusBadge({ status }: { status: EnrollmentStatusEnum }) {
  const config = {
    [EnrollmentStatusEnum.COMPLETED]: {
      label: 'Completed',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    [EnrollmentStatusEnum.IN_PROGRESS]: {
      label: 'In Progress',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <Clock className="h-3 w-3" />,
    },
    [EnrollmentStatusEnum.NOT_STARTED]: {
      label: 'Not Started',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <AlertTriangle className="h-3 w-3" />,
    },
  };

  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const config = {
    [UserStatus.ACTIVE]: {
      label: 'Active',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    [UserStatus.INACTIVE]: {
      label: 'Inactive',
      className: 'bg-gray-50 text-gray-600 border-gray-200',
      icon: <Clock className="h-3 w-3" />,
    },
    [UserStatus.SUSPENDED]: {
      label: 'Suspended',
      className: 'bg-red-50 text-red-700 border-red-200',
      icon: <XCircle className="h-3 w-3" />,
    },
  };

  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

// ============================================================
// HELPERS
// ============================================================

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

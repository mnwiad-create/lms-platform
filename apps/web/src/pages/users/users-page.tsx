import { useState } from 'react';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  User,
  Pencil,
  Trash2,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Types ---

type UserRole =
  | 'SYSTEM_ADMIN'
  | 'COURSE_ADMIN'
  | 'INSTRUCTOR'
  | 'STUDENT'
  | 'AUDITOR';
type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

interface UserRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastLogin: string;
  avatarUrl: string | null;
}

// --- Mock Data ---

const mockUsers: UserRecord[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@acme.com',
    role: 'SYSTEM_ADMIN',
    department: 'IT',
    status: 'ACTIVE',
    lastLogin: '2 hours ago',
    avatarUrl: null,
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@acme.com',
    role: 'COURSE_ADMIN',
    department: 'HR',
    status: 'ACTIVE',
    lastLogin: '1 day ago',
    avatarUrl: null,
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@acme.com',
    role: 'INSTRUCTOR',
    department: 'Engineering',
    status: 'ACTIVE',
    lastLogin: '3 hours ago',
    avatarUrl: null,
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@acme.com',
    role: 'STUDENT',
    department: 'Marketing',
    status: 'ACTIVE',
    lastLogin: '5 hours ago',
    avatarUrl: null,
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@acme.com',
    role: 'STUDENT',
    department: 'Sales',
    status: 'ACTIVE',
    lastLogin: '1 day ago',
    avatarUrl: null,
  },
  {
    id: '6',
    firstName: 'Jessica',
    lastName: 'Taylor',
    email: 'jessica.taylor@acme.com',
    role: 'INSTRUCTOR',
    department: 'Engineering',
    status: 'ACTIVE',
    lastLogin: '6 hours ago',
    avatarUrl: null,
  },
  {
    id: '7',
    firstName: 'Robert',
    lastName: 'Anderson',
    email: 'robert.anderson@acme.com',
    role: 'STUDENT',
    department: 'Finance',
    status: 'INACTIVE',
    lastLogin: '30 days ago',
    avatarUrl: null,
  },
  {
    id: '8',
    firstName: 'Lisa',
    lastName: 'Thomas',
    email: 'lisa.thomas@acme.com',
    role: 'STUDENT',
    department: 'Operations',
    status: 'ACTIVE',
    lastLogin: '12 hours ago',
    avatarUrl: null,
  },
  {
    id: '9',
    firstName: 'James',
    lastName: 'Martinez',
    email: 'james.martinez@acme.com',
    role: 'COURSE_ADMIN',
    department: 'HR',
    status: 'ACTIVE',
    lastLogin: '4 hours ago',
    avatarUrl: null,
  },
  {
    id: '10',
    firstName: 'Amanda',
    lastName: 'Garcia',
    email: 'amanda.garcia@acme.com',
    role: 'STUDENT',
    department: 'Marketing',
    status: 'SUSPENDED',
    lastLogin: '15 days ago',
    avatarUrl: null,
  },
  {
    id: '11',
    firstName: 'Daniel',
    lastName: 'White',
    email: 'daniel.white@acme.com',
    role: 'STUDENT',
    department: 'Engineering',
    status: 'ACTIVE',
    lastLogin: '1 hour ago',
    avatarUrl: null,
  },
  {
    id: '12',
    firstName: 'Jennifer',
    lastName: 'Harris',
    email: 'jennifer.harris@acme.com',
    role: 'AUDITOR',
    department: 'Compliance',
    status: 'ACTIVE',
    lastLogin: '2 days ago',
    avatarUrl: null,
  },
];

// --- Helper Functions ---

function getRoleBadgeClass(role: UserRole): string {
  const map: Record<UserRole, string> = {
    SYSTEM_ADMIN:
      'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
    COURSE_ADMIN:
      'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100',
    INSTRUCTOR:
      'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100',
    STUDENT:
      'bg-green-100 text-green-700 border-green-200 hover:bg-green-100',
    AUDITOR:
      'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100',
  };
  return map[role];
}

function getRoleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    SYSTEM_ADMIN: 'System Admin',
    COURSE_ADMIN: 'Course Admin',
    INSTRUCTOR: 'Instructor',
    STUDENT: 'Student',
    AUDITOR: 'Auditor',
  };
  return map[role];
}

function getStatusDotClass(status: UserStatus): string {
  const map: Record<UserStatus, string> = {
    ACTIVE: 'bg-green-500',
    INACTIVE: 'bg-red-500',
    SUSPENDED: 'bg-yellow-500',
  };
  return map[status];
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

const ITEMS_PER_PAGE = 12;

// --- Component ---

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleAction(action: string, user: UserRecord) {
    toast.success(`${action} action for ${user.firstName} ${user.lastName}`);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage system users and roles
          </p>
        </div>
        <Button
          onClick={() => toast.info('Add User dialog would open here')}
          className="w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Role filter */}
            <Select
              value={roleFilter}
              onValueChange={(v) => {
                setRoleFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SYSTEM_ADMIN">System Admin</SelectItem>
                <SelectItem value="COURSE_ADMIN">Course Admin</SelectItem>
                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                <SelectItem value="STUDENT">Student</SelectItem>
                <SelectItem value="AUDITOR">Auditor</SelectItem>
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="pl-6">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Last Login</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No users found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((user) => (
                  <TableRow key={user.id} className="group">
                    {/* User cell */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                            {getInitials(user.firstName, user.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium leading-none text-foreground">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role cell */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${getRoleBadgeClass(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>

                    {/* Department cell */}
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {user.department}
                    </TableCell>

                    {/* Status cell */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${getStatusDotClass(user.status)}`}
                        />
                        <span className="text-sm capitalize text-foreground">
                          {user.status.charAt(0) +
                            user.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </TableCell>

                    {/* Last Login cell */}
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {user.lastLogin}
                    </TableCell>

                    {/* Actions cell */}
                    <TableCell className="pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem
                            onClick={() => handleAction('View Profile', user)}
                          >
                            <User className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction('Edit', user)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleAction('Suspend', user)}
                            className="text-yellow-600 focus:text-yellow-600"
                          >
                            <ShieldOff className="h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction('Delete', user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium text-foreground">
            {filtered.length === 0 ? 0 : startIndex + 1}
          </span>
          {'-'}
          <span className="font-medium text-foreground">
            {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">{filtered.length}</span>{' '}
          users
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon"
              className="h-8 w-8 text-xs"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

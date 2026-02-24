import { Routes, Route, Navigate, Outlet } from 'react-router';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StudentLayout } from '@/components/layout/student-layout';
import { InstructorLayout } from '@/components/layout/instructor-layout';
import { AuditorLayout } from '@/components/layout/auditor-layout';
import { useAuthStore } from '@/stores/auth-store';
import { Role } from '@/lib/mock-data';

// Admin pages
import { LoginPage } from '@/pages/login/login-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { CoursesPage } from '@/pages/courses/courses-page';
import { CourseDetailPage } from '@/pages/courses/course-detail-page';
import { UsersPage } from '@/pages/users/users-page';
import { EnrollmentsPage } from '@/pages/enrollments/enrollments-page';
import { SettingsPage } from '@/pages/settings/settings-page';

// Student pages
import { StudentDashboard } from '@/pages/student/student-dashboard';
import { MyCourses } from '@/pages/student/my-courses';
import { CoursePlayer } from '@/pages/student/course-player';
import { QuizTaking } from '@/pages/student/quiz-taking';
import { MyCertificates } from '@/pages/student/my-certificates';
import { StudentProfile } from '@/pages/student/student-profile';

// Instructor pages
import { InstructorDashboard } from '@/pages/instructor/instructor-dashboard';
import { MyTeachingCourses } from '@/pages/instructor/my-teaching-courses';
import { CourseManagement } from '@/pages/instructor/course-management';
import { InstructorGrading } from '@/pages/instructor/instructor-grading';
import { InstructorProfile } from '@/pages/instructor/instructor-profile';

// Auditor pages
import { AuditorDashboard } from '@/pages/auditor/auditor-dashboard';
import { AuditReports } from '@/pages/auditor/audit-reports';

// Role-based redirect after login
function RoleRedirect() {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === Role.STUDENT) return <Navigate to="/student" replace />;
  if (user?.role === Role.INSTRUCTOR) return <Navigate to="/instructor" replace />;
  if (user?.role === Role.AUDITOR) return <Navigate to="/auditor" replace />;
  // SYSTEM_ADMIN, COURSE_ADMIN go to admin dashboard
  return <Navigate to="/admin" replace />;
}

// Admin protected layout: SYSTEM_ADMIN, COURSE_ADMIN only
function AdminProtectedLayout() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === Role.STUDENT) return <Navigate to="/student" replace />;
  if (user?.role === Role.INSTRUCTOR) return <Navigate to="/instructor" replace />;
  if (user?.role === Role.AUDITOR) return <Navigate to="/auditor" replace />;

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

// Student protected layout: authenticated students only
function StudentProtectedLayout() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== Role.STUDENT) return <Navigate to="/" replace />;

  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
}

// Instructor protected layout: authenticated instructors only
function InstructorProtectedLayout() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== Role.INSTRUCTOR) return <Navigate to="/" replace />;

  return (
    <InstructorLayout>
      <Outlet />
    </InstructorLayout>
  );
}

// Auditor protected layout: authenticated auditors only
function AuditorProtectedLayout() {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== Role.AUDITOR) return <Navigate to="/" replace />;

  return (
    <AuditorLayout>
      <Outlet />
    </AuditorLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Root: redirect based on role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Admin routes - SYSTEM_ADMIN, COURSE_ADMIN */}
      <Route path="/admin" element={<AdminProtectedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Student routes - students only */}
      <Route path="/student" element={<StudentProtectedLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="courses/:courseId" element={<CoursePlayer />} />
        <Route path="courses/:courseId/quiz/:quizId" element={<QuizTaking />} />
        <Route path="certificates" element={<MyCertificates />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Instructor routes - instructors only */}
      <Route path="/instructor" element={<InstructorProtectedLayout />}>
        <Route index element={<InstructorDashboard />} />
        <Route path="courses" element={<MyTeachingCourses />} />
        <Route path="courses/:courseId" element={<CourseManagement />} />
        <Route path="grading" element={<InstructorGrading />} />
        <Route path="profile" element={<InstructorProfile />} />
      </Route>

      {/* Auditor routes - auditors only (read-only) */}
      <Route path="/auditor" element={<AuditorProtectedLayout />}>
        <Route index element={<AuditorDashboard />} />
        <Route path="reports" element={<AuditReports />} />
      </Route>

      {/* Catch-all: redirect to role-based home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

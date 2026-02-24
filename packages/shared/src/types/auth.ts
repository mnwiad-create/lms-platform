export enum Role {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  COURSE_ADMIN = 'COURSE_ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
  AUDITOR = 'AUDITOR',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  firstNameTh: string | null;
  lastNameTh: string | null;
  role: Role;
  orgUnitId: string | null;
  orgId: string;
  avatarUrl: string | null;
  status: UserStatus;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  LDAP = 'LDAP',
  AZURE_AD = 'AZURE_AD',
  GOOGLE = 'GOOGLE',
}

export interface AuthResponse {
  user: User;
  accessToken?: string; // only used internally, JWT is in httpOnly cookie
}

export interface LoginInput {
  email: string;
  password: string;
}

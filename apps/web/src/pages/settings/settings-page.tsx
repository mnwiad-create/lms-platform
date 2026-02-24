import { useState } from 'react';
import { Save, Upload, Server, KeyRound, Cloud, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- Types ---

interface GeneralSettings {
  organizationName: string;
  defaultLanguage: string;
  timezone: string;
}

interface AuthSettings {
  localAuth: boolean;
  ldapEnabled: boolean;
  ldapServerUrl: string;
  azureAdEnabled: boolean;
  azureAdTenantId: string;
  googleOAuthEnabled: boolean;
  googleClientId: string;
  sessionTimeout: string;
}

interface NotificationSettings {
  newEnrollment: boolean;
  courseCompletion: boolean;
  quizGrading: boolean;
  systemAnnouncements: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
}

// --- Component ---

export function SettingsPage() {
  // General Tab State
  const [general, setGeneral] = useState<GeneralSettings>({
    organizationName: 'Acme Corporation',
    defaultLanguage: 'en',
    timezone: 'America/New_York',
  });

  // Authentication Tab State
  const [auth, setAuth] = useState<AuthSettings>({
    localAuth: true,
    ldapEnabled: false,
    ldapServerUrl: '',
    azureAdEnabled: false,
    azureAdTenantId: '',
    googleOAuthEnabled: false,
    googleClientId: '',
    sessionTimeout: '30',
  });

  // Notifications Tab State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newEnrollment: true,
    courseCompletion: true,
    quizGrading: false,
    systemAnnouncements: true,
    smtpHost: 'smtp.acme.com',
    smtpPort: '587',
    smtpUsername: 'lms-notifications@acme.com',
    smtpPassword: '',
  });

  function handleSaveGeneral() {
    toast.success('General settings saved successfully');
  }

  function handleSaveAuth() {
    toast.success('Authentication settings saved successfully');
  }

  function handleSaveNotifications() {
    toast.success('Notification settings saved successfully');
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage organization preferences and system configuration
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 w-full justify-start sm:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* ===================== GENERAL TAB ===================== */}
        <TabsContent value="general">
          <div className="grid gap-6 max-w-2xl">
            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organization Details</CardTitle>
                <CardDescription>
                  Basic information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                {/* Organization Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    value={general.organizationName}
                    onChange={(e) =>
                      setGeneral((prev) => ({
                        ...prev,
                        organizationName: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Logo Upload */}
                <div className="flex flex-col gap-2">
                  <Label>Organization Logo</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 px-6 py-8 text-center transition-colors hover:border-muted-foreground/40 hover:bg-muted/30">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        PNG, JPG, SVG up to 2MB
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Language and Timezone row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Default Language */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select
                      value={general.defaultLanguage}
                      onValueChange={(v) =>
                        setGeneral((prev) => ({ ...prev, defaultLanguage: v }))
                      }
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="th">Thai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Timezone */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={general.timezone}
                      onValueChange={(v) =>
                        setGeneral((prev) => ({ ...prev, timezone: v }))
                      }
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">
                          Eastern Time (UTC-5)
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time (UTC-6)
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time (UTC-7)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time (UTC-8)
                        </SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="Europe/London">
                          London (UTC+0)
                        </SelectItem>
                        <SelectItem value="Asia/Bangkok">
                          Bangkok (UTC+7)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Tokyo (UTC+9)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveGeneral}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ===================== AUTHENTICATION TAB ===================== */}
        <TabsContent value="authentication">
          <div className="grid gap-6 max-w-2xl">
            {/* Auth Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Authentication Providers
                </CardTitle>
                <CardDescription>
                  Configure how users authenticate into the system
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 divide-y divide-border">
                {/* Local Authentication */}
                <div className="flex flex-col gap-3 py-5 first:pt-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <KeyRound className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Local Authentication
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Username and password stored locally
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={auth.localAuth}
                      onCheckedChange={(v) =>
                        setAuth((prev) => ({ ...prev, localAuth: v }))
                      }
                    />
                  </div>
                </div>

                {/* LDAP Integration */}
                <div className="flex flex-col gap-3 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50">
                        <Server className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          LDAP Integration
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Connect to your corporate LDAP directory
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={auth.ldapEnabled}
                      onCheckedChange={(v) =>
                        setAuth((prev) => ({ ...prev, ldapEnabled: v }))
                      }
                    />
                  </div>
                  {auth.ldapEnabled && (
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
                      <Label htmlFor="ldap-url" className="text-xs">
                        LDAP Server URL
                      </Label>
                      <Input
                        id="ldap-url"
                        placeholder="ldap://your-server.acme.com:389"
                        value={auth.ldapServerUrl}
                        onChange={(e) =>
                          setAuth((prev) => ({
                            ...prev,
                            ldapServerUrl: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Azure AD */}
                <div className="flex flex-col gap-3 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50">
                        <Cloud className="h-4 w-4 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Azure AD (Microsoft 365)
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Single sign-on via Microsoft identity platform
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={auth.azureAdEnabled}
                      onCheckedChange={(v) =>
                        setAuth((prev) => ({ ...prev, azureAdEnabled: v }))
                      }
                    />
                  </div>
                  {auth.azureAdEnabled && (
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
                      <Label htmlFor="azure-tenant" className="text-xs">
                        Tenant ID
                      </Label>
                      <Input
                        id="azure-tenant"
                        placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        value={auth.azureAdTenantId}
                        onChange={(e) =>
                          setAuth((prev) => ({
                            ...prev,
                            azureAdTenantId: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Google OAuth */}
                <div className="flex flex-col gap-3 py-5 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                        <span className="text-sm font-bold text-red-500">G</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Google OAuth
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Sign in with Google Workspace accounts
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={auth.googleOAuthEnabled}
                      onCheckedChange={(v) =>
                        setAuth((prev) => ({
                          ...prev,
                          googleOAuthEnabled: v,
                        }))
                      }
                    />
                  </div>
                  {auth.googleOAuthEnabled && (
                    <div className="flex flex-col gap-2 rounded-lg bg-muted/30 p-3">
                      <Label htmlFor="google-client-id" className="text-xs">
                        Client ID
                      </Label>
                      <Input
                        id="google-client-id"
                        placeholder="xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                        value={auth.googleClientId}
                        onChange={(e) =>
                          setAuth((prev) => ({
                            ...prev,
                            googleClientId: e.target.value,
                          }))
                        }
                        className="h-8 text-sm"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Session Settings</CardTitle>
                <CardDescription>
                  Control how long users stay logged in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex max-w-xs flex-col gap-2">
                  <Label htmlFor="session-timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="480"
                    value={auth.sessionTimeout}
                    onChange={(e) =>
                      setAuth((prev) => ({
                        ...prev,
                        sessionTimeout: e.target.value,
                      }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Users will be logged out after this period of inactivity
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveAuth}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* ===================== NOTIFICATIONS TAB ===================== */}
        <TabsContent value="notifications">
          <div className="grid gap-6 max-w-2xl">
            {/* Email Notification Toggles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email Notifications</CardTitle>
                <CardDescription>
                  Choose which system events trigger email alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-0 divide-y divide-border">
                {/* New Enrollment */}
                <div className="flex items-center justify-between gap-4 py-4 first:pt-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      New enrollment notification
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Alert when a student enrolls in a course
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newEnrollment}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        newEnrollment: v,
                      }))
                    }
                  />
                </div>

                {/* Course Completion */}
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Course completion notification
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Alert when a student completes a course
                    </p>
                  </div>
                  <Switch
                    checked={notifications.courseCompletion}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        courseCompletion: v,
                      }))
                    }
                  />
                </div>

                {/* Quiz Grading */}
                <div className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Quiz grading notification
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Alert when a quiz has been graded
                    </p>
                  </div>
                  <Switch
                    checked={notifications.quizGrading}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        quizGrading: v,
                      }))
                    }
                  />
                </div>

                {/* System Announcements */}
                <div className="flex items-center justify-between gap-4 py-4 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      System announcements
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Platform updates, maintenance windows, and news
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemAnnouncements}
                    onCheckedChange={(v) =>
                      setNotifications((prev) => ({
                        ...prev,
                        systemAnnouncements: v,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* SMTP Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">
                    SMTP Configuration
                  </CardTitle>
                </div>
                <CardDescription>
                  Configure the outgoing mail server for email delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* SMTP Host */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input
                      id="smtp-host"
                      placeholder="smtp.example.com"
                      value={notifications.smtpHost}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smtpHost: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* SMTP Port */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      placeholder="587"
                      value={notifications.smtpPort}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smtpPort: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* SMTP Username */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      type="email"
                      placeholder="notifications@example.com"
                      value={notifications.smtpUsername}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smtpUsername: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* SMTP Password */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input
                      id="smtp-password"
                      type="password"
                      placeholder="Enter SMTP password"
                      value={notifications.smtpPassword}
                      onChange={(e) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smtpPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

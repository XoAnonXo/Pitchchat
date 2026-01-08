import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Menu,
  X,
  LogOut,
  Settings,
  Users,
  FolderOpen,
  Home,
  BarChart3,
  MessageSquare,
  Sparkles,
  User,
  Key,
  Bell,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Upload,
  Mail,
  Lock,
  Globe,
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { logout } from "@/lib/authUtils";
import { Logo } from "@/components/Logo";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Conversation } from "@shared/schema";

interface UserSettings {
  id: string;
  email: string;
  name?: string;
  profileImageUrl?: string | null;
  notifications: {
    emailAlerts: boolean;
    weeklyReports: boolean;
    productUpdates: boolean;
  };
  integrations: {
    openaiConnected: boolean;
    anthropicConnected: boolean;
    googleConnected: boolean;
    xaiConnected: boolean;
  };
}

export default function SettingsPage() {
  usePageTitle('Settings');
  const { user } = useAuth();
  const { toast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts ?? true);
  const [weeklyReports, setWeeklyReports] = useState(user?.weeklyReports ?? false);
  
  useEffect(() => {
    if (user) {
      setEmailAlerts(user.emailAlerts ?? true);
      setWeeklyReports(user.weeklyReports ?? false);
    }
  }, [user]);

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  const hasContactNotifications = conversations.some((conv) => (conv as any).contactProvidedAt);

  const settings: UserSettings = {
    id: user?.id || "",
    email: user?.email || "",
    name: user?.email?.split('@')[0] || "",
    profileImageUrl: user?.profileImageUrl,
    notifications: {
      emailAlerts: emailAlerts,
      weeklyReports: weeklyReports,
      productUpdates: false,
    },
    integrations: {
      openaiConnected: true,
      anthropicConnected: false,
      googleConnected: false,
      xaiConnected: false,
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return apiRequest('PATCH', '/api/user/profile', data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: async (notifications: typeof settings.notifications) => {
      return apiRequest('PATCH', '/api/user/notifications', notifications);
    },
    onSuccess: () => {
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
        duration: 2000,
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/user/delete');
    },
    onSuccess: () => {
      void logout();
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/user/export');
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pitchchat-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      toast({
        title: "Data exported",
        description: "Your data has been downloaded successfully.",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (priceType: 'monthly' | 'annual') => {
      const response = await apiRequest('POST', '/api/subscriptions/create-checkout', { priceType });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
      return data;
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/subscriptions/cancel');
    },
    onSuccess: () => {
      toast({
        title: "Subscription canceled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation failed",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest('POST', '/api/user/change-password', data);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
        duration: 3000,
      });
      setChangePasswordOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Note",
        description: error.message || "Failed to change password. Please check your current password.",
        duration: 5000,
      });
      setChangePasswordOpen(false);
    },
  });

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfileMutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    if (key === 'emailAlerts') {
      setEmailAlerts(value);
    } else if (key === 'weeklyReports') {
      setWeeklyReports(value);
    }
    
    updateNotificationsMutation.mutate({
      ...settings.notifications,
      [key]: value,
    });
  };

  const handleDeleteAccount = () => {
    if (confirmDelete === user?.email) {
      deleteAccountMutation.mutate();
    }
  };

  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ currentPassword, newPassword });
  };

  const handleExportData = () => {
    exportDataMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-black/[0.08] z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Logo size="md" variant="white" className="p-1" />
            </div>
            <span className="font-bold text-lg text-black tracking-tight">PitchChat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-black/60 hover:text-black"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>
          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-black border-none" />
            )}
          </Link>
          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Analytics</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 bg-black text-white rounded-xl transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span className="font-semibold text-sm">Settings</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-black/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover border border-black/10"
                />
              ) : (
                <div className="w-8 h-8 bg-black/[0.04] rounded-xl flex items-center justify-center border border-black/10">
                  <Users className="w-4 h-4 text-black/60" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-black/45 font-medium uppercase tracking-wider">
                  {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void logout()}
              className="h-8 w-8 text-black/45 hover:text-black"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-black/[0.08] sticky top-0 z-30 h-20 flex items-center shrink-0">
          <div className="px-6 lg:px-8 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-black/60 hover:text-black"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">Settings</h2>
                <p className="text-[11px] text-black/45 font-medium uppercase tracking-wider mt-1.5">
                  Account and preferences
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-4xl space-y-8">
          <Card className="bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/8">
            <CardHeader className="border-b border-black/[0.06] px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#DAE8FB] rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-black/70" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-black tracking-tight">Profile</CardTitle>
                  <CardDescription className="text-[11px] uppercase font-semibold tracking-widest text-black/45">Personal Information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    {settings.profileImageUrl ? (
                      <img
                        src={settings.profileImageUrl}
                        alt="Profile"
                        className="w-20 h-20 rounded-2xl object-cover border border-black/10 shadow-sm group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-black/[0.04] rounded-2xl flex items-center justify-center border border-black/10 group-hover:scale-105 transition-transform">
                        <User className="w-8 h-8 text-black/30" />
                      </div>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-xl bg-black hover:bg-black/90 h-8 w-8 p-0 border-2 border-white shadow-lg"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-black truncate">{settings.name}</h3>
                    <p className="text-sm text-black/45 font-medium truncate">{settings.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-black/45 ml-1">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={settings.name}
                      className="h-11 rounded-xl border-black/10 bg-black/[0.03] focus:border-black focus:ring-0 transition-all font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-black/45 ml-1">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={settings.email}
                      className="h-11 rounded-xl border-black/10 bg-black/[0.03] focus:border-black focus:ring-0 transition-all font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-black hover:bg-black/90 text-white rounded-xl px-8 h-11 font-bold text-sm shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                    disabled={updateProfileMutation.isPending}
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/8">
            <CardHeader className="border-b border-black/[0.06] px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#E8E4F3] rounded-2xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-black/70" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-black tracking-tight">Notifications</CardTitle>
                  <CardDescription className="text-[11px] uppercase font-semibold tracking-widest text-black/45">Alert Preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="font-bold text-black text-sm">Email Alerts</p>
                  <p className="text-xs text-black/45 font-medium">Get notified when investors engage with your pitch links.</p>
                </div>
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
                />
              </div>

              <Separator className="bg-black/[0.08]" />

              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <p className="font-bold text-black text-sm">Weekly Reports</p>
                  <p className="text-xs text-black/45 font-medium">Receive weekly analytics and link performance summaries.</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                />
              </div>

              <Separator className="bg-black/[0.08]" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-black text-sm">System Connectivity</p>
                  <p className="text-xs text-black/45 font-medium">Test if email services are properly configured.</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      try {
                        const res = await apiRequest("POST", "/api/email/test-simple");
                        const data = await res.json();
                        if (data.success) {
                          toast({ title: "Sent!", description: `Check ${data.sentTo}` });
                        }
                      } catch (error: any) {
                        toast({ title: "Failed", description: error.message, variant: "destructive" });
                      }
                    }}
                    variant="outline"
                    className="border-black/10 text-black/60 text-[10px] font-bold uppercase tracking-wider h-9 rounded-xl"
                  >
                    Test Mailer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/8">
            <CardHeader className="border-b border-black/[0.06] px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[#EAE3D1] rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-black/70" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-black tracking-tight">Security & Export</CardTitle>
                  <CardDescription className="text-[11px] uppercase font-semibold tracking-widest text-black/45">Account Control</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 justify-start rounded-xl border-black/10 font-bold text-sm text-black/60"
                  onClick={handleExportData}
                  disabled={exportDataMutation.isPending}
                >
                  <Download className="w-4 h-4 mr-3 text-black/45" />
                  Export Account Data
                </Button>

                <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-12 justify-start rounded-xl border-black/10 font-bold text-sm text-black/60">
                      <Lock className="w-4 h-4 mr-3 text-black/45" />
                      Rotate Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl border border-black/8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] p-0 overflow-hidden">
                    <form onSubmit={handleChangePassword}>
                      <DialogHeader className="bg-black text-white p-8">
                        <DialogTitle className="text-xl font-bold tracking-tight">Rotate Password</DialogTitle>
                        <DialogDescription className="text-white/50 font-medium">Update your credentials to maintain security.</DialogDescription>
                      </DialogHeader>
                      <div className="p-8 space-y-5">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/45 ml-1">Current Password</Label>
                          <Input name="currentPassword" type="password" required className="rounded-xl h-11 border-black/10 bg-black/[0.03]" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/45 ml-1">New Password</Label>
                          <Input name="newPassword" type="password" required minLength={8} className="rounded-xl h-11 border-black/10 bg-black/[0.03]" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-black/45 ml-1">Confirm New</Label>
                          <Input name="confirmPassword" type="password" required minLength={8} className="rounded-xl h-11 border-black/10 bg-black/[0.03]" />
                        </div>
                      </div>
                      <DialogFooter className="p-8 pt-0">
                        <Button type="submit" className="bg-black hover:bg-black/90 text-white rounded-xl px-8 h-11 font-bold w-full" disabled={changePasswordMutation.isPending}>
                          Update Password
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="pt-6 border-t border-black/[0.08]">
                <div className="p-6 rounded-2xl bg-black/[0.02] border border-black/10 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-black/60 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold text-black text-sm">Danger Zone</p>
                    <p className="text-xs text-black/60 mt-1 mb-4 font-medium leading-relaxed">Permanently delete your account and all associated pitch rooms, documents, and analytics. This action is irreversible.</p>
                    <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="h-9 px-4 rounded-xl border-black/20 text-black/60 bg-white hover:bg-black hover:text-white font-bold text-[10px] uppercase tracking-widest transition-all">
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl border border-black/8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] p-0 overflow-hidden max-w-sm">
                        <DialogHeader className="bg-black text-white p-8">
                          <DialogTitle className="text-xl font-bold tracking-tight">Are you sure?</DialogTitle>
                          <DialogDescription className="text-white/50 font-medium">This will destroy everything. No recovery possible.</DialogDescription>
                        </DialogHeader>
                        <div className="p-8 space-y-4">
                          <p className="text-xs text-black/60 font-medium leading-relaxed">
                            To confirm, please type <span className="font-bold text-black select-all">{user?.email}</span> below:
                          </p>
                          <Input
                            value={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.value)}
                            placeholder="Type your email"
                            className="h-11 rounded-xl border-black/10 bg-black/[0.03]"
                          />
                        </div>
                        <DialogFooter className="p-8 pt-0">
                          <Button
                            className="w-full h-11 rounded-xl font-bold bg-black hover:bg-black/90 text-white"
                            onClick={handleDeleteAccount}
                            disabled={confirmDelete !== user?.email || deleteAccountMutation.isPending}
                          >
                            Destroy Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

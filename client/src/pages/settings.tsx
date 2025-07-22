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
  ExternalLink
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface UserSettings {
  id: string;
  email: string;
  name?: string;
  profileImageUrl?: string;
  credits: number;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(user?.emailAlerts ?? true);
  const [weeklyReports, setWeeklyReports] = useState(user?.weeklyReports ?? false);
  
  // Update notification states when user data changes
  useEffect(() => {
    if (user) {
      setEmailAlerts(user.emailAlerts ?? true);
      setWeeklyReports(user.weeklyReports ?? false);
    }
  }, [user]);

  // Fetch conversations to check for contact notifications
  const { data: conversations = [] } = useQuery({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  // Check if there are any conversations with contact details
  const hasContactNotifications = conversations.some((conv: any) => conv.contactProvidedAt);

  // Mock settings data - in production this would come from the API
  const settings: UserSettings = {
    id: user?.id || "",
    email: user?.email || "",
    name: user?.email?.split('@')[0] || "",
    profileImageUrl: user?.profileImageUrl,
    tokens: user?.tokens || 0,
    notifications: {
      emailAlerts: emailAlerts,
      weeklyReports: weeklyReports,
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
        duration: 2000, // 2 seconds
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', '/api/user/delete');
    },
    onSuccess: () => {
      window.location.href = '/api/auth/logout';
    },
  });

  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/user/export');
      const data = await response.json();
      
      // Create and download JSON file
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

  // Subscription mutations
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

  const tokenPurchaseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/tokens/purchase');
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      // Would need to implement Stripe payment modal here
      toast({
        title: "Redirecting to payment",
        description: "Please complete your purchase.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to initiate purchase. Please try again.",
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
    // Update local state immediately for responsive UI
    if (key === 'emailAlerts') {
      setEmailAlerts(value);
    } else if (key === 'weeklyReports') {
      setWeeklyReports(value);
    }
    
    // Send update to backend
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

  const handleExportData = () => {
    exportDataMutation.mutate();
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

  const handleSubscription = (priceType: 'monthly' | 'annual') => {
    subscriptionMutation.mutate(priceType);
  };

  const handleTokenPurchase = () => {
    tokenPurchaseMutation.mutate();
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      cancelMutation.mutate();
    }
  };



  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">PitchChat</h1>
              <p className="text-xs text-gray-500">AI Document Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </Link>
          
          <Link href="/conversations" className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Conversations</span>
            </div>
            {hasContactNotifications && (
              <div className="flex items-center">
                <Bell className="w-4 h-4 text-black fill-black" />
              </div>
            )}
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-green-600">{(user?.tokens || 0).toLocaleString()} tokens</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/api/auth/logout"}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500">Manage your account and preferences</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 max-w-4xl space-y-8">
          {/* Profile Settings */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-bold text-gray-900">Profile</CardTitle>
              </div>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    {settings.profileImageUrl ? (
                      <img 
                        src={settings.profileImageUrl} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full bg-black hover:bg-gray-800"
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{settings.name}</h3>
                    <p className="text-sm text-gray-500">{settings.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={settings.name}
                      className="bg-gray-50 border-gray-200 focus:border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={settings.email}
                      className="bg-gray-50 border-gray-200 focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    className="bg-black hover:bg-gray-800 text-white rounded-xl"
                    disabled={updateProfileMutation.isPending}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>



          {/* Notifications */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-bold text-gray-900">Notifications</CardTitle>
              </div>
              <CardDescription>Configure how you receive updates</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when investors engage with your pitch</p>
                </div>
                <Switch
                  checked={settings.notifications.emailAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('emailAlerts', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Receive weekly analytics and performance summaries</p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReports}
                  onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">Test Email Notifications</p>
                  <p className="text-sm text-gray-500">Send all email types to test they are working correctly</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      try {
                        const res = await apiRequest("POST", "/api/email/test-simple");
                        const data = await res.json();
                        if (data.success) {
                          toast({
                            title: "Simple test email sent!",
                            description: `Check your inbox at ${data.sentTo}`,
                          });
                        } else {
                          toast({
                            title: "Email send failed",
                            description: "Check console logs for details",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Failed to send test email",
                          description: error.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Test Simple
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        const res = await apiRequest("POST", "/api/email/test-all");
                        const data = await res.json();
                        toast({
                          title: "Test emails sent!",
                          description: `Sent ${data.totalSent} emails to ${data.sentTo}`,
                        });
                      } catch (error) {
                        toast({
                          title: "Failed to send test emails",
                          description: error.message,
                          variant: "destructive",
                        });
                      }
                    }}
                    variant="outline"
                    className="border-black text-black hover:bg-gray-100"
                  >
                    Send All Test Emails
                  </Button>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Billing */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-bold text-gray-900">Billing & Credits</CardTitle>
              </div>
              <CardDescription>Manage your subscription and credits</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Available Tokens</p>
                    <p className="text-3xl font-bold mt-1">{settings.tokens.toLocaleString()}</p>
                  </div>
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Buy More Tokens
                  </Button>
                </div>

                {/* Subscription Status */}
                <div className="space-y-4">
                  {user?.subscriptionStatus === 'active' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Current Plan</span>
                        <Badge variant="secondary" className="bg-black text-white">
                          {user?.subscriptionIsAnnual ? 'Annual' : 'Monthly'} Subscription
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next Renewal</span>
                        <span className="text-sm font-medium">
                          {user?.subscriptionCurrentPeriodEnd 
                            ? new Date(user.subscriptionCurrentPeriodEnd).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Monthly Token Allowance</span>
                        <span className="text-sm font-medium">
                          {user?.subscriptionIsAnnual ? '1M tokens' : '1M tokens'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-2">No active subscription</p>
                      <p className="text-sm text-gray-500">Subscribe to get monthly token refills</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Subscription Options */}
                {user?.subscriptionStatus !== 'active' && (
                  <>
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Choose a Subscription Plan</h4>
                      
                      {/* Monthly Plan */}
                      <div className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Monthly Plan</h5>
                            <p className="text-sm text-gray-600 mt-1">1M tokens per month</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">$29</p>
                            <p className="text-xs text-gray-500">per month</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-3 bg-black hover:bg-gray-800 text-white"
                          onClick={() => handleSubscription('monthly')}
                          disabled={subscriptionMutation.isPending}
                        >
                          {subscriptionMutation.isPending ? 'Processing...' : 'Subscribe Monthly'}
                        </Button>
                      </div>

                      {/* Annual Plan */}
                      <div className="border border-gray-200 rounded-xl p-4 hover:border-black transition-colors cursor-pointer relative">
                        <div className="absolute -top-3 right-4">
                          <Badge className="bg-green-100 text-green-800 border-green-200">Save 20%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Annual Plan</h5>
                            <p className="text-sm text-gray-600 mt-1">12M tokens per year</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">$278</p>
                            <p className="text-xs text-gray-500">per year ($23.20/mo)</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-3 bg-black hover:bg-gray-800 text-white"
                          onClick={() => handleSubscription('annual')}
                          disabled={subscriptionMutation.isPending}
                        >
                          {subscriptionMutation.isPending ? 'Processing...' : 'Subscribe Annually'}
                        </Button>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                {/* One-time Purchase */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Need More Tokens?</h4>
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">Token Pack</h5>
                        <p className="text-sm text-gray-600">100k tokens - one time purchase</p>
                      </div>
                      <p className="text-xl font-bold">$10</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl"
                      onClick={() => handleTokenPurchase()}
                      disabled={tokenPurchaseMutation.isPending}
                    >
                      {tokenPurchaseMutation.isPending ? 'Processing...' : 'Buy Token Pack'}
                    </Button>
                  </div>
                </div>

                {/* Manage Subscription */}
                {user?.subscriptionStatus === 'active' && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <Button 
                        variant="outline" 
                        className="rounded-xl"
                        onClick={() => window.open('https://billing.stripe.com/p/login/test', '_blank')}
                      >
                        Manage Billing
                      </Button>
                      <Button 
                        variant="outline" 
                        className="rounded-xl text-red-600 hover:text-red-700"
                        onClick={() => handleCancelSubscription()}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? 'Canceling...' : 'Cancel Subscription'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <CardTitle className="text-xl font-bold text-gray-900">Data & Privacy</CardTitle>
              </div>
              <CardDescription>Manage your data and account security</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl"
                onClick={handleExportData}
                disabled={exportDataMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {exportDataMutation.isPending ? 'Exporting...' : 'Export All Data'}
              </Button>

              <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleChangePassword}>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your new password below. Make sure it's at least 8 characters long.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          name="currentPassword"
                          type="password"
                          required
                          className="bg-gray-50 border-gray-200 focus:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          required
                          minLength={8}
                          className="bg-gray-50 border-gray-200 focus:border-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          required
                          minLength={8}
                          className="bg-gray-50 border-gray-200 focus:border-black"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setChangePasswordOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-500">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Delete Account</DialogTitle>
                          <DialogDescription>
                            This will permanently delete your account and all associated data. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-gray-600">
                            Type <span className="font-mono font-semibold">{user?.email}</span> to confirm:
                          </p>
                          <Input
                            value={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.value)}
                            placeholder="Enter your email"
                            className="font-mono"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteAccountOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={confirmDelete !== user?.email || deleteAccountMutation.isPending}
                          >
                            Delete Account
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
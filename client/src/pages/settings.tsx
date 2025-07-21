import { useState } from "react";
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

  // Mock settings data - in production this would come from the API
  const settings: UserSettings = {
    id: user?.id || "",
    email: user?.email || "",
    name: user?.email?.split('@')[0] || "",
    profileImageUrl: user?.profileImageUrl,
    credits: user?.credits || 0,
    notifications: {
      emailAlerts: true,
      weeklyReports: false,
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
      return apiRequest('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
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
      return apiRequest('/api/user/notifications', {
        method: 'PATCH',
        body: JSON.stringify(notifications),
      });
    },
    onSuccess: () => {
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved.",
      });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/user/delete', {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      window.location.href = '/api/logout';
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
          
          <Link href="/conversations" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Conversations</span>
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
                <p className="text-xs text-green-600">{user?.credits || 0} credits</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/api/logout"}
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
                    <p className="text-sm font-medium text-gray-300">Available Credits</p>
                    <p className="text-3xl font-bold mt-1">{settings.credits.toLocaleString()}</p>
                  </div>
                  <Button className="bg-white text-black hover:bg-gray-100">
                    Buy More Credits
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Plan</span>
                    <Badge variant="secondary" className="bg-black text-white">Pro Plan</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Billing Period</span>
                    <span className="text-sm font-medium">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Billing Date</span>
                    <span className="text-sm font-medium">Aug 21, 2025</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" className="rounded-xl">
                    View Billing History
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    Manage Subscription
                  </Button>
                </div>
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
              <Button variant="outline" className="w-full justify-start rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>

              <Button variant="outline" className="w-full justify-start rounded-xl">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>

              <Button variant="outline" className="w-full justify-start rounded-xl">
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>

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
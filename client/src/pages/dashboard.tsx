import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Project, Document, Conversation } from "@shared/schema";
import { 
  MessageSquare, 
  Link as LinkIcon, 
  BarChart3, 
  Settings,
  Plus,
  Upload,
  DollarSign,
  FileText,
  Database,
  Brain,
  Menu,
  X,
  Home,
  FolderOpen,
  Users,
  LogOut,
  Sparkles,
  Clock,
  CheckCircle2,
  Bell,
  CreditCard,
  ArrowRight
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import DocumentsList from "@/components/DocumentsList";
import ShareLinkModal from "@/components/ShareLinkModal";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Dashboard() {
  usePageTitle('Dashboard');
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  // Fetch analytics
  const { data: analytics } = useQuery<{
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  }>({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  });

  // Fetch conversations to check for contact notifications
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  // Check if there are any conversations with contact details
  const hasContactNotifications = conversations.some((conv) => conv.contactProvidedAt);

  // Fetch documents for selected project
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/projects", selectedProjectId, "documents"],
    enabled: !!selectedProjectId,
  });

  // Auto-select first project or create default
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Get the selected project object
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: { name: string; description?: string }) => {
      const res = await apiRequest("POST", "/api/projects", projectData);
      return res.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setSelectedProjectId(newProject.id);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    setShowNewProjectModal(true);
  };

  const handleSubmitNewProject = () => {
    if (newProjectName.trim()) {
      createProjectMutation.mutate({ 
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || undefined
      });
      setShowNewProjectModal(false);
      setNewProjectName("");
      setNewProjectDescription("");
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (projectsLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base font-inter-tight">PC</span>
            </div>
            <span className="font-bold text-lg text-black font-inter-tight tracking-tight">PitchChat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 bg-gray-50 text-black rounded-lg transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>
          
          <Link 
            href={selectedProjectId ? `/documents/${selectedProjectId}` : "/"} 
            className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>
          
          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-blue-600 border-none" />
            )}
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Analytics</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-100"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  {user?.subscriptionStatus === 'active' ? 'Pro' : 'Free'}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/api/auth/logout"}
              className="h-8 w-8 text-gray-400 hover:text-black"
            >
              <LogOut className="h-4 w-4" />
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
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30 h-20 flex items-center shrink-0">
          <div className="px-6 lg:px-8 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {selectedProject && (
                <div>
                  <h2 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">{selectedProject.name}</h2>
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1.5">
                    Updated {selectedProject.updatedAt ? new Date(selectedProject.updatedAt).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedProject && (
                <Link href={`/links/${selectedProject.id}`}>
                  <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg h-9 text-xs font-semibold">
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                    Manage Links
                  </Button>
                </Link>
              )}
              <Button size="sm" onClick={() => setShowShareModal(true)} className="bg-black hover:bg-gray-800 text-white rounded-lg h-9 text-xs font-semibold shadow-sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create Link
              </Button>
            </div>
          </div>
        </header>

        {selectedProject ? (
          <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Documents</p>
                    <p className="text-2xl font-bold text-black font-inter-tight">{documents.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Processed</p>
                    <p className="text-2xl font-bold text-black font-inter-tight">
                      {documents.length > 0 
                        ? Math.round((documents.filter((d) => d.status === 'completed').length / documents.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center border border-blue-100/50">
                    <Brain className="w-5 h-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AI Status</p>
                    <p className="text-2xl font-bold text-black font-inter-tight">
                      {documents.some((d) => d.status === 'completed') ? 'Ready' : 'Waiting'}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-50/50 rounded-xl flex items-center justify-center border border-green-100/50">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-5 space-y-8">
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Upload</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-soft transition-all duration-300">
                    <FileUpload projectId={selectedProject.id} />
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Documents</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1 min-h-[400px] flex flex-col hover:shadow-soft transition-all duration-300">
                    <DocumentsList projectId={selectedProject.id} hideDelete={true} />
                  </div>
                </section>
              </div>

              <div className="xl:col-span-7">
                <section className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Test AI Assistant</h3>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase border-gray-200 text-gray-500 bg-white">
                      GPT-4o
                    </Badge>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex-1 overflow-hidden min-h-[600px] flex flex-col hover:shadow-soft transition-all duration-300">
                    <ChatInterface projectId={selectedProject.id} />
                  </div>
                </section>
              </div>
            </div>

            {analytics && (
              <section className="pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quick Analytics</h3>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-gray-500 hover:text-black">
                      Full Report <ArrowRight className="ml-1.5 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Questions</p>
                    <p className="text-2xl font-bold text-black font-inter-tight">{analytics.totalQuestions}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Links</p>
                    <p className="text-2xl font-bold text-black font-inter-tight">{analytics.activeLinks}</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black text-white md:col-span-2 flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Plan</p>
                      <p className="text-xl font-bold font-inter-tight">
                        {user?.subscriptionStatus === 'active' ? 'Unlimited Pro' : 'Free Tier'}
                      </p>
                    </div>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-100 rounded-lg h-8 text-[10px] font-bold uppercase relative z-10">
                      Upgrade
                    </Button>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                <Plus className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-black font-inter-tight mb-2">No Projects Yet</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Create your first project to start transforming your pitch decks into intelligent conversations.
              </p>
              <Button 
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-black/10"
              >
                Create First Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <ShareLinkModal 
          projectId={selectedProject.id} 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* New Project Dialog */}
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="bg-white rounded-2xl border-gray-200 shadow-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Create New Project</DialogTitle>
            <DialogDescription className="text-gray-600">
              Give your project a name and optional description to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="project-name" className="text-sm font-medium text-gray-700">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="My Startup Pitch"
                className="mt-1.5 rounded-xl border-gray-300 focus:border-black focus:ring-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newProjectName.trim()) {
                    handleSubmitNewProject();
                  }
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="project-description" className="text-sm font-medium text-gray-700">
                Description <span className="text-gray-500">(optional)</span>
              </Label>
              <Textarea
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your project..."
                className="mt-1.5 rounded-xl border-gray-300 focus:border-black focus:ring-black min-h-[100px]"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowNewProjectModal(false);
                setNewProjectName("");
                setNewProjectDescription("");
              }}
              className="rounded-xl border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitNewProject}
              disabled={!newProjectName.trim() || createProjectMutation.isPending}
              className="bg-black hover:bg-gray-800 text-white rounded-xl"
            >
              {createProjectMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
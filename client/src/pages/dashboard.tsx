import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import type { Project, Document, Conversation, User } from "@shared/schema";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { BlobMorphBackground } from "@/components/backgrounds";
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
  ArrowRight,
  Link2,
  Sparkles
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

type DashboardBootstrap = {
  user: User;
  projects: Project[];
  analytics: {
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  };
  conversations: Conversation[];
};

// Feature cards for empty state - matching auth page style (doubled for fuller background)
const emptyStateCards = [
  // First set
  { id: 1, label: "AI Rooms", title: "Pitch 24/7", bgColor: "bg-[#DAE8FB]", mockup: "chat" },
  { id: 2, label: "Lead Capture", title: "Know your viewers", bgColor: "bg-[#E8E4F3]", mockup: "leads" },
  { id: 3, label: "Analytics", title: "Track intent", bgColor: "bg-[#EAE3D1]", mockup: "analytics" },
  { id: 4, label: "Smart Links", title: "Share securely", bgColor: "bg-[#F5F5F5]", mockup: "link" },
  { id: 5, label: "Documents", title: "Upload once", bgColor: "bg-[#DAE8FB]", mockup: "upload" },
  { id: 6, label: "Insights", title: "AI-powered", bgColor: "bg-[#E8E4F3]", mockup: "insights" },
  // Second set (duplicates with different positions)
  { id: 7, label: "AI Rooms", title: "Pitch 24/7", bgColor: "bg-[#DAE8FB]", mockup: "chat" },
  { id: 8, label: "Lead Capture", title: "Know your viewers", bgColor: "bg-[#E8E4F3]", mockup: "leads" },
  { id: 9, label: "Analytics", title: "Track intent", bgColor: "bg-[#EAE3D1]", mockup: "analytics" },
  { id: 10, label: "Smart Links", title: "Share securely", bgColor: "bg-[#F5F5F5]", mockup: "link" },
  { id: 11, label: "Documents", title: "Upload once", bgColor: "bg-[#DAE8FB]", mockup: "upload" },
  { id: 12, label: "Insights", title: "AI-powered", bgColor: "bg-[#E8E4F3]", mockup: "insights" },
];

// Card positions for floating layout - 12 positions spread around the viewport
const cardPositions = [
  // Top row
  { top: "-2%", left: "2%", rotate: -12, scale: 1.0 },
  { top: "3%", left: "25%", rotate: 5, scale: 0.95 },
  { top: "-3%", right: "20%", rotate: -6, scale: 1.05 },
  { top: "5%", right: "-2%", rotate: 10, scale: 0.98 },
  // Middle row (sides only - center is for CTA)
  { top: "32%", left: "-4%", rotate: -8, scale: 1.0 },
  { top: "38%", right: "-3%", rotate: 12, scale: 0.92 },
  // Lower middle
  { top: "55%", left: "0%", rotate: 6, scale: 0.95 },
  { top: "52%", right: "2%", rotate: -10, scale: 1.02 },
  // Bottom row
  { bottom: "8%", left: "-2%", rotate: 8, scale: 0.98 },
  { bottom: "2%", left: "22%", rotate: -5, scale: 1.0 },
  { bottom: "5%", right: "18%", rotate: 7, scale: 0.95 },
  { bottom: "-2%", right: "0%", rotate: -8, scale: 1.0 },
];

// Mini mockup components
function MiniChatMockup() {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-end">
        <div className="rounded-xl rounded-tr-sm bg-black px-2 py-1">
          <p className="text-[9px] text-white">What's your ARR?</p>
        </div>
      </div>
      <div className="flex justify-start">
        <div className="rounded-xl rounded-tl-sm border border-black/10 bg-white px-2 py-1">
          <p className="text-[9px] text-black/70">$2.4M ARR</p>
        </div>
      </div>
    </div>
  );
}

function MiniLeadsMockup() {
  return (
    <div className="space-y-1">
      <div className="rounded-lg bg-white border border-black/10 px-2 py-1">
        <p className="text-[8px] text-black/40">name@vc.com</p>
      </div>
      <div className="flex items-center gap-1">
        <Users className="h-2.5 w-2.5 text-black/40" />
        <span className="text-[8px] text-black/50">12 leads</span>
      </div>
    </div>
  );
}

function MiniAnalyticsMockup() {
  return (
    <div className="flex gap-1">
      <div className="flex-1 rounded-lg bg-white border border-black/10 p-1.5 text-center">
        <p className="text-sm font-bold text-black">47</p>
        <p className="text-[7px] text-black/40">Views</p>
      </div>
      <div className="flex-1 rounded-lg bg-white border border-black/10 p-1.5 text-center">
        <p className="text-sm font-bold text-black">23</p>
        <p className="text-[7px] text-black/40">Q&A</p>
      </div>
    </div>
  );
}

function MiniLinkMockup() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 rounded-lg bg-white border border-black/10 px-2 py-1">
        <Link2 className="h-3 w-3 text-black" />
        <span className="text-[9px] text-black/60">pitch.chat/you</span>
      </div>
      <div className="flex gap-1">
        <span className="rounded-full bg-black/[0.06] px-1.5 py-0.5 text-[7px] text-black/50">Active</span>
      </div>
    </div>
  );
}

function MiniUploadMockup() {
  return (
    <div className="space-y-1">
      <div className="rounded-lg border border-dashed border-black/20 bg-white/50 p-2 text-center">
        <Upload className="mx-auto h-3 w-3 text-black/30" />
      </div>
      <div className="flex items-center gap-1 rounded-lg bg-white border border-black/10 px-1.5 py-1">
        <FileText className="h-2.5 w-2.5 text-red-500" />
        <span className="text-[8px] text-black/60">Deck.pdf</span>
      </div>
    </div>
  );
}

function MiniInsightsMockup() {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1">
        <Sparkles className="h-3 w-3 text-black/60" />
        <span className="text-[9px] font-medium text-black/70">AI Insights</span>
      </div>
      <div className="rounded-lg bg-white border border-black/10 px-2 py-1">
        <p className="text-[8px] text-black/50">3 hot investors</p>
      </div>
    </div>
  );
}

const mockupComponents: Record<string, React.FC> = {
  chat: MiniChatMockup,
  leads: MiniLeadsMockup,
  analytics: MiniAnalyticsMockup,
  link: MiniLinkMockup,
  upload: MiniUploadMockup,
  insights: MiniInsightsMockup,
};

// Empty state with floating cards component
function EmptyProjectsState({ onCreateProject, isCreating }: { onCreateProject: () => void; isCreating: boolean }) {
  return (
    <div className="flex-1 relative overflow-hidden bg-[#FAFAFA]">
      {/* Blob morphing background */}
      <BlobMorphBackground />

      {/* Floating cards - 30% bigger, hidden on small screens */}
      {emptyStateCards.map((card, index) => {
        const pos = cardPositions[index];
        const MockupComponent = mockupComponents[card.mockup];

        return (
          <motion.div
            key={card.id}
            className="absolute w-[260px] pointer-events-none hidden md:block"
            style={{
              top: pos.top,
              left: pos.left,
              right: pos.right,
              bottom: pos.bottom,
            }}
            initial={{ opacity: 0, y: 30, rotate: pos.rotate, scale: pos.scale }}
            animate={{ opacity: 0.75, y: 0, rotate: pos.rotate, scale: pos.scale }}
            transition={{
              duration: 1,
              delay: index * 0.08,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <div
              className={`${card.bgColor} rounded-3xl p-5 shadow-xl shadow-black/8 backdrop-blur-sm border border-white/50`}
              style={{ opacity: 0.9 }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest text-black/40">
                {card.label}
              </div>
              <h4 className="mt-1.5 text-base font-semibold text-black/85">{card.title}</h4>
              <div className="mt-3">
                <MockupComponent />
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Center CTA overlay - fully responsive */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6">
        <motion.div
          className="text-center max-w-lg w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl shadow-black/10 border border-black/5">
            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 tracking-tight">
            Create your first project
          </h2>
          <p className="text-black/50 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Transform your pitch deck into an AI-powered conversation room that works for you 24/7.
          </p>
          <Button
            onClick={onCreateProject}
            disabled={isCreating}
            className="bg-black hover:bg-black/90 text-white px-6 sm:px-8 lg:px-10 h-12 sm:h-14 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-[0_0_0_0_rgba(0,0,0,0),0_16px_40px_rgba(0,0,0,0.25)] transition-all duration-300 hover:shadow-[0_0_30px_8px_rgba(0,0,0,0.15),0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span className="whitespace-nowrap">Get Started</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

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
  const [bootstrapHydrated, setBootstrapHydrated] = useState(false);
  const [skipProjectsSkeleton] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return sessionStorage.getItem("pc_onboarding") === "1";
  });

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

  const bootstrapQuery = useQuery<DashboardBootstrap | null>({
    queryKey: ["/api/bootstrap"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user,
  });

  useEffect(() => {
    if (!bootstrapQuery.data) {
      return;
    }

    queryClient.setQueryData(["/api/auth/user"], bootstrapQuery.data.user);
    queryClient.setQueryData(["/api/projects"], bootstrapQuery.data.projects);
    queryClient.setQueryData(["/api/analytics"], bootstrapQuery.data.analytics);
    queryClient.setQueryData(["/api/conversations"], bootstrapQuery.data.conversations);
    setBootstrapHydrated(true);
  }, [bootstrapQuery.data, queryClient]);

  const bootstrapFailed = bootstrapQuery.isError;
  const bootstrapLoading = bootstrapQuery.isLoading || bootstrapQuery.isFetching;

  // Fetch projects (fallback when bootstrap fails)
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user && bootstrapFailed,
  });

  useEffect(() => {
    const onboardingReady =
      bootstrapHydrated || (bootstrapFailed && !projectsLoading);

    if (skipProjectsSkeleton && onboardingReady && typeof window !== "undefined") {
      sessionStorage.removeItem("pc_onboarding");
    }
  }, [bootstrapFailed, bootstrapHydrated, projectsLoading, skipProjectsSkeleton]);

  // Fetch analytics
  const { data: analytics } = useQuery<{
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  }>({
    queryKey: ["/api/analytics"],
    enabled: !!user && bootstrapFailed,
  });

  // Fetch conversations to check for contact notifications
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user && bootstrapFailed,
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
      queryClient.setQueryData<Project[]>(["/api/projects"], (current = []) => [
        newProject,
        ...current,
      ]);
      queryClient.setQueryData<DashboardBootstrap | undefined>(
        ["/api/bootstrap"],
        (current) =>
          current
            ? {
                ...current,
                projects: [newProject, ...current.projects],
              }
            : current,
      );
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

  if (authLoading && !skipProjectsSkeleton) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  const showProjectsSkeleton = (projectsLoading || bootstrapLoading) && !skipProjectsSkeleton;

  if (showProjectsSkeleton) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Fixed Sidebar - Monochrome like landing */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-black/[0.08] z-50
        transform transition-all duration-200
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
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

        {/* Navigation - Monochrome style */}
        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 bg-black text-white rounded-xl transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>

          <Link
            href={selectedProjectId ? `/documents/${selectedProjectId}` : "/"}
            className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200"
          >
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>

          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 bg-black border-none" />
            )}
          </Link>

          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Analytics</span>
          </Link>

          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-black/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 object-cover rounded-xl border border-black/10"
                />
              ) : (
                <div className="w-8 h-8 bg-black/[0.04] rounded-xl flex items-center justify-center border border-black/10">
                  <Users className="w-4 h-4 text-black/60" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user.email?.split('@')[0]}</p>
                <p className="text-[10px] text-black/45 font-medium uppercase tracking-wider">
                  {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.href = "/api/auth/logout"}
              className="h-8 w-8 text-black/45 hover:text-black"
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
        {/* Top Header - Monochrome like landing */}
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
              {selectedProject && (
                <div>
                  <h2 className="text-xl font-bold text-black tracking-tight leading-none">{selectedProject.name}</h2>
                  <p className="text-[11px] text-black/45 font-medium uppercase tracking-wider mt-1.5">
                    Updated {selectedProject.updatedAt ? new Date(selectedProject.updatedAt).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedProject && (
                <Link href={`/links/${selectedProject.id}`}>
                  <Button variant="outline" size="sm" className="border-black/10 text-black/60 hover:text-black hover:border-black h-9 text-xs font-semibold rounded-xl">
                    <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                    Manage Links
                  </Button>
                </Link>
              )}
              <Button 
                size="sm" 
                onClick={() => {
                  if (selectedProject) {
                    setShowShareModal(true);
                  } else {
                    handleCreateProject();
                  }
                }} 
                className="bg-black hover:bg-black/90 text-white h-9 text-xs font-semibold rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create Link
              </Button>
            </div>
          </div>
        </header>

        {selectedProject ? (
          <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] bg-[#FAFAFA] min-h-[calc(100vh-5rem)]">
            {/* Stats Cards - Enhanced with pastel backgrounds */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="bg-[#DAE8FB] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Documents</p>
                    <p className="text-3xl font-bold text-black tracking-tight">{documents.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-black/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#E8E4F3] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Processed</p>
                    <p className="text-3xl font-bold text-black tracking-tight">
                      {documents.length > 0
                        ? Math.round((documents.filter((d) => d.status === 'completed').length / documents.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-black/70" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#EAE3D1] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Conversations</p>
                    <p className="text-3xl font-bold text-black tracking-tight">
                      {conversations.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-black/70" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              <div className="xl:col-span-5 space-y-8">
                <section>
                  <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-widest mb-4">Quick Upload</h3>
                  <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-lg shadow-black/5 transition-all duration-200">
                    <FileUpload projectId={selectedProject.id} />
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-widest mb-4">Your Documents</h3>
                  <div className="bg-white border border-black/8 rounded-3xl p-2 min-h-[400px] flex flex-col shadow-lg shadow-black/5 transition-all duration-200">
                    <DocumentsList projectId={selectedProject.id} hideDelete={true} />
                  </div>
                </section>
              </div>

              <div className="xl:col-span-7">
                <section className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-widest">Test AI Assistant</h3>
                  </div>
                  <div className="bg-white border border-black/8 rounded-3xl flex-1 overflow-hidden min-h-[600px] flex flex-col shadow-lg shadow-black/5 transition-all duration-200">
                    <ChatInterface projectId={selectedProject.id} />
                  </div>
                </section>
              </div>
            </div>

            {analytics && (
              <section className="pt-8 mt-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-widest">Quick Analytics</h3>
                  <Link href="/analytics">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-black/50 hover:text-black rounded-xl">
                      Full Report <ArrowRight className="ml-1.5 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border border-black/8 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-semibold text-black/45 uppercase tracking-widest mb-1.5">Questions</p>
                    <p className="text-2xl font-bold text-black tracking-tight">{analytics.totalQuestions}</p>
                  </div>
                  <div className="p-5 bg-white border border-black/8 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-semibold text-black/45 uppercase tracking-widest mb-1.5">Active Links</p>
                    <p className="text-2xl font-bold text-black tracking-tight">{analytics.activeLinks}</p>
                  </div>
                  <div className="p-5 bg-white border border-black/8 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-semibold text-black/45 uppercase tracking-widest mb-1.5">Lead Rate</p>
                    <p className="text-2xl font-bold text-black tracking-tight">
                      {conversations.length > 0 
                        ? ((conversations.filter(c => c.contactProvidedAt).length / conversations.length) * 100).toFixed(0)
                        : 0}%
                    </p>
                  </div>
                  <div className="p-5 bg-white border border-black/8 rounded-2xl shadow-sm">
                    <p className="text-[10px] font-semibold text-black/45 uppercase tracking-widest mb-1.5">Contacts</p>
                    <p className="text-2xl font-bold text-black tracking-tight">
                      {conversations.filter(c => c.contactProvidedAt).length}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : (
          <EmptyProjectsState
            onCreateProject={handleCreateProject}
            isCreating={createProjectMutation.isPending}
          />
        )}
      </div>

      {selectedProject && (
        <ShareLinkModal 
          projectId={selectedProject.id} 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)} 
        />
      )}

      {/* New Project Dialog - Enhanced aesthetics matching landing page */}
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="bg-[#FAFAFA] border border-black/8 rounded-3xl max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.18)] font-sans p-0 overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="px-7 pt-7 pb-5 bg-gradient-to-b from-white to-transparent">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-black tracking-tight">Create New Project</DialogTitle>
              <DialogDescription className="text-black/55 mt-1.5">
                Give your project a name and optional description to get started.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-5 px-7 pb-7">
            <div>
              <Label htmlFor="project-name" className="text-sm font-semibold text-black/80">
                Project Name <span className="text-black/40">*</span>
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Your Project Name"
                className="mt-2 bg-white border-black/10 focus:border-black focus:ring-black/10 rounded-2xl h-12 px-4 text-base placeholder:text-black/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newProjectName.trim()) {
                    handleSubmitNewProject();
                  }
                }}
              />
            </div>

            <div>
              <Label htmlFor="project-description" className="text-sm font-semibold text-black/80">
                Description <span className="text-black/35 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="project-description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="A brief description of your project..."
                className="mt-2 bg-white border-black/10 focus:border-black focus:ring-black/10 min-h-[100px] rounded-2xl px-4 py-3 text-base placeholder:text-black/30 resize-none"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewProjectModal(false);
                  setNewProjectName("");
                  setNewProjectDescription("");
                }}
                className="flex-1 border-black/10 text-black/60 hover:bg-black/[0.04] hover:text-black rounded-2xl h-12 font-semibold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitNewProject}
                disabled={!newProjectName.trim() || createProjectMutation.isPending}
                className="flex-1 bg-black hover:bg-black/90 text-white rounded-2xl h-12 font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all"
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

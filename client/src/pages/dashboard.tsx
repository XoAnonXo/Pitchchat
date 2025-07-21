import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
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
  CheckCircle2
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import DocumentsList from "@/components/DocumentsList";
import ShareLinkModal from "@/components/ShareLinkModal";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
    enabled: !!user,
  });

  // Fetch documents for selected project
  const { data: documents = [] } = useQuery({
    queryKey: ["/api/projects", selectedProjectId, "documents"],
    enabled: !!selectedProjectId,
  });

  // Auto-select first project or create default
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

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
          window.location.href = "/api/login";
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
    const name = prompt("Enter project name:");
    if (name?.trim()) {
      createProjectMutation.mutate({ name: name.trim() });
    }
  };

  const selectedProject = projects.find((p: any) => p.id === selectedProjectId);

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
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl transition-all duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href={selectedProjectId ? `/documents/${selectedProjectId}` : "#"} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
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
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>

        {/* New Project Button */}
        <div className="px-4 mb-6">
          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white rounded-xl h-12 font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
            onClick={handleCreateProject}
            disabled={createProjectMutation.isPending}
          >
            <Plus className="w-5 h-5 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Section */}
        {projects.length > 0 && (
          <div className="px-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Recent Projects</h3>
            <div className="space-y-2">
              {projects.slice(0, 3).map((project: any) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                    selectedProjectId === project.id 
                      ? 'bg-gray-100 text-black font-medium' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{project.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Updated {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {user.profileImageUrl ? (
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
                <p className="text-sm font-medium text-gray-900">{user.email?.split('@')[0]}</p>
                <p className="text-xs text-green-600">{user.credits || 0} credits</p>
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
              {selectedProject && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h2>
                  <p className="text-sm text-gray-500">Last updated {new Date(selectedProject.updatedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                Export Data
              </Button>
              <Button onClick={() => setShowShareModal(true)} className="bg-black hover:bg-gray-800 text-white rounded-xl">
                Share Link
              </Button>
            </div>
          </div>
        </header>

        {selectedProject ? (
          <div className="p-6 lg:p-8">
            {/* Document Upload Section */}
            <section className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Documents</h3>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <FileUpload projectId={selectedProject.id} />
              </div>
            </section>

            {/* Stats Cards */}
            <section className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white rounded-2xl border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-black" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">{documents.length}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Documents Uploaded</p>
                    <p className="text-xs text-gray-400 mt-1">All your project files</p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-green-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {documents.length > 0 
                          ? Math.round((documents.filter((d: any) => d.status === 'completed').length / documents.length) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Processed</p>
                    <p className="text-xs text-gray-400 mt-1">AI analysis complete</p>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-3xl font-bold text-gray-900">
                        {documents.some((d: any) => d.status === 'completed') ? 'Ready' : 'Waiting'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">AI Assistant Status</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {documents.some((d: any) => d.status === 'completed') 
                        ? 'Chat is available' 
                        : 'Upload documents to start'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Documents and Chat Section */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Documents List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2 text-black" />
                    Your Documents
                  </h3>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <DocumentsList projectId={selectedProject.id} hideDelete={true} />
                  </div>
                </div>

                {/* Chat Interface */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-black" />
                      Test AI Assistant
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Model:</span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                        o3
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <ChatInterface projectId={selectedProject.id} model="o3" />
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics Section */}
            {analytics && (
              <section className="mt-10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analytics Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Questions</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {analytics.totalQuestions}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Active Links</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            {analytics.activeLinks}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                          <LinkIcon className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Cost This Month</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            ${analytics.monthlyCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-[#FFF5E6] rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-[#FFA500]" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-500 mb-4">Create your first project to get started</p>
              <Button 
                onClick={handleCreateProject}
                disabled={createProjectMutation.isPending}
                className="bg-[#FFA500] hover:bg-[#FF8C00] text-white rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        )}
      </div>

      {showShareModal && selectedProject && (
        <ShareLinkModal 
          projectId={selectedProject.id} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
}
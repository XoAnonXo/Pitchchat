import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Github,
  FileText,
  Database
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import DocumentsList from "@/components/DocumentsList";
import ShareLinkModal from "@/components/ShareLinkModal";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

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
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <h1 className="text-xl font-semibold text-slate-900">PitchChat Builder</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#dashboard" className="text-primary font-medium">Dashboard</a>
              <a href="#projects" className="text-slate-700 hover:text-primary font-medium">Projects</a>
              <a href="#analytics" className="text-slate-700 hover:text-primary font-medium">Analytics</a>
              <a href="#settings" className="text-slate-700 hover:text-primary font-medium">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-slate-700">{user.credits || 0} credits</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
              >
                Logout
              </Button>
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-slate-300 rounded-full" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0">
          <div className="p-6">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <nav className="px-6">
            <div className="space-y-2">
              <a href="#" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
                <Database className="w-5 h-5" />
                <span>All Projects</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-primary bg-blue-50 px-3 py-2 rounded-lg">
                <MessageSquare className="w-5 h-5" />
                <span>Active Chats</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
                <LinkIcon className="w-5 h-5" />
                <span>Shared Links</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </a>
            </div>
          </nav>

          {projects.length > 0 && (
            <div className="px-6 mt-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Recent Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 3).map((project: any) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`block w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedProjectId === project.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-medium text-slate-900 text-sm">{project.name}</div>
                    <div className="text-xs text-slate-500">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-slate-50">
          {selectedProject ? (
            <>
              {/* Project Header */}
              <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                    <p className="text-slate-600 mt-1">
                      Last updated {new Date(selectedProject.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline">
                      Export Data
                    </Button>
                    <Button onClick={() => setShowShareModal(true)}>
                      Generate Share Link
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: File Upload & Documents */}
                  <div className="lg:col-span-1 space-y-6">
                    <FileUpload projectId={selectedProject.id} />
                    <DocumentsList projectId={selectedProject.id} />
                  </div>

                  {/* Right Column: Chat Interface */}
                  <div className="lg:col-span-2">
                    <ChatInterface projectId={selectedProject.id} />
                  </div>
                </div>

                {/* Analytics Section */}
                {analytics && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-500 text-sm font-medium">Total Questions</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                              {analytics.totalQuestions}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-500 text-sm font-medium">Active Links</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                              {analytics.activeLinks}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <LinkIcon className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-slate-500 text-sm font-medium">Cost This Month</p>
                            <p className="text-2xl font-bold text-slate-900 mt-1">
                              ${analytics.monthlyCost.toFixed(2)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Database className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Projects Yet</h3>
                <p className="text-slate-600 mb-4">Create your first project to get started</p>
                <Button 
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Share Link Modal */}
      {showShareModal && selectedProject && (
        <ShareLinkModal
          projectId={selectedProject.id}
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

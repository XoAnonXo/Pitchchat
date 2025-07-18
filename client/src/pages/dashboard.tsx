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
  Database,
  Brain,
  Zap
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import DocumentsList from "@/components/DocumentsList";
import ShareLinkModal from "@/components/ShareLinkModal";
import IntegrationDialog from "@/components/IntegrationDialog";
import { AIModelSelector } from "@/components/ui/ai-model-selector";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-[#5C8AF7] rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">PC</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">PitchChat Builder</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#dashboard" className="text-primary font-medium">Dashboard</a>
              <a href="#projects" className="text-muted-foreground hover:text-primary font-medium transition-colors">Projects</a>
              <a href="#analytics" className="text-muted-foreground hover:text-primary font-medium transition-colors">Analytics</a>
              <a href="#settings" className="text-muted-foreground hover:text-primary font-medium transition-colors">Settings</a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-muted-foreground">{user.credits || 0} credits</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="text-muted-foreground hover:text-foreground"
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
                <div className="w-8 h-8 bg-muted rounded-full" />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border flex-shrink-0">
          <div className="p-6">
            <Button 
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 rounded-lg font-medium shadow-soft"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <nav className="px-6">
            <div className="space-y-1">
              <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">All Projects</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-primary bg-secondary px-3 py-2 rounded-lg">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Active Chats</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Shared Links</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </a>
            </div>
          </nav>

          {projects.length > 0 && (
            <div className="px-6 mt-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 3).map((project: any) => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`block w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedProjectId === project.id 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background text-card-foreground border-border hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="font-medium text-sm">{project.name}</div>
                    <div className="text-xs opacity-75 mt-1">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background">
          {selectedProject ? (
            <>
              {/* Project Header */}
              <div className="bg-card border-b border-border px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{selectedProject.name}</h2>
                    <p className="text-muted-foreground mt-1">
                      Last updated {new Date(selectedProject.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <IntegrationDialog projectId={selectedProject.id} />
                    <Button variant="outline" className="rounded-lg">
                      Export Data
                    </Button>
                    <Button onClick={() => setShowShareModal(true)} className="rounded-lg">
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
                    <div className="bg-card rounded-xl shadow-subtle border border-border p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-foreground">AI Assistant</h3>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <AIModelSelector 
                            value={selectedModel} 
                            onChange={setSelectedModel}
                            className="w-48"
                          />
                        </div>
                      </div>
                      <ChatInterface projectId={selectedProject.id} model={selectedModel} />
                    </div>
                  </div>
                </div>

                {/* Analytics Section */}
                {analytics && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-xl border-border shadow-subtle">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm font-medium">Total Questions</p>
                            <p className="text-2xl font-semibold text-foreground mt-1">
                              {analytics.totalQuestions}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border shadow-subtle">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm font-medium">Active Links</p>
                            <p className="text-2xl font-semibold text-foreground mt-1">
                              {analytics.activeLinks}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <LinkIcon className="w-6 h-6 text-success" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-border shadow-subtle">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm font-medium">Cost This Month</p>
                            <p className="text-2xl font-semibold text-foreground mt-1">
                              ${analytics.monthlyCost.toFixed(2)}
                            </p>
                          </div>
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-alert" />
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
                <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-4">Create your first project to get started</p>
                <Button 
                  onClick={handleCreateProject}
                  disabled={createProjectMutation.isPending}
                  className="gradient-primary shadow-soft"
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

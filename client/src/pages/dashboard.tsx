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
  Github,
  FileText,
  Database,
  Brain,
  Zap,
  Menu,
  X
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import DocumentsList from "@/components/DocumentsList";
import ShareLinkModal from "@/components/ShareLinkModal";
import IntegrationDialog from "@/components/IntegrationDialog";
import { AIModelSelector } from "@/components/ui/ai-model-selector";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-[#5C8AF7] rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">PC</span>
                </div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground hidden sm:block">PitchChat Builder</h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-primary font-medium">
                Dashboard
              </Link>
              <Link href={selectedProjectId ? `/documents/${selectedProjectId}` : "#"} className="text-muted-foreground hover:text-primary font-medium transition-colors">
                Documents
              </Link>
              <button className="text-muted-foreground hover:text-primary font-medium transition-colors">Analytics</button>
              <button className="text-muted-foreground hover:text-primary font-medium transition-colors">Settings</button>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-muted px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-muted-foreground">{user.credits || 0} credits</span>
              </div>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center space-x-4">
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
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="px-4 py-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-primary font-medium">
                Dashboard
              </Link>
              <Link 
                href={selectedProjectId ? `/documents/${selectedProjectId}` : "#"} 
                className="block px-3 py-2 text-muted-foreground hover:text-primary font-medium"
              >
                Documents
              </Link>
              <button className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary font-medium">
                Analytics
              </button>
              <button className="block w-full text-left px-3 py-2 text-muted-foreground hover:text-primary font-medium">
                Settings
              </button>
              <div className="flex items-center justify-between px-3 py-2 border-t border-border mt-2 pt-2">
                <div className="flex items-center space-x-2">
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
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-card border-r border-border flex-shrink-0 z-50
          transform transition-transform duration-200 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-4 md:hidden border-b border-border">
            <h2 className="font-semibold">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 md:p-6">
            <Button 
              className="w-full gradient-primary text-primary-foreground hover:opacity-90 rounded-lg font-medium shadow-soft"
              onClick={handleCreateProject}
              disabled={createProjectMutation.isPending}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <nav className="px-4 md:px-6">
            <div className="space-y-1">
              <Link href="/" className="flex items-center space-x-3 text-primary bg-secondary px-3 py-2 rounded-lg transition-colors">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">All Projects</span>
              </Link>
              <button className="w-full text-left flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-medium">Active Chats</span>
              </button>
              <Link 
                href={selectedProjectId ? `/documents/${selectedProjectId}` : "#"} 
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedProjectId 
                    ? "text-muted-foreground hover:bg-accent hover:text-accent-foreground" 
                    : "text-muted-foreground/50 cursor-not-allowed"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Manage Documents</span>
              </Link>
              <button className="w-full text-left flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Shared Links</span>
              </button>
              <button className="w-full text-left flex items-center space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-lg transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </button>
            </div>
          </nav>

          {projects.length > 0 && (
            <div className="px-4 md:px-6 mt-8">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Projects
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 3).map((project: any) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setMobileSidebarOpen(false);
                    }}
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
        <main className="flex-1 bg-background min-w-0">
          {selectedProject ? (
            <>
              {/* Project Header */}
              <div className="bg-card border-b border-border px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">{selectedProject.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Last updated {new Date(selectedProject.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <IntegrationDialog projectId={selectedProject.id} />
                    <Button variant="outline" className="rounded-lg text-sm sm:text-base">
                      Export Data
                    </Button>
                    <Button onClick={() => setShowShareModal(true)} className="rounded-lg text-sm sm:text-base">
                      Share Link
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                {/* Central Upload Area */}
                <div className="max-w-5xl mx-auto mb-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      Upload Your Documents
                    </h2>
                    <p className="text-muted-foreground text-lg">
                      Add your startup documents to build an intelligent pitch assistant
                    </p>
                  </div>
                  
                  {/* Large Upload Component */}
                  <div className="bg-card rounded-2xl shadow-soft border-2 border-dashed border-primary/20 p-8 mb-6">
                    <FileUpload projectId={selectedProject.id} />
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{documents.length}</p>
                      <p className="text-sm text-muted-foreground">Documents Uploaded</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <Brain className="w-8 h-8 text-success mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {documents.length > 0 
                          ? Math.round((documents.filter((d: any) => d.status === 'completed').length / documents.length) * 100) 
                          : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Processed</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4 text-center">
                      <MessageSquare className="w-8 h-8 text-alert mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">
                        {documents.some((d: any) => d.status === 'completed') ? 'Ready' : 'Waiting'}
                      </p>
                      <p className="text-sm text-muted-foreground">AI Assistant Status</p>
                    </div>
                  </div>
                </div>

                {/* Documents and Chat Section */}
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Documents List */}
                    <div>
                      <div className="bg-card rounded-xl shadow-subtle border border-border">
                        <div className="p-6 border-b border-border">
                          <h3 className="text-lg font-semibold text-foreground flex items-center">
                            <Database className="w-5 h-5 mr-2 text-primary" />
                            Your Documents
                          </h3>
                        </div>
                        <div className="p-6">
                          <DocumentsList projectId={selectedProject.id} />
                        </div>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div>
                      <div className="bg-card rounded-xl shadow-subtle border border-border">
                        <div className="p-6 border-b border-border">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground flex items-center">
                              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                              Test AI Assistant
                            </h3>
                            <AIModelSelector 
                              value={selectedModel} 
                              onChange={setSelectedModel}
                              className="w-48"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <ChatInterface projectId={selectedProject.id} model={selectedModel} />
                        </div>
                      </div>
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

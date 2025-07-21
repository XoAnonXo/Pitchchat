import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Calendar, 
  Database, 
  Trash2, 
  Download,
  Filter,
  MoreHorizontal,
  ExternalLink,
  ArrowLeft,
  Home,
  BarChart3,
  LinkIcon,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Settings,
  Users,
  FolderOpen,
  Plus,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";

interface Document {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  status: 'processing' | 'completed' | 'failed';
  tokens: number;
  createdAt: string;
  updatedAt: string;
  source?: string;
  chunks?: Array<{
    id: string;
    content: string;
    tokenCount: number;
    metadata: Record<string, any>;
  }>;
}

interface DocumentsPageProps {
  projectId: string;
}

export default function DocumentsPage({ projectId }: DocumentsPageProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const { data: project } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
  });

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: [`/api/projects/${projectId}/documents`],
    select: (data) => data || [],
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Document Deleted",
        description: "Document has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/documents`] });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const handleDelete = (documentId: string) => {
    if (window.confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      deleteMutation.mutate(documentId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-black">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-50 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return "📄";
    if (mimeType.includes('word') || mimeType.includes('document')) return "📝";
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return "📊";
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return "📋";
    return "📄";
  };

  const totalTokens = filteredDocuments.reduce((sum, doc) => sum + (doc.tokens || 0), 0);
  const totalSize = filteredDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="documents" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Fixed Sidebar - Same as Dashboard */}
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
          
          <Link href={`/documents/${projectId}`} className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl transition-all duration-200">
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
                <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
                <p className="text-sm text-gray-500">{project?.name || 'All Documents'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{documents?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{formatFileSize(totalSize)}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Processed</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {documents?.filter(d => d.status === 'completed').length || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Documents</CardTitle>
                <span className="text-sm text-gray-500">
                  {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredDocuments.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No documents found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Upload documents to get started'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredDocuments.map((doc) => (
                    <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="text-2xl">{getFileIcon(doc.mimeType)}</div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{doc.originalName}</h4>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                              <span>{formatFileSize(doc.fileSize)}</span>
                              <span>•</span>
                              <span>{doc.tokens.toLocaleString()} tokens</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(doc.createdAt))} ago</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(doc.status)}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(doc.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
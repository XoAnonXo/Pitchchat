import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
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
  Database, 
  Trash2, 
  Download,
  MoreHorizontal,
  ArrowLeft,
  Home,
  BarChart3,
  MessageSquare,
  X,
  FolderOpen,
  Users,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Bell,
  Settings,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatDistanceToNow } from "date-fns";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { Project, Document, Conversation } from "@shared/schema";

interface DocumentsPageProps {
  projectId: string;
}

export default function DocumentsPage({ projectId }: DocumentsPageProps) {
  usePageTitle('Documents');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: project } = useQuery<Project>({
    queryKey: [`/api/projects/${projectId}`],
  });

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: [`/api/projects/${projectId}/documents`],
  });

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  const hasContactNotifications = conversations.some((conv) => (conv as any).contactProvidedAt);

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
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = (doc.filename || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.originalName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "processing":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 text-[10px] font-bold uppercase py-0.5 px-2">
            <Clock className="w-2.5 h-2.5 mr-1" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 text-[10px] font-bold uppercase py-0.5 px-2">
            <CheckCircle className="w-2.5 h-2.5 mr-1" />
            Ready
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 text-[10px] font-bold uppercase py-0.5 px-2">
            <XCircle className="w-2.5 h-2.5 mr-1" />
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

  const totalTokens = documents.reduce((sum, doc) => sum + (doc.tokens || 0), 0);
  const totalSize = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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

        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          
          <Link href={`/documents/${projectId}`} className="flex items-center space-x-3 px-3 py-2 bg-gray-50 text-black rounded-lg transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-semibold text-sm">Documents</span>
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

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user?.profileImageUrl ? (
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
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider">
                  {user?.tokens || 0} tokens
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

      <div className="flex-1 lg:ml-64 flex flex-col">
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
              <div>
                <h2 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">Library</h2>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1.5">
                  {project?.name || 'Managing Project Documents'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black text-xs font-semibold h-9">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{documents.length}</p>
                </div>
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tokens</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{totalTokens.toLocaleString()}</p>
                </div>
                <div className="w-9 h-9 bg-blue-50/50 rounded-lg flex items-center justify-center border border-blue-100/50">
                  <Database className="w-4 h-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Storage</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{formatFileSize(totalSize)}</p>
                </div>
                <div className="w-9 h-9 bg-green-50/50 rounded-lg flex items-center justify-center border border-green-100/50">
                  <Database className="w-4 h-4 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ready</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">
                    {documents.filter(d => d.status === 'completed').length}
                  </p>
                </div>
                <div className="w-9 h-9 bg-purple-50/50 rounded-lg flex items-center justify-center border border-purple-100/50">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-sm focus:border-black focus:ring-0 transition-all shadow-subtle"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white border-gray-200 rounded-xl text-xs font-semibold shadow-subtle">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
            <CardContent className="p-0">
              {filteredDocuments.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-xl font-bold text-black font-inter-tight mb-2">No Documents Found</p>
                  <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or status filters.' 
                      : 'Upload your first pitch deck or financial document to get started.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Document Name</th>
                        <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tokens</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Added</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all text-xl">
                                {getFileIcon(doc.mimeType)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-black truncate max-w-[240px]">{doc.originalName}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase">{formatFileSize(doc.fileSize)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-600 tabular-nums">
                            {doc.tokens?.toLocaleString() || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium text-gray-400">
                            {doc.createdAt ? formatDistanceToNow(new Date(doc.createdAt)) : 'Just now'} ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-black rounded-lg">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-xl w-44">
                                <DropdownMenuItem className="text-xs font-semibold">
                                  <Eye className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                  View Analysis
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-semibold">
                                  <Download className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                  Download Original
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-600 focus:text-red-600 text-xs font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                                  Delete Permanently
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
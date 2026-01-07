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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

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

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/documents/${documentId}/download`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleViewAnalysis = (doc: Document) => {
    setSelectedDocument(doc);
    setShowAnalysisDialog(true);
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
          <Badge variant="outline" className="bg-black/[0.04] text-black/60 border-black/10 text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-lg">
            <Clock className="w-2.5 h-2.5 mr-1" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-black/[0.08] text-black border-black/10 text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-lg">
            <CheckCircle className="w-2.5 h-2.5 mr-1" />
            Ready
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-black/[0.04] text-black/50 border-black/10 text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-lg">
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

  const totalTokens = documents.reduce((sum, doc) => sum + (Number(doc.tokens) || 0), 0);
  const totalSize = documents.reduce((sum, doc) => sum + (Number(doc.fileSize) || 0), 0);

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
        fixed top-0 left-0 h-full w-64 bg-white border-r border-black/[0.08] z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base">PC</span>
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

        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link href={`/documents/${projectId}`} className="flex items-center space-x-3 px-3 py-2 bg-black/[0.06] text-black rounded-xl transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-semibold text-sm">Documents</span>
          </Link>

          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-black border-none" />
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

        <div className="absolute bottom-0 w-full p-4 border-t border-black/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover border border-black/10"
                />
              ) : (
                <div className="w-8 h-8 bg-black/[0.04] rounded-xl flex items-center justify-center border border-black/10">
                  <Users className="w-4 h-4 text-black/60" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-black/45 font-medium uppercase tracking-wider">
                  {user?.subscriptionStatus === 'active' ? 'Pro' : 'Free'}
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

      <div className="flex-1 lg:ml-64 flex flex-col">
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
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">Library</h2>
                <p className="text-[11px] text-black/45 font-medium uppercase tracking-wider mt-1.5">
                  {project?.name || 'Managing Project Documents'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-black/50 hover:text-black text-xs font-semibold h-9 rounded-xl">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="bg-[#DAE8FB] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Total</p>
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
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Tokens</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{totalTokens.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#EAE3D1] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Storage</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{formatFileSize(totalSize)}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#F5E6E0] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Ready</p>
                  <p className="text-3xl font-bold text-black tracking-tight">
                    {documents.filter(d => d.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/30 w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white border-black/10 rounded-2xl text-xs font-semibold">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-black/10 shadow-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300">
            <CardContent className="p-0">
              {filteredDocuments.length === 0 ? (
                <div className="p-20 text-center">
                  <div className="w-16 h-16 bg-black/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-black/30" />
                  </div>
                  <p className="text-xl font-bold text-black mb-2">No Documents Found</p>
                  <p className="text-black/50 max-w-sm mx-auto leading-relaxed">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or status filters.'
                      : 'Upload your first pitch deck or financial document to get started.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/[0.02] border-b border-black/[0.06]">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-black/40 uppercase tracking-wider">Document Name</th>
                        <th className="px-6 py-4 text-center text-[10px] font-bold text-black/40 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center text-[10px] font-bold text-black/40 uppercase tracking-wider">Tokens</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-black/40 uppercase tracking-wider">Added</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-black/40 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04]">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="hover:bg-black/[0.02] transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-black/[0.03] flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-black/10 transition-all text-xl">
                                {getFileIcon(doc.mimeType)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-black truncate max-w-[240px]">{doc.originalName}</p>
                                <p className="text-[10px] text-black/40 font-medium uppercase">{formatFileSize(doc.fileSize)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-black/60 tabular-nums">
                            {doc.tokens?.toLocaleString() || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium text-black/40">
                            {doc.createdAt ? formatDistanceToNow(new Date(doc.createdAt)) : 'Just now'} ago
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-black/30 hover:text-black rounded-xl">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl border-black/10 shadow-xl w-44">
                                <DropdownMenuItem
                                  onClick={() => handleViewAnalysis(doc)}
                                  className="text-xs font-semibold rounded-xl"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-2 text-black/40" />
                                  View Analysis
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDownload(doc.id, doc.originalName)}
                                  className="text-xs font-semibold rounded-xl"
                                >
                                  <Download className="w-3.5 h-3.5 mr-2 text-black/40" />
                                  Download Original
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(doc.id)}
                                  className="text-red-600 focus:text-red-600 text-xs font-semibold rounded-xl"
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

      {/* Document Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="bg-[#FAFAFA] border border-black/8 rounded-3xl max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.18)] p-0 overflow-hidden">
          <div className="px-7 pt-7 pb-5 bg-gradient-to-b from-white to-transparent">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-black tracking-tight">
                Document Analysis
              </DialogTitle>
            </DialogHeader>
          </div>
          {selectedDocument && (
            <div className="space-y-4 px-7 pb-7">
              {/* File Info */}
              <div className="p-4 bg-white border border-black/8 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 bg-black/[0.03] rounded-xl flex items-center justify-center text-2xl">
                    {getFileIcon(selectedDocument.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-black text-sm truncate">{selectedDocument.originalName}</p>
                    <p className="text-xs text-black/40">{selectedDocument.mimeType}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-white border border-black/8 rounded-2xl">
                <span className="text-sm text-black/60">Status</span>
                {getStatusBadge(selectedDocument.status)}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white border border-black/8 rounded-2xl">
                  <p className="text-[10px] text-black/40 font-semibold uppercase tracking-wider mb-1">File Size</p>
                  <p className="text-sm font-bold text-black">{formatFileSize(selectedDocument.fileSize)}</p>
                </div>
                <div className="p-4 bg-white border border-black/8 rounded-2xl">
                  <p className="text-[10px] text-black/40 font-semibold uppercase tracking-wider mb-1">Pages</p>
                  <p className="text-sm font-bold text-black">{selectedDocument.pageCount || 'N/A'}</p>
                </div>
                <div className="p-4 bg-white border border-black/8 rounded-2xl">
                  <p className="text-[10px] text-black/40 font-semibold uppercase tracking-wider mb-1">Tokens</p>
                  <p className="text-sm font-bold text-black">{selectedDocument.tokens?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 bg-white border border-black/8 rounded-2xl">
                  <p className="text-[10px] text-black/40 font-semibold uppercase tracking-wider mb-1">Uploaded</p>
                  <p className="text-sm font-bold text-black">
                    {selectedDocument.createdAt ? formatDistanceToNow(new Date(selectedDocument.createdAt)) + ' ago' : 'Just now'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-black/10 text-black/60 hover:bg-black/[0.04] hover:text-black font-semibold"
                  onClick={() => {
                    handleDownload(selectedDocument.id, selectedDocument.originalName);
                    setShowAnalysisDialog(false);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-2xl border-black/10 text-black/50 hover:text-black/70 hover:bg-black/[0.02] font-semibold"
                  onClick={() => {
                    setShowAnalysisDialog(false);
                    handleDelete(selectedDocument.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
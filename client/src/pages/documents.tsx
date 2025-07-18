import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Calendar, 
  Database, 
  Trash2, 
  Download,
  Filter,
  MoreHorizontal,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

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
    const matchesSource = sourceFilter === "all" || 
                         (doc.source && doc.source.toLowerCase().includes(sourceFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesSource;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source?: string) => {
    if (!source) return <FileText className="w-4 h-4" />;
    
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('github')) return <div className="w-4 h-4 bg-gray-900 rounded-full" />;
    if (lowerSource.includes('dropbox')) return <div className="w-4 h-4 bg-blue-600 rounded" />;
    if (lowerSource.includes('google')) return <div className="w-4 h-4 bg-green-600 rounded-full" />;
    if (lowerSource.includes('notion')) return <div className="w-4 h-4 bg-black rounded" />;
    return <FileText className="w-4 h-4" />;
  };

  const totalTokens = filteredDocuments.reduce((sum, doc) => sum + (doc.tokens || 0), 0);
  const totalSize = filteredDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your uploaded documents and AI knowledge base
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{filteredDocuments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Tokens</p>
                <p className="text-2xl font-bold">{totalTokens.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Size</p>
                <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold">
                  {filteredDocuments.filter(d => d.status === 'processing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="upload">Upload</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="dropbox">Dropbox</SelectItem>
                <SelectItem value="google">Google Drive</SelectItem>
                <SelectItem value="notion">Notion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getSourceIcon(doc.source)}
                      <div>
                        <p className="font-medium">{doc.originalName}</p>
                        <p className="text-sm text-gray-500">{doc.mimeType}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {doc.source ? (
                        <Badge variant="secondary" className="text-xs">
                          {doc.source}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Direct Upload
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {doc.tokens?.toLocaleString() || '0'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDistanceToNow(new Date(doc.createdAt))} ago</p>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => window.open(`/api/projects/${projectId}/documents/${doc.id}/download`, '_blank')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm || statusFilter !== "all" || sourceFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Upload your first document to get started"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
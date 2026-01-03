import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import { StartupLoadingSkeleton } from "./StartupLoadingSkeleton";

interface Document {
  id: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  status: "processing" | "completed" | "failed";
  tokens: number;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface DocumentsListProps {
  projectId: string;
  hideDelete?: boolean;
}

export default function DocumentsList({ projectId, hideDelete = false }: DocumentsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: [`/api/projects/${projectId}/documents`],
    enabled: !!projectId,
    refetchInterval: 5000, // Poll for status updates
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/documents`] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
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
        description: "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return "📄";
    if (mimeType.includes('word') || mimeType.includes('document')) return "📝";
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return "📊";
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return "📋";
    return "📄";
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
            Processed
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <StartupLoadingSkeleton type="documents" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-border shadow-subtle">
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
        
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
            <p className="text-sm text-placeholder">Upload documents to start building your AI assistant</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc: Document) => (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0 mb-2 sm:mb-0">
                  <div className="text-2xl flex-shrink-0">{getFileIcon(doc.mimeType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">{doc.originalName}</p>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <span>{formatFileSize(doc.fileSize)}</span>
                      {doc.pageCount && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{doc.pageCount} pages</span>
                        </>
                      )}
                      {doc.tokens > 0 && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span>{doc.tokens} tokens</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end space-x-2 flex-shrink-0">
                  {getStatusBadge(doc.status)}
                  {doc.status === "completed" && !hideDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      disabled={deleteMutation.isPending}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

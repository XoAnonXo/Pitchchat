import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Loader2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  downloadUrl: string;
}

interface DocumentDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

export default function DocumentDownloadDialog({ isOpen, onClose, slug }: DocumentDownloadDialogProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/chat/${slug}/download`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data.documents || []);
      // Select all documents by default
      setSelectedDocs(new Set(data.documents?.map((doc: Document) => doc.id) || []));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const handleDownload = async () => {
    if (selectedDocs.size === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to download",
        variant: "destructive",
      });
      return;
    }

    setDownloading(true);
    try {
      // Download each selected document
      for (const doc of documents) {
        if (selectedDocs.has(doc.id)) {
          const response = await fetch(doc.downloadUrl);
          if (!response.ok) {
            throw new Error(`Failed to download ${doc.name}`);
          }
          
          // Create a blob from the response
          const blob = await response.blob();
          
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = doc.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      toast({
        title: "Success",
        description: `Downloaded ${selectedDocs.size} document${selectedDocs.size > 1 ? 's' : ''}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download documents",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeLabel = (mimeType: string) => {
    const typeMap: { [key: string]: string } = {
      'application/pdf': 'PDF',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
      'application/msword': 'Word',
      'application/vnd.ms-excel': 'Excel',
      'application/vnd.ms-powerpoint': 'PowerPoint',
      'text/plain': 'Text',
      'text/csv': 'CSV',
    };
    return typeMap[mimeType] || 'Document';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-2xl border-gray-200 shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Download Documents</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents available</p>
          ) : (
            <>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleDocument(doc.id)}
                  >
                    <Checkbox
                      checked={selectedDocs.has(doc.id)}
                      onCheckedChange={() => toggleDocument(doc.id)}
                      className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {getFileTypeLabel(doc.type)} • {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  {selectedDocs.size} of {documents.length} selected
                </p>
                <div className="space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDownload}
                    disabled={downloading || selectedDocs.size === 0}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download Selected
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
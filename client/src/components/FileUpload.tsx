import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Github, FileText, Database, X } from "lucide-react";

interface FileUploadProps {
  projectId: string;
}

interface UploadFile {
  file: File;
  id: string;
}

export default function FileUpload({ projectId }: FileUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/documents`] });
      toast({
        title: "Success",
        description: "Document uploaded and processing started",
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
        title: "Upload Failed",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }));
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }));
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = () => {
    selectedFiles.forEach(({ file }) => {
      uploadMutation.mutate(file);
    });
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Upload Documents</h3>
        
        {/* File Upload Dropzone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive 
              ? 'border-primary bg-blue-50' 
              : 'border-slate-300 hover:border-primary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium">Drop files here or click to browse</p>
          <p className="text-sm text-slate-500 mt-1">PDF, DOCX, PPTX, TXT up to 500MB</p>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.pptx,.txt,.md"
            multiple
          />
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-900 mb-2">Selected Files</h4>
            <div className="space-y-2">
              {selectedFiles.map(({ file, id }) => (
                <div key={id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900">{file.name}</span>
                    <span className="text-xs text-slate-500">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={() => removeFile(id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button 
              onClick={uploadFiles}
              disabled={uploadMutation.isPending}
              className="w-full mt-3"
            >
              {uploadMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : null}
              Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        {/* Integration Options */}
        <div className="mt-4 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left"
            disabled
          >
            <Github className="w-4 h-4 mr-2" />
            <span>Connect GitHub Repository</span>
            <span className="ml-auto text-xs text-slate-500">Coming Soon</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left"
            disabled
          >
            <FileText className="w-4 h-4 mr-2" />
            <span>Connect Notion Workspace</span>
            <span className="ml-auto text-xs text-slate-500">Coming Soon</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left"
            disabled
          >
            <Database className="w-4 h-4 mr-2" />
            <span>Connect Google Drive</span>
            <span className="ml-auto text-xs text-slate-500">Coming Soon</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

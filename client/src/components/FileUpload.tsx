import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X } from "lucide-react";
import { StartupLoadingSkeleton } from "./StartupLoadingSkeleton";

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
    <div className="w-full">
      {/* File Upload Dropzone */}
      <div
        className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer ${
          dragActive 
            ? 'bg-primary/5 border-4 border-primary scale-[1.02]' 
            : 'bg-gradient-to-b from-secondary/30 to-secondary/10 border-2 border-dashed border-border hover:border-primary hover:bg-secondary/40'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="p-12 text-center relative z-10">
          <div className={`mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
            dragActive ? 'bg-primary text-primary-foreground rotate-12' : 'bg-primary/10 text-primary'
          }`}>
            <Upload className="h-10 w-10" />
          </div>
          
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {dragActive ? 'Drop to upload' : 'Upload your documents'}
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            Drag & drop files here, or click to browse
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">PDF</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">DOCX</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">PPTX</span>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">TXT</span>
            <span className="text-muted-foreground">up to 500MB</span>
          </div>
          
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.pptx,.txt,.md"
            multiple
          />
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-primary rounded-full translate-x-30 translate-y-30" />
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 bg-card rounded-xl p-6 border border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Selected Files</h4>
          <div className="space-y-2">
            {selectedFiles.map(({ file, id }) => (
              <div key={id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button 
            onClick={uploadFiles}
            disabled={uploadMutation.isPending}
            className="w-full mt-4 gradient-primary shadow-soft h-12 text-base"
          >
            {uploadMutation.isPending ? (
              <div className="flex items-center space-x-2">
                <div className="scale-50">
                  <StartupLoadingSkeleton type="upload" className="w-4 h-4" />
                </div>
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}


    </div>
  );
}

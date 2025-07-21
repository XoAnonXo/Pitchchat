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
            ? 'bg-gray-100 border-4 border-black scale-[1.02] shadow-2xl' 
            : 'bg-white border-2 border-dashed border-gray-300 hover:border-black hover:bg-gray-50 hover:shadow-lg'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="p-12 text-center relative z-10">
          <div className={`mx-auto h-20 w-20 rounded-2xl flex items-center justify-center mb-6 transition-all ${
            dragActive ? 'bg-black text-white rotate-12 shadow-xl' : 'bg-gray-100 text-black'
          }`}>
            <Upload className="h-10 w-10" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {dragActive ? 'Drop to upload' : 'Upload your documents'}
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Drag & drop files here, or click to browse
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="bg-gray-100 text-black px-4 py-2 rounded-full font-medium">PDF</span>
            <span className="bg-gray-100 text-black px-4 py-2 rounded-full font-medium">DOCX</span>
            <span className="bg-gray-100 text-black px-4 py-2 rounded-full font-medium">PPTX</span>
            <span className="bg-gray-100 text-black px-4 py-2 rounded-full font-medium">TXT</span>
            <span className="text-gray-500">up to 500MB</span>
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
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-black rounded-full -translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-black rounded-full translate-x-30 translate-y-30" />
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-card">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Selected Files</h4>
          <div className="space-y-3">
            {selectedFiles.map(({ file, id }) => (
              <div key={id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button 
            onClick={uploadFiles}
            disabled={uploadMutation.isPending}
            className="w-full mt-6 bg-black hover:bg-gray-800 text-white h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {uploadMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
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

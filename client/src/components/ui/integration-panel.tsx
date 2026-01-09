import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Github, 
  FileText, 
  Database, 
  Cloud, 
  Users, 
  CheckCircle, 
  ExternalLink,
  Download,
  Settings
} from "lucide-react";

interface IntegrationPanelProps {
  projectId: string;
  onClose: () => void;
}

export function IntegrationPanel({ projectId, onClose }: IntegrationPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("platforms");

  const integrations = [
    {
      id: "github",
      name: "GitHub",
      description: "Import repositories, issues, and documentation",
      icon: Github,
      color: "bg-gray-900",
      connected: false,
      features: ["Code repositories", "Issues & PRs", "Wiki pages", "README files"]
    },
    {
      id: "notion",
      name: "Notion",
      description: "Sync pages, databases, and documentation",
      icon: FileText,
      color: "bg-black",
      connected: false,
      features: ["Pages & blocks", "Databases", "Comments", "Templates"]
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Access documents, spreadsheets, and presentations",
      icon: Cloud,
      color: "bg-blue-600",
      connected: false,
      features: ["Documents", "Spreadsheets", "Presentations", "PDFs"]
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Import files and documents from your Dropbox",
      icon: Database,
      color: "bg-blue-700",
      connected: false,
      features: ["Files & folders", "Shared links", "Paper docs", "Team spaces"]
    },
    {
      id: "asana",
      name: "Asana",
      description: "Import project tasks and team communications",
      icon: Users,
      color: "bg-red-500",
      connected: false,
      features: ["Tasks & projects", "Team discussions", "Progress updates", "Goals"]
    },
    {
      id: "jira",
      name: "Jira",
      description: "Sync issues, epics, and project documentation",
      icon: Settings,
      color: "bg-blue-800",
      connected: false,
      features: ["Issues & epics", "Project boards", "Comments", "Attachments"]
    }
  ];

  const connectMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/integrations/${platform}/connect`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.authUrl) {
        window.open(data.authUrl, '_blank', 'width=600,height=700,noopener,noreferrer');
      }
      toast({
        title: "Connection initiated",
        description: "Complete the authorization in the popup window",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection failed",
        description: "Failed to connect to the platform",
        variant: "destructive",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/integrations/${platform}/import`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import started",
        description: `Importing ${data.count} documents from ${data.platform}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "documents"] });
    },
    onError: (error) => {
      toast({
        title: "Import failed",
        description: "Failed to import documents",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Import from Platforms</span>
          </DialogTitle>
          <DialogDescription>
            Connect your accounts to automatically import documents and create a comprehensive knowledge base for your AI assistant.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="status">Import Status</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${integration.color}`}>
                          <integration.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <p className="text-sm text-slate-600">{integration.description}</p>
                        </div>
                      </div>
                      {integration.connected && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {integration.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        {!integration.connected ? (
                          <Button
                            onClick={() => connectMutation.mutate(integration.id)}
                            disabled={connectMutation.isPending}
                            className="flex-1"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Connect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => importMutation.mutate(integration.id)}
                            disabled={importMutation.isPending}
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Import Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Imports</CardTitle>
                <p className="text-sm text-slate-600">
                  Track the status of your document imports from connected platforms
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Github className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub Repository</p>
                        <p className="text-sm text-slate-600">my-startup-repo</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                      Processing
                    </Badge>
                  </div>
                  <div className="text-center py-8 text-slate-500">
                    <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent imports</p>
                    <p className="text-sm">Connect platforms to see import status here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

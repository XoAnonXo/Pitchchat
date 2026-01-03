import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import IntegrationConfigModal from "./IntegrationConfigModal";
import { apiRequest } from "@/lib/queryClient";
import { 
  SiGithub,
  SiNotion,
  SiGoogledrive,
  SiDropbox,
  SiAsana,
  SiJira,
  SiSlack,
  SiTrello,
  SiConfluence,
  SiLinear,
  SiDiscord,
  SiAirtable,
  SiFigma,
  SiIntercom
} from "react-icons/si";
import { MessageSquare, RefreshCw } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "available" | "connected" | "coming_soon";
  category: "development" | "docs" | "storage" | "project_management" | "communication" | "productivity";
  color: string;
}

const integrations: Integration[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Import repositories, issues, and documentation",
    icon: <SiGithub className="w-5 h-5" />,
    status: "available",
    category: "development",
    color: "text-gray-900"
  },
  {
    id: "notion",
    name: "Notion",
    description: "Sync pages, databases, and documentation",
    icon: <SiNotion className="w-5 h-5" />,
    status: "available",
    category: "docs",
    color: "text-gray-900"
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access documents, sheets, and presentations",
    icon: <SiGoogledrive className="w-5 h-5" />,
    status: "available",
    category: "storage",
    color: "text-blue-600"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    description: "Import files and folders from your workspace",
    icon: <SiDropbox className="w-5 h-5" />,
    status: "available",
    category: "storage",
    color: "text-blue-500"
  },
  {
    id: "asana",
    name: "Asana",
    description: "Sync tasks, projects, and team updates",
    icon: <SiAsana className="w-5 h-5" />,
    status: "available",
    category: "project_management",
    color: "text-red-500"
  },
  {
    id: "jira",
    name: "Jira",
    description: "Import issues, epics, and project data",
    icon: <SiJira className="w-5 h-5" />,
    status: "available",
    category: "project_management",
    color: "text-blue-700"
  },
  {
    id: "slack",
    name: "Slack",
    description: "Access conversations and shared files",
    icon: <SiSlack className="w-5 h-5" />,
    status: "available",
    category: "communication",
    color: "text-purple-600"
  },
  {
    id: "trello",
    name: "Trello",
    description: "Import boards, cards, and project data",
    icon: <SiTrello className="w-5 h-5" />,
    status: "coming_soon",
    category: "project_management",
    color: "text-blue-600"
  },
  {
    id: "confluence",
    name: "Confluence",
    description: "Sync documentation and knowledge base",
    icon: <SiConfluence className="w-5 h-5" />,
    status: "coming_soon",
    category: "docs",
    color: "text-blue-800"
  },
  {
    id: "linear",
    name: "Linear",
    description: "Import issues and project roadmaps",
    icon: <SiLinear className="w-5 h-5" />,
    status: "coming_soon",
    category: "project_management",
    color: "text-gray-700"
  },
  {
    id: "discord",
    name: "Discord",
    description: "Access server messages and shared content",
    icon: <SiDiscord className="w-5 h-5" />,
    status: "coming_soon",
    category: "communication",
    color: "text-indigo-600"
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Sync databases and structured data",
    icon: <SiAirtable className="w-5 h-5" />,
    status: "coming_soon",
    category: "productivity",
    color: "text-orange-600"
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    description: "Access team conversations and shared files",
    icon: <MessageSquare className="w-5 h-5" />,
    status: "coming_soon",
    category: "communication",
    color: "text-blue-600"
  },
  {
    id: "figma",
    name: "Figma",
    description: "Import design files and project documentation",
    icon: <SiFigma className="w-5 h-5" />,
    status: "available",
    category: "productivity",
    color: "text-purple-500"
  },
  {
    id: "intercom",
    name: "Intercom",
    description: "Access customer conversations and support data",
    icon: <SiIntercom className="w-5 h-5" />,
    status: "coming_soon",
    category: "communication",
    color: "text-blue-500"
  }
];

const categoryNames = {
  development: "Development",
  docs: "Documentation",
  storage: "File Storage",
  project_management: "Project Management",
  communication: "Communication",
  productivity: "Productivity"
};

interface IntegrationGridProps {
  projectId: string;
}

export default function IntegrationGrid({ projectId }: IntegrationGridProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Fetch connected integrations for this project
  const { data: connectedIntegrations = [] } = useQuery<any[]>({
    queryKey: [`/api/projects/${projectId}/integrations`],
    enabled: !!projectId,
  });

  // Mutation for syncing integrations
  const syncMutation = useMutation({
    mutationFn: async ({ integrationId }: { integrationId: string }) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/integrations/${integrationId}/sync`, {});
      return response.json();
    },
    onSuccess: (data, variables) => {
      const integration = integrations.find(i => i.id === variables.integrationId);
      toast({
        title: "Sync Complete",
        description: `${integration?.name} synced successfully. ${data.documentsImported || 0} documents imported.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/documents`] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync integration",
        variant: "destructive",
      });
    }
  });

  const handleConnect = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    // Supported platforms with configuration modal
    const supportedPlatforms = ['github', 'notion', 'google-drive', 'dropbox', 'asana', 'jira', 'figma'];
    
    if (supportedPlatforms.includes(integrationId)) {
      setSelectedIntegration(integration);
      setShowConfigModal(true);
    } else {
      toast({
        title: "Coming Soon",
        description: `${integration.name} integration will be available soon.`,
      });
    }
  };

  // Merge integration status with connected integrations
  const integrationsWithStatus = integrations.map(integration => {
    const connected = connectedIntegrations.find((ci: any) => ci.platform === integration.id);
    const newStatus = connected && connected.status === 'connected' ? 'connected' : integration.status;
    
    return {
      ...integration,
      status: newStatus as 'available' | 'connected' | 'coming_soon'
    };
  });

  const categories = Object.keys(categoryNames) as Array<keyof typeof categoryNames>;
  const filteredIntegrations = selectedCategory === "all" 
    ? integrationsWithStatus 
    : integrationsWithStatus.filter(i => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className="rounded-full"
        >
          All Platforms
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {categoryNames[category]}
          </Button>
        ))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="rounded-xl border-border shadow-subtle hover:shadow-soft transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-accent ${integration.color}`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <Badge 
                      variant={integration.status === "connected" ? "default" : "outline"}
                      className="mt-1"
                    >
                      {integration.status === "connected" ? "Connected" : 
                       integration.status === "available" ? "Available" : "Coming Soon"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {integration.description}
              </p>
              
              {integration.status === "connected" ? (
                <Button
                  onClick={() => syncMutation.mutate({ integrationId: integration.id })}
                  disabled={syncMutation.isPending}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
                  {syncMutation.isPending ? "Syncing..." : "Sync Documents"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleConnect(integration.id)}
                  disabled={integration.status !== "available"}
                  className="w-full"
                  variant={integration.status === "available" ? "default" : "outline"}
                >
                  {integration.status === "available" ? "Connect" : "Coming Soon"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <IntegrationConfigModal
          isOpen={showConfigModal}
          onClose={() => {
            setShowConfigModal(false);
            setSelectedIntegration(null);
          }}
          integration={selectedIntegration}
          projectId={projectId}
        />
      )}
    </div>
  );
}
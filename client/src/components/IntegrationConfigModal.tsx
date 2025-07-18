import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ExternalLink, Key, AlertCircle } from "lucide-react";

interface IntegrationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
  };
  projectId: string;
}

const platformConfigs = {
  github: {
    fields: [
      { key: 'token', label: 'Personal Access Token', type: 'password' as const, required: true }
    ],
    instructions: 'Create a Personal Access Token with repo access at https://github.com/settings/tokens',
    docsUrl: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
  },
  notion: {
    fields: [
      { key: 'token', label: 'Integration Token', type: 'password' as const, required: true }
    ],
    instructions: 'Create an internal integration at https://www.notion.so/my-integrations',
    docsUrl: 'https://developers.notion.com/docs/create-a-notion-integration'
  },
  'google-drive': {
    fields: [
      { key: 'client_id', label: 'Client ID', type: 'text' as const, required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password' as const, required: true }
    ],
    instructions: 'Create OAuth 2.0 credentials in Google Cloud Console',
    docsUrl: 'https://developers.google.com/drive/api/quickstart/nodejs'
  },
  dropbox: {
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password' as const, required: true, placeholder: 'Enter your Dropbox access token' }
    ],
    instructions: 'IMPORTANT: First enable permissions in your Dropbox app: Go to https://www.dropbox.com/developers/apps → Select your app → Click "Permissions" tab → Enable "files.metadata.read" and "files.content.read" → Click "Submit" → Generate new access token from "Settings" tab.',
    docsUrl: 'https://www.dropbox.com/developers/documentation/http/documentation'
  },
  asana: {
    fields: [
      { key: 'token', label: 'Personal Access Token', type: 'password' as const, required: true }
    ],
    instructions: 'Create a Personal Access Token in Asana Developer Console',
    docsUrl: 'https://developers.asana.com/docs/personal-access-token'
  },
  jira: {
    fields: [
      { key: 'domain', label: 'Jira Domain', type: 'text' as const, required: true, placeholder: 'your-domain.atlassian.net' },
      { key: 'email', label: 'Email', type: 'email' as const, required: true },
      { key: 'token', label: 'API Token', type: 'password' as const, required: true }
    ],
    instructions: 'Create an API token at https://id.atlassian.com/manage-profile/security/api-tokens',
    docsUrl: 'https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/'
  }
};

export default function IntegrationConfigModal({ 
  isOpen, 
  onClose, 
  integration, 
  projectId 
}: IntegrationConfigModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const config = platformConfigs[integration.id as keyof typeof platformConfigs];

  const connectMutation = useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return apiRequest("POST", `/api/projects/${projectId}/integrations/${integration.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Integration Connected",
        description: `${integration.name} has been connected successfully`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/documents`] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to platform",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config) return;
    
    // Validate required fields
    const missingFields = config.fields
      .filter(field => field.required && !credentials[field.key])
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    connectMutation.mutate(credentials);
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  if (!config) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Integration Not Available</DialogTitle>
            <DialogDescription>
              {integration.name} integration is not yet available. Please check back later.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent">
              {integration.icon}
            </div>
            Connect {integration.name}
          </DialogTitle>
          <DialogDescription>
            {integration.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Setup Instructions */}
          <div className="bg-accent/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-alert mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium mb-2">Setup Instructions</p>
                <p className="text-sm text-muted-foreground mb-3">
                  {config.instructions}
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(config.docsUrl, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Documentation
                </Button>
              </div>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={credentials[field.key] || ''}
                  onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={connectMutation.isPending}
              className="flex-1"
            >
              {connectMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
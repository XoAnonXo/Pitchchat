import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus } from "lucide-react";
import IntegrationGrid from "./IntegrationGrid";

interface IntegrationDialogProps {
  projectId: string;
  trigger?: React.ReactNode;
}

export default function IntegrationDialog({ projectId, trigger }: IntegrationDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Import from Platforms
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Connect Your Platforms
          </DialogTitle>
          <p className="text-muted-foreground">
            Import documents and data from your favorite platforms to enhance your AI assistant's knowledge.
          </p>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Platforms</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="connected">Connected</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <IntegrationGrid projectId={projectId} />
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Popular Integrations</h3>
              <p className="text-muted-foreground mb-6">
                The most commonly used platforms for startup documentation
              </p>
              <IntegrationGrid projectId={projectId} />
            </div>
          </TabsContent>
          
          <TabsContent value="connected" className="mt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Connected Platforms</h3>
              <p className="text-muted-foreground mb-6">
                Manage your existing platform connections
              </p>
              <div className="text-sm text-muted-foreground">
                No platforms connected yet. Start by connecting your first platform.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Integration Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure how your platforms sync with your AI assistant
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Auto-sync</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync new content from connected platforms
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Sync Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      How often to check for new content
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Daily
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Content Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose which types of content to import
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Copy, ExternalLink } from "lucide-react";

interface ShareLinkModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareLinkModal({ projectId, isOpen, onClose }: ShareLinkModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [linkName, setLinkName] = useState("");
  const [expiration, setExpiration] = useState("7");
  const [tokenLimit, setTokenLimit] = useState("1000");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const generateLinkMutation = useMutation({
    mutationFn: async (linkData: {
      name: string;
      expiresAt?: string;
      limitTokens: number;
    }) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/links`, linkData);
      return res.json();
    },
    onSuccess: (link) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/links`] });
      const fullUrl = `${window.location.origin}/chat/${link.slug}`;
      setGeneratedLink(fullUrl);
      toast({
        title: "Success",
        description: "Share link created successfully",
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
          window.location.href = "/auth";
        }, 500);
        return;
      }
      
      if (error.message.includes("Insufficient credits")) {
        toast({
          title: "Insufficient Credits",
          description: "You need at least 25 credits to create a share link",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to create share link",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!linkName.trim()) {
      toast({
        title: "Link Name Required",
        description: "Please enter a name for your share link",
        variant: "destructive",
      });
      return;
    }

    const linkData = {
      name: linkName.trim(),
      limitTokens: parseInt(tokenLimit),
      ...(expiration !== "never" && {
        expiresAt: new Date(Date.now() + parseInt(expiration) * 24 * 60 * 60 * 1000).toISOString()
      })
    };

    generateLinkMutation.mutate(linkData);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
    }
  };

  const openLink = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  const handleClose = () => {
    setLinkName("");
    setExpiration("7");
    setTokenLimit("1000");
    setGeneratedLink(null);
    onClose();
  };

  const estimatedCost = 25; // 25 credits for creating a link

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Share Link</DialogTitle>
        </DialogHeader>
        
        {!generatedLink ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="link-name">Link Name</Label>
              <Input
                id="link-name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="e.g., tech-startup-pitch-2024"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="expiration">Expiration</Label>
              <Select value={expiration} onValueChange={setExpiration}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="token-limit">Usage Limit per Investor</Label>
              <Select value={tokenLimit} onValueChange={setTokenLimit}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000 tokens</SelectItem>
                  <SelectItem value="5000">5,000 tokens</SelectItem>
                  <SelectItem value="10000">10,000 tokens</SelectItem>
                  <SelectItem value="50000">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Estimated cost:</span>
                <span className="font-medium text-slate-900">{estimatedCost} credits</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={generateLinkMutation.isPending}
                className="flex-1"
              >
                {generateLinkMutation.isPending ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : null}
                Generate Link
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Your Share Link</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  value={generatedLink} 
                  readOnly 
                  className="flex-1 bg-slate-50"
                />
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={openLink}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Link Created Successfully!</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Share this link with investors</li>
                <li>• No signup required for investors</li>
                <li>• {expiration === "never" ? "No expiration" : `Expires in ${expiration} days`}</li>
                <li>• {tokenLimit === "50000" ? "Unlimited" : `${parseInt(tokenLimit).toLocaleString()} tokens`} per investor</li>
              </ul>
            </div>
            
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

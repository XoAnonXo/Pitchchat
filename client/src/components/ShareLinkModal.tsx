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
import { Copy, ExternalLink, Check } from "lucide-react";

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
            
            <div className="bg-[#F8FAFB] rounded-lg p-4 border border-[#E0E3EB]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#72788F]">Estimated cost:</span>
                <span className="font-bold text-[#1A1A26]">{estimatedCost} credits</span>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1 border-[#E0E3EB] hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={generateLinkMutation.isPending}
                className="flex-1 bg-black text-white hover:bg-gray-800"
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
              <Label className="text-[#1A1A26] font-medium">Your Share Link</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Input 
                  value={generatedLink} 
                  readOnly 
                  className="flex-1 bg-[#F8FAFB] border-[#E0E3EB] text-[#1A1A26]"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="border-[#E0E3EB] hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openLink}
                  className="border-[#E0E3EB] hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-[#F8FAFB] border border-[#E0E3EB] rounded-lg p-5">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-[#1A1A26]">Link Created Successfully!</h4>
              </div>
              <ul className="text-sm text-[#72788F] space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  Share this link with investors to start conversations
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  No signup required - investors just need their email
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  {expiration === "never" ? "No expiration date" : `Active for ${expiration} days`}
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  {tokenLimit === "50000" ? "Unlimited usage" : `${parseInt(tokenLimit).toLocaleString()} tokens`} per investor
                </li>
              </ul>
            </div>
            
            <Button onClick={handleClose} className="w-full bg-black text-white hover:bg-gray-800">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

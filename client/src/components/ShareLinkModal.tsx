import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Copy, ExternalLink, Check, Download } from "lucide-react";

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
  const [tokenLimit, setTokenLimit] = useState("50000"); // Set to unlimited by default
  const [allowDownloads, setAllowDownloads] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const generateLinkMutation = useMutation({
    mutationFn: async (linkData: {
      name: string;
      expiresAt?: string;
      limitTokens: number;
      allowDownloads: boolean;
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
    onError: async (error) => {
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
      
      // Handle 402 Payment Required error for link limits
      if ((error as any).status === 402) {
        const errorData = (error as any).data;
        toast({
          title: errorData?.message || "You've reached your free plan limit",
          description: errorData?.details || "Free users can create 1 pitch link. Upgrade to Premium for unlimited pitch links.",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = errorData?.upgradeUrl || "/settings#billing"}
            >
              Upgrade
            </Button>
          ),
        });
        return;
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to create share link",
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
      allowDownloads,
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
      window.open(generatedLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = () => {
    setLinkName("");
    setExpiration("7");
    setTokenLimit("50000"); // Reset to unlimited
    setAllowDownloads(false);
    setGeneratedLink(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#FAFAFA] border border-black/8 rounded-3xl max-w-md shadow-[0_24px_80px_rgba(0,0,0,0.18)] font-sans p-0 overflow-hidden">
        {/* Header with subtle gradient */}
        <div className="px-7 pt-7 pb-5 bg-gradient-to-b from-white to-transparent">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black tracking-tight">Generate Share Link</DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-7 pb-7">
          {!generatedLink ? (
            <div className="space-y-5">
              <div>
                <Label htmlFor="link-name" className="text-sm font-semibold text-black/80">Link Name <span className="text-black/40">*</span></Label>
                <Input
                  id="link-name"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder="e.g., tech-startup-pitch-2024"
                  className="mt-2 bg-white border-black/10 focus:border-black focus:ring-black/10 rounded-2xl h-12 px-4 text-base placeholder:text-black/30"
                />
              </div>
              
              <div>
                <Label htmlFor="expiration" className="text-sm font-semibold text-black/80">Expiration</Label>
                <Select value={expiration} onValueChange={setExpiration}>
                  <SelectTrigger className="mt-2 bg-white border-black/10 focus:ring-black/10 rounded-2xl h-12 px-4 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-black/10 shadow-xl">
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-black/8 shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="allow-downloads" className="text-sm font-semibold text-black/80 cursor-pointer">Allow Downloads</Label>
                  <p className="text-xs text-black/45">
                    Let investors download original documents
                  </p>
                </div>
                <Switch
                  id="allow-downloads"
                  checked={allowDownloads}
                  onCheckedChange={setAllowDownloads}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={handleClose} 
                  className="flex-1 border-black/10 text-black/60 hover:bg-black/[0.04] hover:text-black rounded-2xl h-12 font-semibold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerate}
                  disabled={generateLinkMutation.isPending}
                  className="flex-1 bg-black hover:bg-black/90 text-white rounded-2xl h-12 font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all"
                >
                  {generateLinkMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : null}
                  Generate Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label htmlFor="generated-share-link" className="text-sm font-semibold text-black/80">Your Share Link</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    id="generated-share-link"
                    value={generatedLink} 
                    readOnly 
                    className="flex-1 h-12 bg-white border-black/10 rounded-2xl px-4 text-sm font-medium text-black/70"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="h-12 w-12 rounded-2xl border-black/10 hover:bg-black/[0.04] shrink-0"
                    aria-label="Copy share link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={openLink}
                    className="h-12 w-12 rounded-2xl border-black/10 hover:bg-black/[0.04] shrink-0"
                    aria-label="Open share link in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 leading-none">Link Created!</h4>
                    <p className="text-xs text-emerald-700/70 mt-1">Ready to share with investors</p>
                  </div>
                </div>
                <ul className="text-xs text-emerald-800/70 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>Share this link with investors to start conversations instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>No signup required - investors just need their email to access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{expiration === "never" ? "No expiration date" : `Active for ${expiration} days`}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{allowDownloads ? "Document downloads enabled" : "Document downloads disabled"}</span>
                  </li>
                </ul>
              </div>
              
              <Button onClick={handleClose} className="w-full h-12 rounded-2xl bg-black hover:bg-black/90 text-white font-bold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition-all">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Send, Clock, ExternalLink, Sparkles, ArrowRight, FileText, Download, Phone } from "lucide-react";
import DocumentDownloadDialog from "@/components/DocumentDownloadDialog";
import ContactTeamDialog from "@/components/ContactTeamDialog";
import { usePageTitle } from "@/hooks/usePageTitle";
import { format } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokenCount: number;
  citations?: Array<{
    source: string;
    content: string;
    page?: number;
  }>;
  timestamp: string;
}

interface ChatLinkInfo {
  id: string;
  name: string;
  projectName: string;
  description?: string;
  documentCount: number;
  allowDownloads: boolean;
}

export default function InvestorChat() {
  usePageTitle('Investor Chat');
  const [location] = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [investorEmail, setInvestorEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const slug = location.split("/").pop();

  const { data: linkInfo, isLoading: linkLoading, error: linkError } = useQuery<ChatLinkInfo>({
    queryKey: [`/api/chat/${slug}`],
    enabled: !!slug,
    retry: false,
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery<Message[]>({
    queryKey: [`/api/chat/${slug}/messages/${conversationId}`],
    enabled: !!conversationId,
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string; conversationId?: string; investorEmail?: string }) => {
      const res = await apiRequest("POST", `/api/chat/${slug}/messages`, messageData);
      return res.json();
    },
    onSuccess: (data) => {
      setConversationId(data.conversationId);
      setMessage("");
      refetchMessages();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (!emailSubmitted) {
      toast({
        title: "Email Required",
        description: "Please provide your email address first",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      message: message.trim(),
      conversationId: conversationId || undefined,
      investorEmail: investorEmail || undefined,
    });
  };

  const handleEmailSubmit = () => {
    const email = investorEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setEmailSubmitted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!emailSubmitted) {
        handleEmailSubmit();
      } else {
        handleSendMessage();
      }
    }
  };

  if (linkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }

  if (linkError || !linkInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Card className="w-full max-w-md mx-4 shadow-subtle">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-[#1A1A26] mb-2">Chat Link Not Found</h1>
            <p className="text-sm text-[#72788F]">
              This chat link may have expired or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans selection:bg-black selection:text-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/5">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h1 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">{linkInfo.projectName}</h1>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">{linkInfo.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {emailSubmitted && linkInfo.allowDownloads && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDownloadDialog(true)}
                className="hidden sm:flex border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg h-9 text-xs font-semibold"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Documents
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col min-h-[calc(100vh-12rem)] space-y-8">
          {!emailSubmitted && (
            <Card className="rounded-[2rem] border-none shadow-soft overflow-hidden bg-white">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                    <MessageSquare className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-black font-inter-tight mb-2">Welcome to the Pitch Room</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Please provide your email to start exploring this startup's vision. Your information helps founders understand investor interest.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 h-12 rounded-xl border-gray-200 focus:border-black focus:ring-0 transition-all text-sm"
                    />
                    <Button 
                      onClick={handleEmailSubmit}
                      className="h-12 px-8 bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-sm shadow-lg shadow-black/10 transition-all"
                    >
                      Enter Room
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {emailSubmitted && (
            <Card className="flex-1 flex flex-col rounded-[2.5rem] border border-gray-100 shadow-soft bg-white overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-gray-50/30">
                {messages.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                      <Sparkles className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black font-inter-tight mb-2">AI Pitch Assistant</h3>
                    <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                      I have full context on this startup's vision, financials, and team. What would you like to explore first?
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end pl-12" : "justify-start pr-12"}`}>
                    <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-full`}>
                      <div className={`rounded-[1.5rem] px-5 py-4 shadow-subtle ${
                        msg.role === "user" 
                          ? "bg-black text-white rounded-tr-none" 
                          : "bg-white border border-gray-100 text-black rounded-tl-none"
                      }`}>
                        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        
                        {msg.citations && msg.citations.length > 0 && (
                          <div className={`mt-4 pt-4 border-t ${msg.role === "user" ? "border-white/10" : "border-gray-50"}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${msg.role === "user" ? "text-white/40" : "text-gray-400"}`}>Sources</p>
                            <div className="flex flex-wrap gap-2">
                              {msg.citations.map((cite, i) => (
                                <div key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${msg.role === "user" ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-500"}`}>
                                  {cite.source} {cite.page && `• p. ${cite.page}`}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 mt-3 px-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {msg.timestamp ? format(new Date(msg.timestamp), 'h:mm a') : ''}
                        </p>
                        {msg.role === "assistant" && (
                          <Badge variant="outline" className="text-[9px] font-bold uppercase h-4 px-1.5 opacity-50 border-gray-200">
                            {msg.tokenCount} tokens
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 sm:p-8 bg-white border-t border-gray-100">
                <div className="relative flex items-center">
                  <Input
                    placeholder="Ask about revenue, competition, roadmap..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-14 pl-6 pr-16 rounded-2xl border-gray-100 bg-gray-50/50 focus:border-black focus:ring-0 transition-all text-sm font-medium placeholder:text-gray-400"
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    className="absolute right-2 w-10 h-10 bg-black text-white hover:bg-gray-800 rounded-xl flex items-center justify-center p-0 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    {sendMessageMutation.isPending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-4 px-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                    <Clock className="w-3 h-3 mr-1.5" />
                    Instant Response Mode
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Press Enter to send
                  </p>
                </div>
              </div>
            </Card>
          )}

          {emailSubmitted && (
            <div className="flex flex-col items-center justify-center pt-4">
              <Button
                variant="ghost"
                onClick={() => setShowContactDialog(true)}
                className="text-gray-400 hover:text-black font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-full border border-transparent hover:border-gray-100 transition-all"
              >
                <Phone className="w-3.5 h-3.5 mr-2" />
                Contact Team
              </Button>
            </div>
          )}
        </div>
      </div>

      <footer className="py-12 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-black font-inter-tight">PitchChat</span>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
            Professional intelligence for founders and investors.
          </p>
        </div>
      </footer>

      {slug && (
        <DocumentDownloadDialog
          isOpen={showDownloadDialog}
          onClose={() => setShowDownloadDialog(false)}
          slug={slug}
        />
      )}

      {conversationId && (
        <ContactTeamDialog
          isOpen={showContactDialog}
          onClose={() => setShowContactDialog(false)}
          conversationId={conversationId}
        />
      )}
    </div>
  );
}
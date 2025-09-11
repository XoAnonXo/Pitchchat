import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Send, Clock, ExternalLink, Sparkles, ArrowRight, FileText, Download, Phone } from "lucide-react";
import DocumentDownloadDialog from "@/components/DocumentDownloadDialog";
import ContactTeamDialog from "@/components/ContactTeamDialog";
import { usePageTitle } from "@/hooks/usePageTitle";

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

  // Extract slug from URL
  const slug = location.split("/").pop();

  // Fetch chat link info
  const { data: linkInfo, isLoading: linkLoading, error: linkError } = useQuery({
    queryKey: [`/api/chat/${slug}`],
    enabled: !!slug,
    retry: false,
  });

  // Fetch messages if we have a conversation
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: [`/api/chat/${slug}/messages/${conversationId}`],
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll for new messages
  });

  // Send message mutation
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
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
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address (e.g., name@example.com)",
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
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E0E3EB]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1A1A26]">{linkInfo.projectName}</h1>
              <p className="text-[#72788F] mt-1">{linkInfo.name}</p>
            </div>

          </div>
          {linkInfo.description && (
            <p className="text-[#72788F] mt-6 text-base leading-relaxed">{linkInfo.description}</p>
          )}
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="min-h-[700px] flex flex-col shadow-soft bg-white">
          {/* Email Collection */}
          {!emailSubmitted && (
            <div className="p-8 border-b border-[#E0E3EB] bg-[#F8FAFB]">
              <div className="max-w-md mx-auto text-center">
                <MessageSquare className="w-12 h-12 text-black mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A26] mb-2">Welcome to the Pitch Room</h3>
                <p className="text-[#72788F] mb-6">
                  Please provide your email to start exploring this startup's vision. Your information helps founders understand investor interest.
                </p>
                <div className="flex space-x-3">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={investorEmail}
                    onChange={(e) => setInvestorEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border-[#E0E3EB] focus:border-black"
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Chat Header */}
          {emailSubmitted && (
            <div className="p-6 border-b border-[#E0E3EB]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A26]">AI Pitch Assistant</h3>
                  <p className="text-[#72788F] text-sm mt-1">
                    Ask about the business model, market opportunity, team, financials, or any aspect of this startup
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#72788F]" />
                    <span className="text-sm text-[#72788F]">{linkInfo.documentCount || 0} documents</span>
                  </div>
                  {linkInfo.allowDownloads && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDownloadDialog(true)}
                      className="border-[#E0E3EB] hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Documents
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]">
            {messages.length === 0 && emailSubmitted && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#F8FAFB] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A26] mb-3">Ready to Explore</h3>
                <p className="text-[#72788F] max-w-md mx-auto">
                  I have full context on this startup's vision, strategy, and metrics. What would you like to know?
                </p>
              </div>
            )}

            {messages.map((msg: Message) => (
              <div key={msg.id} className={`flex space-x-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div className={`flex-1 ${msg.role === "user" ? "max-w-lg" : "max-w-2xl"}`}>
                  <div className={`rounded-2xl px-5 py-4 ${
                    msg.role === "user" 
                      ? "bg-black text-white shadow-md" 
                      : "bg-white border border-[#E0E3EB] shadow-subtle"
                  }`}>
                    <p className={`leading-relaxed ${msg.role === "user" ? "text-white" : "text-[#1A1A26]"}`}>
                      {msg.content}
                    </p>
                  </div>
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.citations.map((citation, idx) => (
                        <div key={idx} className="border-l-2 border-[#E0E3EB] pl-4 ml-1">
                          <p className="text-sm text-[#72788F] italic leading-relaxed">"{citation.content}"</p>
                          <p className="text-xs text-[#B5B8CB] mt-2 flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{citation.source}</span>
                            {citation.page && <span> • Page {citation.page}</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <p className="text-xs text-[#B5B8CB]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {msg.role === "assistant" && (
                      <>
                        <span className="text-xs text-[#B5B8CB]">•</span>
                        <span className="text-xs text-[#B5B8CB]">
                          {msg.tokenCount} tokens
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-10 h-10 bg-[#F8FAFB] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#1A1A26] font-medium text-sm">
                      {investorEmail ? investorEmail.charAt(0).toUpperCase() : "U"}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {emailSubmitted && (
            <div className="p-6 border-t border-[#E0E3EB] bg-white">
              <div className="flex space-x-3">
                <Input
                  placeholder="Ask about the business model, team, metrics..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-[#E0E3EB] focus:border-black placeholder:text-[#B5B8CB]"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-black text-white hover:bg-gray-800 px-6"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-[#B5B8CB]">
                  Press Enter to send • Shift+Enter for new line
                </p>
                <p className="text-xs text-[#72788F]">
                  Powered by OpenAI
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Contact Team Button */}
        {emailSubmitted && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => setShowContactDialog(true)}
              className="bg-white text-black border-2 border-black hover:bg-gray-50 rounded-xl px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Phone className="w-5 h-5 mr-3" />
              Contact the Team
            </Button>
            <p className="text-sm text-[#72788F] mt-3">
              Share your contact details for direct communication with the founders
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#E0E3EB] py-8 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1A1A26]">PitchChat</span>
          </div>
          <p className="text-[#72788F] text-sm">
            Intelligent conversations between founders and investors
          </p>
        </div>
      </footer>

      {/* Download Dialog */}
      {slug && (
        <DocumentDownloadDialog
          isOpen={showDownloadDialog}
          onClose={() => setShowDownloadDialog(false)}
          slug={slug}
        />
      )}

      {/* Contact Team Dialog */}
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

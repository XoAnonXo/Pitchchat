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
import { MessageSquare, Send, Clock, ExternalLink } from "lucide-react";

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
  const [location] = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [investorEmail, setInvestorEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
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
    if (!investorEmail.trim() || !investorEmail.includes("@")) {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (linkError || !linkInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Chat Link Not Found</h1>
            <p className="text-sm text-gray-600">
              This chat link may have expired or doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PC</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">{linkInfo.name}</h1>
              <p className="text-slate-600">{linkInfo.projectName}</p>
            </div>
          </div>
          {linkInfo.description && (
            <p className="text-slate-600 mt-4">{linkInfo.description}</p>
          )}
        </div>
      </header>

      {/* Main Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[600px] flex flex-col">
          {/* Email Collection */}
          {!emailSubmitted && (
            <div className="p-6 border-b border-slate-200 bg-blue-50">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Welcome!</h3>
              <p className="text-slate-600 mb-4">
                Please provide your email address to start the conversation. This helps the founder track engagement.
              </p>
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={investorEmail}
                  onChange={(e) => setInvestorEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleEmailSubmit}>
                  Start Chat
                </Button>
              </div>
            </div>
          )}

          {/* Chat Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Ask Me Anything</h3>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>GPT-4o</span>
              </Badge>
            </div>
            <p className="text-slate-600 text-sm mt-1">
              I can answer questions about the startup's pitch, business model, financials, and more.
            </p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && emailSubmitted && (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Start the Conversation</h3>
                <p className="text-slate-600">
                  Ask me about the startup's business model, market opportunity, financials, or any other questions you have.
                </p>
              </div>
            )}

            {messages.map((msg: Message) => (
              <div key={msg.id} className={`flex space-x-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">AI</span>
                  </div>
                )}
                
                <div className={`flex-1 ${msg.role === "user" ? "max-w-md" : ""}`}>
                  <div className={`rounded-lg p-4 ${
                    msg.role === "user" 
                      ? "bg-primary text-white" 
                      : "bg-slate-100"
                  }`}>
                    <p className={msg.role === "user" ? "text-white" : "text-slate-900"}>
                      {msg.content}
                    </p>
                  </div>
                  
                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.citations.map((citation, idx) => (
                        <div key={idx} className="border-l-4 border-blue-200 pl-3 bg-white rounded-r p-2">
                          <p className="text-sm text-slate-600 italic">"{citation.content}"</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>Source: {citation.source}</span>
                            {citation.page && <span>, page {citation.page}</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <p className="text-xs text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                    {msg.role === "assistant" && (
                      <>
                        <span className="text-xs text-slate-500">•</span>
                        <Badge variant="outline" className="text-xs">
                          {msg.tokenCount} tokens
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex-shrink-0" />
                )}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {emailSubmitted && (
            <div className="p-6 border-t border-slate-200">
              <div className="flex space-x-3">
                <Input
                  placeholder="Ask a question about the startup..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Ask about business model, market size, financials, team, or any other aspect of the startup
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">
            Powered by <span className="font-semibold">PitchChat Builder</span> - AI-driven investor conversations
          </p>
        </div>
      </footer>
    </div>
  );
}

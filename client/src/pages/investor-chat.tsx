import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Send, Clock, ExternalLink, Sparkles, ArrowRight, FileText, Download, Phone, BarChart3, Users, TrendingUp, Eye, Mail, MousePointerClick } from "lucide-react";
import DocumentDownloadDialog from "@/components/DocumentDownloadDialog";
import ContactTeamDialog from "@/components/ContactTeamDialog";
import { usePageTitle } from "@/hooks/usePageTitle";
import { format } from "date-fns";

// Simple markdown renderer for AI responses
function renderMarkdown(text: string) {
  // Split into paragraphs (handle both \n\n and single \n for list items)
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, pIndex) => {
    // Check if it's a numbered list (lines starting with digits followed by .)
    if (paragraph.match(/^\d+\.\s/m)) {
      const items = paragraph.split(/\n(?=\d+\.\s)/);
      return (
        <div key={pIndex} className="space-y-2 my-3">
          {items.map((item, i) => {
            const match = item.match(/^(\d+)\.\s([\s\S]*)$/);
            if (match) {
              return (
                <div key={i} className="flex gap-2 leading-relaxed">
                  <span className="font-semibold text-gray-600 min-w-[1.5rem]">{match[1]}.</span>
                  <span>{renderInlineMarkdown(match[2])}</span>
                </div>
              );
            }
            return <p key={i}>{renderInlineMarkdown(item)}</p>;
          })}
        </div>
      );
    }

    // Check if it's a bullet list
    if (paragraph.match(/^[-•]\s/m)) {
      const items = paragraph.split(/\n(?=[-•]\s)/);
      return (
        <div key={pIndex} className="space-y-2 my-3">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span className="text-gray-400">•</span>
              <span>{renderInlineMarkdown(item.replace(/^[-•]\s/, ''))}</span>
            </div>
          ))}
        </div>
      );
    }

    // Regular paragraph
    return (
      <p key={pIndex} className={pIndex > 0 ? "mt-3" : ""}>
        {renderInlineMarkdown(paragraph)}
      </p>
    );
  });
}

// Render inline markdown (bold, italic)
function renderInlineMarkdown(text: string): JSX.Element {
  // Process bold first (**text**), then italic (*text*)
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let key = 0;

  // Simple iterative approach for bold
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);

    if (boldMatch && boldMatch.index !== undefined) {
      // Add text before the match
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      // Add bold text
      parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return <>{parts}</>;
}

// Typewriter component for animated text display
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep the ref updated without triggering re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isComplete) return;

    let index = 0;
    const speed = 8; // milliseconds per character (fast typing)

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, isComplete]);

  // If typing is complete, show full formatted text
  if (isComplete) {
    return <>{renderMarkdown(text)}</>;
  }

  // While typing, show plain text with cursor
  return (
    <span>
      {displayedText}
      <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse" />
    </span>
  );
}

// Founder Dashboard Preview - shows what founders see
function FounderDashboardPreview({ messagesCount, investorEmail }: { messagesCount: number; investorEmail: string }) {
  const [animatedViews, setAnimatedViews] = useState(0);
  const [animatedEngagement, setAnimatedEngagement] = useState(0);

  // Animate numbers on mount
  useEffect(() => {
    const viewsTarget = 847;
    const engagementTarget = 73;
    const duration = 2000;
    const steps = 60;
    const viewsIncrement = viewsTarget / steps;
    const engagementIncrement = engagementTarget / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedViews(Math.min(Math.round(viewsIncrement * currentStep), viewsTarget));
      setAnimatedEngagement(Math.min(Math.round(engagementIncrement * currentStep), engagementTarget));
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mt-8 mb-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 mb-2">
          Founder Dashboard Preview
        </p>
        <h2 className="font-inter-tight text-2xl sm:text-3xl font-semibold tracking-tight text-black">
          See what founders see
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm">
          Every conversation generates real-time analytics. Here's a preview of your investor engagement dashboard.
        </p>
      </div>

      {/* Dashboard Mockup */}
      <div className="relative">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-blue-50 rounded-[2rem] -z-10" />

        {/* Dashboard Container */}
        <div className="border border-gray-200/80 rounded-[2rem] bg-white/70 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
          {/* Dashboard Header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-inter-tight font-semibold text-sm text-black">Investor Analytics</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Real-time engagement</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Views */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Views</span>
              </div>
              <p className="font-inter-tight text-2xl font-bold text-black">{animatedViews.toLocaleString()}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +23% this week
              </p>
            </div>

            {/* Messages */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Messages</span>
              </div>
              <p className="font-inter-tight text-2xl font-bold text-black">{Math.max(1, messagesCount)}</p>
              <p className="text-[10px] text-amber-600 font-semibold mt-1">Just now</p>
            </div>

            {/* Engagement Rate */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <MousePointerClick className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Engagement</span>
              </div>
              <p className="font-inter-tight text-2xl font-bold text-black">{animatedEngagement}%</p>
              <p className="text-[10px] text-blue-600 font-semibold mt-1">Above average</p>
            </div>

            {/* Investors */}
            <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Investors</span>
              </div>
              <p className="font-inter-tight text-2xl font-bold text-black">12</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +3 new
              </p>
            </div>
          </div>

          {/* Recent Activity - Live Feed */}
          <div className="px-6 pb-6">
            <div className="bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-white/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Recent Activity</p>
              </div>
              <div className="divide-y divide-gray-100">
                {/* Current user's activity - highlighted */}
                <div className="px-4 py-3 bg-amber-50/50 flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {investorEmail || "investor@example.com"}
                    </p>
                    <p className="text-[10px] text-amber-600 font-semibold">Started conversation • Just now</p>
                  </div>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse flex-shrink-0" />
                </div>

                {/* Simulated past activities */}
                <div className="px-4 py-3 flex items-center gap-3 opacity-60">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">alex.chen@vc.com</p>
                    <p className="text-[10px] text-gray-400 font-semibold">Viewed pitch deck • 2h ago</p>
                  </div>
                </div>

                <div className="px-4 py-3 flex items-center gap-3 opacity-40">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">sarah@sequoia.com</p>
                    <p className="text-[10px] text-gray-400 font-semibold">Asked about financials • 5h ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-8 rounded-[2rem]">
          <div className="text-center">
            <p className="text-gray-600 mb-4 font-medium">
              Get your own analytics dashboard
            </p>
            <a href="/auth">
              <Button className="bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-sm px-8 h-12 shadow-xl shadow-black/20 transition-all hover:scale-105 hover:shadow-2xl">
                Create Your Pitch Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <p className="text-[11px] text-gray-400 mt-3">
              Free to start • No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track messages that have been fully typed (by message ID)
  const [typedMessageIds, setTypedMessageIds] = useState<Set<string>>(new Set());
  // Track the latest AI response to show with typewriter
  const [pendingAiMessage, setPendingAiMessage] = useState<Message | null>(null);

  const slug = location.split("/").pop();
  const isDemo = slug === "demo";
  const DEMO_MESSAGE_LIMIT = 3;

  // Helper to get stored demo session
  const getStoredDemoSession = () => {
    if (typeof window === 'undefined' || slug !== 'demo') return null;
    try {
      const stored = localStorage.getItem(`pitchchat_demo_${slug}`);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  };

  // Initialize state from localStorage for demo persistence
  const [conversationId, setConversationId] = useState<string | null>(() => {
    const session = getStoredDemoSession();
    return session?.conversationId || null;
  });

  const [investorEmail, setInvestorEmail] = useState(() => {
    const session = getStoredDemoSession();
    return session?.investorEmail || "";
  });

  const [emailSubmitted, setEmailSubmitted] = useState(() => {
    const session = getStoredDemoSession();
    return session?.emailSubmitted || false;
  });

  // Persist demo session to localStorage
  useEffect(() => {
    if (isDemo && (conversationId || emailSubmitted)) {
      localStorage.setItem(`pitchchat_demo_${slug}`, JSON.stringify({
        conversationId,
        investorEmail,
        emailSubmitted,
      }));
    }
  }, [isDemo, slug, conversationId, investorEmail, emailSubmitted]);
  const [demoLimitReached, setDemoLimitReached] = useState(false);

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
      // Set the pending AI message for typewriter effect
      if (data.message) {
        setPendingAiMessage(data.message);
      }
      refetchMessages();
    },
    onError: (error: any) => {
      // Check if it's a demo limit error
      if (isDemo && error?.message?.includes("429")) {
        setDemoLimitReached(true);
        toast({
          title: "Demo limit reached",
          description: "Sign up to create your own pitch room with unlimited messages",
        });
        return;
      }
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

  // Track demo message limit
  const userMessageCount = messages.filter(m => m.role === "user").length;
  const demoMessagesRemaining = DEMO_MESSAGE_LIMIT - userMessageCount;

  useEffect(() => {
    if (isDemo && userMessageCount >= DEMO_MESSAGE_LIMIT) {
      setDemoLimitReached(true);
    }
  }, [isDemo, userMessageCount]);

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
    <div className={`bg-[#FAFAFA] font-sans selection:bg-black selection:text-white flex flex-col ${isDemo && emailSubmitted ? 'min-h-screen overflow-auto' : 'h-screen overflow-hidden'}`}>
      <header className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/5">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">{linkInfo.projectName}</h1>
                {isDemo && (
                  <Badge variant="outline" className="text-[9px] font-bold uppercase h-5 px-2 border-amber-300 bg-amber-50 text-amber-700">
                    Demo
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">{linkInfo.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {emailSubmitted && conversationId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContactDialog(true)}
                className="hidden sm:flex text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg h-9 text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5" />
                Contact
              </Button>
            )}
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

      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full ${isDemo && emailSubmitted ? '' : 'flex-1 flex flex-col min-h-0'}`}>
        <div className={`flex flex-col space-y-8 ${isDemo && emailSubmitted ? '' : 'flex-1 min-h-0'}`}>
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
            <Card className={`flex flex-col rounded-[2.5rem] border border-gray-100 shadow-soft bg-white overflow-hidden ${isDemo ? 'h-[600px]' : 'flex-1 min-h-0'}`}>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-gray-50/30 min-h-0">
                {messages.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                      <Sparkles className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-bold text-black font-inter-tight mb-2">Hey, thanks for stopping by!</h3>
                    <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                      I'm here to walk you through our story - the problem we're solving, our traction, the team, financials, whatever you'd like to know. What's on your mind?
                    </p>
                  </div>
                )}

                {messages.map((msg) => {
                  // Skip the pending AI message from the list (we'll show it with typewriter)
                  if (pendingAiMessage && msg.id === pendingAiMessage.id) {
                    return null;
                  }

                  return (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end pl-12" : "justify-start pr-12"}`}>
                      <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} max-w-full`}>
                        <div className={`rounded-[1.5rem] px-5 py-4 shadow-subtle ${
                          msg.role === "user"
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white border border-gray-100 text-black rounded-tl-none"
                        }`}>
                          <div className="text-sm font-medium leading-relaxed">
                            {msg.role === "assistant" ? renderMarkdown(msg.content) : <p className="whitespace-pre-wrap">{msg.content}</p>}
                          </div>

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
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Thinking Animation - only while waiting for response */}
                {sendMessageMutation.isPending && !pendingAiMessage && (
                  <div className="flex justify-start pr-12">
                    <div className="flex flex-col items-start max-w-full">
                      <div className="rounded-[1.5rem] px-5 py-4 shadow-subtle bg-white border border-gray-100 text-black rounded-tl-none">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-sm text-gray-400 font-medium ml-2">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI response with typewriter effect */}
                {pendingAiMessage && (
                  <div className="flex justify-start pr-12">
                    <div className="flex flex-col items-start max-w-full">
                      <div className="rounded-[1.5rem] px-5 py-4 shadow-subtle bg-white border border-gray-100 text-black rounded-tl-none">
                        <div className="text-sm font-medium leading-relaxed">
                          <TypewriterText
                            text={pendingAiMessage.content}
                            onComplete={() => {
                              setTypedMessageIds(prev => new Set(prev).add(pendingAiMessage.id));
                              setPendingAiMessage(null);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-3 px-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {pendingAiMessage.timestamp ? format(new Date(pendingAiMessage.timestamp), 'h:mm a') : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 sm:p-8 bg-white border-t border-gray-100 relative">
                {/* Demo limit reached overlay */}
                {isDemo && demoLimitReached && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-10 rounded-b-[2.5rem]">
                    <div className="text-center p-6 max-w-sm">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
                        <Sparkles className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-bold text-black font-inter-tight mb-2">Demo limit reached</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        You've used all 3 demo questions. Create your own pitch room for unlimited investor conversations.
                      </p>
                      <a href="/auth">
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-xl font-bold text-sm px-6 h-11">
                          Sign up free
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </div>
                )}

                <div className="relative flex items-center">
                  <Input
                    placeholder="Ask about revenue, competition, roadmap..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 h-14 pl-6 pr-16 rounded-2xl border-gray-100 bg-gray-50/50 focus:border-black focus:ring-0 transition-all text-sm font-medium placeholder:text-gray-400"
                    disabled={sendMessageMutation.isPending || demoLimitReached}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending || demoLimitReached}
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
                  {isDemo && !demoLimitReached ? (
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                      {demoMessagesRemaining} question{demoMessagesRemaining !== 1 ? 's' : ''} remaining
                    </p>
                  ) : (
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      Press Enter to send
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Founder Dashboard Preview - Only for demo rooms after email submitted */}
          {isDemo && emailSubmitted && (
            <FounderDashboardPreview
              messagesCount={messages.length}
              investorEmail={investorEmail}
            />
          )}

        </div>
      </div>

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
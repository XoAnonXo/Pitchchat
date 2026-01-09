import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Activity,
  Calendar, 
  MessageSquare,
  User,
  DollarSign,
  Hash,
  Menu,
  X,
  LogOut,
  Settings,
  Users,
  FolderOpen,
  Home,
  BarChart3,
  Sparkles,
  Clock,
  Mail,
  ChevronDown,
  ChevronUp,
  Eye,
  Filter,
  ExternalLink,
  Bell,
  Phone,
  ArrowRight
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Logo } from "@/components/Logo";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Conversation, Message } from "@shared/schema";

export default function ConversationsPage() {
  usePageTitle('Conversations');
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const hasContactNotifications = conversations.some((conv) => (conv as any).contactProvidedAt);

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(conversationId);
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const messages = await response.json();
        setConversationMessages(prev => ({
          ...prev,
          [conversationId]: messages
        }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoadingMessages(null);
    }
  };

  const toggleConversation = (conversationId: string) => {
    if (expandedConversation === conversationId) {
      setExpandedConversation(null);
    } else {
      setExpandedConversation(conversationId);
      if (!conversationMessages[conversationId]) {
        fetchMessages(conversationId);
      }
    }
  };

  const filteredConversations = conversations.filter(conv => {
    // Add null safety for linkName and projectName if they are missing from schema but present in current type
    // Looking at schema.ts, linkName and projectName are NOT in conversations table.
    // They are likely joined in the API response. I'll use type casting for now or assume they are there.
    const c = conv as any;
    const matchesSearch = 
      (c.investorEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.linkName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (c.projectName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesProject = projectFilter === "all" || c.projectId === projectFilter;
    
    return matchesSearch && matchesProject;
  });

  const uniqueProjects = Array.from(
    new Set(conversations.map(c => (c as any).projectId).filter(Boolean))
  ).map(projectId => {
    const project = conversations.find(c => (c as any).projectId === projectId);
    return { id: projectId, name: (project as any)?.projectName || 'Unknown' };
  });

  const totalConversations = filteredConversations.length;
  const totalTokens = filteredConversations.reduce((sum, conv) => sum + (conv.totalTokens || 0), 0);
  const totalCost = filteredConversations.reduce((sum, conv) => sum + (conv.costUsd || 0), 0);
  const activeConversations = filteredConversations.filter(c => c.isActive).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-black/[0.08] z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center">
              <Logo size="md" variant="white" className="p-1" />
            </div>
            <span className="font-bold text-lg text-black tracking-tight">PitchChat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-black/60 hover:text-black"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>

          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 bg-black/[0.06] text-black rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-black border-none" />
            )}
          </Link>

          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Analytics</span>
          </Link>

          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-black/[0.08]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-xl object-cover border border-black/10"
                />
              ) : (
                <div className="w-8 h-8 bg-black/[0.04] rounded-xl flex items-center justify-center border border-black/10">
                  <Users className="w-4 h-4 text-black/60" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-black/45 font-medium uppercase tracking-wider">
                  {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free Plan'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => void logout()}
              className="h-8 w-8 text-black/45 hover:text-black"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-black/[0.08] sticky top-0 z-30 h-20 flex items-center shrink-0">
          <div className="px-6 lg:px-8 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-black/60 hover:text-black"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">Conversations</h2>
                <p className="text-[11px] text-black/45 font-medium uppercase tracking-wider mt-1.5">
                  Track all shared link interactions
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="bg-[#DAE8FB] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Total</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{totalConversations}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#E8E4F3] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Active</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{activeConversations}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#EAE3D1] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Lead Capture</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{conversations.filter(c => c.contactProvidedAt).length}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#F5E6E0] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Engagement</p>
                  <p className="text-3xl font-bold text-black tracking-tight">
                    {conversations.length > 0 
                      ? (conversations.reduce((acc, c) => acc + (c as any).messages?.length || 0, 0) / conversations.length).toFixed(1)
                      : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/30 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-white border-black/10 rounded-2xl text-sm focus:border-black focus:ring-black/10 transition-all placeholder:text-black/30"
                aria-label="Search conversations"
              />
            </div>

            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-12 bg-white border-black/10 rounded-2xl text-xs font-semibold">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-black/8 shadow-xl shadow-black/10 bg-white">
                <SelectItem value="all" className="rounded-xl">All Projects</SelectItem>
                {uniqueProjects.map(project => (
                  <SelectItem key={project.id} value={project.id} className="rounded-xl">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5">
                <div className="w-16 h-16 bg-black/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-black/8">
                  <MessageSquare className="w-8 h-8 text-black/30" />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight mb-2">No Conversations Found</h3>
                <p className="text-black/50 leading-relaxed max-w-sm mx-auto">
                  {searchTerm || projectFilter !== 'all'
                    ? 'Try adjusting your search or filters to find what you are looking for.'
                    : 'Conversations will appear here when investors start interacting with your shared links.'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const c = conversation as any;
                return (
                  <Card
                    key={conversation.id}
                    className={`bg-white rounded-3xl border border-black/8 shadow-lg shadow-black/5 overflow-hidden hover:shadow-xl hover:shadow-black/8 transition-all duration-300 ${expandedConversation === conversation.id ? 'ring-1 ring-black/10' : ''}`}
                  >
                    <div
                      className="p-5 sm:p-6 cursor-pointer"
                      onClick={() => toggleConversation(conversation.id)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expandedConversation === conversation.id}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleConversation(conversation.id);
                        }
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            <h4 className="text-sm font-bold text-black truncate">{c.linkName || 'Unnamed Link'}</h4>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase border-black/10 text-black/50 bg-black/[0.04] px-2 py-0.5 rounded-lg">
                              {c.projectName}
                            </Badge>
                            {conversation.isActive && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/[0.08] text-black text-[10px] font-bold uppercase">
                                <div className="w-1 h-1 rounded-full bg-black animate-pulse" />
                                Active
                              </div>
                            )}
                            {conversation.contactProvidedAt && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-bold uppercase">
                                <Bell className="w-2.5 h-2.5 fill-white" />
                                Lead
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-black/40 font-medium">
                            {conversation.investorEmail && (
                              <div className="flex items-center gap-1.5 text-black font-semibold">
                                <Mail className="w-3 h-3 text-black/40" />
                                {conversation.investorEmail}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {conversation.startedAt ? formatDistanceToNow(new Date(conversation.startedAt)) : 'Just now'} ago
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 rounded-xl transition-colors ${expandedConversation === conversation.id ? 'bg-black/[0.06] text-black' : 'text-black/30 hover:text-black'}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleConversation(conversation.id);
                          }}
                          aria-label={
                            expandedConversation === conversation.id
                              ? "Collapse conversation details"
                              : "Expand conversation details"
                          }
                          aria-expanded={expandedConversation === conversation.id}
                        >
                          {expandedConversation === conversation.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {expandedConversation === conversation.id && (
                      <div className="border-t border-black/[0.06] bg-black/[0.02]">
                        <div className="p-5 sm:p-6 max-w-4xl mx-auto">
                          {conversation.contactProvidedAt && (
                            <div className="mb-8 p-5 bg-white rounded-2xl border border-black/10 shadow-lg shadow-black/5 relative overflow-hidden">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-black text-sm">Lead Details</h5>
                                    <Badge className="bg-black text-white border-none text-[9px] uppercase px-1.5 h-4 rounded-md">Verified</Badge>
                                  </div>
                                  <p className="text-xs text-black/40 font-medium uppercase tracking-wider">
                                    Submitted {conversation.contactProvidedAt ? format(new Date(conversation.contactProvidedAt), 'MMM d, yyyy • h:mm a') : 'Unknown'}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                  {conversation.contactName && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-black/40 uppercase font-bold tracking-tight">Name</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactName as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactPhone && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-black/40 uppercase font-bold tracking-tight">Phone</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactPhone as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactCompany && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-black/40 uppercase font-bold tracking-tight">Company</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactCompany as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactWebsite && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-black/40 uppercase font-bold tracking-tight">Website</span>
                                      <a href={conversation.contactWebsite as string} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-black hover:underline inline-flex items-center gap-1">
                                        {(conversation.contactWebsite as string).replace(/^https?:\/\//, '')}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 w-24 h-24 bg-black/[0.04] rounded-full -mr-12 -mt-12" />
                            </div>
                          )}

                          <div className="space-y-6">
                            {loadingMessages === conversation.id ? (
                              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Retrieving History...</span>
                              </div>
                            ) : (
                              conversationMessages[conversation.id]?.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'}`}
                                >
                                  <div
                                    className={`max-w-full rounded-[1.5rem] px-5 py-4 shadow-lg shadow-black/5 ${
                                      message.role === 'user'
                                        ? 'bg-black text-white rounded-tr-none'
                                        : 'bg-white text-black border border-black/8 rounded-tl-none'
                                    }`}
                                  >
                                    <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                        message.role === 'user' ? 'bg-white/20' : 'bg-black'
                                      }`}>
                                        {message.role === 'user' ? (
                                          <User className="w-3 h-3 text-white" />
                                        ) : (
                                          <Sparkles className="w-3 h-3 text-white" />
                                        )}
                                      </div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${message.role === 'user' ? 'text-white/60' : 'text-black/40'}`}>
                                        {message.role === 'user' ? 'Investor' : 'AI'}
                                      </span>
                                      <span className="text-[10px] text-black/20">•</span>
                                      <span className={`text-[10px] font-medium ${message.role === 'user' ? 'text-white/40' : 'text-black/40'}`}>
                                        {message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : 'Unknown'}
                                      </span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content as string}</p>
                                    {Array.isArray(message.citations) && message.citations.length > 0 && (
                                      <div className={`mt-3 pt-3 border-t ${message.role === 'user' ? 'border-white/10' : 'border-black/[0.06]'}`}>
                                        <div className="flex flex-wrap gap-2">
                                          {message.citations.map((citation: any, idx: number) => (
                                            <div key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${message.role === 'user' ? 'bg-white/10 text-white/60' : 'bg-black/[0.06] text-black/50'}`}>
                                              {citation.source} {citation.page && `(p. ${citation.page})`}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

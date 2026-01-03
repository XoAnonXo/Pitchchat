import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base font-inter-tight">PC</span>
            </div>
            <span className="font-bold text-lg text-black font-inter-tight tracking-tight">PitchChat</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          
          <Link href="/documents" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>
          
          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 bg-gray-50 text-black rounded-lg transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-blue-600 border-none" />
            )}
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium text-sm">Analytics</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border border-gray-100"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-black truncate max-w-[100px]">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider">
                  {user?.tokens || 0} tokens
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/api/auth/logout"}
              className="h-8 w-8 text-gray-400 hover:text-black"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-30 h-20 flex items-center shrink-0">
          <div className="px-6 lg:px-8 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">Conversations</h2>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1.5">
                  Track all shared link interactions
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{totalConversations}</p>
                </div>
                <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{activeConversations}</p>
                </div>
                <div className="w-9 h-9 bg-green-50/50 rounded-lg flex items-center justify-center border border-green-100/50">
                  <Clock className="w-4 h-4 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tokens</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">{totalTokens.toLocaleString()}</p>
                </div>
                <div className="w-9 h-9 bg-blue-50/50 rounded-lg flex items-center justify-center border border-blue-100/50">
                  <Hash className="w-4 h-4 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cost</p>
                  <p className="text-2xl font-bold text-black font-inter-tight">${totalCost.toFixed(2)}</p>
                </div>
                <div className="w-9 h-9 bg-purple-50/50 rounded-lg flex items-center justify-center border border-purple-100/50">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white border-gray-200 rounded-xl text-sm focus:border-black focus:ring-0 transition-all shadow-subtle"
              />
            </div>
            
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-10 bg-white border-gray-200 rounded-xl text-xs font-semibold shadow-subtle">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <div className="space-y-4">
            {filteredConversations.length === 0 ? (
              <div className="p-20 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-black font-inter-tight mb-2">No Conversations Found</h3>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
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
                    className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300 ${expandedConversation === conversation.id ? 'ring-1 ring-black/5' : ''}`}
                  >
                    <div 
                      className="p-5 sm:p-6 cursor-pointer"
                      onClick={() => toggleConversation(conversation.id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2.5">
                            <h4 className="text-sm font-bold text-black truncate">{c.linkName || 'Unnamed Link'}</h4>
                            <Badge variant="outline" className="text-[10px] font-bold uppercase border-gray-100 text-gray-500 bg-gray-50 px-2 py-0.5">
                              {c.projectName}
                            </Badge>
                            {conversation.isActive && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase">
                                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                Active
                              </div>
                            )}
                            {conversation.contactProvidedAt && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                                <Bell className="w-2.5 h-2.5 fill-blue-600" />
                                Lead
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium">
                            {conversation.investorEmail && (
                              <div className="flex items-center gap-1.5 text-black font-semibold">
                                <Mail className="w-3 h-3 text-gray-400" />
                                {conversation.investorEmail}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {conversation.startedAt ? formatDistanceToNow(new Date(conversation.startedAt)) : 'Just now'} ago
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Hash className="w-3 h-3" />
                              {conversation.totalTokens?.toLocaleString()} tokens
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3" />
                              ${conversation.costUsd?.toFixed(4)}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-9 w-9 rounded-xl transition-colors ${expandedConversation === conversation.id ? 'bg-gray-50 text-black' : 'text-gray-300 hover:text-black'}`}
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
                      <div className="border-t border-gray-50 bg-gray-50/30">
                        <div className="p-5 sm:p-6 max-w-4xl mx-auto">
                          {conversation.contactProvidedAt && (
                            <div className="mb-8 p-5 bg-white rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-black text-sm">Lead Details</h5>
                                    <Badge className="bg-blue-600 text-white border-none text-[9px] uppercase px-1.5 h-4">Verified</Badge>
                                  </div>
                                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    Submitted {conversation.contactProvidedAt ? format(new Date(conversation.contactProvidedAt), 'MMM d, yyyy • h:mm a') : 'Unknown'}
                                  </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                  {conversation.contactName && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Name</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactName as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactPhone && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Phone</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactPhone as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactCompany && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Company</span>
                                      <span className="text-sm font-semibold text-black">{conversation.contactCompany as string}</span>
                                    </div>
                                  )}
                                  {conversation.contactWebsite && (
                                    <div className="flex flex-col">
                                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Website</span>
                                      <a href={conversation.contactWebsite as string} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                                        {(conversation.contactWebsite as string).replace(/^https?:\/\//, '')}
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50" />
                            </div>
                          )}

                          <div className="space-y-6">
                            {loadingMessages === conversation.id ? (
                              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Retrieving History...</span>
                              </div>
                            ) : (
                              conversationMessages[conversation.id]?.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.role === 'user' ? 'justify-end pl-12' : 'justify-start pr-12'}`}
                                >
                                  <div
                                    className={`max-w-full rounded-[1.5rem] px-5 py-4 shadow-subtle ${
                                      message.role === 'user'
                                        ? 'bg-black text-white rounded-tr-none'
                                        : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
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
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${message.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                                        {message.role === 'user' ? 'Investor' : 'AI'}
                                      </span>
                                      <span className="text-[10px] text-gray-300">•</span>
                                      <span className={`text-[10px] font-medium ${message.role === 'user' ? 'text-white/40' : 'text-gray-400'}`}>
                                        {message.timestamp ? format(new Date(message.timestamp), 'h:mm a') : 'Unknown'}
                                      </span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.content as string}</p>
                                    {Array.isArray(message.citations) && message.citations.length > 0 && (
                                      <div className={`mt-3 pt-3 border-t ${message.role === 'user' ? 'border-white/10' : 'border-gray-50'}`}>
                                        <div className="flex flex-wrap gap-2">
                                          {message.citations.map((citation: any, idx: number) => (
                                            <div key={idx} className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tight ${message.role === 'user' ? 'bg-white/10 text-white/60' : 'bg-gray-100 text-gray-400'}`}>
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
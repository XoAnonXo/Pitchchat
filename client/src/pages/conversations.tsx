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
  Bell
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";

interface Message {
  id: string;
  conversationId: string;
  role: string;
  content: string;
  tokenCount: number;
  citations?: any;
  timestamp: string;
}

interface Conversation {
  id: string;
  investorEmail: string | null;
  startedAt: string;
  totalTokens: number;
  costUsd: number;
  isActive: boolean;
  linkId: string;
  linkName: string;
  projectId: string;
  projectName: string;
  // Contact details
  contactName?: string | null;
  contactPhone?: string | null;
  contactCompany?: string | null;
  contactWebsite?: string | null;
  contactProvidedAt?: string | null;
}

export default function ConversationsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<Record<string, Message[]>>({});

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    select: (data) => data || [],
  });

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

  const filteredConversations = conversations?.filter(conv => {
    const matchesSearch = 
      (conv.investorEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      conv.linkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProject = projectFilter === "all" || conv.projectId === projectFilter;
    
    return matchesSearch && matchesProject;
  }) || [];

  const uniqueProjects = Array.from(
    new Set(conversations?.map(c => c.projectId) || [])
  ).map(projectId => {
    const project = conversations?.find(c => c.projectId === projectId);
    return { id: projectId, name: project?.projectName || 'Unknown' };
  });

  const totalConversations = filteredConversations.length;
  const totalTokens = filteredConversations.reduce((sum, conv) => sum + conv.totalTokens, 0);
  const totalCost = filteredConversations.reduce((sum, conv) => sum + conv.costUsd, 0);
  const activeConversations = filteredConversations.filter(c => c.isActive).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="documents" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex">
      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">PitchChat</h1>
              <p className="text-xs text-gray-500">AI Document Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </Link>
          
          <Link href="/conversations" className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Conversations</span>
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
          
          <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
                <p className="text-xs text-green-600">{user?.credits || 0} credits</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => window.location.href = "/api/auth/logout"}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Conversations</h2>
                <p className="text-sm text-gray-500">Track all shared link interactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                AI Model: <span className="font-semibold text-black">o3</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalConversations}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Chats</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{activeConversations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalTokens.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Hash className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${totalCost.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Section */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search by email, link name, or project..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
                
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {uniqueProjects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Conversations List */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Conversation History</CardTitle>
                <span className="text-sm text-gray-500">
                  {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredConversations.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No conversations found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchTerm || projectFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Conversations will appear here when investors use your shared links'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredConversations.map((conversation) => (
                    <div key={conversation.id} className="hover:bg-gray-50 transition-colors">
                      <div 
                        className="p-6 cursor-pointer"
                        onClick={() => toggleConversation(conversation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-sm font-semibold text-gray-900">{conversation.linkName}</h4>
                              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                {conversation.projectName}
                              </Badge>
                              {conversation.isActive && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700">
                                  Active
                                </Badge>
                              )}
                              {conversation.contactProvidedAt && (
                                <div className="flex items-center gap-1 text-black">
                                  <Bell className="w-4 h-4 fill-black" />
                                  <span className="text-xs font-medium">Contact info provided</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {conversation.investorEmail && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {conversation.investorEmail}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(new Date(conversation.startedAt))} ago
                              </span>
                              <span className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {conversation.totalTokens.toLocaleString()} tokens
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${conversation.costUsd.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          >
                            {expandedConversation === conversation.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Chat History */}
                      {expandedConversation === conversation.id && (
                        <div className="px-6 pb-6 border-t border-gray-100">
                          {/* Contact Details Section */}
                          {conversation.contactProvidedAt && (
                            <div className="mt-4 mb-4 p-4 bg-black/5 rounded-xl border border-black/10">
                              <div className="flex items-center gap-2 mb-3">
                                <Bell className="w-5 h-5 text-black fill-black" />
                                <h5 className="font-semibold text-black">Contact Information Provided</h5>
                                <span className="text-xs text-gray-500 ml-auto">
                                  {format(new Date(conversation.contactProvidedAt), 'MMM d, yyyy h:mm a')}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                {conversation.contactName && (
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Name:</span>
                                    <span className="font-medium text-gray-900">{conversation.contactName}</span>
                                  </div>
                                )}
                                {conversation.contactPhone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="font-medium text-gray-900">{conversation.contactPhone}</span>
                                  </div>
                                )}
                                {conversation.contactCompany && (
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Company:</span>
                                    <span className="font-medium text-gray-900">{conversation.contactCompany}</span>
                                  </div>
                                )}
                                {conversation.contactWebsite && (
                                  <div className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-600">Website:</span>
                                    <a 
                                      href={conversation.contactWebsite}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-blue-600 hover:underline"
                                    >
                                      {conversation.contactWebsite}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
                            {loadingMessages === conversation.id ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                              </div>
                            ) : (
                              conversationMessages[conversation.id]?.map((message) => (
                                <div
                                  key={message.id}
                                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`max-w-[70%] rounded-2xl p-4 ${
                                      message.role === 'user'
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        message.role === 'user' ? 'bg-white/20' : 'bg-black'
                                      }`}>
                                        {message.role === 'user' ? (
                                          <User className={`w-4 h-4 ${message.role === 'user' ? 'text-white' : 'text-white'}`} />
                                        ) : (
                                          <Sparkles className="w-4 h-4 text-white" />
                                        )}
                                      </div>
                                      <span className="text-xs font-medium">
                                        {message.role === 'user' ? 'Investor' : 'AI Assistant'}
                                      </span>
                                      <span className={`text-xs ${message.role === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                                        {format(new Date(message.timestamp), 'h:mm a')}
                                      </span>
                                    </div>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    {message.citations && message.citations.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Sources:</p>
                                        {message.citations.map((citation: any, idx: number) => (
                                          <p key={idx} className="text-xs text-gray-400">
                                            • {citation.source} {citation.page && `(Page ${citation.page})`}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
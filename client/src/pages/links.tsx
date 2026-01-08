import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/Logo";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import ShareLinkModal from "@/components/ShareLinkModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X, 
  Home, 
  FolderOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus,
  Link as LinkIcon,
  Calendar,
  Users,
  Check,
  Copy,
  ExternalLink,
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";

interface LinksPageProps {
  projectId: string;
}

export default function LinksPage({ projectId }: LinksPageProps) {
  usePageTitle('Share Links');
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const { data: projects, isLoading: projectsLoading } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const selectedProject = projects?.find(p => p.id === projectId);
  
  const { data: links, isLoading: linksLoading } = useQuery<any[]>({ 
    queryKey: [`/api/projects/${projectId}/links`],
    enabled: !!projectId,
  });

  const { data: conversations = [] } = useQuery<any[]>({ 
    queryKey: ["/api/conversations"] 
  });
  
  const hasContactNotifications = conversations?.some(conv => conv.contactProvidedAt) || false;

  const copyLink = (slug: string, linkId: string) => {
    const fullUrl = `${window.location.origin}/chat/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(linkId);
    toast({
      title: "Link copied to clipboard",
      description: "Share this link with investors to start conversations",
    });
    
    // Reset copied state after 2 seconds
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLinkStats = (linkId: string) => {
    const linkConversations = conversations?.filter(c => c.linkId === linkId) || [];
    const uniqueVisitors = new Set(linkConversations.map(c => c.investorEmail).filter(Boolean)).size;
    return {
      conversations: linkConversations.length,
      uniqueVisitors,
    };
  };

  if (projectsLoading || linksLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans">
      {/* Fixed Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-black/[0.08] z-50
        transform transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="px-3 py-2 space-y-0.5">
          <Link href="/" className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>

          <Link href={`/documents/${projectId}`} className="flex items-center space-x-3 px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <FolderOpen className="w-4 h-4" />
            <span className="font-medium text-sm">Documents</span>
          </Link>

          <div className="flex items-center space-x-3 px-3 py-2 bg-black/[0.06] text-black rounded-xl transition-all duration-200">
            <LinkIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">Links</span>
          </div>

          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-black/60 hover:text-black hover:bg-black/[0.04] rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
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
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-black/[0.08] sticky top-0 z-30 h-20 flex items-center shrink-0">
          <div className="px-6 lg:px-8 w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 text-black/60 hover:text-black"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-black tracking-tight leading-none">Share Links</h2>
                <p className="text-[11px] text-black/45 font-medium uppercase tracking-wider mt-1.5">
                  {selectedProject?.name || 'Managing Project Links'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowShareModal(true)} className="bg-black hover:bg-black/90 text-white h-9 text-xs font-semibold rounded-xl shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create Link
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-black/50 hover:text-black text-xs font-semibold h-9 rounded-xl">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-[#DAE8FB] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Total Links</p>
                  <p className="text-3xl font-bold text-black tracking-tight">{links?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#E8E4F3] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Total Q&A</p>
                  <p className="text-3xl font-bold text-black tracking-tight">
                    {links?.reduce((acc, link) => acc + getLinkStats(link.id).conversations, 0) || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#EAE3D1] border-0 rounded-3xl shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-0.5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-black/50 uppercase tracking-widest mb-1.5">Unique Visitors</p>
                  <p className="text-3xl font-bold text-black tracking-tight">
                    {links?.reduce((acc, link) => acc + getLinkStats(link.id).uniqueVisitors, 0) || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-black/70" />
                </div>
              </CardContent>
            </Card>
          </div>

          {links && links.length > 0 ? (
            <div className="grid gap-6">
              {links.map((link) => {
                const stats = getLinkStats(link.id);
                const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                
                return (
                  <Card key={link.id} className="bg-white rounded-[2rem] border border-black/8 shadow-lg shadow-black/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/8">
                    <CardContent className="p-0">
                      <div className="p-8">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <h3 className="text-xl font-bold text-black tracking-tight">{link.name}</h3>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-lg border-black/10 ${
                                  link.status === 'active' && !isExpired
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : 'bg-black/[0.04] text-black/50'
                                }`}
                              >
                                {isExpired ? 'Expired' : link.status}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-black/50 mb-6">
                              <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Added {formatDistanceToNow(new Date(link.createdAt))} ago
                              </span>
                              <span className="flex items-center gap-2 text-black/70">
                                <MessageSquare className="w-4 h-4 text-black/40" />
                                <span className="font-bold">{stats.conversations}</span> conversations
                              </span>
                              <span className="flex items-center gap-2 text-black/70">
                                <Users className="w-4 h-4 text-black/40" />
                                <span className="font-bold">{stats.uniqueVisitors}</span> visitors
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 p-4 bg-black/[0.03] border border-black/5 rounded-2xl group">
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Public Link</p>
                                <code className="text-sm font-semibold text-black/70 block truncate">
                                  {window.location.origin}/chat/{link.slug}
                                </code>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm hover:border-black/10 border border-transparent transition-all"
                                  onClick={() => copyLink(link.slug, link.id)}
                                >
                                  {copiedId === link.id ? (
                                    <Check className="h-4 w-4 text-emerald-600" />
                                  ) : (
                                    <Copy className="h-4 w-4 text-black/40" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm hover:border-black/10 border border-transparent transition-all"
                                  onClick={() => window.open(`/chat/${link.slug}`, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 text-black/40" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-white rounded-[2rem] border border-black/8 shadow-lg shadow-black/5 overflow-hidden">
              <CardContent className="p-20 text-center">
                <div className="w-16 h-16 bg-black/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LinkIcon className="w-8 h-8 text-black/30" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">No Links Found</h3>
                <p className="text-black/50 max-w-sm mx-auto mb-8 leading-relaxed">
                  You haven't created any share links for this project yet.
                </p>
                <Button 
                  onClick={() => setShowShareModal(true)}
                  className="bg-black hover:bg-black/90 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5"
                >
                  Create your first link
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {selectedProject && (
        <ShareLinkModal 
          projectId={selectedProject.id} 
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
}

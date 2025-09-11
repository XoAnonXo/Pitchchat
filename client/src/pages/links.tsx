import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LinkIcon,
  Copy,
  ExternalLink,
  Calendar,
  Users,
  Check,
  Bell,
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";

interface LinksPageProps {
  projectId: string;
}

export default function LinksPage({ projectId }: LinksPageProps) {
  usePageTitle('Share Links');
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const { data: projects } = useQuery<any[]>({ queryKey: ["/api/projects"] });
  const selectedProject = projects?.find(p => p.id === projectId);
  
  const { data: links, isLoading } = useQuery<any[]>({ 
    queryKey: [`/api/projects/${projectId}/links`],
    enabled: !!projectId,
  });

  const { data: conversations } = useQuery<any[]>({ 
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">PitchChat</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link href={`/documents/${projectId}`} className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </Link>
          
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl">
            <LinkIcon className="w-5 h-5" />
            <span className="font-medium">Links</span>
          </div>
          
          <Link href="/conversations" className="flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Conversations</span>
            </div>
            {hasContactNotifications && (
              <div className="flex items-center">
                <Bell className="w-4 h-4 text-black fill-black" />
              </div>
            )}
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
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
              <p className="text-xs text-gray-500">
                {user?.subscriptionStatus === 'active' ? 'Premium' : 'Free'} Plan
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Share Links</h2>
            <p className="text-gray-600 mt-2">Manage and share pitch links with investors</p>
          </div>

          {selectedProject && (
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm mb-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {selectedProject.name}
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : links && links.length > 0 ? (
            <div className="grid gap-4">
              {links.map((link) => {
                const stats = getLinkStats(link.id);
                const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
                
                return (
                  <Card key={link.id} className="bg-white rounded-2xl border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{link.name}</h3>
                            <Badge 
                              variant="secondary" 
                              className={`${
                                link.status === 'active' && !isExpired
                                  ? 'bg-green-50 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {isExpired ? 'Expired' : link.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Created {formatDistanceToNow(new Date(link.createdAt))} ago
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {stats.conversations} conversations
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {stats.uniqueVisitors} unique visitors
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <code className="text-sm text-gray-700 flex-1 truncate">
                              {window.location.origin}/chat/{link.slug}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-200"
                              onClick={() => copyLink(link.slug, link.id)}
                            >
                              {copiedId === link.id ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-200"
                              onClick={() => window.open(`/chat/${link.slug}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-12 text-center">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No links created yet</h3>
                <p className="text-gray-600 mb-4">Create share links from your project dashboard</p>
                <Link href="/">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
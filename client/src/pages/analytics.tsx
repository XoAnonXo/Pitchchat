import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { 
  Menu,
  X,
  LogOut,
  Settings,
  Users,
  FolderOpen,
  Home,
  BarChart3,
  MessageSquare,
  Sparkles,
  FileText,
  DollarSign,
  Hash,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Calendar,
  Target,
  Activity,
  Link as LinkIcon,
  Download,
  Bell,
  ArrowRight,
  Database
} from "lucide-react";
import { format } from "date-fns";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Conversation, Project } from "@shared/schema";

interface AnalyticsData {
  overview: {
    totalProjects: number;
    totalDocuments: number;
    totalConversations: number;
    totalTokensUsed: number;
    totalCost: number;
    totalLinks: number;
    activeLinks: number;
    totalVisitors: number;
  };
  timeSeriesData: Array<{
    date: string;
    conversations: number;
    messages: number;
    tokens: number;
    cost: number;
  }>;
  projectBreakdown: Array<{
    projectId: string;
    projectName: string;
    documents: number;
    links: number;
    conversations: number;
    totalTokens: number;
    totalCost: number;
  }>;
  documentStats: {
    byType: Array<{ type: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
    totalSize: number;
  };
  linkPerformance: Array<{
    linkId: string;
    linkName: string;
    status: string;
    conversations: number;
    uniqueVisitors: number;
    totalTokens: number;
    totalCost: number;
    createdAt: string;
  }>;
  visitorEngagement: {
    averageMessagesPerConversation: number;
    averageTokensPerConversation: number;
    topVisitors: Array<{
      email: string;
      conversations: number;
      totalTokens: number;
      totalCost: number;
    }>;
  };
}

const COLORS = ["#000000", "#4B5563", "#9CA3AF", "#D1D5DB", "#E5E7EB", "#F3F4F6"];

export default function AnalyticsPage() {
  usePageTitle('Analytics');
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30");

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/detailed"],
  });

  // Fetch conversations to check for contact notifications
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    enabled: !!user,
  });

  // Check if there are any conversations with contact details
  const hasContactNotifications = conversations.some((conv) => conv.contactProvidedAt);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <StartupLoadingSkeleton type="dashboard" />
      </div>
    );
  }

  // Check if there's no data
  const hasNoData = analytics.overview.totalConversations === 0 && 
                    analytics.overview.totalDocuments === 0 && 
                    analytics.overview.totalProjects === 0;

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
          
          <Link href="/conversations" className="flex items-center justify-between px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Conversations</span>
            </div>
            {hasContactNotifications && (
              <Badge className="h-2 w-2 p-0 rounded-full bg-blue-600 border-none" />
            )}
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-3 py-2 bg-gray-50 text-black rounded-lg transition-all duration-200">
            <BarChart3 className="w-4 h-4" />
            <span className="font-semibold text-sm">Analytics</span>
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

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

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
                <h2 className="text-xl font-bold text-black font-inter-tight tracking-tight leading-none">Analytics</h2>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1.5">
                  Comprehensive insights and performance
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg h-9 text-xs font-semibold">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8 max-w-[1600px]">
          {/* Empty State */}
          {hasNoData ? (
            <div className="flex-1 flex items-center justify-center p-8 min-h-[60vh]">
              <div className="max-w-md w-full text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                  <BarChart3 className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-black font-inter-tight mb-2">No Analytics Yet</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Analytics will appear here once you start receiving visitors and conversations through your shared pitch links.
                </p>
                <Link href="/">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-black/10">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Key Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conversations</p>
                      <p className="text-2xl font-bold text-black font-inter-tight">{analytics.overview.totalConversations.toLocaleString()}</p>
                      <p className="text-[10px] text-green-600 mt-1 font-semibold flex items-center">
                        <TrendingUp className="w-2.5 h-2.5 mr-1" />
                        +12% vs last month
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Tokens</p>
                      <p className="text-2xl font-bold text-black font-inter-tight">{analytics.overview.totalTokensUsed.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                        Avg: {analytics.visitorEngagement.averageTokensPerConversation} per chat
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center border border-blue-100/50">
                      <Hash className="w-5 h-5 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Cost</p>
                      <p className="text-2xl font-bold text-black font-inter-tight">${analytics.overview.totalCost.toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        ${(analytics.overview.totalCost / 30).toFixed(2)} / day avg
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-50/50 rounded-xl flex items-center justify-center border border-green-100/50">
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Visitors</p>
                      <p className="text-2xl font-bold text-black font-inter-tight">{analytics.overview.totalVisitors}</p>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium uppercase tracking-tighter">
                        Across {analytics.overview.activeLinks} active links
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-purple-50/50 rounded-xl flex items-center justify-center border border-purple-100/50">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Time Series Chart */}
              <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
                <CardHeader className="border-b border-gray-50 px-6 py-5 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-bold text-black font-inter-tight">Activity Over Time</CardTitle>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">Usage trends and engagement volume</p>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[130px] h-9 bg-gray-50 border-gray-200 rounded-lg text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={analytics.timeSeriesData}>
                      <defs>
                        <linearGradient id="colorConvs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
                        tickFormatter={(value) => format(new Date(value), 'MMM d')}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #f3f4f6',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversations" 
                        stroke="#000000" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorConvs)" 
                        name="Conversations"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        fillOpacity={0} 
                        name="Messages"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Project Performance */}
                <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
                  <CardHeader className="border-b border-gray-50 px-6 py-5">
                    <CardTitle className="text-lg font-bold text-black font-inter-tight">Project Performance</CardTitle>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">Metrics across your workspace</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.projectBreakdown} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                        <YAxis 
                          dataKey="projectName" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fill: '#1a1a1a', fontWeight: 600 }}
                          width={100}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f9fafb' }}
                          contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }}
                        />
                        <Bar dataKey="conversations" fill="#000000" radius={[0, 4, 4, 0]} barSize={20} name="Conversations" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Document Type Distribution */}
                <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
                  <CardHeader className="border-b border-gray-50 px-6 py-5">
                    <CardTitle className="text-lg font-bold text-black font-inter-tight">Storage Analysis</CardTitle>
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-1">Data composition and volume</p>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col items-center">
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={analytics.documentStats.byType}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          nameKey="type"
                        >
                          {analytics.documentStats.byType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                      {analytics.documentStats.byType.map((entry, index) => (
                        <div key={entry.type} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{entry.type}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-50 w-full text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payload</p>
                      <p className="text-xl font-bold text-black font-inter-tight">{formatFileSize(analytics.documentStats.totalSize)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
                  <CardHeader className="border-b border-gray-50 px-6 py-5">
                    <CardTitle className="text-lg font-bold text-black font-inter-tight">Top Performing Links</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link Name</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">Convs</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visitors</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {analytics.linkPerformance
                            .sort((a, b) => b.conversations - a.conversations)
                            .slice(0, 5)
                            .map((link) => (
                            <tr key={link.linkId} className="hover:bg-gray-50 transition-colors group">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">
                                    <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900">{link.linkName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-600 tabular-nums">
                                {link.conversations}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-600 tabular-nums">
                                {link.uniqueVisitors}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-soft transition-all duration-300">
                  <CardHeader className="border-b border-gray-50 px-6 py-5">
                    <CardTitle className="text-lg font-bold text-black font-inter-tight">Most Engaged Visitors</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {analytics.visitorEngagement.topVisitors.map((visitor, index) => (
                        <div key={visitor.email} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm transition-all group">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{visitor.email}</p>
                              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                                {visitor.conversations} chats • {visitor.totalTokens.toLocaleString()} tokens
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">${visitor.totalCost.toFixed(2)}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase">Cost</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black text-white rounded-3xl border-0 shadow-lg relative overflow-hidden group">
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px] font-bold uppercase">Live Insight</Badge>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Engagement Average</p>
                    <p className="text-3xl font-bold font-inter-tight">
                      {analytics.visitorEngagement.averageMessagesPerConversation} <span className="text-sm font-medium text-white/40 uppercase ml-1">msgs</span>
                    </p>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  </CardContent>
                </Card>

                <Card className="bg-[#6366f1] text-white rounded-3xl border-0 shadow-lg relative overflow-hidden group">
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold uppercase">Performance</Badge>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Conversion Rate</p>
                    <p className="text-3xl font-bold font-inter-tight">
                      {((analytics.overview.totalConversations / analytics.overview.totalVisitors) * 100).toFixed(1)}%
                    </p>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  </CardContent>
                </Card>

                <Card className="bg-[#10b981] text-white rounded-3xl border-0 shadow-lg relative overflow-hidden group">
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold uppercase">Inventory</Badge>
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Knowledge Base</p>
                    <p className="text-3xl font-bold font-inter-tight">
                      {analytics.overview.totalDocuments} <span className="text-sm font-medium text-white/40 uppercase ml-1">docs</span>
                    </p>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
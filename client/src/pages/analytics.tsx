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
  RadarArea,
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
  LinkIcon,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";

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
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [timeRange, setTimeRange] = useState("30");

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/detailed"],
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading || !analytics) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
        <StartupLoadingSkeleton type="dashboard" />
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
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <FolderOpen className="w-5 h-5" />
            <span className="font-medium">Documents</span>
          </button>
          
          <Link href="/conversations" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Conversations</span>
          </Link>
          
          <Link href="/analytics" className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black rounded-xl transition-all duration-200">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </Link>
          
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
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
              onClick={() => window.location.href = "/api/logout"}
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
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-sm text-gray-500">Comprehensive insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-8">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics.overview.totalConversations.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% from last month
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">Total Tokens</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics.overview.totalTokensUsed.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Avg: {analytics.visitorEngagement.averageTokensPerConversation} per chat
                    </p>
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
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${analytics.overview.totalCost.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ${(analytics.overview.totalCost / 30).toFixed(2)}/day avg
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {analytics.overview.totalVisitors}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {analytics.overview.activeLinks} active links
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Chart */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Activity Over Time</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px] bg-gray-50 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analytics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="conversations" 
                    stackId="1"
                    stroke="#000000" 
                    fill="#000000"
                    fillOpacity={0.6}
                    name="Conversations"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stackId="1"
                    stroke="#4B5563" 
                    fill="#4B5563"
                    fillOpacity={0.6}
                    name="Messages"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Performance */}
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">Project Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.projectBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="projectName" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      stroke="#9CA3AF"
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="conversations" fill="#000000" name="Conversations" />
                    <Bar dataKey="documents" fill="#6B7280" name="Documents" />
                    <Bar dataKey="links" fill="#D1D5DB" name="Links" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Document Type Distribution */}
            <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-900">Document Types</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.documentStats.byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, count, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
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
                <div className="mt-4 text-center text-sm text-gray-600">
                  Total Storage: {formatFileSize(analytics.documentStats.totalSize)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Link Performance Table */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900">Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Link Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversations
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unique Visitors
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tokens Used
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.linkPerformance
                      .sort((a, b) => b.conversations - a.conversations)
                      .slice(0, 5)
                      .map((link) => (
                      <tr key={link.linkId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{link.linkName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="secondary" 
                            className={`${
                              link.status === 'active' 
                                ? 'bg-green-50 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {link.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.conversations}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.uniqueVisitors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {link.totalTokens.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${link.totalCost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Visitors */}
          <Card className="bg-white rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-bold text-gray-900">Most Engaged Visitors</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {analytics.visitorEngagement.topVisitors.map((visitor, index) => (
                  <div key={visitor.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{visitor.email}</p>
                        <p className="text-xs text-gray-500">
                          {visitor.conversations} conversations • {visitor.totalTokens.toLocaleString()} tokens
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${visitor.totalCost.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Total Cost</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-700 text-white rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">Live</Badge>
                </div>
                <p className="text-sm font-medium text-white/80">Average Engagement</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.visitorEngagement.averageMessagesPerConversation} msgs
                </p>
                <p className="text-xs text-white/60 mt-1">Per conversation</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">Performance</Badge>
                </div>
                <p className="text-sm font-medium text-white/80">Conversion Rate</p>
                <p className="text-3xl font-bold mt-2">
                  {((analytics.overview.totalConversations / analytics.overview.totalVisitors) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-white/60 mt-1">Visitors to conversations</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-400 text-white rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-white/80" />
                  <Badge className="bg-white/20 text-white border-0">Growth</Badge>
                </div>
                <p className="text-sm font-medium text-white/80">Document Processing</p>
                <p className="text-3xl font-bold mt-2">
                  {analytics.overview.totalDocuments}
                </p>
                <p className="text-xs text-white/60 mt-1">Total documents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Skeleton } from "@/components/ui/skeleton";

interface StartupLoadingSkeletonProps {
  type: 'dashboard' | 'documents' | 'chat' | 'upload' | 'analytics';
  className?: string;
}

export function StartupLoadingSkeleton({ type, className }: StartupLoadingSkeletonProps) {
  const skeletonMap = {
    dashboard: <DashboardSkeleton />,
    documents: <DocumentsSkeleton />,
    chat: <ChatSkeleton />,
    upload: <UploadSkeleton />,
    analytics: <AnalyticsSkeleton />
  };

  return (
    <div className={`animate-fadeIn ${className}`}>
      {skeletonMap[type]}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        
        {/* Startup Illustration */}
        <div className="flex items-center justify-center py-8">
          <StartupIllustration type="rocket" />
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Startup Illustration */}
      <div className="flex items-center justify-center py-6">
        <StartupIllustration type="documents" />
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl border p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-6 rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>

      {/* Startup Illustration */}
      <div className="flex items-center justify-center py-8">
        <StartupIllustration type="chat" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? 'bg-muted' : 'bg-primary'} rounded-xl p-3`}>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 w-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function UploadSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      {/* Startup Illustration */}
      <div className="flex items-center justify-center py-8">
        <StartupIllustration type="upload" />
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center space-y-4">
        <Skeleton className="h-16 w-16 mx-auto rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Startup Illustration */}
      <div className="flex items-center justify-center py-6">
        <StartupIllustration type="analytics" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="rounded-xl border p-6 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

interface StartupIllustrationProps {
  type: 'rocket' | 'documents' | 'chat' | 'upload' | 'analytics';
}

function StartupIllustration({ type }: StartupIllustrationProps) {
  const illustrations = {
    rocket: (
      <div className="relative">
        <div className="animate-bounce">
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary">
            <path
              d="M50 10 L70 30 L60 40 L55 35 L50 50 L45 35 L40 40 L30 30 Z"
              fill="currentColor"
              className="animate-pulse"
            />
            <circle cx="50" cy="65" r="8" fill="currentColor" opacity="0.7" />
            <circle cx="45" cy="75" r="6" fill="currentColor" opacity="0.5" />
            <circle cx="55" cy="75" r="6" fill="currentColor" opacity="0.5" />
            <circle cx="50" cy="85" r="4" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
          Launching...
        </div>
      </div>
    ),
    documents: (
      <div className="relative">
        <div className="animate-pulse">
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary">
            <rect x="20" y="20" width="40" height="50" rx="3" fill="currentColor" opacity="0.8" />
            <rect x="30" y="30" width="40" height="50" rx="3" fill="currentColor" opacity="0.6" />
            <rect x="40" y="40" width="40" height="50" rx="3" fill="currentColor" opacity="0.4" />
            <rect x="25" y="25" width="30" height="3" fill="white" opacity="0.9" />
            <rect x="25" y="30" width="25" height="2" fill="white" opacity="0.7" />
            <rect x="25" y="35" width="20" height="2" fill="white" opacity="0.5" />
          </svg>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
          Loading docs...
        </div>
      </div>
    ),
    chat: (
      <div className="relative">
        <div className="animate-pulse">
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary">
            <rect x="15" y="25" width="50" height="30" rx="15" fill="currentColor" opacity="0.8" />
            <rect x="35" y="45" width="50" height="30" rx="15" fill="currentColor" opacity="0.6" />
            <circle cx="25" cy="40" r="3" fill="white" opacity="0.9" />
            <circle cx="35" cy="40" r="3" fill="white" opacity="0.7" />
            <circle cx="45" cy="40" r="3" fill="white" opacity="0.5" />
            <circle cx="55" cy="60" r="3" fill="white" opacity="0.9" />
            <circle cx="65" cy="60" r="3" fill="white" opacity="0.7" />
            <circle cx="75" cy="60" r="3" fill="white" opacity="0.5" />
          </svg>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
          Connecting...
        </div>
      </div>
    ),
    upload: (
      <div className="relative">
        <div className="animate-bounce">
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary">
            <rect x="30" y="40" width="40" height="40" rx="5" fill="currentColor" opacity="0.8" />
            <path d="M50 20 L40 35 L45 35 L45 50 L55 50 L55 35 L60 35 Z" fill="currentColor" />
            <rect x="35" y="65" width="30" height="3" fill="white" opacity="0.9" />
            <rect x="35" y="70" width="25" height="2" fill="white" opacity="0.7" />
          </svg>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
          Uploading...
        </div>
      </div>
    ),
    analytics: (
      <div className="relative">
        <div className="animate-pulse">
          <svg viewBox="0 0 100 100" className="w-24 h-24 text-primary">
            <rect x="20" y="60" width="8" height="30" fill="currentColor" opacity="0.8" />
            <rect x="35" y="45" width="8" height="45" fill="currentColor" opacity="0.7" />
            <rect x="50" y="35" width="8" height="55" fill="currentColor" opacity="0.6" />
            <rect x="65" y="50" width="8" height="40" fill="currentColor" opacity="0.5" />
            <path d="M20 40 Q35 30 50 35 Q65 40 80 25" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.8" />
            <circle cx="20" cy="40" r="2" fill="currentColor" />
            <circle cx="35" cy="35" r="2" fill="currentColor" />
            <circle cx="50" cy="35" r="2" fill="currentColor" />
            <circle cx="65" cy="40" r="2" fill="currentColor" />
            <circle cx="80" cy="25" r="2" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground animate-pulse">
          Analyzing...
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {illustrations[type]}
      <div className="text-center space-y-1">
        <div className="text-sm text-muted-foreground">
          Building your startup's future
        </div>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}

// Add custom animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }
`;
document.head.appendChild(style);
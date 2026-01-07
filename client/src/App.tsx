import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";

// Lazy load all page components for code splitting
const Landing = lazy(() => import("@/pages/landing"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const InvestorChat = lazy(() => import("@/pages/investor-chat"));
const DocumentsPage = lazy(() => import("@/pages/documents"));
const ConversationsPage = lazy(() => import("@/pages/conversations"));
const AnalyticsPage = lazy(() => import("@/pages/analytics"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const LinksPage = lazy(() => import("@/pages/links"));
const AuthPage = lazy(() => import("@/pages/auth"));
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={<StartupLoadingSkeleton type="dashboard" />}>
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/reset-password/:token" component={ResetPasswordPage} />
            <Route path="/chat/:slug" component={InvestorChat} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/documents/:projectId" component={({ params }) => <DocumentsPage projectId={params.projectId} />} />
            <Route path="/links/:projectId" component={({ params }) => <LinksPage projectId={params.projectId} />} />
            <Route path="/conversations" component={ConversationsPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/chat/:slug" component={InvestorChat} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

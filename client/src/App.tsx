import { Switch, Route, Redirect } from "wouter";
import { lazy, Suspense, useEffect } from "react";
import { getQueryFn, queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StartupLoadingSkeleton } from "@/components/StartupLoadingSkeleton";
import { CookieConsent } from "@/components/CookieConsent";
import type { Conversation, Project, User } from "@shared/schema";

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

type DashboardBootstrap = {
  user: User;
  projects: Project[];
  analytics: {
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  };
  conversations: Conversation[];
};

function Router() {
  const reactQueryClient = useQueryClient();
  const bootstrapQuery = useQuery<DashboardBootstrap | null>({
    queryKey: ["/api/bootstrap"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const authFallbackQuery = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: bootstrapQuery.isError,
  });

  useEffect(() => {
    if (bootstrapQuery.data === null) {
      reactQueryClient.setQueryData(["/api/auth/user"], null);
      return;
    }

    if (!bootstrapQuery.data) {
      return;
    }

    reactQueryClient.setQueryData(["/api/auth/user"], bootstrapQuery.data.user);
    reactQueryClient.setQueryData(["/api/projects"], bootstrapQuery.data.projects);
    reactQueryClient.setQueryData(["/api/analytics"], bootstrapQuery.data.analytics);
    reactQueryClient.setQueryData(["/api/conversations"], bootstrapQuery.data.conversations);
  }, [bootstrapQuery.data, reactQueryClient]);

  const isAuthenticated = !!bootstrapQuery.data?.user || !!authFallbackQuery.data;
  const isLoading = bootstrapQuery.isLoading || (bootstrapQuery.isError && authFallbackQuery.isLoading);

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
            {/* Avoid client-side 404s when deep-linking to app pages while logged out */}
            <Route path="/dashboard" component={() => <Redirect to="/auth" />} />
            <Route path="/documents/:projectId" component={() => <Redirect to="/auth" />} />
            <Route path="/links/:projectId" component={() => <Redirect to="/auth" />} />
            <Route path="/conversations" component={() => <Redirect to="/auth" />} />
            <Route path="/analytics" component={() => <Redirect to="/auth" />} />
            <Route path="/settings" component={() => <Redirect to="/auth" />} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
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
        <CookieConsent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

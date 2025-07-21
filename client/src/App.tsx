import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import InvestorChat from "@/pages/investor-chat";
import DocumentsPage from "@/pages/documents";
import ConversationsPage from "@/pages/conversations";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import AuthPage from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/chat/:slug" component={InvestorChat} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/documents/:projectId" component={({ params }) => <DocumentsPage projectId={params.projectId} />} />
          <Route path="/conversations" component={ConversationsPage} />
          <Route path="/analytics" component={AnalyticsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/chat/:slug" component={InvestorChat} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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

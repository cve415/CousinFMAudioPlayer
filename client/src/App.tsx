import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BroadcastPage from "@/pages/broadcast";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/broadcast/:id" component={BroadcastPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Handle iframe communication for domain forwarding
  useEffect(() => {
    const sendHeightToParent = () => {
      if (window.parent && window.parent.postMessage && window.parent !== window) {
        const height = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          window.innerHeight
        );
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    };

    // Initial height send
    sendHeightToParent();
    
    // Update on resize
    window.addEventListener('resize', sendHeightToParent);
    
    // Watch for DOM changes
    const observer = new MutationObserver(sendHeightToParent);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('resize', sendHeightToParent);
      observer.disconnect();
    };
  }, []);

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

import { useState, useEffect, useCallback } from "react";
import { Toaster } from "./components/ui/toaster.jsx";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { LoginPage } from "./components/LoginPage.jsx";
import { RegisterPage } from "./components/RegisterPage.jsx";
import { DashboardPage } from "./components/DashboardPage.jsx";
import { AddBookPage } from "./components/AddBookPage.jsx";
import { BrowseBooksPage } from "./components/BrowseBooksPage.jsx";
import { useToast } from "./hooks/use-toast.js";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  const expiry = payload.exp * 1000;
  return Date.now() >= expiry;
}

const App = () => {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  const logout = useCallback(() => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      if (isTokenExpired(token)) {
        logout();
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again to continue.",
        });
      } else {
        const payload = parseJwt(token);
        if (payload) {
          setUser({ email: payload.sub, id: payload.id });
        }
      }
    }
  }, [logout, toast]);

  // Check token expiry periodically
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("jwtToken");
      if (token && isTokenExpired(token)) {
        logout();
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please log in again to continue.",
        });
      }
    };

    const interval = setInterval(checkToken, 60000); // Check every minute
    window.addEventListener('focus', checkToken); // Check when window regains focus

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkToken);
    };
  }, [logout, toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-subtle">
            <Header user={user} logout={logout} />
            <main>
              <Routes>
                {/* Redirect root to browse books */}
                <Route 
                  path="/" 
                  element={<Navigate to="/browse" />} 
                />
                
                {/* Protected route for browsing books */}
                <Route 
                  path="/browse" 
                  element={user ? <BrowseBooksPage /> : <Navigate to="/login" state={{ from: "/browse" }} />} 
                />
                
                {/* Auth routes - redirect to dashboard if already logged in */}
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />} 
                />
                
                {/* Protected routes - require authentication */}
                <Route 
                  path="/dashboard" 
                  element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} 
                />

                <Route 
                  path="/add" 
                  element={user ? <AddBookPage user={user} /> : <Navigate to="/login" />} 
                />
                
                {/* Catch-all route for 404s */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
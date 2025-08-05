import { Link } from "react-router-dom";
import { BookOpen, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button.jsx";

export function Header({ user, logout }) {
  return (
    <header className="bg-gradient-card border-b border-border shadow-soft sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-primary font-bold text-xl hover:text-primary-glow transition-smooth"
          >
            <BookOpen className="h-7 w-7" />
            Digital Book Swap
          </Link>
          
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/browse">Browse Books</Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm">
                  <User className="h-4 w-4" />
                  <span className="max-w-32 truncate">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
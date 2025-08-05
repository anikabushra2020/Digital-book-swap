import { BookOpen, Users, Shield, Sparkles } from "lucide-react";

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('./placeholder.svg')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <BookOpen className="h-10 w-10" />
              <h1 className="text-3xl font-bold">Digital Book Swap</h1>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight animate-fade-in [animation-delay:200ms]">
              Share Knowledge,<br />
              Build Community
            </h2>
            
            <p className="text-xl mb-8 text-primary-foreground/90 animate-fade-in [animation-delay:400ms]">
              Connect with fellow book lovers and create a sustainable learning ecosystem through book sharing.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 animate-fade-in [animation-delay:600ms]">
                <div className="p-2 rounded-full bg-white/10">
                  <Users className="h-5 w-5 text-primary-glow" />
                </div>
                <span>Growing community of book enthusiasts</span>
              </div>
              <div className="flex items-center gap-3 animate-fade-in [animation-delay:800ms]">
                <div className="p-2 rounded-full bg-white/10">
                  <Shield className="h-5 w-5 text-primary-glow" />
                </div>
                <span>Safe and trusted book exchanges</span>
              </div>
              <div className="flex items-center gap-3 animate-fade-in [animation-delay:1000ms]">
                <div className="p-2 rounded-full bg-white/10">
                  <Sparkles className="h-5 w-5 text-primary-glow" />
                </div>
                <span>Discover new books and authors</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-primary-foreground/20 rounded-full blur-2xl animate-pulse [animation-delay:1000ms]"></div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:max-w-md xl:max-w-lg">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
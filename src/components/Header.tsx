import { Sparkles, Zap, Target, Crown, User, LogOut, Settings, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { MaterialButton } from "@/components/ui/material-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden min-h-[400px] lg:min-h-[500px] flex flex-col">
      {/* Navigation */}
      <nav className="relative z-10 p-4 lg:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Crown className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-300" />
            <span className="text-lg lg:text-xl font-bold">Elite CommentCraft</span>
          </Link>
          
          <div className="flex items-center gap-2 lg:gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <MaterialButton
                    variant="outlined"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {profile?.email?.split('@')[0] || 'Account'}
                  </MaterialButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 lg:gap-3">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium rounded-lg bg-white text-primary hover:bg-white/90 transition-colors"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 flex-1">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute top-20 left-4 lg:left-20 w-32 lg:w-64 h-32 lg:h-64 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-32 right-4 lg:right-20 w-24 lg:w-48 h-24 lg:h-48 bg-gradient-to-r from-green-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-40 lg:w-80 h-40 lg:h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 right-1/4 w-16 lg:w-32 h-16 lg:h-32 bg-gradient-to-r from-cyan-400/40 to-blue-500/40 rounded-full blur-2xl animate-pulse delay-500" />
      </div>
      
      <div className="relative container mx-auto px-4 lg:px-6 py-12 lg:py-20 flex-1 flex items-center">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 lg:gap-4 mb-6 lg:mb-8">
            <div className="relative order-2 sm:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl lg:rounded-3xl blur-lg opacity-60 animate-pulse"></div>
              <div className="relative p-2 lg:p-4 bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/30 shadow-2xl">
                <Crown className="h-6 w-6 lg:h-10 lg:w-10 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-yellow-200 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl order-1 sm:order-2">
              Elite CommentCraft
            </h1>
            <div className="relative order-3">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl lg:rounded-3xl blur-lg opacity-60 animate-pulse delay-300"></div>
              <div className="relative p-2 lg:p-4 bg-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/30 shadow-2xl">
                <Zap className="h-6 w-6 lg:h-10 lg:w-10 text-cyan-300" />
              </div>
            </div>
          </div>
          
          <p className="text-lg lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium mb-8 lg:mb-12 px-4">
            Transform any social media post into <span className="text-yellow-300 font-bold">expert-level</span>, research-backed comments that build trust and authority
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 lg:gap-8 text-sm lg:text-lg px-4">
            <div className="flex items-center gap-2 lg:gap-3 bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border border-white/20 w-full sm:w-auto justify-center">
              <Target className="h-4 w-4 lg:h-6 lg:w-6 text-emerald-300 flex-shrink-0" />
              <span className="text-white font-medium">AI-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border border-white/20 w-full sm:w-auto justify-center">
              <Sparkles className="h-4 w-4 lg:h-6 lg:w-6 text-pink-300 flex-shrink-0" />
              <span className="text-white font-medium">Human-Like Tone</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3 bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl px-4 lg:px-6 py-2 lg:py-3 border border-white/20 w-full sm:w-auto justify-center">
              <Crown className="h-4 w-4 lg:h-6 lg:w-6 text-yellow-300 flex-shrink-0" />
              <span className="text-white font-medium">Research-Backed</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
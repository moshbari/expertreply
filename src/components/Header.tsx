import { Sparkles, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>
      
      <div className="relative container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Elite CommentCraft
            </h1>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Transform any social media post into research-powered, human-sounding replies that build trust and authority
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              AI-Powered Analysis
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              Human-Like Tone
            </span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/60 rounded-full" />
              Research-Backed
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
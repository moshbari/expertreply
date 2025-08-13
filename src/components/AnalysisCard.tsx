import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Heart, Lightbulb, BarChart3, MessageSquare } from "lucide-react";

interface AnalysisCardProps {
  analysis: string;
  onWriteComment: () => void;
  isLoading?: boolean;
}

const AnalysisCard = ({ analysis, onWriteComment, isLoading }: AnalysisCardProps) => {
  // Parse the analysis text to format it better
  const formatAnalysis = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const sections: { icon: any; title: string; content: string[] }[] = [];
    let currentSection: { icon: any; title: string; content: string[] } | null = null;
    
    const sectionIcons = {
      'main problem': Target,
      'emotional state': Heart,
      'help needed': Lightbulb,
      'root cause': Brain,
      'facts': BarChart3,
      'comment angle': MessageSquare,
    };
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      const sectionKey = Object.keys(sectionIcons).find(key => 
        lowerLine.includes(key) && (lowerLine.includes(':') || lowerLine.includes('?'))
      );
      
      if (sectionKey) {
        if (currentSection) sections.push(currentSection);
        currentSection = {
          icon: sectionIcons[sectionKey as keyof typeof sectionIcons],
          title: line.split(':')[0].trim(),
          content: line.includes(':') ? [line.split(':').slice(1).join(':').trim()] : []
        };
      } else if (currentSection) {
        currentSection.content.push(line.trim());
      } else {
        // If no section found yet, create a general section
        if (!currentSection) {
          currentSection = {
            icon: Brain,
            title: 'Analysis',
            content: [line.trim()]
          };
        }
      }
    });
    
    if (currentSection) sections.push(currentSection);
    return sections.length > 0 ? sections : [{ icon: Brain, title: 'Analysis', content: lines }];
  };

  const formattedSections = formatAnalysis(analysis);

  return (
    <Card className="rounded-3xl shadow-elevation-2 border-0 bg-gradient-to-br from-surface via-surface-container to-surface-container-high overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-accent/5 border-b border-outline-variant/50">
        <CardTitle className="text-2xl font-bold text-on-surface flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          Post Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-6">
          {formattedSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-on-surface">{section.title}</h3>
                </div>
                <div className="space-y-2">
                  {section.content.map((content, contentIndex) => (
                    <p key={contentIndex} className="text-on-surface-variant leading-relaxed">
                      {content}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="pt-6 border-t border-outline-variant/50">
          <div className="bg-surface-container-highest rounded-2xl p-6 mb-6">
            <p className="text-on-surface-variant mb-1 font-medium">
              Ready to continue?
            </p>
            <p className="text-on-surface-variant/80 text-sm">
              Does this analysis align with your understanding? Any changes before I write the comment?
            </p>
          </div>
          <Button 
            onClick={onWriteComment} 
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-accent via-amber-500 to-amber-400 hover:from-accent/90 hover:via-amber-500/90 hover:to-amber-400/90 text-black font-semibold text-lg shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black"></div>
                Writing Comment...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                Write Expert Comment
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
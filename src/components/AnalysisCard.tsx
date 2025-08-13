import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, Heart, Lightbulb, BarChart3, MessageSquare } from "lucide-react";
import { stripMarkdown, cleanAIText, extractTitle } from "@/utils/textFormatting";

interface AnalysisCardProps {
  analysis: string;
  onWriteComment: () => void;
  isLoading?: boolean;
}

const AnalysisCard = ({ analysis, onWriteComment, isLoading }: AnalysisCardProps) => {
  const formatAnalysis = (text: string) => {
    // Clean the text first
    const cleanedText = cleanAIText(stripMarkdown(text));
    const lines = cleanedText.split('\n').filter(line => line.trim());
    const sections: { icon: any; title: string; content: string[] }[] = [];
    
    const sectionIcons = {
      'problem': Target,
      'struggle': Target,
      'asking': Target,
      'emotional': Heart,
      'state': Heart,
      'need': Heart,
      'help': Lightbulb,
      'type': Lightbulb,
      'assistance': Lightbulb,
      'root': Brain,
      'cause': Brain,
      'underlying': Brain,
      'fact': BarChart3,
      'stat': BarChart3,
      'insight': BarChart3,
      'data': BarChart3,
      'angle': MessageSquare,
      'approach': MessageSquare,
      'strategy': MessageSquare,
    };
    
    // Try to detect numbered sections (1., 2., 3., etc.)
    const numberedSections = lines.filter(line => /^\d+\.\s/.test(line.trim()));
    
    if (numberedSections.length >= 3) {
      // Handle numbered format
      let currentSection: { icon: any; title: string; content: string[] } | null = null;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        const isNumbered = /^\d+\.\s/.test(trimmedLine);
        
        if (isNumbered) {
          if (currentSection) sections.push(currentSection);
          
          const content = stripMarkdown(trimmedLine.replace(/^\d+\.\s/, ''));
          const lowerContent = content.toLowerCase();
          
          // Find appropriate icon based on content
          let icon = Brain;
          let title = extractTitle(content, 35);
          
          for (const [keyword, iconComponent] of Object.entries(sectionIcons)) {
            if (lowerContent.includes(keyword)) {
              icon = iconComponent;
              break;
            }
          }
          
          currentSection = {
            icon,
            title,
            content: [content]
          };
        } else if (currentSection && trimmedLine) {
          const cleanedLine = stripMarkdown(trimmedLine);
          if (cleanedLine && !currentSection.content.includes(cleanedLine)) {
            currentSection.content.push(cleanedLine);
          }
        }
      });
      
      if (currentSection) sections.push(currentSection);
    } else {
      // Handle paragraph format or fallback
      const paragraphs = cleanedText.split('\n\n').filter(p => p.trim());
      
      if (paragraphs.length > 1) {
        paragraphs.forEach((paragraph, index) => {
          const cleanedParagraph = stripMarkdown(paragraph.trim());
          const lowerParagraph = cleanedParagraph.toLowerCase();
          
          let icon = Brain;
          let title = extractTitle(cleanedParagraph, 40);
          
          // Smart icon detection
          for (const [keyword, iconComponent] of Object.entries(sectionIcons)) {
            if (lowerParagraph.includes(keyword)) {
              icon = iconComponent;
              break;
            }
          }
          
          sections.push({
            icon,
            title,
            content: cleanedParagraph.split('\n').filter(line => line.trim())
          });
        });
      } else {
        // Single block - just display cleanly
        sections.push({
          icon: Brain,
          title: 'Analysis Overview',
          content: lines.map(line => stripMarkdown(line))
        });
      }
    }
    
    return sections.length > 0 ? sections : [{ icon: Brain, title: 'Analysis', content: [cleanedText] }];
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
                <div className="space-y-3">
                  {section.content.map((content, contentIndex) => (
                    <p key={contentIndex} className="text-on-surface-variant leading-relaxed text-base">
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
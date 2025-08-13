import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Sparkles, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CommentCardProps {
  comment: string;
  onRequestConversational?: () => void;
  isConversationalVersion?: boolean;
  isGeneratingConversational?: boolean;
}

const CommentCard = ({ 
  comment, 
  onRequestConversational, 
  isConversationalVersion = false,
  isGeneratingConversational = false 
}: CommentCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(comment);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Comment copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl shadow-elevation-3 border-0 bg-gradient-to-br from-primary via-purple-600 to-accent text-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-8 bg-black/10">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl">
              <Copy className="h-6 w-6" />
            </div>
            {isConversationalVersion ? "Your Story-Driven Comment" : "Your Expert Comment"}
          </CardTitle>
          <Button
            onClick={handleCopy}
            variant="outline"
            size="lg"
            className="border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-2xl px-6 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            {copied ? <Check className="h-5 w-5 mr-2" /> : <Copy className="h-5 w-5 mr-2" />}
            {copied ? "Copied!" : "Copy Comment"}
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm relative">
            {isGeneratingConversational && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-3 text-white">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="text-sm">Transforming to story-driven version...</span>
                </div>
              </div>
            )}
            <p className="whitespace-pre-wrap text-white leading-relaxed text-lg font-medium">
              {comment}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
            <span>Ready to paste on {comment && 'your social media platform'}</span>
          </div>
        </CardContent>
      </Card>
      
      {onRequestConversational && !isGeneratingConversational && (
        <Card className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">Want me to also give you a slightly more conversational, story-driven version?</p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={onRequestConversational}
                className="bg-gradient-to-r from-primary to-accent text-white border-0 rounded-2xl px-6 py-3 font-semibold hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Yes, Create Story Version
              </Button>
              
              <Button
                variant="outline"
                disabled
                className="opacity-60 rounded-2xl px-6 py-3"
              >
                No, Thanks
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommentCard;
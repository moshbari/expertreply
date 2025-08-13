import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card";
import { MaterialButton } from "@/components/ui/material-button";
import { Copy, Check, MessageCircle } from "lucide-react";

interface ConversationalCommentCardProps {
  comment: string;
}

export const ConversationalCommentCard = ({ comment }: ConversationalCommentCardProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(comment);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Conversational comment copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try copying manually",
        variant: "destructive",
      });
    }
  };

  return (
    <MaterialCard className="animate-scale-in" variant="elevated">
      <MaterialCardHeader>
        <MaterialCardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-xl">
            <MessageCircle className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Story-Driven Comment</h3>
            <p className="text-sm text-muted-foreground font-normal">More conversational and engaging</p>
          </div>
        </MaterialCardTitle>
      </MaterialCardHeader>
      
      <MaterialCardContent className="space-y-6">
        <div className="prose prose-gray max-w-none">
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 rounded-lg p-6 border border-orange-200/50 dark:border-orange-800/30">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
              {comment}
            </p>
          </div>
        </div>
        
        <MaterialButton
          onClick={handleCopy}
          variant="outlined"
          className="w-full"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Story-Driven Comment
            </>
          )}
        </MaterialButton>
      </MaterialCardContent>
    </MaterialCard>
  );
};
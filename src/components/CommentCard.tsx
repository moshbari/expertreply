import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CommentCardProps {
  comment: string;
}

const CommentCard = ({ comment }: CommentCardProps) => {
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
    <Card className="rounded-3xl shadow-elevation-3 border-0 bg-gradient-to-br from-primary via-purple-600 to-accent text-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-8 bg-black/10">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Copy className="h-6 w-6" />
          </div>
          Your Expert Comment
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
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
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
  );
};

export default CommentCard;
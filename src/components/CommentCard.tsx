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
    <Card className="rounded-2xl shadow-card bg-gradient-primary text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Your Comment</CardTitle>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="border-white/20 bg-white/10 text-white hover:bg-white/20 rounded-xl"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-white/95 leading-relaxed">
          {comment}
        </p>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalysisCardProps {
  analysis: string;
  onWriteComment: () => void;
  isLoading?: boolean;
}

const AnalysisCard = ({ analysis, onWriteComment, isLoading }: AnalysisCardProps) => {
  return (
    <Card className="rounded-2xl shadow-card border">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Post Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-foreground">{analysis}</p>
        </div>
        <div className="pt-4 border-t">
          <p className="text-muted-foreground mb-4">
            Does this align with your understanding? Any changes before I write the comment?
          </p>
          <Button 
            onClick={onWriteComment} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Writing Comment..." : "Write Comment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard;
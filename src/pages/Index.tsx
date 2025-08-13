import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from "@/components/ui/material-card";
import { MaterialTextarea } from "@/components/ui/material-textarea";
import { MaterialButton } from "@/components/ui/material-button";
import { MaterialFab } from "@/components/ui/material-fab";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformSelector from "@/components/PlatformSelector";
import ToneSelector from "@/components/ToneSelector";
import AnalysisCard from "@/components/AnalysisCard";
import CommentCard from "@/components/CommentCard";
import { analyzePost, generateComment } from "@/lib/api";
import { Sparkles, Send } from "lucide-react";

const Index = () => {
  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("reddit");
  const [tone, setTone] = useState("casual");
  const [analysis, setAnalysis] = useState("");
  const [comment, setComment] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!post.trim()) {
      toast({
        title: "Missing Content",
        description: "Please paste a social media post first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzePost({ post: post.trim(), platform, tone });
      setAnalysis(result.analysis);
      toast({
        title: "Analysis Complete",
        description: "Post has been analyzed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWriteComment = async () => {
    setIsWritingComment(true);
    try {
      const result = await generateComment({ analysis, platform, tone });
      setComment(result.comment);
      toast({
        title: "Comment Generated",
        description: "Your expert comment is ready!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed", 
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsWritingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Step 1: Input Section */}
        <MaterialCard className="mb-12" variant="elevated">
          <MaterialCardHeader>
            <MaterialCardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              Create Your Expert Comment
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent className="space-y-8">
            <MaterialTextarea
              label="Paste the original post here"
              placeholder="Copy and paste the social media post you want to respond to..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
              className="min-h-[160px]"
              supportingText="Paste any social media post and we'll analyze it for you"
            />

            <div className="grid lg:grid-cols-2 gap-8">
              <PlatformSelector value={platform} onValueChange={setPlatform} />
              <ToneSelector value={tone} onValueChange={setTone} />
            </div>

            <MaterialButton
              onClick={handleAnalysis}
              loading={isAnalyzing}
              variant="filled"
              size="lg"
              className="w-full"
            >
              <Send className="h-5 w-5" />
              {isAnalyzing ? "Analyzing Post..." : "Start Analysis"}
            </MaterialButton>
          </MaterialCardContent>
        </MaterialCard>

        {/* Step 1 Output: Analysis */}
        {analysis && (
          <div className="mb-12 animate-slide-up">
            <AnalysisCard
              analysis={analysis}
              onWriteComment={handleWriteComment}
              isLoading={isWritingComment}
            />
          </div>
        )}

        {/* Step 2 Output: Comment */}
        {comment && (
          <div className="mb-12 animate-scale-in">
            <CommentCard comment={comment} />
          </div>
        )}

        {/* Floating Action Button */}
        {!analysis && post.trim() && (
          <MaterialFab
            onClick={handleAnalysis}
            loading={isAnalyzing}
            extended
            icon={<Sparkles className="h-5 w-5" />}
          >
            Analyze
          </MaterialFab>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

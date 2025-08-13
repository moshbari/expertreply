import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformSelector from "@/components/PlatformSelector";
import ToneSelector from "@/components/ToneSelector";
import AnalysisCard from "@/components/AnalysisCard";
import CommentCard from "@/components/CommentCard";

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
        title: "Error",
        description: "Please paste a social media post first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // TODO: Implement API call to /api/analysis
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(`**Main Problem:** The poster is struggling with time management and feeling overwhelmed with their workload.

**Emotional State:** Stressed, anxious, and seeking validation that their struggles are normal.

**Type of Help Needed:** Practical strategies and mindset shift to better manage their time and reduce overwhelm.

**Likely Root Cause:** Poor boundary setting and perfectionist tendencies leading to overcommitment.

**Relevant Facts:** 
- Studies show that 76% of professionals report feeling overwhelmed at work (Deloitte, 2023)
- Time-blocking techniques can improve productivity by up to 25% (Harvard Business Review, 2024)

**Suggested Angle:** Share a relatable experience about overcoming similar challenges, then offer 2-3 actionable time management strategies.`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleWriteComment = async () => {
    setIsWritingComment(true);
    try {
      // TODO: Implement API call to /api/comment
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setComment(`I totally get this feeling! I used to be in the exact same boat - constantly saying yes to everything and then drowning in my own commitments. What really turned things around for me was implementing time-blocking (literally scheduling every task like an appointment) and the "two-minute rule" - if something takes less than two minutes, do it immediately rather than adding it to your ever-growing list. According to recent research, professionals who use structured time management see about 25% improvement in productivity. You're not alone in feeling overwhelmed, and small systems like these can make a huge difference. What's one area where you feel you lose the most time right now?`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsWritingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: Input Section */}
        <Card className="rounded-2xl shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Step 1: Analyze the Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="post" className="text-base font-medium">
                Paste the original post here
              </Label>
              <Textarea
                id="post"
                placeholder="Copy and paste the social media post you want to respond to..."
                value={post}
                onChange={(e) => setPost(e.target.value)}
                className="min-h-[200px] rounded-2xl resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <PlatformSelector value={platform} onValueChange={setPlatform} />
              <ToneSelector value={tone} onValueChange={setTone} />
            </div>

            <Button
              onClick={handleAnalysis}
              disabled={isAnalyzing}
              variant="accent"
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Start Analysis"}
            </Button>
          </CardContent>
        </Card>

        {/* Step 1 Output: Analysis */}
        {analysis && (
          <div className="mb-8">
            <AnalysisCard
              analysis={analysis}
              onWriteComment={handleWriteComment}
              isLoading={isWritingComment}
            />
          </div>
        )}

        {/* Step 2 Output: Comment */}
        {comment && (
          <div className="mb-8">
            <CommentCard comment={comment} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;

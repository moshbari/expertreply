import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthProvider";
import { ContactPopup } from "@/components/auth/ContactPopup";
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
import { ConversationalDialog } from "@/components/ConversationalDialog";
import { AnalysisImprovementDialog } from "@/components/AnalysisImprovementDialog";
import { analyzePost, generateComment, generateConversationalComment, improveAnalysis } from "@/lib/api";
import { Sparkles, Send } from "lucide-react";

const Index = () => {
  const [post, setPost] = useState("");
  const [platform, setPlatform] = useState("reddit");
  const [tone, setTone] = useState("casual");
  const [analysis, setAnalysis] = useState("");
  const [comment, setComment] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWritingComment, setIsWritingComment] = useState(false);
  const [isGeneratingConversational, setIsGeneratingConversational] = useState(false);
  const [isConversationalVersion, setIsConversationalVersion] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showConversationalDialog, setShowConversationalDialog] = useState(false);
  const [showAnalysisImprovement, setShowAnalysisImprovement] = useState(false);
  const [isRegeneratingAnalysis, setIsRegeneratingAnalysis] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleAnalysis = async () => {
    if (!post.trim()) {
      toast({
        title: "Missing Content",
        description: "Please paste a social media post first",
        variant: "destructive",
      });
      return;
    }

    // Check if user has access to this feature
    if (!profile || profile.role === 'interested') {
      setShowContactPopup(true);
      return;
    }

    setIsAnalyzing(true);
    setComment(""); // Reset comment when starting new analysis
    setIsConversationalVersion(false); // Reset conversational state
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

  const handleRequestConversational = () => {
    setShowConversationalDialog(true);
  };

  const handleGenerateConversational = async (customInstructions: string) => {
    setIsGeneratingConversational(true);
    setShowConversationalDialog(false);
    
    try {
      const result = await generateConversationalComment({
        originalComment: comment,
        platform,
        tone,
        customInstructions: customInstructions.trim() || undefined
      });
      setComment(result.comment);
      setIsConversationalVersion(true);
      toast({
        title: "Comment Updated",
        description: "Your comment has been transformed into a story-driven version!",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingConversational(false);
    }
  };

  const handleRequestAnalysisImprovement = () => {
    setShowAnalysisImprovement(true);
  };

  const handleRegenerateAnalysis = async (customInstructions: string) => {
    setIsRegeneratingAnalysis(true);
    try {
      const result = await improveAnalysis({
        post,
        currentAnalysis: analysis,
        improvementInstructions: customInstructions,
        platform,
        tone
      });
      setAnalysis(result.analysis);
      setShowAnalysisImprovement(false);
      toast({
        title: "Analysis improved",
        description: "Your analysis has been successfully regenerated with improvements.",
      });
    } catch (error) {
      console.error('Failed to improve analysis:', error);
      toast({
        title: "Error",
        description: "Failed to improve analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingAnalysis(false);
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
              className="w-full bg-gradient-to-r from-primary via-purple-600 to-accent hover:from-primary/90 hover:via-purple-600/90 hover:to-accent/90 shadow-2xl shadow-primary/25 transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <Send className="h-5 w-5" />
                <span>{isAnalyzing ? "Analyzing Post..." : "Start Analysis"}</span>
              </div>
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
              onEditAnalysis={handleRequestAnalysisImprovement}
            />
          </div>
        )}

        {/* Step 2 Output: Comment */}
        {comment && (
          <div className="mb-12 animate-scale-in">
            <CommentCard 
              comment={comment} 
              onRequestConversational={!isConversationalVersion ? handleRequestConversational : undefined}
              isConversationalVersion={isConversationalVersion}
              isGeneratingConversational={isGeneratingConversational}
            />
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
      
      <ContactPopup 
        open={showContactPopup} 
        onClose={() => setShowContactPopup(false)} 
      />
      
      <ConversationalDialog
        open={showConversationalDialog}
        onClose={() => setShowConversationalDialog(false)}
        onGenerate={handleGenerateConversational}
        isLoading={isGeneratingConversational}
        comment={comment}
        platform={platform}
        tone={tone}
      />
      
      <AnalysisImprovementDialog
        open={showAnalysisImprovement}
        onClose={() => setShowAnalysisImprovement(false)}
        onRegenerate={handleRegenerateAnalysis}
        isLoading={isRegeneratingAnalysis}
        analysis={analysis}
        platform={platform}
        tone={tone}
      />
    </div>
  );
};

export default Index;

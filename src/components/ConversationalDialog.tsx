import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MaterialTextarea } from "@/components/ui/material-textarea";
import { MaterialButton } from "@/components/ui/material-button";
import { Sparkles, X, Lightbulb, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateSuggestions } from "@/lib/api";

interface ConversationalDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (customInstructions: string) => void;
  isLoading: boolean;
  comment: string;
  platform: string;
  tone: string;
}

export const ConversationalDialog = ({ 
  open, 
  onClose, 
  onGenerate, 
  isLoading,
  comment,
  platform,
  tone
}: ConversationalDialogProps) => {
  const [customInstructions, setCustomInstructions] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (open && comment) {
      loadSuggestions();
    }
  }, [open, comment]);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const result = await generateSuggestions({
        comment,
        platform,
        tone
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
      // Fallback suggestions
      setSuggestions([
        "Add a personal story",
        "Include specific examples", 
        "Make it more casual"
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (selectedSuggestions.includes(suggestion)) {
      setSelectedSuggestions(prev => prev.filter(s => s !== suggestion));
      setCustomInstructions(prev => 
        prev.replace(new RegExp(`${suggestion}[,\\s]*`, 'g'), '').trim()
      );
    } else {
      setSelectedSuggestions(prev => [...prev, suggestion]);
      setCustomInstructions(prev => 
        prev ? `${prev}, ${suggestion}` : suggestion
      );
    }
  };

  const handleGenerate = () => {
    onGenerate(customInstructions);
    setCustomInstructions("");
    setSelectedSuggestions([]);
  };

  const handleClose = () => {
    setCustomInstructions("");
    setSelectedSuggestions([]);
    setSuggestions([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Create Story-Driven Version
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* AI Suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI Suggestions</span>
              {loadingSuggestions && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>
            
            {loadingSuggestions ? (
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-7 w-24 bg-muted animate-pulse rounded-full" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant={selectedSuggestions.includes(suggestion) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <MaterialTextarea
            label="Do you have anything specific in mind?"
            placeholder="e.g., Include a personal story, add humor, mention specific examples..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="min-h-[120px]"
            supportingText="Optional: Add any specific instructions for the conversational version"
          />
          
          <div className="flex gap-3 justify-end">
            <MaterialButton
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </MaterialButton>
            
            <MaterialButton
              variant="filled"
              onClick={handleGenerate}
              loading={isLoading}
              className="bg-gradient-to-r from-primary to-accent"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </MaterialButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
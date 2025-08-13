import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MaterialTextarea } from "@/components/ui/material-textarea";
import { MaterialButton } from "@/components/ui/material-button";
import { Sparkles, X } from "lucide-react";

interface ConversationalDialogProps {
  open: boolean;
  onClose: () => void;
  onGenerate: (customInstructions: string) => void;
  isLoading: boolean;
}

export const ConversationalDialog = ({ 
  open, 
  onClose, 
  onGenerate, 
  isLoading 
}: ConversationalDialogProps) => {
  const [customInstructions, setCustomInstructions] = useState("");

  const handleGenerate = () => {
    onGenerate(customInstructions);
    setCustomInstructions("");
  };

  const handleClose = () => {
    setCustomInstructions("");
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
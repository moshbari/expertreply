import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MaterialButton } from '@/components/ui/material-button';
import { MaterialCard } from '@/components/ui/material-card';
import { Crown, Instagram, ExternalLink, Sparkles } from 'lucide-react';

interface ContactPopupProps {
  open: boolean;
  onClose: () => void;
}

export const ContactPopup: React.FC<ContactPopupProps> = ({ open, onClose }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleContactClick = () => {
    window.open('https://www.instagram.com/askmoshbari/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <MaterialCard variant="elevated" className="border-none shadow-none">
          <DialogHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-r from-primary to-accent rounded-full">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Premium Feature
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              This feature is exclusively available for verified users
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Upgrade Required</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-lg mb-2 text-center">Get Full Access</h3>
              <p className="text-muted-foreground text-center text-sm mb-4">
                Contact us to upgrade your account and unlock all premium features including AI-powered analysis and comment generation.
              </p>
              
              <MaterialButton
                onClick={handleContactClick}
                variant="filled"
                size="lg"
                className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white shadow-elevation-3 transform hover:scale-105 transition-all duration-300"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white/20 rounded-full transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`}>
                    <Instagram className="h-5 w-5" />
                  </div>
                  <span className="font-semibold">Contact on Instagram</span>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </MaterialButton>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Already have access? Try logging out and back in.
              </p>
            </div>
          </div>
        </MaterialCard>
      </DialogContent>
    </Dialog>
  );
};
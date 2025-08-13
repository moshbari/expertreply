import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { MaterialButton } from '@/components/ui/material-button';
import { Crown, Instagram, ExternalLink, X, Sparkles } from 'lucide-react';

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
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white rounded-3xl border-0 shadow-elevation-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Header with Crown Icon */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Premium Feature
          </h2>
          <p className="text-gray-600 text-center leading-relaxed">
            This feature is exclusively available for verified users
          </p>
        </div>

        {/* Upgrade Required Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-medium">Upgrade Required</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 pb-8">
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-3 text-center">
              Get Full Access
            </h3>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Contact us to upgrade your account and unlock all premium features including AI-powered analysis and comment generation.
            </p>
          </div>
          
          {/* Instagram Contact Button */}
          <MaterialButton
            onClick={handleContactClick}
            variant="filled"
            size="lg"
            className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white shadow-lg border-0 rounded-2xl h-14 font-semibold text-base transform hover:scale-[1.02] transition-all duration-300"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-white/20 rounded-lg transition-transform duration-300 ${isHovering ? 'rotate-12' : ''}`}>
                <Instagram className="h-5 w-5" />
              </div>
              <span>Contact on Instagram</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          </MaterialButton>

          {/* Footer Text */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Already have access? Try logging out and back in.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
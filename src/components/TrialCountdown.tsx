import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrialCountdown = () => {
  const { user } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);

  useEffect(() => {
    const fetchTrialInfo = async () => {
      if (!user) return;

      try {
        // Fetch profile data directly from profiles table with proper typing
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role, trial_ends_at')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        // Type the response properly since we know the actual structure
        const profile = profileData as any;
        
        if (profile && profile.role === 'TRIAL' && profile.trial_ends_at) {
          // Check if trial is still active
          const endDate = new Date(profile.trial_ends_at);
          const now = new Date();
          
          if (endDate > now) {
            setIsTrialActive(true);
            const diffTime = endDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysRemaining(Math.max(0, diffDays));
          }
        }
      } catch (error) {
        console.error('Error in fetchTrialInfo:', error);
      }
    };

    fetchTrialInfo();
  }, [user]);

  // Only show for active trial users
  if (!user || !isTrialActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-200" />
              <span className="font-semibold">Free Trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {daysRemaining > 0 ? (
                  <>
                    <span className="font-bold text-lg">{daysRemaining}</span> day{daysRemaining !== 1 ? 's' : ''} remaining
                  </>
                ) : (
                  <span className="font-bold text-red-200">Trial expired</span>
                )}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4" />
              <span>Upgrade to unlock unlimited access</span>
            </div>
            <Link
              to="/account"
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialCountdown;
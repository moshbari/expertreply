import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth/login', { 
            replace: true,
            state: { message: 'Authentication failed. Please try again.' }
          });
          return;
        }

        if (data.session) {
          // Check if this is a password reset
          const type = searchParams.get('type');
          if (type === 'recovery') {
            navigate('/auth/reset-password', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } else {
          navigate('/auth/login', { replace: true });
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        navigate('/auth/login', { 
          replace: true,
          state: { message: 'An unexpected error occurred. Please try again.' }
        });
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
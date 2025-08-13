import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { MaterialInput } from '@/components/ui/material-input';
import { MaterialButton } from '@/components/ui/material-button';
import { Eye, EyeOff, Lock, Key } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      navigate('/auth/login', { 
        replace: true,
        state: { message: 'Invalid reset link. Please try again.' }
      });
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    setLoading(true);
    
    const { error } = await updatePassword(password);
    
    if (!error) {
      navigate('/auth/login', {
        replace: true,
        state: { message: 'Password updated successfully! Please sign in with your new password.' }
      });
    }
    
    setLoading(false);
  };

  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Set New Password
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose a strong password for your account
          </p>
        </div>

        <MaterialCard variant="elevated" className="shadow-elevation-3">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-center flex items-center justify-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Reset Password
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <MaterialInput
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  supportingText={!isPasswordValid && password ? "Password must be at least 6 characters" : undefined}
                  error={!isPasswordValid && password.length > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="relative">
                <MaterialInput
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  supportingText={!doPasswordsMatch && confirmPassword ? "Passwords do not match" : undefined}
                  error={!doPasswordsMatch && confirmPassword.length > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-8 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <MaterialButton
                type="submit"
                loading={loading}
                variant="filled"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={!isPasswordValid || !doPasswordsMatch}
              >
                Update Password
              </MaterialButton>
            </form>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    </div>
  );
};

export default ResetPassword;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { MaterialInput } from '@/components/ui/material-input';
import { MaterialButton } from '@/components/ui/material-button';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await resetPassword(email);
    
    if (!error) {
      setSent(true);
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <MaterialCard variant="elevated" className="shadow-elevation-3 text-center">
            <MaterialCardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Email Sent!</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/auth/login')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
                <Button
                  onClick={() => setSent(false)}
                  variant="ghost"
                  size="sm"
                >
                  Try different email
                </Button>
              </div>
            </MaterialCardContent>
          </MaterialCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/login')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-muted-foreground mt-2">
            Enter your email to receive a password reset link
          </p>
        </div>

        <MaterialCard variant="elevated" className="shadow-elevation-3">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-center flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Forgot Password
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <MaterialInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                icon={<Mail className="h-4 w-4" />}
                supportingText="We'll send you a secure link to reset your password"
              />

              <MaterialButton
                type="submit"
                loading={loading}
                variant="filled"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                disabled={!email}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Reset Link
              </MaterialButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link
                  to="/auth/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
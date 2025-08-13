import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { MaterialInput } from '@/components/ui/material-input';
import { MaterialButton } from '@/components/ui/material-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, UserPlus, Mail, Lock, ArrowLeft, Shield } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return;
    }
    
    if (password.length < 6) {
      return;
    }
    
    setLoading(true);
    
    const { error } = await signUp(email, password);
    
    if (!error) {
      navigate('/auth/login', { 
        state: { message: 'Account created! Please check your email to verify your account.' }
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join Elite CommentCraft and start crafting expert comments
          </p>
        </div>

        <MaterialCard variant="elevated" className="shadow-elevation-3">
          <MaterialCardHeader>
            <MaterialCardTitle className="text-center flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Sign Up
            </MaterialCardTitle>
          </MaterialCardHeader>
          <MaterialCardContent>
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-700 text-sm">
                <Shield className="h-4 w-4" />
                <span className="font-medium">New accounts start as "Interested"</span>
              </div>
              <p className="text-amber-600 text-xs mt-1">
                Contact us to upgrade to full access
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <MaterialInput
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                icon={<Mail className="h-4 w-4" />}
              />

              <div className="relative">
                <MaterialInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  icon={<Lock className="h-4 w-4" />}
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
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  icon={<Lock className="h-4 w-4" />}
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
                disabled={!isPasswordValid || !doPasswordsMatch || !email}
              >
                Create Account
              </MaterialButton>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/auth/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    </div>
  );
};

export default Register;
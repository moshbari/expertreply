import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { MaterialInput } from '@/components/ui/material-input';
import { MaterialButton } from '@/components/ui/material-button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, Key, Calendar, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { RequireAuth } from '@/components/auth/RequireAuth';

const Account = () => {
  const { profile, updatePassword, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return;
    }
    
    if (newPassword.length < 6) {
      return;
    }
    
    setLoading(true);
    
    const { error } = await updatePassword(newPassword);
    
    if (!error) {
      setNewPassword('');
      setConfirmPassword('');
    }
    
    setLoading(false);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'user':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Full administrative access to all features and user management';
      case 'user':
        return 'Full access to all analysis and comment generation features';
      case 'interested':
        return 'Limited access - contact us to upgrade for full features';
      default:
        return 'Unknown role';
    }
  };

  const isPasswordValid = newPassword.length >= 6;
  const doPasswordsMatch = newPassword === confirmPassword;

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account information and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Information */}
            <MaterialCard variant="elevated">
              <MaterialCardHeader>
                <MaterialCardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Information
                </MaterialCardTitle>
              </MaterialCardHeader>
              <MaterialCardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(profile?.role || '')}>
                          {profile?.role?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getRoleDescription(profile?.role || '')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {profile?.created_at && format(new Date(profile.created_at), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </MaterialCardContent>
            </MaterialCard>

            {/* Password Change */}
            <MaterialCard variant="elevated">
              <MaterialCardHeader>
                <MaterialCardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Change Password
                </MaterialCardTitle>
              </MaterialCardHeader>
              <MaterialCardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="relative">
                    <MaterialInput
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      supportingText={!isPasswordValid && newPassword ? "Password must be at least 6 characters" : undefined}
                      error={!isPasswordValid && newPassword.length > 0}
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
                      placeholder="Confirm new password"
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
                    disabled={!isPasswordValid || !doPasswordsMatch || !newPassword}
                  >
                    Update Password
                  </MaterialButton>
                </form>
              </MaterialCardContent>
            </MaterialCard>

            {/* Account Actions */}
            <MaterialCard variant="outlined">
              <MaterialCardContent className="pt-6">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Account Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your account settings and access
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <MaterialButton
                    onClick={signOut}
                    variant="outlined"
                    className="self-start"
                  >
                    Sign Out
                  </MaterialButton>
                </div>
              </MaterialCardContent>
            </MaterialCard>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default Account;
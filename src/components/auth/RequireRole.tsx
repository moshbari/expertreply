import { useAuth } from '@/contexts/AuthProvider';
import { MaterialCard, MaterialCardContent } from '@/components/ui/material-card';
import { Shield, AlertTriangle } from 'lucide-react';

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'user' | 'interested'>;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <MaterialCard className="max-w-md mx-auto text-center">
          <MaterialCardContent className="p-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-destructive/10 rounded-full">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span>Required role: {allowedRoles.join(' or ')}</span>
            </div>
          </MaterialCardContent>
        </MaterialCard>
      </div>
    );
  }

  return <>{children}</>;
};
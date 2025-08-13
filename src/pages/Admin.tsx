import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { MaterialCard, MaterialCardContent, MaterialCardHeader, MaterialCardTitle } from '@/components/ui/material-card';
import { MaterialInput } from '@/components/ui/material-input';
import { MaterialButton } from '@/components/ui/material-button';
import { Badge } from '@/components/ui/badge';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireRole } from '@/components/auth/RequireRole';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, Shield, Crown, User, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'interested';
  created_at: string;
}

const Admin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Failed to load users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user' | 'interested') => {
    setUpdatingUsers(prev => new Set(prev).add(userId));
    
    try {
      const { error } = await supabase.rpc('admin_set_role', {
        _user_id: userId,
        _new_role: newRole
      });

      if (error) throw error;

      // Update local state optimistically
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'user':
        return <User className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    user: users.filter(u => u.role === 'user').length,
    interested: users.filter(u => u.role === 'interested').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <RequireRole allowedRoles={['admin']}>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage users and their access levels
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <MaterialCard variant="elevated">
                <MaterialCardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Crown className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{roleStats.admin}</p>
                      <p className="text-sm text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </MaterialCardContent>
              </MaterialCard>

              <MaterialCard variant="elevated">
                <MaterialCardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{roleStats.user}</p>
                      <p className="text-sm text-muted-foreground">Users</p>
                    </div>
                  </div>
                </MaterialCardContent>
              </MaterialCard>

              <MaterialCard variant="elevated">
                <MaterialCardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{roleStats.interested}</p>
                      <p className="text-sm text-muted-foreground">Interested</p>
                    </div>
                  </div>
                </MaterialCardContent>
              </MaterialCard>
            </div>

            {/* User Management */}
            <MaterialCard variant="elevated">
              <MaterialCardHeader>
                <MaterialCardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </MaterialCardTitle>
              </MaterialCardHeader>
              <MaterialCardContent>
                <div className="space-y-6">
                  {/* Search */}
                  <MaterialInput
                    label="Search Users"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {/* Users Table */}
                  <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border border-outline rounded-xl hover:bg-surface-variant/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="font-medium">{user.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                                </p>
                              </div>
                              <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1">
                                {getRoleIcon(user.role)}
                                {user.role.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <MaterialButton
                                variant="outlined"
                                size="sm"
                                disabled={updatingUsers.has(user.id)}
                                loading={updatingUsers.has(user.id)}
                              >
                                Change Role
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </MaterialButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => updateUserRole(user.id, 'interested')}
                                disabled={user.role === 'interested'}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Interested
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateUserRole(user.id, 'user')}
                                disabled={user.role === 'user'}
                              >
                                <User className="h-4 w-4 mr-2" />
                                User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateUserRole(user.id, 'admin')}
                                disabled={user.role === 'admin'}
                              >
                                <Crown className="h-4 w-4 mr-2" />
                                Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </MaterialCardContent>
            </MaterialCard>
          </div>
        </div>
      </RequireRole>
    </RequireAuth>
  );
};

export default Admin;
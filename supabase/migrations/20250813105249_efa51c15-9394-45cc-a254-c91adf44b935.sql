-- ============================================================================
-- EliteCommentCraft Database Schema
-- Complete schema with authentication, roles, and audit logging
-- ============================================================================

-- Create enum for user roles
CREATE TYPE ec_user_role AS ENUM ('admin', 'user', 'interested');

-- Create enum for analysis platforms
CREATE TYPE ec_platform AS ENUM ('reddit', 'linkedin', 'facebook', 'twitter');

-- Create enum for comment tones
CREATE TYPE ec_tone AS ENUM ('casual', 'professional', 'friendly', 'empathetic', 'storytelling');

-- ============================================================================
-- TABLES
-- ============================================================================

-- User profiles table
CREATE TABLE ec_user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role ec_user_role NOT NULL DEFAULT 'interested',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    display_name TEXT,
    UNIQUE(email)
);

-- Analysis requests table
CREATE TABLE ec_analysis_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES ec_user_profiles(id) ON DELETE CASCADE,
    original_post TEXT NOT NULL,
    platform ec_platform NOT NULL,
    tone ec_tone NOT NULL,
    analysis_result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'error'))
);

-- Comment generations table
CREATE TABLE ec_comment_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_request_id UUID NOT NULL REFERENCES ec_analysis_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES ec_user_profiles(id) ON DELETE CASCADE,
    generated_comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT
);

-- Role changes audit log
CREATE TABLE ec_role_changes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_user_id UUID NOT NULL REFERENCES ec_user_profiles(id) ON DELETE CASCADE,
    changed_by_user_id UUID NOT NULL REFERENCES ec_user_profiles(id) ON DELETE CASCADE,
    old_role ec_user_role NOT NULL,
    new_role ec_user_role NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User sessions for analytics (optional but useful)
CREATE TABLE ec_user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES ec_user_profiles(id) ON DELETE CASCADE,
    session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    ip_address INET,
    user_agent TEXT
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_ec_analysis_requests_user_id ON ec_analysis_requests(user_id);
CREATE INDEX idx_ec_analysis_requests_created_at ON ec_analysis_requests(created_at DESC);
CREATE INDEX idx_ec_analysis_requests_platform ON ec_analysis_requests(platform);

CREATE INDEX idx_ec_comment_generations_user_id ON ec_comment_generations(user_id);
CREATE INDEX idx_ec_comment_generations_request_id ON ec_comment_generations(analysis_request_id);

CREATE INDEX idx_ec_role_changes_target_user ON ec_role_changes(target_user_id);
CREATE INDEX idx_ec_role_changes_changed_by ON ec_role_changes(changed_by_user_id);
CREATE INDEX idx_ec_role_changes_created_at ON ec_role_changes(created_at DESC);

CREATE INDEX idx_ec_user_sessions_user_id ON ec_user_sessions(user_id);
CREATE INDEX idx_ec_user_sessions_start ON ec_user_sessions(session_start DESC);

-- ============================================================================
-- BASIC FUNCTIONS (No table dependencies)
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION ec_update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION ec_is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.ec_user_profiles 
        WHERE id = _user_id AND role = 'admin'
    );
$$;

-- Security definer function to check if user has access (user or admin)
CREATE OR REPLACE FUNCTION ec_is_user_or_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.ec_user_profiles 
        WHERE id = _user_id AND role IN ('user', 'admin')
    );
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION ec_handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.ec_user_profiles (id, email, display_name)
    VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Function to update user's last login time
CREATE OR REPLACE FUNCTION ec_update_last_login(_user_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
SET search_path = ''
AS $$
    UPDATE ec_user_profiles 
    SET last_login_at = NOW(), updated_at = NOW() 
    WHERE id = _user_id;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for updated_at on profiles
CREATE TRIGGER ec_user_profiles_updated_at
    BEFORE UPDATE ON ec_user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION ec_update_updated_at_column();

-- Trigger for updated_at on analysis requests
CREATE TRIGGER ec_analysis_requests_updated_at
    BEFORE UPDATE ON ec_analysis_requests
    FOR EACH ROW
    EXECUTE FUNCTION ec_update_updated_at_column();

-- Trigger to auto-create user profile on signup
CREATE TRIGGER ec_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ec_handle_new_user();

-- ============================================================================
-- COMPLEX FUNCTIONS (With table dependencies) - Must come after tables
-- ============================================================================

-- Admin function to set user role
CREATE OR REPLACE FUNCTION ec_admin_set_role(_target_user_id UUID, _new_role ec_user_role, _reason TEXT DEFAULT NULL)
RETURNS RECORD
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    updated_profile RECORD;
    old_role ec_user_role;
    admin_user_id UUID := auth.uid();
BEGIN
    -- Check if the requesting user is an admin
    IF NOT ec_is_admin(admin_user_id) THEN
        RAISE EXCEPTION 'Access denied. Admin role required.' USING ERRCODE = '42501';
    END IF;

    -- Get the current role
    SELECT role INTO old_role FROM ec_user_profiles WHERE id = _target_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User profile not found.' USING ERRCODE = 'P0002';
    END IF;

    -- Prevent self-demotion from admin (optional safety check)
    IF admin_user_id = _target_user_id AND old_role = 'admin' AND _new_role != 'admin' THEN
        RAISE EXCEPTION 'Cannot demote yourself from admin role.' USING ERRCODE = '42501';
    END IF;

    -- Update the user role
    UPDATE ec_user_profiles 
    SET role = _new_role, updated_at = NOW()
    WHERE id = _target_user_id
    RETURNING * INTO updated_profile;

    -- Log the role change
    INSERT INTO ec_role_changes (target_user_id, changed_by_user_id, old_role, new_role, reason)
    VALUES (_target_user_id, admin_user_id, old_role, _new_role, _reason);

    RETURN updated_profile;
END;
$$;

-- Bootstrap function to create first admin
CREATE OR REPLACE FUNCTION ec_bootstrap_admin(_admin_email TEXT)
RETURNS RECORD
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    updated_profile RECORD;
BEGIN
    UPDATE ec_user_profiles 
    SET role = 'admin', updated_at = NOW()
    WHERE email = _admin_email
    RETURNING * INTO updated_profile;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found. User must sign up first.', _admin_email USING ERRCODE = 'P0002';
    END IF;

    -- Log the bootstrap action
    INSERT INTO ec_role_changes (target_user_id, changed_by_user_id, old_role, new_role, reason)
    VALUES (updated_profile.id, updated_profile.id, 'interested', 'admin', 'Bootstrap admin');

    RETURN updated_profile;
END;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE ec_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_analysis_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_comment_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_role_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_user_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for ec_user_profiles
CREATE POLICY "Users can view their own profile"
    ON ec_user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON ec_user_profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM ec_user_profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can view all profiles"
    ON ec_user_profiles FOR SELECT
    USING (ec_is_admin(auth.uid()));

CREATE POLICY "Admins can update any profile"
    ON ec_user_profiles FOR UPDATE
    USING (ec_is_admin(auth.uid()));

CREATE POLICY "System can insert profiles"
    ON ec_user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policies for ec_analysis_requests
CREATE POLICY "Users can view their own analysis requests"
    ON ec_analysis_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis requests"
    ON ec_analysis_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id AND ec_is_user_or_admin(auth.uid()));

CREATE POLICY "Users can update their own analysis requests"
    ON ec_analysis_requests FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analysis requests"
    ON ec_analysis_requests FOR SELECT
    USING (ec_is_admin(auth.uid()));

-- Policies for ec_comment_generations
CREATE POLICY "Users can view their own comment generations"
    ON ec_comment_generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comment generations"
    ON ec_comment_generations FOR INSERT
    WITH CHECK (auth.uid() = user_id AND ec_is_user_or_admin(auth.uid()));

CREATE POLICY "Users can update their own comment generations"
    ON ec_comment_generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all comment generations"
    ON ec_comment_generations FOR SELECT
    USING (ec_is_admin(auth.uid()));

-- Policies for ec_role_changes (admin-only access)
CREATE POLICY "Admins can view all role changes"
    ON ec_role_changes FOR SELECT
    USING (ec_is_admin(auth.uid()));

CREATE POLICY "Admins can insert role changes"
    ON ec_role_changes FOR INSERT
    WITH CHECK (ec_is_admin(auth.uid()));

-- Policies for ec_user_sessions
CREATE POLICY "Users can view their own sessions"
    ON ec_user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
    ON ec_user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
    ON ec_user_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
    ON ec_user_sessions FOR SELECT
    USING (ec_is_admin(auth.uid()));

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE ec_user_profiles IS 'User profiles for EliteCommentCraft app with role-based access control';
COMMENT ON TABLE ec_analysis_requests IS 'Social media post analysis requests with platform and tone preferences';
COMMENT ON TABLE ec_comment_generations IS 'Generated comments based on analysis requests with user feedback';
COMMENT ON TABLE ec_role_changes IS 'Audit log for tracking user role changes by admins';
COMMENT ON TABLE ec_user_sessions IS 'User session tracking for analytics and admin insights';

COMMENT ON FUNCTION ec_is_admin(UUID) IS 'Security definer function to check if user has admin role';
COMMENT ON FUNCTION ec_is_user_or_admin(UUID) IS 'Security definer function to check if user has access to app features';
COMMENT ON FUNCTION ec_admin_set_role(UUID, ec_user_role, TEXT) IS 'Admin function to change user roles with audit logging';
COMMENT ON FUNCTION ec_bootstrap_admin(TEXT) IS 'Bootstrap function to promote first admin by email';
COMMENT ON FUNCTION ec_handle_new_user() IS 'Trigger function to auto-create user profile on signup';
-- Create custom types/enums
CREATE TYPE public.user_type AS ENUM ('buyer', 'owner', 'investor', 'legal_professional', 'government_official');
CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE public.property_type AS ENUM ('agricultural_land', 'vacant_plot', 'independent_house', 'apartment', 'commercial', 'industrial');
CREATE TYPE public.size_unit AS ENUM ('sq_ft', 'sq_m', 'acre', 'hectare');
CREATE TYPE public.construction_status AS ENUM ('under_construction', 'completed', 'dilapidated', 'partially_built');
CREATE TYPE public.ownership_type AS ENUM ('freehold', 'leasehold', 'power_of_attorney', 'agreement_to_sell');
CREATE TYPE public.risk_level AS ENUM ('very_low', 'low', 'medium', 'high', 'critical');
CREATE TYPE public.project_type AS ENUM ('highway', 'metro', 'railway', 'airport', 'industrial', 'smart_city', 'port', 'power_plant');
CREATE TYPE public.project_phase AS ENUM ('proposed', 'feasibility_study', 'dpr_preparation', 'approved', 'land_notification', 'tender_floated', 'construction_started', 'ongoing', 'completed');
CREATE TYPE public.area_type AS ENUM ('state', 'district', 'city', 'zone', 'locality', 'sub_locality', 'village', 'town');
CREATE TYPE public.alert_type AS ENUM ('new_project', 'project_update', 'risk_change', 'deadline', 'public_hearing');
CREATE TYPE public.notification_channel AS ENUM ('email', 'sms', 'push', 'whatsapp');
CREATE TYPE public.alert_frequency AS ENUM ('real_time', 'daily_digest', 'weekly_summary');
CREATE TYPE public.risk_threshold AS ENUM ('critical_only', 'high_above', 'medium_above', 'all');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  user_type public.user_type DEFAULT 'buyer',
  subscription_tier public.subscription_tier DEFAULT 'free',
  subscription_end_date TIMESTAMPTZ,
  last_active TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create area_database table
CREATE TABLE public.area_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_name TEXT NOT NULL,
  area_type public.area_type NOT NULL,
  parent_area_id UUID REFERENCES public.area_database(id),
  state_code TEXT,
  district_code TEXT,
  pincode TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  boundary_geojson JSONB,
  population INTEGER,
  area_sq_km NUMERIC,
  avg_property_rate_per_sqft NUMERIC,
  risk_index NUMERIC,
  project_density NUMERIC,
  last_census_year INTEGER,
  data_source TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create infrastructure_projects table
CREATE TABLE public.infrastructure_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL,
  project_code TEXT UNIQUE,
  project_type public.project_type NOT NULL,
  implementing_agency TEXT,
  state TEXT NOT NULL,
  districts_covered TEXT[] DEFAULT '{}',
  cities_affected TEXT[] DEFAULT '{}',
  localities_affected TEXT[] DEFAULT '{}',
  project_phase public.project_phase DEFAULT 'proposed',
  alignment_geojson JSONB,
  buffer_distance_meters INTEGER DEFAULT 500,
  total_length_km NUMERIC,
  total_area_hectares NUMERIC,
  notification_date DATE,
  expected_start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  budget_crores NUMERIC,
  land_required_hectares NUMERIC,
  compensation_rate_per_sqm NUMERIC,
  official_gazette_url TEXT,
  tender_document_url TEXT,
  dpr_url TEXT,
  contact_officer_name TEXT,
  contact_officer_email TEXT,
  contact_officer_phone TEXT,
  is_active BOOLEAN DEFAULT true,
  data_source TEXT,
  last_updated_from_source TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create property_assessments table
CREATE TABLE public.property_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  city TEXT,
  locality TEXT,
  sub_locality TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  property_type public.property_type NOT NULL,
  property_size NUMERIC,
  size_unit public.size_unit DEFAULT 'sq_ft',
  construction_status public.construction_status,
  ownership_type public.ownership_type,
  risk_score NUMERIC,
  risk_level public.risk_level,
  risk_breakdown JSONB DEFAULT '{}',
  nearby_projects JSONB DEFAULT '[]',
  compensation_estimate JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create project_updates table
CREATE TABLE public.project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.infrastructure_projects(id) ON DELETE CASCADE NOT NULL,
  update_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  official_document_url TEXT,
  effective_date DATE,
  published_date DATE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create alerts_subscriptions table
CREATE TABLE public.alerts_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type public.alert_type NOT NULL,
  state TEXT,
  city TEXT,
  locality TEXT,
  notification_channels JSONB DEFAULT '["email"]',
  frequency public.alert_frequency DEFAULT 'daily_digest',
  risk_threshold public.risk_threshold DEFAULT 'high_above',
  is_active BOOLEAN DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infrastructure_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts_subscriptions ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for area_database (public read)
CREATE POLICY "Anyone can view areas" ON public.area_database FOR SELECT TO authenticated USING (is_active = true);

-- RLS Policies for infrastructure_projects (public read)
CREATE POLICY "Anyone can view active projects" ON public.infrastructure_projects FOR SELECT TO authenticated USING (is_active = true);

-- RLS Policies for property_assessments
CREATE POLICY "Users can view their own assessments" ON public.property_assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own assessments" ON public.property_assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own assessments" ON public.property_assessments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own assessments" ON public.property_assessments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for project_updates (public read)
CREATE POLICY "Anyone can view public updates" ON public.project_updates FOR SELECT TO authenticated USING (is_public = true);

-- RLS Policies for alerts_subscriptions
CREATE POLICY "Users can view their own alerts" ON public.alerts_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON public.alerts_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts_subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_area_database_updated_at BEFORE UPDATE ON public.area_database FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_infrastructure_projects_updated_at BEFORE UPDATE ON public.infrastructure_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_property_assessments_updated_at BEFORE UPDATE ON public.property_assessments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_project_updates_updated_at BEFORE UPDATE ON public.project_updates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alerts_subscriptions_updated_at BEFORE UPDATE ON public.alerts_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_property_assessments_user_id ON public.property_assessments(user_id);
CREATE INDEX idx_property_assessments_risk_level ON public.property_assessments(risk_level);
CREATE INDEX idx_property_assessments_state ON public.property_assessments(state);
CREATE INDEX idx_infrastructure_projects_state ON public.infrastructure_projects(state);
CREATE INDEX idx_infrastructure_projects_project_type ON public.infrastructure_projects(project_type);
CREATE INDEX idx_infrastructure_projects_project_phase ON public.infrastructure_projects(project_phase);
CREATE INDEX idx_area_database_area_type ON public.area_database(area_type);
CREATE INDEX idx_area_database_parent ON public.area_database(parent_area_id);
CREATE INDEX idx_alerts_subscriptions_user_id ON public.alerts_subscriptions(user_id);
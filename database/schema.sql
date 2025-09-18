-- Jobbcentralen MVP Database Schema
-- Simplified version for core functionality testing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for CVs (simplified)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('cv', 'cover_letter')),
    storage_path TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    text_extract TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table (simplified)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    salary_range TEXT,
    description TEXT NOT NULL,
    jd_text TEXT, -- Full job description text for matching
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table to store user-job matches (simplified)
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    reasons TEXT[], -- Array of matching keywords/reasons
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_owner_id ON public.documents(owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_kind ON public.documents(kind);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON public.matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_job_id ON public.matches(job_id);
CREATE INDEX IF NOT EXISTS idx_matches_score ON public.matches(score);

-- Create Row Level Security (RLS) policies

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own documents" ON public.documents
    FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own documents" ON public.documents
    FOR DELETE USING (auth.uid() = owner_id);

-- Jobs policies (public read)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON public.jobs
    FOR SELECT USING (is_active = true);

-- Matches policies
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own matches" ON public.matches
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert matches" ON public.matches
    FOR INSERT WITH CHECK (true); -- Allow system to create matches
CREATE POLICY "System can update matches" ON public.matches
    FOR UPDATE USING (true); -- Allow system to update matches

-- Functions

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert sample jobs for testing
INSERT INTO public.jobs (title, company, location, salary_range, description, jd_text) VALUES 
(
    'Frontend Developer',
    'TechCorp Stockholm',
    'Stockholm, Sweden',
    '450,000 - 550,000 SEK',
    'Vi söker en Frontend Developer som vill utveckla moderna webbapplikationer med React och TypeScript. Du kommer arbeta i ett agilt team och bygga användarvänliga gränsnitt.',
    'Frontend Developer React TypeScript JavaScript HTML CSS Stockholm agile team user interface development modern web applications'
),
(
    'Full Stack Developer',
    'StartupAB',
    'Göteborg, Sweden', 
    '400,000 - 500,000 SEK',
    'Full Stack Developer position focusing on Node.js backend and React frontend. You will work with modern technologies and help build our SaaS platform.',
    'Full Stack Developer Node.js React JavaScript TypeScript PostgreSQL API development SaaS platform modern technologies'
),
(
    'UX Designer',
    'Design Studio',
    'Malmö, Sweden',
    '380,000 - 480,000 SEK',
    'UX Designer som ska designa användarvänliga digitala produkter. Arbeta med användarforskning, wireframes och prototyper.',
    'UX Designer user experience design research wireframes prototypes Figma digital products user interface'
),
(
    'Backend Developer',
    'CloudTech',
    'Stockholm, Sweden',
    '500,000 - 600,000 SEK',
    'Backend Developer with experience in Python and cloud technologies. Work with microservices, APIs, and scalable architectures.',
    'Backend Developer Python Django Flask cloud technologies microservices REST API PostgreSQL Docker Kubernetes scalable architecture'
),
(
    'Data Analyst',
    'DataCorp',
    'Remote, Sweden',
    '420,000 - 520,000 SEK',
    'Data Analyst för att analysera stora datamängder och skapa insikter. Erfarenhet av SQL, Python och datavisualisering krävs.',
    'Data Analyst SQL Python data analysis visualization business intelligence reporting statistics Excel Power BI'
);

-- Note: You'll need to create the storage buckets manually in Supabase dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Create a new bucket called 'cv' (make it private)
-- 3. Set up the following policies for the 'cv' bucket:

/*
-- Storage policies for CV bucket (run these after creating the bucket)
CREATE POLICY "Users can upload their own CVs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can view their own CVs" ON storage.objects
FOR SELECT USING (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can update their own CVs" ON storage.objects
FOR UPDATE USING (bucket_id = 'cv' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own CVs" ON storage.objects
FOR DELETE USING (bucket_id = 'cv' AND auth.uid() = owner);
*/

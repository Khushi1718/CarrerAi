-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_assessments table to store AI assessment data
CREATE TABLE public.user_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skills TEXT[],
  interests TEXT[],
  experience_level TEXT,
  education TEXT,
  goals TEXT,
  ai_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  location TEXT,
  stipend TEXT,
  duration TEXT,
  is_remote BOOLEAN DEFAULT false,
  category TEXT,
  skills_required TEXT[],
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  image_url TEXT,
  what_you_learn TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_internships table for bookmarks
CREATE TABLE public.saved_internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, internship_id)
);

-- Create enrolled_courses table
CREATE TABLE public.enrolled_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolled_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_assessments
CREATE POLICY "Users can view their own assessments"
  ON public.user_assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
  ON public.user_assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
  ON public.user_assessments FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for internships (public read)
CREATE POLICY "Anyone can view internships"
  ON public.internships FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for saved_internships
CREATE POLICY "Users can view their saved internships"
  ON public.saved_internships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save internships"
  ON public.saved_internships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved internships"
  ON public.saved_internships FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for enrolled_courses
CREATE POLICY "Users can view their enrolled courses"
  ON public.enrolled_courses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
  ON public.enrolled_courses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_assessments_updated_at
  BEFORE UPDATE ON public.user_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample internships
INSERT INTO public.internships (title, company, description, requirements, location, stipend, duration, is_remote, category, skills_required) VALUES
('Frontend Developer Intern', 'TechCorp Inc', 'Work on cutting-edge web applications using React and TypeScript', ARRAY['React', 'TypeScript', 'HTML/CSS'], 'San Francisco, CA', '$2000/month', '3 months', true, 'Software Development', ARRAY['React', 'TypeScript', 'JavaScript']),
('Data Science Intern', 'DataMinds AI', 'Analyze large datasets and build ML models', ARRAY['Python', 'Machine Learning', 'Statistics'], 'Remote', '$2500/month', '6 months', true, 'Data Science', ARRAY['Python', 'Machine Learning', 'Data Analysis']),
('UX Design Intern', 'Creative Studios', 'Design user interfaces and conduct user research', ARRAY['Figma', 'Adobe XD', 'User Research'], 'New York, NY', '$1800/month', '4 months', false, 'Design', ARRAY['UI/UX', 'Figma', 'Design Thinking']),
('Marketing Intern', 'Growth Labs', 'Help with digital marketing campaigns and analytics', ARRAY['Social Media', 'Content Creation', 'Analytics'], 'Austin, TX', '$1500/month', '3 months', true, 'Marketing', ARRAY['Digital Marketing', 'SEO', 'Content Strategy']);

-- Insert sample courses
INSERT INTO public.courses (title, description, instructor, duration, difficulty, category, price, is_free, what_you_learn) VALUES
('Complete Web Development Bootcamp', 'Learn full-stack web development from scratch', 'Dr. Angela Yu', '65 hours', 'beginner', 'Web Development', 0, true, ARRAY['HTML, CSS, JavaScript', 'React and Node.js', 'Database Design', 'API Development']),
('Machine Learning A-Z', 'Master machine learning algorithms and applications', 'Kirill Eremenko', '44 hours', 'intermediate', 'Data Science', 49.99, false, ARRAY['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Real-world Projects']),
('UI/UX Design Fundamentals', 'Learn the principles of user-centered design', 'Sarah Drasner', '30 hours', 'beginner', 'Design', 0, true, ARRAY['Design Thinking', 'Wireframing', 'Prototyping', 'User Testing']),
('Advanced Python Programming', 'Take your Python skills to the next level', 'Jose Portilla', '40 hours', 'advanced', 'Programming', 39.99, false, ARRAY['Advanced OOP', 'Decorators and Generators', 'Async Programming', 'Best Practices']);
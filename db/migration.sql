-- Enhanced Learning Dashboard Database Schema
-- This migration adds comprehensive data structure for courses, lessons, quizzes, and user progress

-- Drop existing tables if they exist (fresh start)
DROP TABLE IF EXISTS user_activity CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- 1. Courses Table (Enhanced)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  icon_name VARCHAR(50) DEFAULT 'BookOpen',
  color_code VARCHAR(7) DEFAULT '#3B82F6',
  category VARCHAR(50),
  difficulty_level VARCHAR(20) DEFAULT 'Beginner',
  total_lessons INTEGER DEFAULT 0,
  total_quizzes INTEGER DEFAULT 0,
  instructor_name VARCHAR(255),
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Lessons Table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  duration_minutes INTEGER DEFAULT 10,
  is_completed BOOLEAN DEFAULT FALSE,
  video_url TEXT,
  resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Quizzes Table
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_questions INTEGER DEFAULT 0,
  passing_score INTEGER DEFAULT 70,
  duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Quiz Questions Table
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'multiple_choice',
  options JSONB NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lessons_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  last_lesson_id UUID REFERENCES lessons(id),
  overall_progress INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Quiz Attempts Table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER,
  total_questions INTEGER,
  passed BOOLEAN,
  attempt_number INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER,
  answers JSONB
);

-- 7. User Activity Table
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create Indexes for Performance
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_quizzes_course_id ON quizzes(course_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_user_progress_user_course ON user_progress(user_id, course_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON user_activity(created_at);

-- Seed Data: Courses
INSERT INTO courses (title, description, icon_name, color_code, category, difficulty_level, total_lessons, total_quizzes, instructor_name)
VALUES
  ('React Fundamentals', 'Learn the basics of React and build dynamic web applications', 'Zap', '#3B82F6', 'Web Development', 'Beginner', 8, 4, 'John Smith'),
  ('Advanced TypeScript', 'Master TypeScript with advanced patterns and techniques', 'Code', '#8B5CF6', 'Programming', 'Advanced', 10, 5, 'Jane Doe'),
  ('Next.js Mastery', 'Build production-ready applications with Next.js', 'Rocket', '#EC4899', 'Web Development', 'Intermediate', 12, 6, 'Alex Johnson'),
  ('Data Science Basics', 'Introduction to data science and machine learning', 'BarChart3', '#10B981', 'Data Science', 'Beginner', 9, 4, 'Mike Brown'),
  ('Cloud Architecture', 'Design scalable cloud solutions on AWS and GCP', 'Cloud', '#F59E0B', 'Cloud Computing', 'Advanced', 11, 5, 'Sarah Wilson');

-- Seed Data: Lessons for React Fundamentals
INSERT INTO lessons (course_id, lesson_number, title, description, content, duration_minutes, video_url)
SELECT id, 1, 'Introduction to React', 'Understand what React is and why you should learn it', 'Learn the fundamentals...', 15, 'https://example.com/react-intro'
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 2, 'JSX and Components', 'Master JSX syntax and component structure', 'JSX is a syntax extension...', 20, 'https://example.com/jsx'
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 3, 'State and Props', 'Understanding React state and component props', 'State and props are core...', 18, 'https://example.com/state-props'
FROM courses WHERE title = 'React Fundamentals';

-- Seed Data: Quizzes
INSERT INTO quizzes (course_id, title, description, total_questions, passing_score, duration_minutes)
SELECT id, 'React Basics Quiz', 'Test your understanding of React fundamentals', 10, 70, 20
FROM courses WHERE title = 'React Fundamentals'
UNION ALL
SELECT id, 'TypeScript Advanced Quiz', 'Challenge yourself with advanced TypeScript concepts', 15, 75, 30
FROM courses WHERE title = 'Advanced TypeScript';

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (Public Read Access)
CREATE POLICY "Enable read access for all users" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for lessons" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for quizzes" ON quizzes
  FOR SELECT USING (true);

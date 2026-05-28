# Supabase Integration Guide - Advanced Features

## Overview

This guide covers the complete Supabase integration for the Learning Dashboard with interactive buttons, course details, lessons tracking, and user progress management.

---

## Table of Contents

1. [Database Schema](#database-schema)
2. [Setup Instructions](#setup-instructions)
3. [API Routes](#api-routes)
4. [Component Integration](#component-integration)
5. [Features](#features)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

---

## Database Schema

### Tables Overview

#### 1. **courses** (Enhanced)
Primary table for course information

```sql
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
```

**Fields:**
- `id`: Unique identifier
- `title`: Course name
- `description`: Course details
- `progress`: Current progress percentage (0-100)
- `icon_name`: Lucide icon name (e.g., 'BookOpen', 'Zap', 'Code')
- `color_code`: Hex color for UI (#RRGGBB)
- `category`: Course category (e.g., 'Web Development')
- `difficulty_level`: Beginner, Intermediate, Advanced
- `total_lessons`: Number of lessons in course
- `total_quizzes`: Number of quizzes in course
- `instructor_name`: Course instructor

#### 2. **lessons**
Individual lessons within courses

```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
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
```

#### 3. **quizzes**
Quiz definitions and metadata

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_questions INTEGER DEFAULT 0,
  passing_score INTEGER DEFAULT 70,
  duration_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 4. **quiz_questions**
Individual quiz questions

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'multiple_choice',
  options JSONB NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 5. **user_progress**
Track user progress in courses

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id),
  lessons_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  last_lesson_id UUID REFERENCES lessons(id),
  overall_progress INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 6. **quiz_attempts**
Record of user quiz attempts

```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  quiz_id UUID NOT NULL REFERENCES quizzes(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  score INTEGER,
  total_questions INTEGER,
  passed BOOLEAN,
  attempt_number INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER,
  answers JSONB
);
```

#### 7. **user_activity**
Activity log for user actions

```sql
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  course_id UUID REFERENCES courses(id),
  lesson_id UUID REFERENCES lessons(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

---

## Setup Instructions

### Step 1: Create Tables in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Open the SQL file at `db/migration.sql`
5. Copy all the SQL and paste into the editor
6. Click **Run** to execute

### Step 2: Seed Initial Data

After creating tables, insert sample data:

```sql
-- Add a sample course
INSERT INTO courses (title, description, icon_name, color_code, category, difficulty_level, total_lessons, total_quizzes, instructor_name)
VALUES (
  'React Fundamentals',
  'Learn the basics of React and build dynamic web applications',
  'Zap',
  '#3B82F6',
  'Web Development',
  'Beginner',
  8,
  4,
  'John Smith'
);

-- Add lessons for the course
INSERT INTO lessons (course_id, lesson_number, title, description, duration_minutes)
SELECT id, 1, 'Introduction to React', 'Understand what React is and why you should learn it', 15
FROM courses WHERE title = 'React Fundamentals';
```

### Step 3: Enable Row Level Security (RLS)

For production, enable RLS:

1. Go to **Authentication** → **Policies**
2. Click **Enable RLS** for each table
3. Add policies as needed:

```sql
-- Allow public read access
CREATE POLICY "Enable read access for all users" ON courses
  FOR SELECT USING (true);
```

---

## API Routes

### GET `/api/courses/[courseId]`

Fetch course details, lessons, and quizzes

**Request:**
```bash
GET /api/courses/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "course": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "React Fundamentals",
    "description": "Learn React basics...",
    "progress": 45,
    "category": "Web Development",
    "total_lessons": 8,
    "total_quizzes": 4
  },
  "lessons": [
    {
      "id": "lesson-id-1",
      "lesson_number": 1,
      "title": "Introduction to React",
      "duration_minutes": 15,
      "is_completed": true
    }
  ],
  "quizzes": [
    {
      "id": "quiz-id-1",
      "title": "React Basics Quiz",
      "total_questions": 10
    }
  ]
}
```

### POST `/api/progress`

Update user progress and log activities

**Request:**
```json
{
  "courseId": "123e4567-e89b-12d3-a456-426614174000",
  "action": "start_course"
}
```

**Actions:**

1. **start_course** - Begin a course
```json
{
  "courseId": "course-id",
  "action": "start_course"
}
```

2. **complete_lesson** - Mark lesson as complete
```json
{
  "courseId": "course-id",
  "lessonId": "lesson-id",
  "action": "complete_lesson"
}
```

3. **submit_quiz** - Submit quiz answers
```json
{
  "courseId": "course-id",
  "quizId": "quiz-id",
  "action": "submit_quiz",
  "score": 85,
  "totalQuestions": 10,
  "answers": { "q1": "A", "q2": "C" }
}
```

---

## Component Integration

### CourseDetailsModal

Modal that displays course details, lessons, and quizzes

**Props:**
```typescript
interface CourseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
  courseIcon: string
  courseColor: string
  courseProgress: number
}
```

**Usage:**
```tsx
import { CourseDetailsModal } from '@/components/course-details-modal'

<CourseDetailsModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  courseId="course-123"
  courseTitle="React Fundamentals"
  courseIcon="Zap"
  courseColor="#3B82F6"
  courseProgress={45}
/>
```

### CourseTile

Interactive course card with action buttons

**Interactive Features:**
- Share button (Web Share API or clipboard)
- More options menu (dropdown)
- Continue button (opens modal)
- Animated progress bar
- Hover animations

**Usage:**
```tsx
import { CourseTile } from '@/components/course-tile'

<CourseTile
  courseId="course-123"
  title="React Fundamentals"
  description="Learn React basics..."
  progress={45}
  iconName="Zap"
  colorCode="#3B82F6"
  index={1}
/>
```

---

## Features

### 1. Course Details View

Click **Continue** button on any course tile to open the modal with:
- Course overview and description
- Progress bar
- Lesson statistics
- Instructor information
- Tabs for Overview, Lessons, and Quizzes

### 2. Lesson Tracking

Each lesson shows:
- Lesson number and title
- Duration in minutes
- Completion status (✓ for completed)
- Complete button for marking lessons done

### 3. Progress Tracking

- Overall course progress
- Lessons completed counter
- Quiz completion status
- Activity logging

### 4. Interactive Buttons

**On Course Cards (Hover):**
- **Share**: Share course with others
- **More Options**: Additional actions
- **Continue**: Open course details

**In Modal:**
- **Continue Learning**: Start/resume course
- **Complete**: Mark lesson as done
- **View Details**: See lesson information

### 5. Notifications

Toast notifications appear for:
- ✅ Course started successfully
- ✅ Lesson completed
- ❌ Errors with clear messages

---

## Customization

### Add a New Course

```javascript
// Via Supabase Dashboard
INSERT INTO courses (
  title,
  description,
  icon_name,
  color_code,
  category,
  difficulty_level,
  total_lessons,
  total_quizzes,
  instructor_name
) VALUES (
  'Advanced TypeScript',
  'Master TypeScript with advanced patterns',
  'Code',
  '#8B5CF6',
  'Programming',
  'Advanced',
  10,
  5,
  'Jane Doe'
);
```

### Change Progress Color

Update the `color_code` field in the courses table:

```sql
UPDATE courses
SET color_code = '#EC4899'
WHERE title = 'React Fundamentals';
```

### Add Lesson to Course

```sql
INSERT INTO lessons (
  course_id,
  lesson_number,
  title,
  description,
  duration_minutes,
  video_url
) VALUES (
  (SELECT id FROM courses WHERE title = 'React Fundamentals'),
  2,
  'JSX and Components',
  'Master JSX syntax',
  20,
  'https://example.com/jsx-video'
);
```

### Update Course Statistics

```sql
UPDATE courses
SET total_lessons = 12, total_quizzes = 6
WHERE title = 'React Fundamentals';
```

---

## User Progress Tracking

### Check Course Progress

```sql
SELECT * FROM user_progress
WHERE user_id = 'user-id' AND course_id = 'course-id';
```

### Get All User Activities

```sql
SELECT * FROM user_activity
WHERE user_id = 'user-id'
ORDER BY created_at DESC;
```

### View Quiz Attempts

```sql
SELECT * FROM quiz_attempts
WHERE user_id = 'user-id'
ORDER BY completed_at DESC;
```

---

## Authentication Integration

To add user authentication:

1. **Install Auth Package:**
```bash
npm install @supabase/auth-helpers-nextjs
```

2. **Update User ID in API Routes:**

Replace `'default-user'` with authenticated user:

```typescript
// In /api/progress route
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
const userId = user?.id || 'default-user'
```

3. **Add Protected Route:**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

## Troubleshooting

### Issue: "Failed to fetch course details"

**Solution:**
1. Verify courseId is correct
2. Check Supabase connection in `.env.local`
3. Ensure course exists in database

### Issue: Modal buttons not responding

**Solution:**
1. Check browser console for errors
2. Verify API routes are deployed
3. Check network tab for API calls

### Issue: Progress not updating

**Solution:**
1. Verify `user_progress` table has data
2. Check user_id is correct
3. Run database migration again

### Issue: Icons not displaying

**Solution:**
1. Verify `icon_name` matches Lucide icon name
2. Check capitalization (e.g., 'BookOpen', not 'bookopen')
3. Use a valid Lucide icon name

---

## Performance Tips

### 1. Optimize Queries
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

### 2. Cache Course Data
```typescript
// Cache for 5 minutes
const response = await fetch(`/api/courses/${courseId}`, {
  next: { revalidate: 300 }
})
```

### 3. Lazy Load Lessons
Load lessons only when modal opens (already implemented)

---

## File Structure

```
app/
  api/
    courses/
      [courseId]/
        route.ts        # Get course details
    progress/
      route.ts          # Update progress
components/
  course-details-modal.tsx
  course-tile.tsx
lib/
  supabase/
    server.ts
    client.ts
db/
  migration.sql         # Database schema
```

---

## Next Steps

1. ✅ Run database migration
2. ✅ Add sample data
3. ✅ Test API routes
4. ✅ Enable RLS policies
5. ⏭️ Add authentication
6. ⏭️ Implement lesson content
7. ⏭️ Add quiz functionality
8. ⏭️ Deploy to production

---

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev)


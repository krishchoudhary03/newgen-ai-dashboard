import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const supabase = await createClient()

    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseError) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch lessons for this course
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('lesson_number', { ascending: true })

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    }

    // Fetch quizzes for this course
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)

    if (quizzesError) {
      console.error('Error fetching quizzes:', quizzesError)
    }

    return NextResponse.json({
      course,
      lessons: lessons || [],
      quizzes: quizzes || [],
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

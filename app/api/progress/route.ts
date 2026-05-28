import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { courseId, action, lessonId, quizId } = body

    const supabase = await createClient()

    // Get current user (in production, you'd use auth)
    const userId = 'default-user'

    if (action === 'start_course') {
      // Create or update user progress
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (existing) {
        const { error } = await supabase
          .from('user_progress')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: userId,
            course_id: courseId,
            overall_progress: 0,
          })

        if (error) throw error
      }

      return NextResponse.json({ success: true, message: 'Course started' })
    }

    if (action === 'complete_lesson') {
      // Mark lesson as completed and update progress
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({ is_completed: true })
        .eq('id', lessonId)

      if (lessonError) throw lessonError

      // Update user progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lessons_completed')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single()

      if (progress) {
        await supabase
          .from('user_progress')
          .update({
            lessons_completed: (progress.lessons_completed || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('course_id', courseId)
      }

      // Log activity
      await supabase.from('user_activity').insert({
        user_id: userId,
        activity_type: 'lesson_completed',
        course_id: courseId,
        lesson_id: lessonId,
        description: 'Completed a lesson',
      })

      return NextResponse.json({ success: true, message: 'Lesson marked as complete' })
    }

    if (action === 'submit_quiz') {
      const { score, totalQuestions, answers } = body

      // Record quiz attempt
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: userId,
          quiz_id: quizId,
          course_id: courseId,
          score,
          total_questions: totalQuestions,
          passed: score >= 70,
          answers,
          completed_at: new Date().toISOString(),
        })

      if (error) throw error

      // Log activity
      await supabase.from('user_activity').insert({
        user_id: userId,
        activity_type: 'quiz_completed',
        course_id: courseId,
        description: `Quiz completed with score ${score}/${totalQuestions}`,
      })

      return NextResponse.json({
        success: true,
        message: 'Quiz submitted successfully',
        passed: score >= 70,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

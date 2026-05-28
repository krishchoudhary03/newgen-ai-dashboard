'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import { Clock, Users, BarChart3, Award, Play, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

interface CourseDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  courseId: string
  courseTitle: string
  courseIcon: string
  courseColor: string
  courseProgress: number
}

interface CourseDetails {
  id: string
  title: string
  description: string
  icon_name: string
  color_code: string
  category: string
  difficulty_level: string
  total_lessons: number
  total_quizzes: number
  instructor_name: string
  progress: number
}

interface Lesson {
  id: string
  lesson_number: number
  title: string
  description: string
  duration_minutes: number
  is_completed: boolean
}

export function CourseDetailsModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  courseIcon,
  courseColor,
  courseProgress,
}: CourseDetailsModalProps) {
  const { toast } = useToast()
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchCourseDetails()
    }
  }, [isOpen, courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/courses/${courseId}`)
      if (!response.ok) throw new Error('Failed to fetch course details')

      const data = await response.json()
      setCourseDetails(data.course)
      setLessons(data.lessons || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContinueLearning = async () => {
    try {
      setSubmitting(true)
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          action: 'start_course',
        }),
      })

      if (!response.ok) throw new Error('Failed to start course')

      toast({
        title: 'Success',
        description: 'Course started successfully!',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCompleteLesson = async (lessonId: string) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          lessonId,
          action: 'complete_lesson',
        }),
      })

      if (!response.ok) throw new Error('Failed to complete lesson')

      // Update local state
      setLessons(
        lessons.map((l) => (l.id === lessonId ? { ...l, is_completed: true } : l))
      )

      toast({
        title: 'Success',
        description: 'Lesson marked as complete!',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const IconComponent = (
    LucideIcons[courseIcon as keyof typeof LucideIcons] || LucideIcons.BookOpen
  ) as React.ComponentType<{ size: number; className: string }>

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-lg bg-opacity-20"
              style={{ backgroundColor: courseColor }}
            >
              <IconComponent size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white">
                {courseTitle}
              </DialogTitle>
              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: `${courseColor}40` }}
                >
                  {courseDetails?.category || 'Category'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200">
                  {courseDetails?.difficulty_level || 'Level'}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="py-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-8">{error}</div>
            ) : (
              <>
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Course Overview
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {courseDetails?.description || 'No description available'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Overall Progress</span>
                        <span className="text-white font-medium">{courseProgress}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: courseColor }}
                          initial={{ width: 0 }}
                          animate={{ width: `${courseProgress}%` }}
                          transition={{ delay: 0.2, duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 size={16} className="text-blue-400" />
                        <span className="text-gray-400 text-sm">Lessons</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {courseDetails?.total_lessons || 0}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award size={16} className="text-yellow-400" />
                        <span className="text-gray-400 text-sm">Quizzes</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {courseDetails?.total_quizzes || 0}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-green-400" />
                        <span className="text-gray-400 text-sm">Instructor</span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">
                        {courseDetails?.instructor_name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleContinueLearning}
                    disabled={submitting}
                    className="w-full text-white"
                    style={{ backgroundColor: courseColor }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </>
                    )}
                  </Button>
                </TabsContent>

                {/* Lessons Tab */}
                <TabsContent value="lessons" className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-4">Course Lessons</h3>
                  {lessons.length > 0 ? (
                    lessons.map((lesson, idx) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group"
                      >
                        <div className="flex items-start gap-4 justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-gray-600 transition-colors">
                                {lesson.is_completed ? (
                                  <span className="text-green-400 text-sm">✓</span>
                                ) : (
                                  <Play size={12} className="text-gray-400" />
                                )}
                              </div>
                              <h4 className="font-semibold text-white">
                                Lesson {lesson.lesson_number}: {lesson.title}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-400 mb-2 ml-8">
                              {lesson.description}
                            </p>
                            <div className="flex items-center gap-2 ml-8">
                              <Clock size={14} className="text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {lesson.duration_minutes} minutes
                              </span>
                            </div>
                          </div>
                          {!lesson.is_completed && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompleteLesson(lesson.id)}
                              className="flex-shrink-0"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No lessons available yet</p>
                  )}
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="text-center py-8">
                  <Award size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">Quiz data coming soon</p>
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

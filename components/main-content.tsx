'use client'

import { Suspense } from 'react'
import { HeroTile } from './hero-tile'
import { CourseTile } from './course-tile'
import { ActivityTile } from './activity-tile'
import { SkeletonLoader } from './skeleton-loader'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description?: string
  progress?: number
  icon_name?: string
  color_code?: string
}

interface MainContentProps {
  courses: Course[]
}

export function MainContent({ courses }: MainContentProps) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 overflow-y-auto"
    >
      <div className="p-6 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Learning Dashboard
          </h1>
          <p className="text-gray-400">
            Master new skills and advance your career
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {/* Hero Tile - 2 columns on larger screens */}
          <div className="lg:col-span-2">
            <HeroTile />
          </div>

          {/* Activity Tile */}
          <div>
            <ActivityTile />
          </div>

          {/* Course Tiles */}
          {courses.map((course, index) => (
            <div key={course.id}>
              <CourseTile
                courseId={course.id}
                title={course.title}
                description={course.description || 'Learn this amazing course'}
                progress={course.progress || 0}
                iconName={course.icon_name || 'BookOpen'}
                colorCode={course.color_code || '#3B82F6'}
                index={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  )
}

export function MainContentSkeleton() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-10 bg-gray-800 rounded w-64 mb-2 animate-pulse" />
          <div className="h-6 bg-gray-800 rounded w-96 animate-pulse" />
        </div>
        <SkeletonLoader />
      </div>
    </main>
  )
}

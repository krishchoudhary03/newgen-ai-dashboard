'use client'

import React, { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'
import { MoreVertical, Play, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CourseDetailsModal } from './course-details-modal'
import { useToast } from '@/hooks/use-toast'

interface CourseTileProps {
  title: string
  description: string
  progress: number
  iconName: string
  colorCode: string
  index: number
  courseId: string
}

export function CourseTile({
  title,
  description,
  progress,
  iconName,
  colorCode,
  index,
  courseId,
}: CourseTileProps) {
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const IconComponent = (
    LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.BookOpen
  ) as React.ComponentType<{ size: number; className: string }>

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `Check out this course: ${title}`,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${title} - ${description}`)
        toast({
          title: 'Copied',
          description: 'Course details copied to clipboard',
        })
      }
    } catch (error) {
      console.error('Share error:', error)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer h-full flex flex-col"
      >
        {/* Background gradient accent */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: colorCode }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Icon and header with actions */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="p-3 rounded-lg bg-opacity-20 transition-transform group-hover:scale-110"
              style={{ backgroundColor: colorCode }}
            >
              <IconComponent size={24} className="text-white" />
            </div>

            {/* Action buttons - visible on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  <Share2 size={16} />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast({
                          title: 'Added to favorites',
                          description: `${title} added to your favorites`,
                        })
                      }}
                    >
                      Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast({
                          title: 'Downloaded',
                          description: `${title} materials downloaded`,
                        })
                      }}
                    >
                      Download Materials
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </div>

          {/* Title and description */}
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-grow">
            {description}
          </p>

          {/* Progress section */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">Progress</span>
                <span className="text-xs font-semibold text-white">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colorCode }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{
                    delay: index * 0.1 + 0.3,
                    duration: 1.5,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="w-full text-white flex items-center justify-center gap-2"
              style={{ backgroundColor: colorCode }}
            >
              <Play size={16} />
              Continue
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Course Details Modal */}
      <CourseDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={courseId}
        courseTitle={title}
        courseIcon={iconName}
        courseColor={colorCode}
        courseProgress={progress}
      />
    </>
  )
}

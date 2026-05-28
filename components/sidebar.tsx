'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, BookOpen, Settings, UserCircle } from 'lucide-react'

interface SidebarProps {
  isCollapsed?: boolean
}

export function Sidebar({ isCollapsed: initialCollapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed)

  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: BookOpen, label: 'Courses' },
    { icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile hamburger button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-white transition-colors"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 240,
          transition: { duration: 0.3 },
        }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 flex-col border-r border-gray-700 bg-gray-900 pt-6"
      >
        {/* Logo/Branding */}
        <div className="px-4 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <BookOpen size={24} className="text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-white text-lg whitespace-nowrap"
              >
                Learn
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2 px-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <UserCircle size={20} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  Profile
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>
    </>
  )
}

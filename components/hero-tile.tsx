'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export function HeroTile() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white md:col-span-2 h-full flex flex-col justify-center"
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={24} className="text-yellow-200" />
          <span className="text-sm font-semibold text-blue-100">Welcome Back</span>
        </div>
        <h2 className="text-4xl font-bold mb-3 text-balance">
          Continue Your Learning Journey
        </h2>
        <p className="text-lg text-blue-100 text-pretty mb-6 max-w-lg">
          Pick up where you left off and master new skills across multiple domains
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          Get Started
        </motion.button>
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Award, Zap } from 'lucide-react'

export function ActivityTile() {
  const stats = [
    { icon: TrendingUp, label: 'Current Streak', value: '12 days' },
    { icon: Award, label: 'Achievements', value: '8 earned' },
    { icon: Zap, label: 'XP Points', value: '2,450' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 border border-gray-700 h-full"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Your Activity</h3>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Icon size={20} className="text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <span className="font-semibold text-white">{stat.value}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

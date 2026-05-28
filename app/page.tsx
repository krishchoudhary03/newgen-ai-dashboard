import { Suspense } from 'react'
import { Dashboard } from '@/components/dashboard'

export const metadata = {
  title: 'Learning Dashboard',
  description: 'Master new skills and advance your career',
}

export default function Page() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  )
}

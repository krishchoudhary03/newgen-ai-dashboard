import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from './sidebar'
import { MainContent, MainContentSkeleton } from './main-content'

export async function Dashboard() {
  try {
    // Check if Supabase credentials are configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = await createClient()

    // Fetch courses from Supabase
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching courses:', error)
      return (
        <div className="flex h-screen bg-gray-900 text-white">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Unable to load courses</h2>
              <p className="text-gray-400">Please try refreshing the page</p>
            </div>
          </main>
        </div>
      )
    }

    return (
      <div className="flex h-screen bg-gray-900 md:pl-80">
        <Sidebar />
        {courses && courses.length > 0 ? (
          <Suspense fallback={<MainContentSkeleton />}>
            <MainContent courses={courses} />
          </Suspense>
        ) : (
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold text-white mb-4">No Courses Available</h2>
              <p className="text-gray-400 mb-6">
                Your courses table is empty. Run the database migration to add sample courses.
              </p>
              <div className="space-y-3 text-left bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-mono text-gray-300 mb-3">Steps to add courses:</p>
                <ol className="text-xs text-gray-400 space-y-2">
                  <li>1. Go to https://app.supabase.com</li>
                  <li>2. Select your project</li>
                  <li>3. Open SQL Editor</li>
                  <li>4. Create a new query</li>
                  <li>5. Paste the migration SQL from db/migration.sql</li>
                  <li>6. Click Run</li>
                </ol>
              </div>
            </div>
          </main>
        )}
      </div>
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Dashboard error:', errorMessage)

    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Configuration Error</h2>
            <p className="text-gray-300 mb-6">
              {errorMessage.includes('Supabase')
                ? 'Supabase credentials are not properly configured. Please check your .env.local file.'
                : errorMessage}
            </p>
            <div className="space-y-3 text-left bg-gray-800 p-4 rounded-lg">
              <p className="text-sm font-mono text-gray-400">
                Required environment variables in .env.local:
              </p>
              <p className="text-xs text-gray-500">
                NEXT_PUBLIC_SUPABASE_URL=your_project_url
              </p>
              <p className="text-xs text-gray-500">
                NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Get these from: https://app.supabase.com → Settings → API
            </p>
          </div>
        </main>
      </div>
    )
  }
}

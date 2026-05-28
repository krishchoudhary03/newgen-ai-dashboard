# NewGen AI Dashboard

A modern learning management dashboard built with Next.js and Supabase. Features interactive course management, progress tracking, and a beautiful UI with smooth animations.

## What This Is

Basically, it's a dashboard where users can browse courses, track their learning progress, mark lessons as complete, and manage their learning activities. The whole thing is interactive - modals pop up, buttons have hover effects, progress bars update in real time. Pretty solid foundation for building out a full learning platform.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- A Supabase account (free tier works fine)

### Setup Steps

1. **Clone and install**
   ```bash
   pnpm install
   ```

2. **Set up the database**
   - Go to [Supabase](https://app.supabase.com) and create a project
   - Open the SQL Editor
   - Copy everything from `db/migration.sql` and paste it into the editor
   - Run it to create tables and load sample data

3. **Configure environment**
   - Create a `.env.local` file in the root
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Run the dev server**
   ```bash
   pnpm dev
   ```
   - Open [http://localhost:3000](http://localhost:3000)

## Features

### Course Management
- Browse multiple courses with rich cards showing progress, difficulty, and instructor info
- Click any course to open a detailed modal with full course information
- See lessons, quizzes, and course descriptions all in one place

### Progress Tracking
- Mark individual lessons as complete
- Watch progress bars update in real time
- Track completion percentage for each course
- Activity logging for all learning actions

### Interactive UI
- Smooth animations and transitions powered by Framer Motion
- Hover effects on course cards revealing action buttons
- Share buttons, favorites, and download options
- Toast notifications for user feedback
- Responsive design that works on any device

### Pre-loaded Sample Data
- 5 complete courses with different difficulty levels
- Lessons, quizzes, and metadata for each course
- Real instructor info and course descriptions
- Perfect for testing and demoing

## Project Structure

```
components/           # React components
├── dashboard.tsx     # Main dashboard view
├── course-tile.tsx   # Individual course card
├── course-details-modal.tsx  # Course detail view
├── sidebar.tsx       # Navigation sidebar
└── ui/              # Reusable UI components (buttons, modals, etc)

app/                 # Next.js app directory
├── page.tsx         # Home page
└── api/
    ├── courses/     # Course endpoints
    └── progress/    # Progress tracking endpoints

db/                  # Database
└── migration.sql    # Schema and seed data

lib/                 # Utilities
├── utils.ts         # Helper functions
└── supabase/        # Supabase client setup

docs/                # Documentation
├── ADVANCED_FEATURES_SETUP.md
├── SUPABASE_INTEGRATION.md
└── UI_INTERACTIONS_GUIDE.md
```

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI (accordion, dialog, tabs, etc)
- **Forms**: React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL + REST API)
- **Animations**: Framer Motion for smooth transitions
- **Notifications**: Sonner for toast messages

## Available Commands

```bash
# Development
pnpm dev              # Start dev server at localhost:3000

# Production
pnpm build            # Build for production
pnpm start            # Run production build

# Code quality
pnpm lint             # Run ESLint
```

## How It Works

1. **Dashboard loads** → fetches all courses from Supabase
2. **Click a course** → opens modal with course details, lessons, and quizzes
3. **Mark complete** → sends update to backend, progress bar updates
4. **Real-time feedback** → notifications show up, UI refreshes instantly

The API routes handle all the backend logic - they talk to Supabase, manage data, and return responses. Everything is server-side rendered where possible for best performance.

## Architecture & Design Decisions

### Server vs Client Components

This project uses Next.js 15 App Router with a strategic split between server and client components:

**Server Components** (default)
- `layout.tsx` - Root layout, metadata, and providers
- `page.tsx` - Home page with Suspense boundary
- API routes in `app/api/` - All data fetching and mutations

Server components give us better performance, direct database access, and they don't ship JavaScript to the browser. We use them for everything that doesn't need interactivity.

**Client Components** (marked with `'use client'`)
- `components/dashboard.tsx` - Main dashboard, manages state
- `components/course-tile.tsx` - Interactive course cards with hover effects
- `components/course-details-modal.tsx` - Modal with tabs and forms
- `components/theme-provider.tsx` - Theme context and styling
- All `components/ui/*` - UI primitives that need events and state

Client components are necessary when we need:
- Real-time state management (modal open/close, form inputs)
- Event handlers (clicks, hovers, form submissions)
- Context providers (theme, toast notifications)
- Animations and transitions

### API Route Design

All data mutations go through `/app/api/` routes rather than direct Supabase calls from the client. This gives us:
- **Security**: Validation and permission checks server-side before touching the database
- **Flexibility**: Can change database structure without breaking the client
- **Performance**: Server can optimize queries before sending to client
- **Logging**: All actions can be tracked and audited server-side

Routes are simple and focused:
- `GET /api/courses/[courseId]` - Fetch single course
- `POST /api/progress` - Log activity and update progress

### Data Fetching Strategy

- **Initial load**: Server fetches courses at render time, streams to client
- **User actions**: Client sends requests to API routes, which update Supabase
- **Updates**: Client refetches data after mutations to stay in sync
- **Suspense**: Used for graceful loading states while data streams in

### Styling & UI

We went with Radix UI + Tailwind because:
- Radix provides accessible, unstyled components as a foundation
- Tailwind lets us customize styling quickly without custom CSS
- The combination is flexible - we can make it look exactly how we want
- Built-in components for complex interactions (modals, dropdowns, tabs, etc)

Animations use Framer Motion because it integrates well with React and makes smooth transitions easy.

### Challenges & Solutions

**Challenge 1: Server/Client Boundary Confusion**
- *Problem*: Hard to know which components should be server vs client
- *Solution*: Default everything to server components. Only add `'use client'` when you need state, events, or context. Start from the leaf and work up.

**Challenge 2: Keeping Data in Sync**
- *Problem*: After marking a lesson complete, the UI was stale until page refresh
- *Solution*: After API mutations, the client immediately refetches the updated course data. Not perfect for real-time but works well for our use case. Future improvement: WebSocket subscriptions for true real-time updates.

**Challenge 3: Type Safety Across Boundaries**
- *Problem*: Server and client code live in different files, easy to drift
- *Solution*: Shared TypeScript types in `lib/`. API routes validate at runtime with Zod or runtime checks. TypeScript helps catch most issues at build time.

**Challenge 4: Modal State Management**
- *Problem*: Modal needed to stay open during async operations, show loading states, then close on success
- *Solution*: Used React state in the client component to track `isOpen`, `isLoading`, and `selectedCourse`. Forms use React Hook Form for handling submissions cleanly.

**Challenge 5: Environment Variables**
- *Problem*: Easy to forget which variables are needed and what they should contain
- *Solution*: Created `.env.example` file with all required variables documented. No secrets get committed.

### Performance Considerations

- Server-side rendering reduces JavaScript sent to browser
- API routes allow caching on the server layer
- Tailwind CSS is processed at build time
- Framer Motion runs on GPU for smooth 60fps animations
- Images and assets are optimized by Next.js
- Future: Add Redis caching for frequently accessed courses

## Documentation

Check out the docs folder for more detailed info:
- `ADVANCED_FEATURES_SETUP.md` - Setup instructions and troubleshooting
- `SUPABASE_INTEGRATION.md` - Database schema and API reference
- `UI_INTERACTIONS_GUIDE.md` - Visual guide to all interactive elements
- `IMPLEMENTATION_CHECKLIST.md` - Technical implementation details

## Future Improvements

- User authentication and accounts
- Certificates for course completion
- Quiz functionality (currently marked as "coming soon")
- Leaderboards and social features
- More course content and categories
- Admin panel for managing courses
- Advanced analytics and reporting

## Contributing

Feel free to fork this and make it your own. If you add cool features, submit a PR.

## License

Open source, use it however you want.
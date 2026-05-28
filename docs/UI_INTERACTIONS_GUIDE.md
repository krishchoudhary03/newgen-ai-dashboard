# User Interface & Interactions Guide

## 📱 Visual Layout

### Course Tile (Normal State)
```
┌─────────────────────────────────────────┐
│                                         │
│  [🔵] React Fundamentals                │
│                                         │
│  Learn the basics of React and build    │
│  dynamic web applications               │
│                                         │
│  Progress     45%                       │
│  ████░░░░░░░░░░░░░░░ (45%)             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     ▶ Continue                       ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### Course Tile (Hover State)
```
┌─────────────────────────────────────────┐
│                               [↗][⋯]    │  ← Action buttons appear
│  [🔵] React Fundamentals                │
│                                         │
│  Learn the basics of React and build    │
│  dynamic web applications               │
│                                         │
│  Progress     45%                       │
│  ████░░░░░░░░░░░░░░░ (45%)             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │     ▶ Continue                       ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘

[↗] = Share button
[⋯] = More options menu
```

### Dropdown Menu (When [⋯] Clicked)
```
┌─ More Options ────┐
│ View Details      │
│ Add to Favorites  │
│ Download Materials│
└───────────────────┘
```

---

## 🎯 Interactive Buttons

### Button 1: Share Button [↗]
```
Location: Course tile top-right (hover to reveal)
Type: Icon button
Action: Opens share dialog
Result: Share course via Web Share API or copy to clipboard
Notification: "Course details copied to clipboard"
```

### Button 2: More Options [⋯]
```
Location: Course tile top-right (hover to reveal)
Type: Dropdown trigger
Action: Shows dropdown menu
Options:
  - View Details → Opens modal
  - Add to Favorites → Shows notification
  - Download Materials → Shows notification
```

### Button 3: Continue Learning
```
Location: Bottom of course tile (always visible)
Type: Primary button
Color: Course color (dynamic)
Action: Opens course details modal
Result: Modal opens with course information
```

### Button 4: Continue Learning (in Modal)
```
Location: Modal overview tab (bottom)
Type: Primary button
Color: Course color (dynamic)
State: Shows loading spinner while processing
Action: Starts/resumes course
Result: Toast notification "Course started successfully!"
API Call: POST /api/progress { action: 'start_course' }
```

### Button 5: Complete (Lesson Button)
```
Location: Next to each lesson in modal
Type: Outline button
Action: Marks lesson as complete
Result: 
  - Button disappears
  - Lesson shows checkmark
  - Toast notification "Lesson marked as complete!"
API Call: POST /api/progress { action: 'complete_lesson' }
```

---

## 🔄 User Flow Diagrams

### Flow 1: View Course Details
```
User sees dashboard
     ↓
User hovers over course tile
     ↓
Action buttons appear (share, more)
     ↓
User clicks "Continue" button
     ↓
Modal opens with animation
     ↓
API fetches course data
     ↓
Modal displays:
  - Overview tab (default)
  - Progress bar
  - Course stats
  - Continue button
```

### Flow 2: View Lessons
```
User has modal open
     ↓
User clicks "Lessons" tab
     ↓
Lessons list loads with staggered animation
     ↓
Each lesson shows:
  - Lesson number and title
  - Description
  - Duration
  - Completion status (✓ or ▶)
     ↓
User clicks "Complete" button
     ↓
API updates lesson
     ↓
Toast shows "Lesson marked as complete!"
     ↓
UI updates in real-time
```

### Flow 3: Share Course
```
User hovers over course tile
     ↓
Share button appears [↗]
     ↓
User clicks share button
     ↓
Browser checks for Web Share API
     ↓
If available:
  - Native share dialog opens
  - User selects app/contact
Else:
  - Course text copied to clipboard
  - Toast shows "Copied to clipboard"
```

### Flow 4: More Options
```
User hovers over course tile
     ↓
More button appears [⋯]
     ↓
User clicks more button
     ↓
Dropdown menu opens:
  - "View Details" → Same as Continue button
  - "Add to Favorites" → Shows notification
  - "Download Materials" → Shows notification
     ↓
Toast appears for confirmation
```

---

## 📊 Modal Layout

### Overview Tab (Default)
```
┌──────────────────────────────────────────────┐
│ [Icon] React Fundamentals        [X]         │ ← Header with close button
│        Beginner | Web Development             │
├──────────────────────────────────────────────┤
│ Overview │ Lessons │ Quizzes  (Tab buttons) │
├──────────────────────────────────────────────┤
│                                              │
│ Course Overview                              │
│ Learn the basics of React...                 │
│                                              │
│ Progress                                     │
│ Overall Progress: 45%                        │
│ ████░░░░░░░░░░░░░░░ (45%)                   │
│                                              │
│ ┌──────────────┬──────────────┬──────────────┐│
│ │ 8 Lessons    │ 4 Quizzes    │ John Smith   ││
│ │ [Icon]       │ [Icon]       │ [Icon]       ││
│ └──────────────┴──────────────┴──────────────┘│
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ▶ Continue Learning                      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

### Lessons Tab
```
┌──────────────────────────────────────────────┐
│ [Icon] React Fundamentals        [X]         │
│        Beginner | Web Development             │
├──────────────────────────────────────────────┤
│ Overview │ Lessons │ Quizzes  (Tab buttons) │
├──────────────────────────────────────────────┤
│                                              │
│ Course Lessons                               │
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ ✓ Lesson 1: Introduction to React       ││
│ │   Understand what React is...            ││
│ │   ⏱ 15 minutes                          ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ ▶ Lesson 2: JSX and Components  [Complete]
│ │   Master JSX syntax...                    ││
│ │   ⏱ 20 minutes                          ││
│ └──────────────────────────────────────────┘│
│                                              │
│ ┌──────────────────────────────────────────┐│
│ │ ▶ Lesson 3: State and Props  [Complete]  │
│ │   Understanding React state...            ││
│ │   ⏱ 18 minutes                          ││
│ └──────────────────────────────────────────┘│
│                                              │
└──────────────────────────────────────────────┘
```

### Quizzes Tab
```
┌──────────────────────────────────────────────┐
│ [Icon] React Fundamentals        [X]         │
│        Beginner | Web Development             │
├──────────────────────────────────────────────┤
│ Overview │ Lessons │ Quizzes  (Tab buttons) │
├──────────────────────────────────────────────┤
│                                              │
│              🏆                              │
│         Quiz data coming soon               │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 🎨 Color & Styling

### Course Tile Colors (Dynamic)
Each course has its own color from the database:

```
React Fundamentals      → Blue (#3B82F6)
Advanced TypeScript     → Purple (#8B5CF6)
Next.js Mastery        → Pink (#EC4899)
Data Science Basics    → Green (#10B981)
Cloud Architecture     → Amber (#F59E0B)
```

Colors are applied to:
- Icon background
- Progress bar
- Primary button
- Modal header accent
- Dropdown items on hover

### States

#### Normal State
```
Background: Gradient (gray-900 to gray-800)
Border: Gray (border-gray-700)
Text: White
Icons: Gray (dimmed)
```

#### Hover State
```
Background: Gradient (slightly brighter)
Border: Lighter gray (border-gray-600)
Text: White
Icons: Bright (course color)
Overlay: Course color (10% opacity)
Buttons: Appear with smooth animation
```

#### Active State (Tab)
```
Background: Course color (20% opacity)
Text: White
Underline: Course color
```

---

## 🔔 Notifications (Toast)

### Success Notification
```
┌─────────────────────────────────┐
│ ✓ Success                       │
│ Lesson marked as complete!      │
└─────────────────────────────────┘
```

### Error Notification
```
┌─────────────────────────────────┐
│ ✗ Error                         │
│ Failed to fetch course details  │
└─────────────────────────────────┘
```

### Info Notification
```
┌─────────────────────────────────┐
│ ℹ Course started successfully!  │
└─────────────────────────────────┘
```

### Position
- Default: Top-right corner
- Mobile: Full width at bottom
- Auto-dismiss: After 3 seconds
- Stacked: Multiple notifications stack vertically

---

## ⌨️ Keyboard Interactions

### Modal
```
Esc         → Close modal
Tab         → Move between buttons
Enter       → Activate focused button
Space       → Toggle menu items
```

### Buttons
```
Tab         → Focus button
Enter       → Click button
Space       → Click button (if focused)
```

### Dropdown
```
Tab         → Open menu and focus first item
Arrow Down  → Move to next item
Arrow Up    → Move to previous item
Enter       → Select item
Esc         → Close menu
```

---

## 📱 Responsive Design

### Desktop (>1024px)
```
┌─────────────────────────────────────────────┐
│ Course Tile (3 columns)                     │
│                                             │
│ ┌──────────────┐ ┌──────────────┐ ┌────────┐
│ │ Course 1     │ │ Course 2     │ │Course 3│
│ └──────────────┘ └──────────────┘ └────────┘
│ ┌──────────────┐ ┌──────────────┐ ┌────────┐
│ │ Course 4     │ │ Course 5     │ │Course 6│
│ └──────────────┘ └──────────────┘ └────────┘
│
│ Modal: Full size with scrolling
└─────────────────────────────────────────────┘
```

### Tablet (768-1024px)
```
┌─────────────────────────────────────────────┐
│ Course Tile (2 columns)                     │
│                                             │
│ ┌──────────────┐ ┌──────────────┐         │
│ │ Course 1     │ │ Course 2     │         │
│ └──────────────┘ └──────────────┘         │
│ ┌──────────────┐ ┌──────────────┐         │
│ │ Course 3     │ │ Course 4     │         │
│ └──────────────┘ └──────────────┘         │
│                                             │
│ Modal: Slightly smaller, adjusted for screen
└─────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────────────────────────────┐
│ Course Tile (1 column, full width)          │
│                                             │
│ ┌────────────────────────────────────────┐ │
│ │ Course 1                               │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ Course 2                               │ │
│ └────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────┐ │
│ │ Course 3                               │ │
│ └────────────────────────────────────────┘ │
│                                             │
│ Modal: Full height, full width, scrollable
└─────────────────────────────────────────────┘
```

---

## 🎬 Animation Timeline

### Modal Opening
```
0ms     → Dialog trigger clicked
100ms   → Dialog overlay fades in (opacity 0→1)
100ms   → Dialog content scales in (0.95→1)
200ms   → Modal fully visible
```

### Lesson List (Staggered)
```
0ms     → Lesson 1 fades in and slides left
100ms   → Lesson 2 fades in and slides left
200ms   → Lesson 3 fades in and slides left
300ms   → Lesson 4 fades in and slides left
```

### Progress Bar
```
0ms     → Width: 0%
300ms   → Animation starts
1500ms  → Width: 45% (or target value)
```

### Button Hover
```
0ms     → Hover state triggers
50ms    → Scale to 1.05
150ms   → Return to normal scale
```

---

## 📊 Data Flow

### On Modal Open
```
User clicks "Continue"
     ↓
Modal state set to isOpen=true
     ↓
CourseDetailsModal component mounts
     ↓
useEffect fetches course data
     ↓
setLoading(true)
     ↓
fetch(`/api/courses/${courseId}`)
     ↓
API returns: { course, lessons, quizzes }
     ↓
setCourseDetails(data.course)
     ↓
setLessons(data.lessons)
     ↓
setLoading(false)
     ↓
Modal renders with data
```

### On Lesson Complete
```
User clicks "Complete" button
     ↓
handleCompleteLesson(lessonId) called
     ↓
POST /api/progress
     ↓
API updates database
     ↓
API logs activity
     ↓
API returns success
     ↓
setLessons (update UI)
     ↓
toast({ success message })
     ↓
Lesson shows checkmark
```

---

## 🧪 Testing Interactions

### Test 1: Modal Opens Correctly
- [ ] Click "Continue" on course
- [ ] Modal appears with animation
- [ ] Modal shows course title
- [ ] Tabs are visible
- [ ] Close button (X) works

### Test 2: Lessons Load
- [ ] Switch to Lessons tab
- [ ] Lessons appear with animation
- [ ] Lesson data displays correctly
- [ ] Complete button is visible
- [ ] No error messages

### Test 3: Complete Lesson
- [ ] Click Complete button
- [ ] Button disappears
- [ ] Checkmark appears
- [ ] Toast notification shows
- [ ] No console errors

### Test 4: Share Functionality
- [ ] Hover over course
- [ ] Share button appears
- [ ] Click share button
- [ ] Share dialog/notification appears
- [ ] Works on desktop and mobile

### Test 5: Dropdown Menu
- [ ] Hover over course
- [ ] Menu button appears
- [ ] Click menu button
- [ ] Dropdown opens
- [ ] All menu items visible
- [ ] Menu items are clickable

---

## 🎯 Performance Metrics

### Interaction Performance
```
Click to modal open: < 300ms
Lessons list render: < 500ms
API response time: < 500ms
Animation frame rate: 60fps (smooth)
Total time to interactive: < 1s
```

### Memory Usage
```
Modal component: ~50KB
API response: ~20KB
Total page: ~150KB (gzipped)
```

---

This guide covers all interactive elements and user flows in your enhanced dashboard!


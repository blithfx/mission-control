# Mission Control Dashboard

A real-time agent activity monitoring dashboard built with Next.js 14+, Convex, and shadcn/ui.

## Features

- **Activity Feed** - Real-time feed of all agent actions with filtering by type
- **Calendar View** - Weekly calendar showing scheduled tasks and cron jobs
- **Global Search** - Search across memories, documents, activities, and tasks
- **Dark Mode** - Beautiful dark theme by default

## Tech Stack

- **Next.js 14+** with App Router
- **Convex** for real-time database
- **Tailwind CSS** + **shadcn/ui** for styling
- **TypeScript** for type safety

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Convex

```bash
npx convex dev
```

This will:
- Create a Convex deployment
- Generate the `convex/_generated` folder
- Output your deployment URL

### 3. Configure Environment

Copy the Convex URL from step 2 to your `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### 4. Run the Development Server

In one terminal, run Convex:
```bash
npx convex dev
```

In another terminal, run Next.js:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 5. Seed Sample Data

Go to Settings (/settings) and click "Seed Data" to populate the database with sample data.

## Project Structure

```
mission-control/
├── app/                    # Next.js App Router pages
│   ├── activity/          # Activity Feed page
│   ├── calendar/          # Calendar page
│   ├── search/            # Global Search page
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout with sidebar
│   └── page.tsx           # Dashboard home
├── components/
│   ├── activity/          # Activity feed components
│   ├── calendar/          # Calendar components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components (Sidebar)
│   ├── providers/         # Context providers
│   ├── search/            # Search components
│   └── ui/                # shadcn/ui components
├── convex/                 # Convex backend
│   ├── schema.ts          # Database schema
│   ├── activities.ts      # Activity queries/mutations
│   ├── scheduledTasks.ts  # Task queries/mutations
│   ├── search.ts          # Global search query
│   └── seed.ts            # Sample data seeder
└── lib/                    # Utilities
```

## Convex Schema

### Activities
- `timestamp` - When the action occurred
- `actionType` - Type of action (email, cron, api, message, etc.)
- `description` - Human-readable description
- `status` - success | pending | error
- `metadata` - Optional additional data

### Scheduled Tasks
- `name` - Task name
- `cronExpression` - Cron schedule
- `taskType` - Type of task
- `description` - Task description
- `enabled` - Whether task is active
- `nextRun` - Next scheduled run time
- `color` - Display color

### Memories
- `title` - Memory title
- `content` - Memory content
- `createdAt` - Creation timestamp
- `tags` - Optional tags array

### Documents
- `title` - Document title
- `content` - Document content
- `path` - File path
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## License

MIT

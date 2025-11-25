# Running TLG as a Next.js App with Front-End

This document describes how to run the Time Line Generator (TLG) as a Next.js application with a front-end interface.

## Overview

Running TLG as a Next.js application provides a full-featured web interface for:
- Viewing generated timeline articles
- Manually triggering article generation
- Managing repository configurations
- Displaying work history in an interactive timeline

## Prerequisites

Before running the Next.js app, ensure you have:

- **Node.js 20+** installed
- **npm** or **pnpm** package manager
- **MongoDB** database (Atlas free tier recommended)
- **OpenAI API key** (for LLM article generation)
- Git repositories to track

## Project Structure

```
TLG/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (Timeline display)
│   │   ├── api/
│   │   │   └── timeline/
│   │   │       └── route.ts    # API routes for timeline CRUD
│   │   └── generate/
│   │       └── page.tsx        # Manual generation interface
│   ├── components/
│   │   ├── Timeline.tsx        # Timeline display component
│   │   ├── ArticleCard.tsx     # Individual article card
│   │   └── GenerateForm.tsx    # Generation trigger form
│   ├── lib/
│   │   ├── mongodb.ts          # Database connection
│   │   ├── git-parser.ts       # Git repository parsing
│   │   ├── llm-client.ts       # OpenAI integration
│   │   └── timelineClient.ts   # API client utilities
│   └── models/
│       └── Article.ts          # Mongoose schema
├── public/                     # Static assets
├── articles.js                 # Example article data structure
├── timelineClient.ts           # TypeScript API client
├── package.json
├── .env.local                  # Environment variables (not committed)
├── .env.example                # Environment template
└── next.config.js              # Next.js configuration
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Git Configuration
REPOS=/path/to/repo1,/path/to/repo2
GIT_AUTHOR=Your Name

# LLM Configuration
OPENAI_API_KEY=sk-your-api-key-here
LLM_MODEL=gpt-4-turbo-preview

# Database Configuration
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tlg

# API Configuration (for external integrations)
API_ENDPOINT=https://your-api.com
API_KEY=your-api-key
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Application Features

### Timeline Display

The main page displays all generated timeline articles in a chronological format:
- Articles are grouped by date
- Each article shows the repository/project name
- Updates are organized by time period (Morning/Afternoon/Evening)
- Descriptions provide detailed work summaries

### Manual Article Generation

The `/generate` page allows manual triggering of article generation:
1. Select repositories to analyze
2. Choose time period
3. Click "Generate Article"
4. View and edit the generated content
5. Save to database

### API Endpoints

The Next.js app exposes REST API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/timeline` | Fetch all timeline articles |
| POST | `/api/timeline` | Create a new article |
| GET | `/api/timeline/[id]` | Fetch specific article |
| PUT | `/api/timeline/[id]` | Update an article |
| DELETE | `/api/timeline/[id]` | Delete an article |

## Using the API Client

The `timelineClient.ts` provides helper functions:

```typescript
import { fetchTimeline, postTimelineEntry } from './timelineClient';

// Fetch all articles
const articles = await fetchTimeline();

// Post a new article
const newArticle = await postTimelineEntry({
  title: 'Portfolio Frontend',
  date: '20/11/25',
  updates: [
    {
      period: 'Morning',
      description: 'Implemented new feature...'
    }
  ]
});
```

## Deployment Options

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
```

### Self-Hosted

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## Scheduled Generation

For automatic article generation in a Next.js environment, consider:

### Option 1: Vercel Cron Jobs

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/generate",
      "schedule": "0 23 * * *"
    }
  ]
}
```

### Option 2: External Cron Service

Use services like cron-job.org to trigger the generation endpoint:
- URL: `https://your-app.vercel.app/api/generate`
- Schedule: Daily at 11 PM
- Method: POST

## Advantages of Next.js Approach

| Advantage | Description |
|-----------|-------------|
| **Interactive UI** | Full web interface for viewing and managing timeline |
| **Real-time Updates** | Instant feedback when generating articles |
| **API Integration** | RESTful API for external integrations |
| **Easy Deployment** | One-click deployment to Vercel |
| **SEO Friendly** | Server-side rendering for public timeline pages |
| **Authentication** | Easy to add user authentication (NextAuth.js) |

## Disadvantages

| Disadvantage | Description |
|--------------|-------------|
| **Infrastructure** | Requires hosting and database |
| **Complexity** | More setup than GitHub Actions |
| **Cost** | Potential hosting costs (though Vercel free tier is generous) |
| **Maintenance** | Requires ongoing server maintenance |

## Best Use Cases

The Next.js approach is best when you need:
- A public-facing timeline website
- Manual control over article generation
- Integration with other web applications
- User authentication and access control
- Custom UI/UX for timeline display
- Multiple users or team collaboration

## Troubleshooting

### Development Server Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Database Connection Issues

- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your server

### Build Errors

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Lint the codebase
npm run lint
```

## Related Documentation

- [SETUP.md](SETUP.md) - General setup instructions
- [IMPLEMENTATION_IDEAS.md](IMPLEMENTATION_IDEAS.md) - Detailed implementation guide
- [RUNNING_WITH_GITHUB_ACTIONS.md](RUNNING_WITH_GITHUB_ACTIONS.md) - Alternative approach using GitHub Actions
- [WORK_REPORT.md](WORK_REPORT.md) - Project status and progress

## Summary

Running TLG as a Next.js application provides a comprehensive web-based solution for timeline generation and display. While it requires more initial setup than the GitHub Actions approach, it offers greater flexibility, a better user experience, and easier integration with other web-based tools and services.

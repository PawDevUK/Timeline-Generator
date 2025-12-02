
# Time Line Generator (TLG)

**Time Line Generator** is a full-stack project that tracks changes in selected repositories and generates human-friendly daily summaries of work. TLG collects git commits and file changes, summarizes them (optionally using OpenAI's chatGPT API), and stores the results in a database for display in a portfolio timeline or via API.

## Timeline Generation Flow

1. **Collect commits**: Use utility scripts to fetch commit history from local or remote repositories (via GitHub API).
2. **Summarize changes**: Aggregate and compress commit messages into concise bullets.
3. **Generate article**: Use OpenAI's chatGPT API to turn bullets into a readable summary article (see `app/api/chatGPT/route.ts`).
4. **Store and display**: Save articles in MongoDB and render them in the timeline UI.

## OpenAI Integration

- The backend uses OpenAI's API to generate timeline articles from commit summaries.
- API key is stored in `.env.local` as `OPENAI_API_KEY`.
- See `app/api/chatGPT/route.ts` for the integration example.

## Project Overview

TLG is commonly run as a **Next.js application** and provides:

- **Automated Git Tracking**: Collects commits and file changes from repositories (local or remote)
- **AI-Powered Summaries**: Optionally generates human-readable summaries using an LLM
- **Web Interface**: Interactive timeline display and management (Next.js front end)
- **REST API**: API routes for creating and retrieving timeline articles
- **Database Integration**: MongoDB storage for timeline history


## Quick Start (local development)

The repository contains both Next.js app wiring and small TypeScript utilities you can run locally. The recommended flow for development is:

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables:

- Copy `.env.example` to `.env.local` (or set environment variables directly).
- If you want to fetch commits from private repositories or avoid strict rate limits, set a GitHub personal access token with appropriate scopes (for public repos a token is optional but recommended for higher rate limits).

Example (.env.local):

```text
GITHUB_TOKEN=ghp_xxx
MONGODB_URI=mongodb+srv://...   # if you use MongoDB
```

1. Run the Next.js development server (if you're running the web app):

```bash
npm run dev
```

1. Run the TypeScript utilities directly (no build) using `tsx` (installed as a dev dependency):

```bash
# run the timeline client script
npx tsx timelineClient.ts
# or use the npm script
npm run run:timeline
```

1. Or build the TypeScript sources and run the output:

```bash
npm run build
node dist/timelineClient.js
```

### Quick Links

- Want to understand the project? → Read [SUMMARY.md](docs/SUMMARY.md)
- Ready to get started? → Follow [RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)
- Need to set up? → Use [SETUP.md](SETUP.md)
- Ready to build? → Follow [IMPLEMENTATION_IDEAS.md](docs/IMPLEMENTATION_IDEAS.md)
- Check progress? → See [WORK_REPORT.md](docs/WORK_REPORT.md)
- Alternative: GitHub Actions? → See [RUNNING_WITH_GITHUB_ACTIONS.md](RUNNING_WITH_GITHUB_ACTIONS.md)

## ToDo (next steps)

### Front-end

- [ ] Add repo list sorting (by last_update, created, alphabetical)
- [ ] Build Time Line component to render articles
- [ ] Connect frontend to API for article generation and display

### Backend & Data

- [x] Article data shape defined (`article.type.ts`)
- [x] Utility scripts for fetching commits (`timelineClient.ts`, `githubFetcher.ts`)
- [x] OpenAI API integration for article generation (`app/api/chatGPT/route.ts`)
- [ ] Wire article generation into API routes and database
- [ ] Set up MongoDB connection and deployable backend

### Integration & Automation

- [ ] Automate daily/weekly timeline generation (cron or webhook)
- [ ] Add error handling and logging for API calls
- [ ] Add caching for generated articles

### Planning & Decisions

- [x] Project name: **Time Line Generator**
- [x] Stack: **Next.js** + MongoDB + OpenAI

---

---

## Key files

- `timelineClient.ts` — CLI/utility for fetching commits and generating summaries
- `githubFetcher.ts` — GitHub API integration for commit and file stats
- `article.type.ts` — TypeScript definitions for timeline articles
- `app/api/chatGPT/route.ts` — API route for generating articles using OpenAI
- `SETUP.md`, `RUNNING_AS_NEXTJS.md` — Setup and deployment instructions

---

## Troubleshooting

- **OpenAI API key issues**: Keys must be created at <https://platform.openai.com/account/api-keys> and stored in `.env.local`. Keys are only shown once—copy and save immediately.
- **API route 404**: Use `/api/chatGPT` (not `/chatGPT`). File must be at `app/api/chatGPT/route.ts`.
- **401 Unauthorized**: Double-check your API key, restart dev server after changes, and never hardcode keys in source files.
- **No summary in response**: Update prompts and schema to require a summary field.

## Example API usage

Request:

```
GET http://localhost:3000/api/chatGPT
```

Response:

```
{
 "title": "Daily Update",
 "date": "2025-12-02",
 "summary": "Today, the navbar routing was fixed for mobile, a metrics endpoint was added, and CI build pipeline was optimized for faster deployments.",
 "bullets": [
  "Fix navbar mobile routing issue",
  "Add metrics endpoint at api/metrics.js",
  "CI build pipeline optimised; ~30% faster"
 ]
}
```

---

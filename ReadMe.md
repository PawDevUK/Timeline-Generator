# Time Line Generator (TLG)

**Time Line Generator** is a project that automatically tracks changes in selected repositories and generates human-friendly daily summaries of work. TLG collects commits and file changes, summarizes them (optionally using an LLM), and stores the results in a database so they can be displayed in a portfolio timeline or consumed via an API.

## Project Overview

TLG is commonly run as a **Next.js application** and provides:

- **Automated Git Tracking**: Collects commits and file changes from repositories (local or remote)
- **AI-Powered Summaries**: Optionally generates human-readable summaries using an LLM
- **Web Interface**: Interactive timeline display and management (Next.js front end)
- **REST API**: API routes for creating and retrieving timeline articles
- **Database Integration**: MongoDB storage for timeline history

## 📚 Documentation

Comprehensive documentation has been created for this project:

- **[SUMMARY.md](docs/SUMMARY.md)** - Start here! Executive summary with recommendations and quick start guide
- **[RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)** - **PRIMARY**: How to run TLG as a Next.js application (recommended approach)
- **[SETUP.md](SETUP.md)** - Step-by-step setup instructions for Next.js deployment
- **[WORK_REPORT.md](docs/WORK_REPORT.md)** - Detailed project status, completed work, and remaining tasks
- **[IMPLEMENTATION_IDEAS.md](docs/IMPLEMENTATION_IDEAS.md)** - Complete implementation guide with architecture options and code examples

### Quick Start (local development)

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

## ToDo (high level)

### Front-end

- [ ] Add functionality to sort repo list by last_update, created, alphabetical
- [ ] Add Time Line component which will be rendering the articles.
- [ ] Set the chatGPT to generate the article.

### Data & Backend

- [x] Article data shape exists (see `article.type.ts`)
- [ ] Create steps to generate an article and wire them into API routes
- [ ] Add OpenAI integration for automatic article generation (optional)
- [ ] Set the chatGPT to generate the article.

### Planning & Decisions

- [x] Picked project name: **Time Line Generator**
- [x] Stack decision: **Next.js** with MongoDB and OpenAI (optional)

### Project setup

- [x] Initialize repository and TypeScript
- [x] Add utility scripts for fetching commits from GitHub (`timelineClient.ts`, `githubFetcher.ts`)
- [ ] Set up MongoDB connection and deployable back-end

---

## Key files

- `timelineClient.ts` — CLI/utility that coordinates fetching commits and generating summaries.
- `githubFetcher.ts` — GitHub API integration (fetches commits and file stats from remote repos).
- `article.type.ts` — TypeScript definitions for the Article shape used by the system.
- `SETUP.md`, `RUNNING_AS_NEXTJS.md` — More detailed deployment and setup instructions.

If you'd like, I can also:

- Add a small example script that demonstrates fetching commits from a public repo and printing a summary.
- Add a short troubleshooting section for common GitHub API permission/rate-limit issues.

---

If this update looks good, I can commit the changes or add the example script next.

# Time Line Generator (TLG)

**Time Line Generator** is a Next.js application that automatically tracks changes in selected repositories using git. TLG reads what is done in your repositories and, based on changes, updates, insertions, and deletions, generates summaries of the work done during the day. These summaries are then uploaded to a server and saved in a database for portfolio and timeline display.

## Project Overview

TLG is built as a **Next.js application** that provides:
- **Automated Git Tracking**: Monitors repository changes automatically
- **AI-Powered Summaries**: Generates human-readable work summaries using LLM
- **Web Interface**: Interactive timeline display and management
- **REST API**: Endpoints for integrating with other applications
- **Database Integration**: MongoDB storage for timeline history

## 📚 Documentation

Comprehensive documentation has been created for this project:

- **[SUMMARY.md](docs/SUMMARY.md)** - Start here! Executive summary with recommendations and quick start guide
- **[RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)** - **PRIMARY**: How to run TLG as a Next.js application (recommended approach)
- **[SETUP.md](SETUP.md)** - Step-by-step setup instructions for Next.js deployment
- **[WORK_REPORT.md](docs/WORK_REPORT.md)** - Detailed project status, completed work, and remaining tasks
- **[IMPLEMENTATION_IDEAS.md](docs/IMPLEMENTATION_IDEAS.md)** - Complete implementation guide with architecture options and code examples

### Quick Start with Next.js

TLG is designed to run as a Next.js application. To get started:

1. **Install Dependencies**: `npm install`
2. **Configure Environment**: Copy `.env.example` to `.env.local` and add your configuration
3. **Start Development Server**: `npm run dev`
4. **Access the App**: Open `http://localhost:3000`

See **[RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)** for complete setup instructions.

### Quick Links
- Want to understand the project? → Read [SUMMARY.md](docs/SUMMARY.md)
- Ready to get started? → Follow [RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md)
- Need to set up? → Use [SETUP.md](SETUP.md)
- Ready to build? → Follow [IMPLEMENTATION_IDEAS.md](docs/IMPLEMENTATION_IDEAS.md)
- Check progress? → See [WORK_REPORT.md](docs/WORK_REPORT.md)
- Alternative: GitHub Actions? → See [RUNNING_WITH_GITHUB_ACTIONS.md](RUNNING_WITH_GITHUB_ACTIONS.md)

## Development Roadmap

**Phase 1: Planning & Decisions**
- [x] Find good name for this package: **Time Line Generator**
- [x] Decide on stack: **Next.js** with MongoDB and OpenAI
- [x] Decide on LLM: OpenAI API will be used for article generation
- [x] Decide on approach: **Next.js application** with web interface

**Phase 2: Project Setup**
- [x] Create separate project which will be independent repository
- [ ] Set up Next.js project structure with App Router
- [ ] Configure TypeScript and ESLint
- [ ] Set up MongoDB connection

**Phase 3: Data Structure Design**
- [x] Create article object structure with all keys (see `articles.js`)
- [ ] Create steps to generate an article
- [ ] Implement article type definitions in TypeScript

**Phase 4: Backend Development (Next.js API Routes)**
- [ ] Create MongoDB schema for articles
- [ ] Create API routes for article CRUD operations (`/api/timeline`)
- [ ] Implement git repository parsing logic
- [ ] Integrate OpenAI API for article generation

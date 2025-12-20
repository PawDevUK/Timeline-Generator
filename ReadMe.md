# Time Line Generator (TLG)

**Time Line Generator** is a full-stack web application that tracks changes in selected GitHub repositories and generates human-friendly daily summaries of work. TLG collects git commits and file changes, summarizes them using OpenAI's ChatGPT API, and stores the results in a MongoDB database. The app features user authentication, a web interface for managing repositories and viewing timelines, and API endpoints for automation.

## Features

- **Automated Git Tracking**: Fetches commits and file changes from GitHub repositories with date filtering.
- **AI-Powered Summaries**: Generates readable summary articles using OpenAI's ChatGPT API.
- **User Authentication**: Supports login via GitHub OAuth or custom credentials (username/password).
- **Web Interface**: Interactive dashboard for repository management, timeline display, and user settings.
- **REST API**: Endpoints for fetching commits, generating summaries, and user management.
- **Database Integration**: MongoDB with Mongoose for storing users, repositories, and timeline articles.

## Timeline Generation Flow

1. **Authenticate User**: Users log in via NextAuth (GitHub or credentials).
2. **Select Repository**: Choose a GitHub repository to analyze.
3. **Fetch Commits**: Use GitHub API to retrieve commits within a specified date range.
4. **Summarize Changes**: Aggregate commit messages and generate a concise summary using ChatGPT.
5. **Store and Display**: Save the article in MongoDB and display in the timeline UI.

## Authentication

- Integrated with NextAuth.js for secure authentication.
- Supports GitHub OAuth and custom credentials provider.
- User registration and login via API routes.
- Session management with JWT strategy.

## OpenAI Integration

- Uses OpenAI's ChatGPT API to generate timeline articles from commit data.
- API key stored in `.env.local` as `CHATGPT_API`.
- Custom prompts for structured summaries (see `app/api/chatGPT/prompts.ts`).

## Project Overview

TLG is built as a **Next.js App Router** application with:

- **Frontend**: React components with Tailwind CSS for UI.
- **Backend**: API routes for commits, summaries, and auth.
- **Database**: MongoDB Atlas for data persistence.
- **Authentication**: NextAuth.js with GitHub and credentials providers.
- **Deployment**: Ready for Vercel or similar platforms.

## Quick Start (Local Development)

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Configure Environment Variables**:

   Copy `.env.example` to `.env.local` and fill in the required values:

   ```env
   CHATGPT_API=sk-proj-...
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   MONGO_DB_TLG=mongodb+srv://...
   GITHUB_TOKEN=ghp_...  # Optional, for higher rate limits
   ```

   - **CHATGPT_API**: OpenAI API key from [OpenAI Platform](https://platform.openai.com/account/api-keys).
   - **NEXTAUTH_SECRET**: Random string for JWT signing.
   - **NEXTAUTH_URL**: Full URL of your app (e.g., `http://localhost:3000`).
   - **GitHub OAuth**: Create an OAuth app at [GitHub Settings](https://github.com/settings/applications/new) for authentication.
   - **MONGO_DB_TLG**: MongoDB Atlas connection string.
   - **GITHUB_TOKEN**: Personal access token for GitHub API (optional but recommended).

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to access the app. You'll be redirected to login if not authenticated.

4. **Register and Login**:

   - Use the `/login` page to sign up or log in.
   - For credentials: Register via API or form, then log in.
   - For GitHub: Click the GitHub button to authenticate.

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login with credentials.
- `GET /api/auth/session`: Get current session (handled by NextAuth).

### GitHub & Summaries

- `GET /api/getRepoCommits?repo=owner/repo&since=YYYY-MM-DD&until=YYYY-MM-DD`: Fetch commits from a repository.
- `POST /api/chatGPT`: Generate a summary article from commit data.

### Articles (CRUD)

- `GET /api/articles`: Get all articles.
- `POST /api/articles`: Create a new article (requires `title`, `date`, `description`).
- `GET /api/articles/:id`: Get a specific article by ID.
- `PUT /api/articles/:id`: Update an article by ID (partial updates supported).
- `DELETE /api/articles/:id`: Delete an article by ID.

## Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `api/`: API endpoints (auth, chatGPT, commits, db).
  - `login/`: Login page.
  - `dashboard/`: Protected dashboard.
- `timelineClient.ts`: CLI utility for timeline generation.
- `app/api/db/`: Database connection and models.
- `app/api/auth/`: NextAuth configuration.

## ToDo (Next Steps)

### Completed

- [x] User authentication with NextAuth (GitHub OAuth and credentials).
- [x] MongoDB integration with Mongoose (User model).
- [x] API for fetching GitHub commits with date filtering.
- [x] ChatGPT integration for summary generation.
- [x] Session management and protected routes.
- [x] Custom login/register routes.
- [x] Timeline data management (merge, sort, dedupe).

### In Progress / Planned

- [ ] Fetching dates of active days so the summary can be created based on this dates.
- [ ] Add error handling and logging.
- [ ] Password hashing with bcrypt.
- [ ] Email verification for registration.
- [x] Add repository management UI (add/remove repos).
- [x] Implement timeline display component.
- [x] Automate daily summary generation (cron jobs).
- [x] Deploy the app to vercel.

## Troubleshooting

- **Session Undefined**: Ensure `NEXTAUTH_URL` is set correctly and restart the server. Check if user is signed in.
- **OpenAI API Errors**: Verify `CHATGPT_API` key is valid and has credits. Check prompts in `prompts.ts`.
- **GitHub API Rate Limits**: Use `GITHUB_TOKEN` for higher limits. Handle 403 errors.
- **MongoDB Connection**: Ensure `MONGO_DB_TLG` is correct and network access is allowed.
- **NextAuth Issues**: Check `options.ts` for provider config. Use `NEXTAUTH_SECRET` for security.
- **401 Unauthorized**: Restart dev server after env changes. Never commit API keys.

## Example API Usage

**Fetch Commits**:

```
GET /api/getRepoCommits?repo=PawDevUK/TLG&since=2025-12-01&until=2025-12-07
```

**Generate Summary**:

```
POST /api/chatGPT
{
  "commits": ["Fixed navbar routing", "Added metrics endpoint"],
  "repo": "PawDevUK/TLG"
}
```

Response:

```json
{
  "title": "Daily Update",
  "date": "2025-12-07",
  "summary": "Today, navbar routing was fixed and a metrics endpoint was added.",
  "bullets": [
    "Fixed navbar mobile routing issue",
    "Added metrics endpoint at api/metrics.js"
  ]
}
```

## Contributing

- Fork the repo and create a feature branch.
- Follow TypeScript best practices.
- Test API routes and UI components.
- Update this README for any new features.

## License

MIT License.

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
- [ ] Add recover password

### Backend & Data

- [x] Article data shape defined (`article.type.ts`)
- [x] Utility scripts for fetching commits (`timelineClient.ts`, `githubFetcher.ts`)
- [x] OpenAI API integration for article generation (`app/api/chatGPT/route.ts`)
- [ ] Wire article generation into API routes and database
- [ ] Set up MongoDB connection and deployable backend.
- [ ] Finish auth. Create the authorisation for login and register.
- [ ] Connect DB and save article.
- [ ] Create logic to run it everyday.

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

# Time Line Generator (TLG)

**Time Line Generator** is a full-stack Next.js application that tracks GitHub repositories and automatically generates AI-powered daily summaries of development work. TLG fetches commits from GitHub, uses OpenAI's ChatGPT API to create human-readable articles, and stores everything in MongoDB. The app features NextAuth authentication, an interactive dashboard for repository management, and a timeline view for browsing generated articles.

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

```
/TLG/
├── app/                              # Next.js App Router
│   ├── api/                          # API routes (server-side)
│   │   ├── auth/                     # Authentication endpoints
│   │   ├── gitHub/                   # GitHub API integrations
│   │   ├── repository/               # Single repository operations
│   │   └── repositories/             # Multi-repository operations
│   │       └── articles/             # Article CRUD endpoints
│   ├── components/                   # Shared UI components
│   ├── dashboard/                    # Dashboard pages
│   ├── login/                        # Login pages
│   ├── repos/                        # Repository listing page
│   ├── timeLine/                     # Timeline view page
│   └── utils/                        # Client-side utilities
│
├── lib/                              # Server-side logic
│   ├── createRepo/                   # Repository creation logic
│   ├── chatGPT/                      # OpenAI integration
│   └── db/                           # Database layer
│       ├── models/                   # Mongoose models
│       └── schema/                   # Mongoose schemas
│
├── types/                            # TypeScript type definitions
│   ├── article.type.ts
│   ├── repository.type.ts
│   └── user.type.ts
│
└── public/                           # Static assets
```

## ToDo (Next Steps)

### Completed ✅

- [x] User authentication with NextAuth (GitHub OAuth and credentials)
- [x] MongoDB integration with Mongoose
- [x] API for fetching GitHub commits with date filtering
- [x] ChatGPT integration for summary generation
- [x] Session management and protected routes
- [x] Timeline data management (merge, sort, dedupe)
- [x] Repository object with tracking functionality
- [x] Repository management UI (add/remove repos)
- [x] Timeline display component with combined articles
- [x] Automated daily summary generation
- [x] Next.js App Router structure following best practices
- [x] Proper file structure (lib/, types/, app/)

### In Progress / Planned 🚧

- [ ] Add updateing TLG repository's articles. Instead of generating all repo obj app need to check which day is missing and generate article only for missing days.
- [ ] Add handling for non-existing repository
- [ ] Add handling for requesting duplicate repository with timeline
- [ ] Add checker for processed repo in DB (add if missing)
- [ ] Create functionality to update saved processed repo
- [ ] Fix creation of day article (single source for commits)
- [ ] Add error handling and logging
- [ ] Password hashing with bcrypt
- [ ] Email verification for registration
- [ ] Add repository list sorting (by last_update, created, alphabetical)
- [ ] Add recover password functionality
- [ ] Implement caching for generated articles

## Troubleshooting

- **Session Undefined**: Ensure `NEXTAUTH_URL` is set correctly and restart the server. Check if user is signed in.
- **OpenAI API Errors**: Verify `CHATGPT_API` key is valid and has credits. Check prompts in `prompts.ts`.
- **GitHub API Rate Limits**: Use `GITHUB_TOKEN` for higher limits. Handle 403 errors.
- **MongoDB Connection**: Ensure `MONGO_DB_TLG` is correct and network access is allowed.
- **NextAuth Issues**: Check `options.ts` for provider config. Use `NEXTAUTH_SECRET` for security.
- **401 Unauthorized**: Restart dev server after env changes. Never commit API keys.

## Example API Usage

**Generate Repository with Articles**:

```bash
POST /api/repositories
Content-Type: application/json

{
  "user": "pawdevUK",
  "repo": "TLG"
}
```

**Get All Repositories**:

```bash
GET /api/repositories
```

Response:

```json
{
  "repositories": [
    {
      "_id": "...",
      "name": "TLG",
      "user": "pawdevUK",
      "articles": [
        {
          "title": "TLG - Authentication Implementation",
          "date": "2025-11-20",
          "description": "Implemented NextAuth with GitHub OAuth and credentials provider...",
          "createdAt": "2025-11-21T10:00:00.000Z"
        }
      ],
      "createdAt": "2025-11-21T10:00:00.000Z"
    }
  ]
}
```

**Get All Articles (Timeline)**:

```bash
GET /api/repositories/articles
```

Response:

```json
{
  "articles": [
    {
      "_id": "...",
      "title": "TLG - Authentication Implementation",
      "date": "2025-11-20",
      "description": "Implemented NextAuth...",
      "createdAt": "2025-11-21T10:00:00.000Z"
    }
  ]
}
```

## Contributing

- Fork the repo and create a feature branch.
- Follow TypeScript and Next.js best practices.
- Keep server logic in `/lib`, API routes in `/app/api`.
- Centralize types in `/types`.
- Test API routes and UI components.
- Update this README for any new features.

## License

MIT License.

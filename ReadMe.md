# Time Line Generator (TLG)

**Time Line Generator (TLG)** is a full-stack Next.js application that automatically tracks GitHub repositories and generates AI-powered daily summaries of development activity. Built with TypeScript, TLG fetches commit history from GitHub, analyzes development patterns, and uses OpenAI's ChatGPT API to create human-readable articles that document your coding journey. The application features secure authentication, repository management, and an interactive timeline interface for browsing your development history.

## Features

- **🔄 Automated Repository Tracking**: Automatically fetches and monitors GitHub repository commits with intelligent date filtering and pagination
- **🤖 AI-Powered Summaries**: Generates professional, human-readable summary articles using OpenAI's GPT API with customizable tone and length
<!-- - **🔐 Secure Authentication**: Multi-provider authentication via NextAuth.js supporting GitHub OAuth and credentials-based login -->
- **📊 Interactive Dashboard**: Modern web interface for searching repositories, managing tracked repos, and visualizing development timelines
- **🛠️ RESTful API**: Comprehensive API endpoints for commits, repository management, article CRUD operations, and user management
- **💾 Database Integration**: MongoDB with Mongoose ODM for persistent storage of users, repositories, and generated timeline articles
- **📅 Activity Tracking**: Tracks active commit days and generates detailed statistics for each repository
- **🎨 Modern UI**: Built with React 19, Tailwind CSS 4, and responsive design patterns

## Technology Stack

### Frontend

- **Next.js 16.0.7** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Styled Components 6.1.19** - CSS-in-JS styling

### Backend & API

- **Next.js API Routes** - Serverless API endpoints
<!-- - **NextAuth 4.24.13** - Authentication library -->
- **Mongoose 9.0.0** - MongoDB ODM
- **OpenAI 6.9.1** - ChatGPT API integration
- **Axios 1.13.2** - HTTP client

### Database & Storage

- **MongoDB Atlas** - Cloud database
- **Mongoose Schemas** - Data modeling

### Development Tools

- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **date-fns 4.1.0** - Date utilities
<!-- - **jsonwebtoken 9.0.2** - JWT handling -->

## Timeline Generation Flow

<!-- 1. **🔐 Authenticate User**: Users log in securely via NextAuth (GitHub OAuth or credentials) -->
1. **🔍 Search & Select Repository**: Browse and select GitHub repositories to track
2. **📥 Fetch Commit History**: Retrieve all commits from repository inception or specific date ranges via GitHub API
3. **🗓️ Group by Date**: Organize commits by activity days
4. **🤖 AI Summarization**: Generate human-readable summaries for each day's work using ChatGPT
5. **💾 Store Articles**: Save generated articles to MongoDB with repository metadata
6. **📊 Display Timeline**: View chronological development history in the interactive UI

<!-- ## Authentication

- **NextAuth.js Integration**: Secure, industry-standard authentication
- **Multiple Providers**:
  - GitHub OAuth (recommended for seamless GitHub integration)
  - Credentials Provider (username/password)
- **Session Management**: JWT-based sessions with 30-day expiration
- **Protected Routes**: Automatic redirect to login for unauthorized access
- **User Registration**: API endpoints for new user creation -->

<!-- ⚠️ **Security Note**: Authentication is currently disabled. When implementing authentication, ensure proper password hashing with bcrypt and secure session management. -->

## OpenAI Integration

- Uses OpenAI's ChatGPT API to generate timeline articles from commit data.
- API key stored in `.env.local` as `CHATGPT_API`.
- Custom prompts for structured summaries (see `app/api/chatGPT/prompts.ts`).

## Project Overview

TLG is built as a **Next.js App Router** application with:

- **Frontend**: React components with Tailwind CSS for UI.
- **Backend**: API routes for commits, summaries, and repository management.
- **Database**: MongoDB Atlas for data persistence.
<!-- - **Authentication**: NextAuth.js with GitHub and credentials providers. -->
- **Deployment**: Ready for Vercel or similar platforms.

## Quick Start (Local Development)

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Configure Environment Variables**:

   Create a `.env.local` file in the root directory:

   ```env
   # OpenAI Configuration (Required)
   CHATGPT_API=sk-proj-your-openai-api-key

   # MongoDB (Required)
   MONGO_DB_TLG=mongodb+srv://username:password@cluster.mongodb.net/tlg?retryWrites=true&w=majority

   # GitHub API Token (Optional but recommended)
   GITHUB_TOKEN=ghp_your-personal-access-token

   <!-- Authentication currently disabled
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-random-secret-string-min-32-chars
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

   # JWT Secret
   JWT_SECRET=your-jwt-secret-string
   -->
   ```

   ### Setup Instructions

   **OpenAI API Key**:
   1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
   2. Create a new API key
   3. Copy and paste into `CHATGPT_API`

   **MongoDB Atlas**:
   1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   2. Create a cluster
   3. Set up database user and password
   4. Get connection string from "Connect" → "Connect your application"
   5. Replace `<password>` with your database password

   **GitHub Personal Access Token** (optional):
   1. Go to [GitHub Token Settings](https://github.com/settings/tokens)
   2. Generate new token (classic)
   3. Select scopes: `repo` (for private repos) or `public_repo` (for public only)
   4. Copy token (starts with `ghp_`)
   5. Increases API rate limit from 60 to 5000 requests/hour

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to access the app.

<!-- 4. **Register and Login** (Currently Disabled):

   - Use the `/login` page to sign up or log in.
   - For credentials: Register via API or form, then log in.
   - For GitHub: Click the GitHub button to authenticate.
-->

## API Endpoints

<!-- ### Authentication Endpoints (Currently Disabled)

#### Register New User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "email": "string" (optional)
}
```

#### Login with Credentials

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: { "token": "jwt-token" }
```

#### Logout

```http
GET /api/auth/logout
```

#### Get Current Session

```http
GET /api/auth/session
```
-->

### GitHub Integration Endpoints

#### Fetch User Info

```http
GET /api/gitHub/fetchGitHubUserInfo
```

#### Get User's Repository List

```http
GET /api/gitHub/getUserRepoList?user={username}
```

#### Get Repository Active Days

```http
GET /api/gitHub/getRepoActiveDays?user={username}&repo={reponame}
```

#### Get All Repository Commits (Paginated)

```http
GET /api/gitHub/getRepoAllCommits?user={username}&repo={reponame}&maxPages={number}
```

#### Get Commits for Specific Day

```http
GET /api/gitHub/getRepoDayCommits?user={username}&repo={reponame}&date={YYYY-MM-DD}
```

### Repository Management

#### Create/Track New Repository

```http
POST /api/repositories
Content-Type: application/json

{
  "user": "github-username",
  "repo": "repository-name"
}

Response: Creates repository object with generated articles
Note: May take several minutes for repositories with extensive history
```

#### Get All Tracked Repositories

```http
GET /api/repositories

Response: {
  "repositories": [Repository[]]
}
```

### Timeline Endpoint

#### Get Combined Timeline (Recommended)

```http
GET /api/timeline

Response: {
  "timeline": [Article[]]
}
```

**Description**: Returns a combined, sorted timeline of all articles from all tracked repositories. This endpoint performs server-side processing to extract articles from repositories and sort them by date (newest first). Each article includes repository metadata (`repositoryName`, `repositoryUser`).

**Benefits**:

- ✅ Reduced data transfer (sends only articles, not full repositories)
- ✅ Server-side processing improves performance
- ✅ Optimized for timeline UI display
- ✅ Easier to cache on server

**Use this instead of** fetching all repositories and processing client-side.

### Articles (Timeline) Endpoints

#### Get All Articles

```http
GET /api/repositories/articles

Response: {
  "articles": [Article[]]
}
```

#### Create New Article

```http
POST /api/repositories/articles
Content-Type: application/json

{
  "title": "string",
  "date": "YYYY-MM-DD",
  "description": "string"
}
```

#### Get Single Article

```http
GET /api/repositories/articles/{id}
```

#### Update Article

```http
PUT /api/repositories/articles/{id}
Content-Type: application/json

{
  "title": "string" (optional),
  "date": "YYYY-MM-DD" (optional),
  "description": "string" (optional)
}
```

#### Delete Article

```http
DELETE /api/repositories/articles/{id}
```

## Project Structure

```
/TLG/
├── app/                              # Next.js App Router
│   ├── api/                          # API routes (server-side)
│   │   <!-- ├── auth/                     # Authentication endpoints (disabled) -->
│   │   ├── gitHub/                   # GitHub API integrations
│   │   ├── repositories/             # Multi-repository operations
│   │   │   └── articles/             # Article CRUD endpoints
│   │   └── timeline/                 # Combined timeline endpoint
│   ├── components/                   # Shared UI components
│   ├── login/                        # Login pages
│   ├── repos/                        # Repository listing page
│   ├── search/                       # Repository search page
│   ├── timeLine/                     # Timeline view page
│   └── utils/                        # Client-side utilities
│       └── combineTimeLine.ts        # Timeline processing logic
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

# App Content and Layout

## Dashboard / Search Repositories Page

- **Repositories Statistics Card**:
  - Number of user repositories
  - Last active repository
  - Last active day
- **Search Section**: Left side with results below search
- **Stats Card**: Right side aligned with search section
- **Search Results**: Display below search section with repository cards

## Tracked Repositories Page

- Number of user tracked repositories
- Tracked repositories number of commits
- Tracked repositories number of active days
- Tracked repositories last update date
- Repository cards with tracking status

## Combined Timeline Page

- Chronological display of all articles from tracked repositories
- Date-based grouping (DD/MM/YYYY format)
- Repository metadata for each article
- Sorted by date (newest first)

## Security & Safety

### Current Protections

- Sensitive endpoints (such as repository creation) are protected with an API key. The API key must be sent in the `x-api-key` header for authorized access.
- Environment variables are used for all secrets (API keys, DB credentials). No secrets are committed to version control.
- Error messages returned to clients are generic; detailed errors are logged server-side.
- MongoDB Atlas is used for database storage, and connection strings are kept in environment variables.

### Recommended Next Steps

- **Rate Limiting:** Add middleware to limit requests per IP or API key, especially on sensitive endpoints, to prevent abuse and brute-force attacks.
- **Input Validation & Sanitization:** Ensure all API endpoints validate and sanitize incoming data to prevent injection and malformed data.
- **CORS Policy:** Explicitly set allowed origins in your API responses to prevent unauthorized cross-origin requests.
- **Dependency Audit:** Regularly run `npm audit` or `yarn audit` to check for vulnerabilities in dependencies and update as needed.
- **HTTPS Enforcement:** If deploying, ensure your server only accepts HTTPS traffic.
- **Remove/Disable Unused Endpoints:** Review your API routes and disable or remove any that are not needed.
- **Database Security:** Use least-privilege DB users and parameterized queries everywhere.

For more details, see `securityAndSafety.md`.

---

## ToDo (Next Steps)

### Completed ✅

<!-- - [x] User authentication with NextAuth (GitHub OAuth and credentials) -->
- [x] MongoDB integration with Mongoose
- [x] API for fetching GitHub commits with date filtering
- [x] ChatGPT integration for summary generation
<!-- - [x] Session management and protected routes -->
- [x] Timeline data management (merge, sort, dedupe)
- [x] Repository object with tracking functionality
- [x] Repository management UI (add/remove repos)
- [x] Timeline display component with combined articles
- [x] Automated daily summary generation
- [x] Next.js App Router structure following best practices
- [x] Proper search engine which will fetch list of repo and then display it in the component below the search
- [x] Add pawdevuk to default search on component mount
- [x] Add list of tracked repositories from DB to Repositories component
- [x] Server-side timeline API endpoint (`/api/timeline`) for optimized data fetching
- [x] Timeline utility functions for filtering and grouping articles by date
- [x] Fix timeline articles date format to DD/MM/YYYY
- [x] Fix combineTimeLine sorting to handle DD/MM/YYYY format correctly
- [x] Fix authOptions export naming consistency
- [x] Add custom color theme (MongoDB green #00684A) to Tailwind CSS v4
- [x] Integrate Google Fonts (Roboto, Roboto Mono, Victor Mono, M PLUS Rounded 1c)
- [x] Use date-fns for consistent date formatting and parsing

### In Progress / Planned 🚧

#### High Priority

- [x] Reverse order of commits sent to OpenAI for article generation. At the moment openAi reads most recent ones, creates paragraph about let say updating Button component then reads further commits and creates another paragraph about creating Button component what is clearly in wrong order.
- [ ] Fix multiple articles for same date caused by launching check for day and if no article, creation new but mean time process can be repeated multiple times and before the first one finishes creation of the article there can be started multiple processes and added multiple articles.
  Solution can be simply by running check and if there is no article for the day new object with only date and id is added to database and when articles is generated, added to this object with use of id.
- [ ] Add loin and additional functionality to delete article.
- [x] **Implement authentication system** (NextAuth.js with GitHub OAuth)
- [ ] **Password hashing with bcrypt** for secure authentication (SECURITY CRITICAL)
- [ ] Secure API endpoints with authentication tokens
- [ ] Add update functionality for existing tracked repositories (incremental article generation)
- [ ] Add handling for non-existing repository errors
- [ ] Add handling of requesting duplicate repository with timeline
- [ ] Add checker for processed repo in DB (prevent duplicates)
- [ ] Add comprehensive error handling and logging

#### UI/UX Improvements

- [ ] Improve UI design and user experience
- [ ] Add statistics card next to search (repo count, last active, etc.)
- [ ] Add statistics card in tracked repos (repo count, last active, etc.)
- [ ] Add GitHub links to displayed repositories
- [ ] Add sorting options for search results (by name, date, language)
- [ ] Add tracking button to displayed repositories with DB integration
- [ ] Add repository list sorting (by last_update, created, alphabetical)

#### Feature Enhancements

- [ ] Email verification for user registration
- [ ] Add password recovery functionality
- [ ] Implement caching for generated articles (Redis/memory)
- [ ] Add pagination for large repository lists
- [ ] Implement rate limiting for API endpoints
- [ ] Add export functionality (PDF, Markdown) for timelines
- [ ] Add search/filter functionality within timeline
- [ ] Add commit statistics visualizations (charts, graphs)

## Troubleshooting

<!-- - **Session Undefined**: Ensure `NEXTAUTH_URL` is set correctly and restart the server. Check if user is signed in. -->
- **OpenAI API Errors**: Verify `CHATGPT_API` key is valid and has credits. Check prompts in `prompts.ts`.
- **GitHub API Rate Limits**: Use `GITHUB_TOKEN` for higher limits. Handle 403 errors.
- **MongoDB Connection**: Ensure `MONGO_DB_TLG` is correct and network access is allowed.
<!-- - **NextAuth Issues**: Check `authOptions` in `options.ts` for provider config. Use `NEXTAUTH_SECRET` for security. -->
<!-- - **401 Unauthorized**: Restart dev server after env changes. -->
- **API Keys**: Never commit API keys to version control. Restart dev server after env changes.
- **Date Format Issues**: All dates now use DD/MM/YYYY format. Ensure date-fns parsing is consistent.
- **Tailwind CSS v4 Build Errors**: External `@import` statements must be added via `<link>` tags in layout.tsx, not in CSS.

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
      "full_name": "pawdevUK/TLG",
      "owner": {
        "login": "pawdevUK",
        "id": 123456
      },
      "TLG": {
        "tracking": true,
        "daysActiveCommits": ["10/02/2026", "11/02/2026"],
        "articles": [
          {
            "title": "TLG - Authentication Implementation",
            "date": "10/02/2026",
            "description": "Implemented NextAuth with GitHub OAuth and credentials provider...",
            "createdAt": "2026-02-11T10:00:00.000Z"
          }
        ]
      },
      "createdAt": "2026-02-11T10:00:00.000Z"
    }
  ]
}
```

**Get Combined Timeline (Recommended)**:

```bash
GET /api/timeline
```

Response:

```json
{
  "timeline": [
    {
      "_id": "...",
      "title": "TLG - Authentication Implementation",
      "date": "10/02/2026",
      "description": "Implemented NextAuth with GitHub OAuth and credentials provider...",
      "createdAt": "2026-02-11T10:00:00.000Z",
      "repositoryName": "TLG",
      "repositoryUser": "pawdevUK"
    },
    {
      "_id": "...",
      "title": "Another Repo - Feature Addition",
      "date": "09/02/2026",
      "description": "Added new feature...",
      "createdAt": "2026-02-10T15:30:00.000Z",
      "repositoryName": "another-repo",
      "repositoryUser": "pawdevUK"
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
      "date": "10/02/2026",
      "description": "Implemented NextAuth...",
      "createdAt": "2026-02-11T10:00:00.000Z"
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

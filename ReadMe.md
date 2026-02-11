# Time Line Generator (TLG)

**Time Line Generator (TLG)** is a full-stack Next.js application that automatically tracks GitHub repositories and generates AI-powered daily summaries of development activity. Built with TypeScript, TLG fetches commit history from GitHub, analyzes development patterns, and uses OpenAI's ChatGPT API to create human-readable articles that document your coding journey. The application features secure authentication, repository management, and an interactive timeline interface for browsing your development history.

## Features

- **🔄 Automated Repository Tracking**: Automatically fetches and monitors GitHub repository commits with intelligent date filtering and pagination
- **🤖 AI-Powered Summaries**: Generates professional, human-readable summary articles using OpenAI's GPT API with customizable tone and length
- **🔐 Secure Authentication**: Multi-provider authentication via NextAuth.js supporting GitHub OAuth and credentials-based login
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
- **NextAuth 4.24.13** - Authentication library
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
- **jsonwebtoken 9.0.2** - JWT handling

## Timeline Generation Flow

1. **🔐 Authenticate User**: Users log in securely via NextAuth (GitHub OAuth or credentials)
2. **🔍 Search & Select Repository**: Browse and select GitHub repositories to track
3. **📥 Fetch Commit History**: Retrieve all commits from repository inception or specific date ranges via GitHub API
4. **🗓️ Group by Date**: Organize commits by activity days
5. **🤖 AI Summarization**: Generate human-readable summaries for each day's work using ChatGPT
6. **💾 Store Articles**: Save generated articles to MongoDB with repository metadata
7. **📊 Display Timeline**: View chronological development history in the interactive UI

## Authentication

- **NextAuth.js Integration**: Secure, industry-standard authentication
- **Multiple Providers**:
  - GitHub OAuth (recommended for seamless GitHub integration)
  - Credentials Provider (username/password)
- **Session Management**: JWT-based sessions with 30-day expiration
- **Protected Routes**: Automatic redirect to login for unauthorized access
- **User Registration**: API endpoints for new user creation

⚠️ **Security Note**: Current implementation stores passwords in plain text. For production, implement bcrypt hashing (see [Security Improvements](#security-improvements)).

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

   Create a `.env.local` file in the root directory:

   ```env
   # OpenAI Configuration (Required)
   CHATGPT_API=sk-proj-your-openai-api-key

   # NextAuth Configuration (Required)
   NEXTAUTH_SECRET=your-random-secret-string-min-32-chars
   NEXTAUTH_URL=http://localhost:3000

   # GitHub OAuth (Required for OAuth login)
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-client-secret

   # MongoDB (Required)
   MONGO_DB_TLG=mongodb+srv://username:password@cluster.mongodb.net/tlg?retryWrites=true&w=majority

   # GitHub API Token (Optional but recommended)
   GITHUB_TOKEN=ghp_your-personal-access-token

   # JWT Secret (for credentials login)
   JWT_SECRET=your-jwt-secret-string
   ```

   ### Setup Instructions

   **OpenAI API Key**:
   1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
   2. Create a new API key
   3. Copy and paste into `CHATGPT_API`

   **NextAuth Secret**:
   - Generate with: `openssl rand -base64 32`
   - Or use any random 32+ character string

   **GitHub OAuth App**:
   1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
   2. Click "New OAuth App"
   3. Set Homepage URL: `http://localhost:3000`
   4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   5. Copy Client ID and Client Secret

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

   Visit `http://localhost:3000` to access the app. You'll be redirected to login if not authenticated.

4. **Register and Login**:

   - Use the `/login` page to sign up or log in.
   - For credentials: Register via API or form, then log in.
   - For GitHub: Click the GitHub button to authenticate.

## API Endpoints

### Authentication Endpoints

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

# App content and layout

## Dashboard content page - need to be renamed to search repositories or some better name

- Repositories:
  - Number of user repositories.
  - Last active repository.
  - Last active day.
- Search section with results bellow serch. -- need to be on the left and stats card on the right with the search results bellow.

## Tracked repositories page

- Number of user tracked repositories
- Tracked repositories number of commits.
- Tracked repositories number of active days.
- Tracked repositories last update.

## Combine TimeLine page

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
- [x] Add seach engine which will fetch list of repo and then display it in the component below the search.

### In Progress / Planned 🚧

- [ ] Add the tracking to displied repositories. Each of displied repositories need to have track button and onClick needs to trigger the repository articles creation and added to DB.
- [x] Add list of tracked repositories from DB to Repositories component.
- [ ] Add update TLG repository's articles. Instead of generating new repo obj with uptodate articles, app needs to check which day is missing and then generate only articles for missing days.
- [ ] Add handling for non-existing repository
- [ ] Add handling for requesting duplicate repository with timeline
- [ ] Add checker for processed repo in DB (add if missing).
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

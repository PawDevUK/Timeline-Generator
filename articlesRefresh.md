# Repository Sync Strategy for TLG

## Current Situation Analysis

**Problem**: Repository objects in MongoDB contain articles up to 08/02/2026, but GitHub repositories have new commits. Need to keep articles synchronized without recreating entire repository objects.

**Current Structure**:

```typescript
RepoList {
  _id?: string
  id: number
  node_id: string
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
    id: number
  }
  html_url: string
  url: string
  created_at: string
  updated_at: string
  pushed_at: string
  date: string
  language: string
  TLG: {
    tracking: boolean
    daysActiveCommitts: string[]
    articles: Article[]  // Nested articles
  }
}
```

## Recommended Approach: Incremental Update Strategy

### Best Practice Solution

**1. Check Last Article Date**

- Query repository from MongoDB
- Find the most recent article date
- Compare with current date

**2. Fetch Only New Commits**

- Use GitHub API with `since` parameter (last article date)
- Only fetch commits after the last processed date

**3. Generate Missing Articles**

- Group new commits by date
- Generate articles for dates that don't exist
- Append to existing articles array

**4. Update Repository**

- Use MongoDB `$push` to add new articles
- Or replace entire articles array if needed
- Update a `lastSyncedAt` field

### Implementation Plan

## Step 1: Add Sync Metadata to Repository Schema

**File**: `lib/db/schema/repository.schema.ts`

```typescript
import { Schema, Document } from 'mongoose';
import { ArticleSchema } from './article.schema';
import { RepoList } from '../../../types/repoList.types';

export interface RepositoryDocument extends RepoList, Document {}

export const RepositorySchema: Schema<RepositoryDocument> = new Schema({
 id: { type: Number },
 node_id: { type: String },
 name: { type: String, required: true },
 full_name: { type: String },
 private: { type: Boolean, default: false },
 owner: {
  login: { type: String, required: true },
  id: { type: Number }
 },
 html_url: { type: String },
 url: { type: String },
 created_at: { type: String },
 updated_at: { type: String },
 pushed_at: { type: String },
 date: { type: String },
 language: { type: String },
 TLG: {
  tracking: { type: Boolean, default: false },
  daysActiveCommitts: [{ type: String }],
  articles: [ArticleSchema],
  lastSyncedAt: { type: Date },
  lastArticleDate: { type: String }
 }
## Step 2: Update Repository Type

**File**: `types/repoList.types.ts`

```typescript
export type RepoList = {
 _id?: string;
 id: number;
 node_id: string;
 name: string;
 full_name: string;
 private: boolean;
 owner: {
  login: string;
  id: number;
 };
 html_url: string;
 url: string;
 created_at: string;
 updated_at: string;
 pushed_at: string;
 date: string;
 language: string;
 TLG: {
  tracking: boolean;
  daysActiveCommitts: string[];
  articles: {
   title: string;
   date: string;
   description: string;
   createdAt: Date;
  }[];
  lastSyncedAt?: Date;
  lastArticleDate?: string;
 };
};
```

**File**: `lib/repository/syncRepository.ts`

```typescript
import axios from 'axios';
import { Repository } from '../db/models/repository.model';
import { dbConnect } from '../db/db';
import { generateDayArticle } from '../chatGPT/generateDayArticle';

const token = process.env.GITHUB_TOKEN;

interface Commit {
 title: string;
 author?: string;
 date?: string;
 description?: string;
}

interface GitHubCommitApi {
 commit?: {
  author?: { name?: string; date?: string };
  committer?: { date?: string };
  message?: string;
 };
}

export async function syncRepository(user: string, repoName: string) {
 await dbConnect();

 try {
  // 1. Find existing repository
  const repository = await Repository.findOne({ 'owner.login': user, name: repoName });
  
  if (!repository) {
   throw new Error('Repository not found. Please create it first.');
  }

  // 2. Get last article date or use repository creation date
  const lastArticleDate = repository.TLG?.lastArticleDate 
   ? new Date(repository.TLG.lastArticleDate)
   : new Date(repository.created_at || Date.now());
  console.log(`Last article date: ${lastArticleDate.toISOString()}`);

  // 3. Fetch commits since last article date
  const headers: Record<string, string> = { 
   Accept: 'application/vnd.github.v3+json' 
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const params: Record<string, string> = {
   since: lastArticleDate.toISOString(),
   per_page: '100'
  };

  const allData: GitHubCommitApi[] = [];
  let page = 1;
  const maxPages = 10;

  while (page <= maxPages) {
   const resp = await axios.get(
    `https://api.github.com/repos/${user}/${repoName}/commits`,
    { headers, params: { ...params, page: String(page) } }
   );

   const pageData = Array.isArray(resp.data) ? resp.data : [];
   if (pageData.length === 0) break;
   
   allData.push(...pageData);
   if (pageData.length < 100) break;
   page++;
  }

  console.log(`Fetched ${allData.length} new commits`);

  if (allData.length === 0) {
   console.log('No new commits to process');
   return { 
    success: true, 
    message: 'Repository is up to date',
    articlesAdded: 0 
   };
  }

  // 4. Group commits by date
  const commits: Commit[] = allData.map((com: GitHubCommitApi) => ({
   title: repoName,
   author: com.commit?.author?.name,
   date: com.commit?.author?.date || com.commit?.committer?.date,
   description: com.commit?.message,
  }));

  const groups: Record<string, Commit[]> = {};
  for (const c of commits) {
   if (!c.date) continue;
   const key = new Date(c.date).toISOString().slice(0, 10);
   
   // Skip if we already have an article for this date
   const existingArticle = repository.articles.find(
    (article: any) => article.date === key
   );
   if (existingArticle) {
    console.log(`Skipping ${key} - article already exists`);
    continue;
   }

   if (!groups[key]) groups[key] = [];
   groups[key].push(c);
  }

  // 5. Generate articles for new dates only
  const newArticles = [];
  for (const [date, dayCommits] of Object.entries(groups)) {
   console.log(`Generating article for ${date} with ${dayCommits.length} commits`);
   const article = await generateDayArticle(dayCommits, repoName, date);
   newArticles.push(article);
  }

  if (newArticles.length === 0) {
   console.log('No new articles to add');
   return { 
    success: true, 
    message: 'No new articles to generate',
    articlesAdded: 0 
   };
  }

  // 6. Update repository with new articles
  const latestDate = newArticles.reduce((latest, article) => {
   return article.date > latest ? article.date : latest;
  }, repository.TLG?.lastArticleDate || '');

  if (!repository.TLG) {
   repository.TLG = {
    tracking: true,
    daysActiveCommitts: [],
    articles: []
   };
  }

  repository.TLG.articles.push(...newArticles);
  repository.TLG.lastSyncedAt = new Date();
  repository.TLG.lastArticleDate = latestDate;
  repository.TLG.daysActiveCommitts = [...new Set([...repository.TLG.daysActiveCommitts, ...Object.keys(groups)])];
  console.log(`Successfully added ${newArticles.length} new articles`);

  return {
   success: true,
   message: `Added ${newArticles.length} new articles`,
   articlesAdded: newArticles.length,
   data: repository
  };

 } catch (error) {
  console.error('Error syncing repository:', error);
  return {
   success: false,
   error: error instanceof Error ? error.message : 'Unknown error'
  };
 }
}
```

## Step 4: Create Sync API Endpoint

**File**: `app/api/repositories/sync/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { syncRepository } from '@/lib/repository/syncRepository';
import { dbConnect } from '@/lib/db/db';

export const maxDuration = 300;

// POST /api/repositories/sync
export async function POST(request: NextRequest) {
 try {
  const body = await request.json();
  const { user, repo } = body;

  if (!user || !repo) {
   return NextResponse.json(
    { error: 'Missing required fields: user, repo' },
    { status: 400 }
   );
  }

  await dbConnect();

  console.log(`Syncing repository: ${user}/${repo}`);
  const result = await syncRepository(user, repo);

  if (!result.success) {
   return NextResponse.json(
    { error: result.error },
    { status: 500 }
   );
  }

  return NextResponse.json({
   success: true,
   message: result.message,
   articlesAdded: result.articlesAdded,
   repository: result.data
  }, { status: 200 });

 } catch (error) {
  console.error('Error in sync endpoint:', error);
  return NextResponse.json(
   { error: 'Internal server error' },
   { status: 500 }
  );
 }
}
```

## Step 5: Update createRepository to Set Initial Sync Data

**File**: `lib/createRepo/createRepo.ts`

Add after saving repository:

```typescript
// After creating repository...
const result = await AddRepository(Repository, repositoryData);

if (result.success && result.data) {
 // Set initial sync metadata
 const latestDate = articles.reduce((latest, article) => {
  return article.date > latest ? article.date : latest;
 }, '');

 if (!result.data.TLG) {
  result.data.TLG = {
   tracking: true,
   daysActiveCommitts: Object.keys(groups),
   articles: articles
  };
 }

 result.data.TLG.lastSyncedAt = new Date();
 result.data.TLG.lastArticleDate = latestDate;
 await result.data.save();
}
```

if (result.success && result.data) {
 // Set initial sync metadata
 const latestDate = articles.reduce((latest, article) => {
  return article.date > latest ? article.date : latest;
 }, '');

 result.data.lastSyncedAt = new Date();
 result.data.lastArticleDate = latestDate;
 await result.data.save();
}

```

## Usage Examples

### 1. Manual Sync via API

```bash
curl -X POST http://localhost:3000/api/repositories/sync \
  -H "Content-Type: application/json" \
  -d '{"user": "pawdevUK", "repo": "TLG"}'
```

### 2. Sync Button in UI

```typescript
// In your repos page or dashboard
const handleSync = async (user: string, repo: string) => {
 setLoading(true);
 try {
  const response = await fetch('/api/repositories/sync', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ user, repo })
  });
  
  const data = await response.json();
  
  if (data.success) {
   alert(`Synced! Added ${data.articlesAdded} new articles`);
   // Refresh your data
  }
 } catch (error) {
  console.error('Sync failed:', error);
 } finally {
  setLoading(false);
 }
};
```

### 3. Automatic Daily Sync (Cron Job)

**File**: `app/api/cron/daily-sync/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { Repository } from '@/lib/db/models/repository.model';
import { syncRepository } from '@/lib/repository/syncRepository';
import { dbConnect } from '@/lib/db/db';

export async function GET(request: Request) {
 // Verify cron secret (for security)
 const authHeader = request.headers.get('authorization');
 if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 }

 await dbConnect();

 try {
  // Get all repositories
  const repositories = await Repository.find();
  
  const results = [];
  for (const repo of repositories) {
   const result = await syncRepository(repo.user, repo.name);
   results.push({
    repo: `${repo.user}/${repo.name}`,
    ...result
   });
  }

  return NextResponse.json({ success: true, results });
 } catch (error) {
  return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
 }
}
```

**Vercel Cron Setup** (`vercel.json`):

```json
{
 "crons": [{
  "path": "/api/cron/daily-sync",
  "schedule": "0 2 * * *"
 }]
}
```

## Benefits of This Approach

✅ **Efficient**: Only fetches and processes new commits  
✅ **No Duplicates**: Checks existing articles before generating  
✅ **Preserves History**: Doesn't recreate repository, just appends  
✅ **Trackable**: `lastSyncedAt` and `lastArticleDate` for monitoring  
✅ **Flexible**: Can be triggered manually or automatically  
✅ **Safe**: Won't lose existing data  

## Migration for Existing Repositories

**File**: `scripts/migrateRepositories.ts`

```typescript
import { Repository } from '../lib/db/models/repository.model';
import { dbConnect } from '../lib/db/db';

async function migrateRepositories() {
 await dbConnect();

 const repos = await Repository.find();

 for (const repo of repos) {
  if (!repo.TLG) {
   repo.TLG = {
    tracking: true,
    daysActiveCommitts: [],
    articles: []
   };
  }

  if (!repo.TLG.lastArticleDate && repo.TLG.articles.length > 0) {
   // Find latest article date
   const latestDate = repo.TLG.articles.reduce((latest: string, article: any) => {
    return article.date > latest ? article.date : latest;
   }, '');

   repo.TLG.lastArticleDate = latestDate;
   repo.TLG.lastSyncedAt = new Date();
   await repo.save();

   console.log(`Updated ${repo.name}: lastArticleDate = ${latestDate}`);
  }
 }

 console.log('Migration complete');
}

migrateRepositories();
```

Run with: `npx tsx scripts/migrateRepositories.ts`

## Implementation Checklist

- [ ] Step 1: Update `lib/db/schema/repository.schema.ts` with RepoList structure and TLG nested object
- [ ] Step 2: Update `types/repoList.types.ts` with sync fields in TLG object
- [ ] Step 3: Create `lib/repository/syncRepository.ts` function
- [ ] Step 4: Create `app/api/repositories/sync/route.ts` endpoint
- [ ] Step 5: Update `lib/createRepo/createRepo.ts` to use RepoList structure and set initial sync data
- [ ] Step 6: (Optional) Add sync button to UI
- [ ] Step 7: (Optional) Create cron job for automated sync
- [ ] Step 8: (Optional) Run migration script for existing repositories

## Summary

This solution provides a **production-ready incremental sync system** that:

- Only processes new commits since last sync
- Avoids duplicates and data loss
- Can be triggered manually or automated
- Follows MongoDB and Next.js best practices
- Scales efficiently as your repository grows

## Next Steps

1. Implement Steps 1-5 to add sync functionality
2. Test with a single repository first
3. Add UI controls for manual sync
4. Set up automated daily sync via cron
5. Monitor sync performance and errors

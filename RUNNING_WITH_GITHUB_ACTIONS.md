# Running TLG with GitHub Actions

This document describes how to run the Time Line Generator (TLG) using GitHub Actions for automated, serverless article generation.

## Overview

Running TLG with GitHub Actions provides:
- Fully automated article generation
- Zero infrastructure management
- Native GitHub integration
- Free execution for public repositories
- Scheduled and event-driven triggers

## Prerequisites

Before setting up GitHub Actions, ensure you have:

- **GitHub repository** with TLG code
- **OpenAI API key** (for LLM article generation)
- **Backend API** endpoint (for storing articles)
- Git repositories to track (can be the same repository)

## Workflow Configuration

The GitHub Actions workflow is defined in `.github/workflows/generate-timeline.yml`:

```yaml
name: Generate Timeline Article

# Triggers for workflow execution
on:
  # Run on every push to main branch
  push:
    branches: [ main, master ]
  
  # Run daily at 11 PM UTC
  schedule:
    - cron: '0 23 * * *'
  
  # Allow manual trigger from Actions tab
  workflow_dispatch:
    inputs:
      period:
        description: 'Time period (Morning/Afternoon/Evening/Night)'
        required: false
        default: 'auto'

jobs:
  generate-article:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
    
    steps:
      # Checkout the repository with full history
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 100  # Get last 100 commits for analysis
      
      # Setup Node.js environment
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      # Install project dependencies
      - name: Install dependencies
        run: npm ci
      
      # Generate timeline article
      - name: Generate article
        env:
          # LLM Configuration
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          LLM_MODEL: ${{ secrets.LLM_MODEL || 'gpt-4-turbo-preview' }}
          
          # API Configuration
          API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
          API_KEY: ${{ secrets.API_KEY }}
          
          # Git Configuration
          REPOS: ${{ secrets.REPOS }}
          GIT_AUTHOR: ${{ secrets.GIT_AUTHOR }}
          
          # Optional period override
          PERIOD: ${{ github.event.inputs.period }}
        run: |
          echo "🚀 Starting TLG article generation..."
          node src/generate-article.js
      
      # Upload generated article as artifact (for debugging)
      - name: Upload artifact
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: generated-article-${{ github.run_number }}
          path: |
            output/
            *.log
          retention-days: 7
      
      # Notify on failure (optional)
      - name: Notify on failure
        if: failure()
        run: |
          echo "❌ Article generation failed!"
          echo "Check logs and artifacts for details."
```

## Setup Instructions

### 1. Add Repository Secrets

Navigate to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

| Secret Name | Description | Required |
|-------------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `API_ENDPOINT` | Backend API URL for storing articles | Yes |
| `API_KEY` | Authentication key for your API | Yes |
| `REPOS` | Comma-separated repository paths | Optional* |
| `GIT_AUTHOR` | Git author name to filter commits | Optional |
| `LLM_MODEL` | OpenAI model name | Optional |

*If not provided, the current repository will be analyzed.

### 2. Enable GitHub Actions

1. Go to your repository's **Actions** tab
2. If prompted, enable workflows for this repository
3. Verify the workflow file is detected

### 3. Verify Workflow

Trigger a manual run to test:
1. Go to **Actions** tab
2. Select "Generate Timeline Article" workflow
3. Click **Run workflow**
4. Select branch and optional period
5. Click **Run workflow**

## Trigger Types

### Push Trigger

Articles are automatically generated on every push to `main` or `master`:

```yaml
on:
  push:
    branches: [ main, master ]
```

### Scheduled Trigger

Daily automatic generation at 11 PM UTC:

```yaml
on:
  schedule:
    - cron: '0 23 * * *'
```

Common schedule patterns:
- `0 23 * * *` - Daily at 11 PM UTC
- `0 */6 * * *` - Every 6 hours
- `0 23 * * 1-5` - Weekdays at 11 PM UTC
- `0 0 * * 0` - Weekly on Sunday at midnight

### Manual Trigger

Run on-demand from the Actions tab:

```yaml
on:
  workflow_dispatch:
    inputs:
      period:
        description: 'Time period'
        required: false
        default: 'auto'
```

## Multi-Repository Tracking

To track multiple repositories:

### Option 1: Repository Secrets

Set `REPOS` secret with comma-separated paths:
```
/home/runner/work/repo1,/home/runner/work/repo2
```

### Option 2: Checkout Multiple Repos

```yaml
- name: Checkout main repo
  uses: actions/checkout@v4
  with:
    path: main-repo

- name: Checkout additional repo
  uses: actions/checkout@v4
  with:
    repository: owner/other-repo
    path: other-repo
    token: ${{ secrets.REPO_ACCESS_TOKEN }}
```

## Workflow Artifacts

Generated articles are saved as workflow artifacts:

1. Go to **Actions** tab
2. Select a workflow run
3. Scroll to **Artifacts** section
4. Download `generated-article-{run_number}`

Artifacts are retained for 7 days by default.

## Error Handling

### Common Issues

**Workflow not running:**
- Check Actions are enabled for repository
- Verify workflow file syntax (use YAML validator)
- Check branch protection rules

**API errors:**
- Verify secrets are correctly set
- Check API endpoint is accessible
- Ensure API key has proper permissions

**No commits found:**
- Increase `fetch-depth` in checkout step
- Verify `GIT_AUTHOR` matches commit author
- Check date range for commit filtering

### Debugging

Add debug logging to workflow:

```yaml
- name: Debug info
  run: |
    echo "Repository: ${{ github.repository }}"
    echo "Branch: ${{ github.ref }}"
    echo "Commit: ${{ github.sha }}"
    git log --oneline -10
```

## Advantages of GitHub Actions Approach

| Advantage | Description |
|-----------|-------------|
| **Zero Infrastructure** | No servers to manage |
| **Free for Public Repos** | 2,000 minutes/month for private repos |
| **Native Integration** | Direct access to repository |
| **Event-Driven** | Trigger on push, PR, schedule, etc. |
| **Secure Secrets** | Encrypted secret management |
| **Easy Setup** | Single YAML file configuration |
| **Scalable** | Runs on GitHub's infrastructure |

## Disadvantages

| Disadvantage | Description |
|--------------|-------------|
| **No UI** | No web interface for viewing timeline |
| **Limited Runtime** | 6-hour maximum execution time |
| **GitHub-Only** | Works only with GitHub repositories |
| **Delayed Feedback** | Must check Actions tab for results |
| **Rate Limits** | API rate limits may apply |

## Best Use Cases

The GitHub Actions approach is best when you:
- Want fully automated, hands-off operation
- Don't need a web interface for the timeline
- Already have a separate frontend for display
- Want minimal infrastructure management
- Need reliable scheduled execution
- Want to track GitHub repositories only

## Cost Analysis

### GitHub Actions

| Plan | Free Minutes/Month | Additional Cost |
|------|-------------------|-----------------|
| Free | 2,000 (private) | $0.008/min |
| Free | Unlimited (public) | - |
| Team | 3,000 | $0.008/min |
| Enterprise | 50,000 | $0.008/min |

### OpenAI API

| Model | Approx. Cost/Article |
|-------|---------------------|
| GPT-4 Turbo | ~$0.02 |
| GPT-4 | ~$0.06 |
| GPT-3.5 Turbo | ~$0.002 |

**Estimated Monthly Cost:**
- 30 daily articles: ~$0.60 (GPT-4 Turbo)
- GitHub Actions: Free (public repo)
- **Total: ~$0.60-2.00/month**

## Advanced Configuration

### Matrix Builds

Process multiple repositories in parallel:

```yaml
jobs:
  generate:
    strategy:
      matrix:
        repo: [repo1, repo2, repo3]
    steps:
      - uses: actions/checkout@v4
        with:
          repository: owner/${{ matrix.repo }}
```

### Conditional Execution

Skip generation if no new commits:

```yaml
- name: Check for changes
  id: check
  run: |
    if git log --since="24 hours ago" --oneline | head -1; then
      echo "has_commits=true" >> $GITHUB_OUTPUT
    fi

- name: Generate article
  if: steps.check.outputs.has_commits == 'true'
  run: node src/generate-article.js
```

### Notifications

Send Slack notification on completion:

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ Timeline article generated successfully!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring

### Workflow Status Badge

Add to README.md:

```markdown
![Generate Timeline](https://github.com/owner/repo/actions/workflows/generate-timeline.yml/badge.svg)
```

### Email Notifications

Configure in GitHub:
**Settings → Notifications → Actions → Email preferences**

## Related Documentation

- [SETUP.md](SETUP.md) - General setup instructions
- [IMPLEMENTATION_IDEAS.md](IMPLEMENTATION_IDEAS.md) - Detailed implementation guide
- [RUNNING_AS_NEXTJS.md](RUNNING_AS_NEXTJS.md) - Alternative approach using Next.js
- [WORK_REPORT.md](WORK_REPORT.md) - Project status and progress

## Summary

Running TLG with GitHub Actions provides a completely automated, serverless solution for timeline generation. It requires minimal setup, has no ongoing infrastructure costs for public repositories, and integrates seamlessly with GitHub's ecosystem. While it lacks a web interface, it's ideal for developers who want a "set it and forget it" approach to work documentation.

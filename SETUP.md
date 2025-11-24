# TLG Setup Guide

Complete guide to setting up and using the Time Line Generator.

## Prerequisites

- Node.js 20+ installed
- Git installed
- GitHub account (for Actions) OR local machine for cron
- OpenAI API key (or local LLM setup)
- MongoDB database (Atlas free tier recommended)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Repository paths (absolute paths, comma-separated)
REPOS=/home/user/projects/repo1,/home/user/projects/repo2

# OpenAI API key
OPENAI_API_KEY=sk-your-key-here

# Backend API endpoint
API_ENDPOINT=https://your-backend-api.com
API_KEY=your-api-key
```

### 3. Test Locally

Run article generation manually:

```bash
npm start
```

## Setup Options

### Option A: GitHub Actions (Recommended)

1. **Add Repository Secrets** (Settings → Secrets and variables → Actions):
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `API_ENDPOINT`: Your backend API URL
   - `API_KEY`: Your API authentication key
   - `REPOS`: Repository paths (for multi-repo tracking)
   - `GIT_AUTHOR`: (Optional) Your git name

2. **Enable Actions**:
   - Go to Actions tab
   - Enable workflows if disabled

3. **Trigger**:
   - Automatically runs on push to main
   - Daily at 11 PM UTC
   - Manually from Actions tab

### Option B: Local Cron

1. **Create run script**:

```bash
#!/bin/bash
cd /path/to/TLG
export $(cat .env | xargs)
node src/generate-article.js >> /var/log/tlg.log 2>&1
```

2. **Add to crontab**:

```bash
# Run at 11 PM daily
0 23 * * * /path/to/TLG/run-tlg.sh
```

## Configuration Details

### Repository Configuration

**Single Repository**:
```bash
REPOS=/home/user/projects/my-repo
```

**Multiple Repositories**:
```bash
REPOS=/home/user/projects/repo1,/home/user/projects/repo2,/home/user/projects/repo3
```

### LLM Configuration

**OpenAI (Recommended)**:
```bash
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4-turbo-preview  # or gpt-4, gpt-3.5-turbo
```

**Local Ollama**:
```bash
# Install Ollama first: https://ollama.com/
OLLAMA_HOST=http://localhost:11434
LLM_MODEL=llama2
```

### Period Configuration

Auto-detect based on time:
```bash
PERIOD=  # Leave empty
```

Or specify manually:
```bash
PERIOD=Morning     # or Afternoon, Evening, Night
```

## Project Structure

```
TLG/
├── .github/
│   └── workflows/
│       └── generate-timeline.yml  # GitHub Actions workflow
├── src/
│   ├── generate-article.js        # Main script (to be created)
│   ├── git-parser.js              # Git integration (to be created)
│   ├── llm-client.js              # LLM integration (to be created)
│   ├── api-client.js              # API client (to be created)
│   └── server/                    # Backend server (to be created)
│       ├── index.js
│       ├── models/
│       └── routes/
├── articles.js                     # Example data structure
├── timelineClient.ts               # TypeScript API client
├── package.json                    # Dependencies
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── ReadMe.md                       # Original README
├── WORK_REPORT.md                  # Work status report
├── IMPLEMENTATION_IDEAS.md         # Implementation guide
└── SETUP.md                        # This file
```

## Usage

### Manual Execution

Generate article for today:
```bash
npm start
```

With custom period:
```bash
PERIOD=Morning npm start
```

### Development Mode

Watch for changes:
```bash
npm run dev
```

## Troubleshooting

### "No commits found"

- Check that REPOS paths are correct and absolute
- Ensure you have commits in the last 24 hours
- Verify GIT_AUTHOR matches your git config (if set)

### "OpenAI API error"

- Verify OPENAI_API_KEY is correct
- Check your OpenAI account has credits
- Ensure you have API access enabled

### "Failed to submit article"

- Verify API_ENDPOINT is accessible
- Check API_KEY is correct
- Ensure backend server is running
- Check backend logs for errors

### GitHub Actions not running

- Check workflow file syntax
- Verify secrets are set correctly
- Check Actions tab for error messages
- Ensure Actions are enabled for repository

## Next Steps

1. **Implement Core Modules**: See IMPLEMENTATION_IDEAS.md for detailed code examples
2. **Set Up Backend**: Create Express server with MongoDB
3. **Test End-to-End**: Run full workflow with real data
4. **Deploy Backend**: Deploy to Vercel, Railway, or similar
5. **Enable Automation**: Set up GitHub Actions or cron
6. **Monitor**: Add logging and error alerting

## Cost Estimation

### OpenAI API Costs
- **GPT-4 Turbo**: ~$0.02 per article
- **Daily usage**: ~$0.60/month
- **100 articles/month**: ~$2.00/month

### Infrastructure
- **MongoDB Atlas**: Free tier (512MB)
- **Backend Hosting**: Free tier (Vercel/Railway)
- **GitHub Actions**: Free (2000 min/month public repos)

**Total Monthly Cost**: $0-2 for typical usage

## Support

- **Issues**: Report bugs on GitHub Issues
- **Questions**: Check IMPLEMENTATION_IDEAS.md for detailed guidance
- **Updates**: Star the repo for updates

## License

MIT License - See LICENSE file for details

# TLG Project Status Report

## Overview

Time Line Generator (TLG) is partially implemented. Core flows (auth, GitHub data fetch, AI summary, storage, UI) exist but are incomplete and weakly integrated. Security is minimal (plain-text passwords). No automated tests or deployment setup.

## Current State

- **Frontend**: Dashboard pages render placeholders; timeline view shows articles but uses hardcoded generate params; repo page fetches for a fixed user and only stores tracking state locally.
- **APIs**:
  - GitHub commits (paged) lacks date filtering; date-scoped endpoint exists but is unused by generators.
  - Repo activity endpoint points to a non-API HTML URL and will fail.
  - GitHub user info endpoint is hardcoded.
  - Articles CRUD works but has no auth/ownership checks.
- **Auth**: NextAuth is present, but custom login/register APIs store and compare plain-text passwords; JWT-based login is separate from NextAuth; no hashing or rate limiting.
- **OpenAI**: ChatGPT route parses JSON heuristically; no safeguards for empty commits or cost controls.
- **Database**: Mongo connection helper exists; schemas are minimal; missing type import for user type; no migrations.
- **Types/Tooling**: Timeline client is empty; several types are weak/typoed; no tests/CI; bleeding-edge package versions (Next 16, React 19, Tailwind 4 beta).

## Gaps to Finish (high level)

1) Fix data pipeline: use date-scoped commits for generation; add filtering to the all-commits route; correct repo activity endpoint.
2) Secure auth: hash passwords (bcrypt), pick one system (NextAuth), validate input, and add rate limiting; enforce auth on article/repo actions.
3) Complete UI flows: article display, repo selection/persistence, timeline generation UI, replace anchors with Next Links, wire to APIs.
4) Persistence and models: add ownership to articles/repos, clean types, remove typos, add missing files (user type).
5) Ops: add .env.example, logging/error strategy, tests (unit+integration), CI checks; pin stable package versions.
6) Remove hardcoded values (GitHub user/repo, URLs, tokens) and validate inputs.

## Immediate Priorities

- Add password hashing and unify auth on NextAuth.
- Update generation to call the date-scoped commits endpoint; add date filtering to the paged commits route.
- Fix repo activity endpoint to real GitHub API or remove until implemented.
- Replace hardcoded GitHub user/repo in UI and APIs.
- Implement article display and repo tracking persistence on the frontend.

## Environment Requirements

- .env.local should define: CHATGPT_API, NEXTAUTH_SECRET, NEXTAUTH_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, MONGO_DB_TLG, optional GITHUB_TOKEN.

## Testing/CI

- No tests exist. Add lint/test workflows, API integration tests (auth, commits, generate, articles CRUD), and component tests for dashboard/timeline.

## Risk Notes

- Security risk: plain-text credentials and mixed auth flows.
- Data risk: generation ignores date filters; activity endpoint broken.
- Upgrade risk: unstable dependency versions (Next 16/React 19/Tailwind 4 beta) with untested code.

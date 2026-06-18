# Contributing

Engineering practices for the Cue project. All team members and AI assistants should follow these conventions.

## Team

| Role | Person |
|------|--------|
| Scrum Lead | Maia |
| Git Lead | Adel |
| Pair A | TBD |
| Pair B | TBD |

## Branch Naming

Use the following prefixes:

- `feat/` — new feature
- `fix/` — bug fix
- `chore/` — maintenance, config, tooling
- `docs/` — documentation only
- `refactor/` — code change that isn't a fix or feature
- `test/` — adding or updating tests

Examples:
- `feat/embedding-script`
- `feat/query-parse-controller`
- `fix/pinecone-upsert-batch-size`
- `chore/repo-scaffolding`

## Git Workflow

1. Always branch off `dev`, never `main`
2. Pull latest dev before starting any work
```bash
   git switch dev
   git pull
   git switch -c feat/your-branch-name
```
3. Keep commits focused and use conventional commit messages
4. Push your branch and open a PR to `dev`
5. Request a review before merging — see PR review rules below
6. Never push directly to `main` or `dev`

## Commit Messages

Follow the Conventional Commits spec: `<type>(<scope>): <short description>`

Common types:
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance, config, tooling
- `docs` — documentation only
- `refactor` — code change that isn't a fix or feature
- `test` — adding or updating tests

Rules:
- Keep subject line under 72 characters
- Use imperative mood — "add", not "added" or "adds"
- Lowercase after the colon
- No period at the end

Examples:
- `feat(embedding): add offline embedding script for songs dataset`
- `fix(search): correct Pinecone topK parameter`
- `chore(repo): add .env.example with required keys`

## Picking Up a Task

- Check Linear for open issues before starting something new
- Assign yourself when you start, not before — avoids two people quietly working the same thing
- If a task turns out to depend on something not yet done, flag it in standup rather than guessing around it

## Pull Request Format

```md
## Summary

Briefly explain what this pull request does.

## Changes

- List the main changes made in this PR
- Keep each bullet short and specific

## Testing

- Explain how the change was tested
- If no tests were run, explain why
```

## PR Review Rules

- Anything touching AI/backend logic (controllers, prompts, offline scripts) requires review from the **opposite pair** before merging
- Small frontend-only changes don't require cross-pair review
- Saturday integration day is the exception — both pairs are already working together, so this rule naturally relaxes that day

What reviewers are checking for:
- Does it match what's documented in `docs/Backend_Architecture.md` and `docs/API_contract.md`?
- Are there tests for new controller logic?
- Is anything hardcoded that should be in `.env`?
- Does it actually do what the task asked, not just "something reasonable"?

## Pre-PR Checklist

Before opening a pull request:

1. Pull latest dev and merge into your branch
```bash
   git switch dev
   git pull
   git switch your-branch-name
   git merge dev
```
2. Run `npm install` to make sure dependencies are up to date
3. Test your changes locally and confirm nothing is broken
4. Make sure no `console.log` statements are left in your code (unless it's intentional logging output)
5. Push your branch to GitHub
6. Fill out the PR description — Summary, Changes, Testing

## Code Comment Guidelines

1. Comment **why**, not just **what**
2. Use comments only for non-obvious logic
3. Keep comments brief, specific, and direct
4. Avoid comments that simply repeat the code
5. Remove temporary learning comments before finishing the file

## Function Documentation

When adding comments to functions, prefer JSDoc format over inline comments. This gives VS Code the ability to show inline documentation on hover and keeps documentation structured and readable.

```typescript
/**
 * Brief description of what the function does.
 *
 * @param {type} paramName - Description of the parameter
 * @returns {type} Description of what is returned
 *
 * @example
 * functionName(arg1, arg2);
 */
```

Not required for every function — use judgment. Prioritize documenting functions with non-obvious inputs, outputs, or behavior.

## Environment Variables

Never commit `.env` files. Use `.env.example` as a template.

### `/server/.env`
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
```

No environment variables needed for `/client/` in the current MVP.
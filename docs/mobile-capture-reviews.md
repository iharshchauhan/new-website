# Mobile Capture to Draft Review PR

This workflow lets you share a URL from your phone, then auto-create a draft review file and draft PR in this repo.

## 1) GitHub secrets

Add one or both repository secrets:

- `GEMINI_API_KEY` for Gemini Flash
- `GROK_API_KEY` for Grok
- `GROQ_API_KEY` for Groq

The workflow writes these into a temporary `.env` file at runtime, and `scripts/capture-review.mjs` reads keys from `.env` (or `.env.local` for local runs).

## 2) Trigger endpoint

Workflow file: `.github/workflows/capture-review.yml`  
Workflow name: `Capture Review Draft`

Use GitHub REST API `workflow_dispatch`:

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR_GITHUB_PAT>" \
  https://api.github.com/repos/<OWNER>/<REPO>/actions/workflows/capture-review.yml/dispatches \
  -d '{
    "ref": "main",
    "inputs": {
      "url": "https://example.com/article",
      "provider": "groq",
      "model": "llama-3.3-70b-versatile",
      "source": "ios-shortcut",
      "tags": "Review,Notes,AI"
    }
  }'
```

Required PAT scopes:

- Fine-grained token with `Actions: Read and write` and `Contents: Read and write` on this repo.

## 3) iPhone Shortcut idea

- In Share Sheet, receive `URL`.
- `Get Contents of URL` to `https://api.github.com/repos/<OWNER>/<REPO>/actions/workflows/capture-review.yml/dispatches`
- Method: `POST`
- Headers:
  - `Accept: application/vnd.github+json`
  - `Authorization: Bearer <YOUR_GITHUB_PAT>`
- JSON body:

```json
{
  "ref": "main",
  "inputs": {
    "url": "<Shortcut Input>",
    "provider": "groq",
    "source": "ios-shortcut"
  }
}
```

## 4) Optional manual summary mode

If you generate summary on phone first (Grok/Gemini app), pass markdown as `summary_text` input.

When `summary_text` is present, the workflow skips model API calls.

Supported provider values:

- `gemini`
- `grok`
- `groq`
- `none`

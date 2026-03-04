<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/37ec1f41-9811-44cd-a8d0-ba7a11830494

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Cloudinary image integration

If local markdown images break on GitHub Pages/static export, use Cloudinary URLs instead of serving from the repo.

1. Add Cloudinary keys to `.env.local`:
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Optional: set `CLOUDINARY_FOLDER` (defaults to `new-website`).
3. Upload local site images and generate a manifest:
   `npm run cloudinary:upload`
4. Convert local markdown image paths to Cloudinary links:
   `npm run cloudinary:rewrite`
5. Run both in sequence:
   `npm run cloudinary:sync`
6. Build/run:
   `npm run build` or `npm run dev`

How it works:
- Upload script pushes images from `public/images` and `public/support/images`.
- A mapping file is generated at `lib/cloudinary-manifest.json`.
- Markdown `<img>` rendering in `components/mdx-content.tsx` uses Cloudinary URL when a local path exists in this mapping.
- A rewrite script updates markdown content in `content/**` from local image paths (for example `public/images/...`) to Cloudinary URLs.

### GitHub automation

`.github/workflows/cloudinary-sync.yml` runs automatically on pushes to `main` that modify:
- `public/images/**`
- `public/support/images/**`

It uploads images to Cloudinary, regenerates the manifest, rewrites local markdown image links, and commits updates back to `main`.

Required GitHub repository secrets:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Optional: `CLOUDINARY_FOLDER`

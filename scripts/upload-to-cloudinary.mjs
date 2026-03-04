import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missing = requiredEnvVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing required env vars in .env.local: ${missing.join(", ")}`,
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const repoRoot = process.cwd();
const publicDir = path.join(repoRoot, "public");
const sourceDirs = ["images", "support/images"];
const outputFile = path.join(repoRoot, "lib", "cloudinary-manifest.json");
const folderPrefix = (process.env.CLOUDINARY_FOLDER || "new-website").replace(
  /^\/+|\/+$/g,
  "",
);

const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".avif",
]);

function listFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFilesRecursively(fullPath));
      continue;
    }
    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function isImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return imageExtensions.has(ext);
}

async function run() {
  const candidateFiles = sourceDirs.flatMap((dir) =>
    listFilesRecursively(path.join(publicDir, dir)),
  );
  const imageFiles = candidateFiles.filter(isImage);

  if (imageFiles.length === 0) {
    console.log(
      "No images found in public/images or public/support/images. Nothing to upload.",
    );
    process.exit(0);
  }

  const manifest = {};

  for (const absolutePath of imageFiles) {
    const relativeToPublic = path
      .relative(publicDir, absolutePath)
      .split(path.sep)
      .join("/");
    const localKey = `/${relativeToPublic}`;
    const publicIdWithoutExt = relativeToPublic.replace(/\.[^.]+$/, "");
    const publicId = folderPrefix
      ? `${folderPrefix}/${publicIdWithoutExt}`
      : publicIdWithoutExt;

    try {
      const result = await cloudinary.uploader.upload(absolutePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      });
      manifest[localKey] = result.secure_url;
      console.log(`Uploaded ${localKey}`);
    } catch (error) {
      console.error(`Failed uploading ${localKey}:`, error.message);
    }
  }

  fs.writeFileSync(outputFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`\nWrote ${Object.keys(manifest).length} entries to ${outputFile}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

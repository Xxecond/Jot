import { v2 as cloudinary } from "cloudinary";

// Cloudinary config (only used in production)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// LOCAL upload helper
import fs from "fs";
import path from "path";

// Save locally
async function saveLocal(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  fs.writeFileSync(filepath, buffer);

  return `/uploads/${filename}`;
}

// Cloudinary upload
async function saveCloudinary(file, quality = "medium") {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const qualityMap = {
    low: "auto:low",
    medium: "auto:good",
    high: "auto:best",
  };

  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "blog_images",
        quality: qualityMap[quality] || "auto:good",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

// 🔥 MAIN EXPORT (decision maker)
export async function uploadFile(file, options = {}) {
  const env = process.env.NODE_ENV;

  if (env === "production") {
    return await saveCloudinary(file, options.quality);
  }

  return await saveLocal(file);
}
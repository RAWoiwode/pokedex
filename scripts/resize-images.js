import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./assets/originals";
const outputDir = "./assets/icons";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir);

for (const file of files) {
  const inputPath = path.join(inputDir, file);

  // Skip non-images
  if (!/\.(png|jpg|jpeg|webp)$/i.test(file)) continue;

  const baseName = path.parse(file).name;
  const outputPath = path.join(outputDir, `${baseName}.webp`);

  await sharp(inputPath)
    .resize(64, 64, {
      fit: "contain", // use "cover" if you want cropping
      withoutEnlargement: true,
    })
    .webp({
      quality: 85, // adjust 70–90
      effort: 6, // compression effort (0–6)
    })
    .toFile(outputPath);

  console.log(`Converted ${file} → ${baseName}.webp`);
}

console.log("Done!");

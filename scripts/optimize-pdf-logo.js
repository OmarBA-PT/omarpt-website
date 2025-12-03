const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeLogo() {
  const inputPath = path.join(__dirname, '../public/images/logos/logo.png');
  const outputPath = path.join(__dirname, '../public/images/logos/logo-pdf-optimized.png');

  try {
    console.log('Optimizing logo for PDF usage...');
    console.log(`Input: ${inputPath}`);

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    console.log(`Original size: ${(originalStats.size / 1024).toFixed(2)} KB`);

    // Resize to 200x200 (larger than displayed 80px for quality)
    // Convert to PNG with reduced quality
    // Remove alpha channel if not needed (convert RGBA to RGB)
    await sharp(inputPath)
      .resize(200, 200, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png({
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true // Use palette-based PNG for smaller file size
      })
      .toFile(outputPath);

    // Get optimized file size
    const optimizedStats = fs.statSync(outputPath);
    console.log(`Optimized size: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
    console.log(`Reduction: ${((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1)}%`);
    console.log(`✓ Optimized logo created: ${outputPath}`);
  } catch (error) {
    console.error('Error optimizing logo:', error);
    process.exit(1);
  }
}

optimizeLogo();

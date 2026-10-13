import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

/**
 * Packs multiple PNG buffers into a standard Windows ICO file buffer
 */
function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dirSize = headerSize + count * dirEntrySize;

  let currentOffset = dirSize;
  const entries = [];

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    entries.push({
      width: size >= 256 ? 0 : size,
      height: size >= 256 ? 0 : size,
      colorCount: 0,
      reserved: 0,
      planes: 1,
      bitCount: 32,
      bytesInRes: buf.length,
      imageOffset: currentOffset,
      data: buf,
    });
    currentOffset += buf.length;
  }

  const icoBuffer = Buffer.alloc(currentOffset);

  // Write ICONDIR
  icoBuffer.writeUInt16LE(0, 0); // reserved
  icoBuffer.writeUInt16LE(1, 2); // 1 = ICO
  icoBuffer.writeUInt16LE(count, 4); // count

  // Write ICONDIRENTRY list
  let entryPos = 6;
  for (const entry of entries) {
    icoBuffer.writeUInt8(entry.width, entryPos + 0);
    icoBuffer.writeUInt8(entry.height, entryPos + 1);
    icoBuffer.writeUInt8(entry.colorCount, entryPos + 2);
    icoBuffer.writeUInt8(entry.reserved, entryPos + 3);
    icoBuffer.writeUInt16LE(entry.planes, entryPos + 4);
    icoBuffer.writeUInt16LE(entry.bitCount, entryPos + 6);
    icoBuffer.writeUInt32LE(entry.bytesInRes, entryPos + 8);
    icoBuffer.writeUInt32LE(entry.imageOffset, entryPos + 12);
    entryPos += 16;
  }

  // Write PNG data buffers
  for (const entry of entries) {
    entry.data.copy(icoBuffer, entry.imageOffset);
  }

  return icoBuffer;
}

async function run() {
  console.log('Generating favicon and app icons...');

  const faviconSvgPath = path.join(publicDir, 'favicon.svg');
  const logoMonogramSvgPath = path.join(publicDir, 'logo-monogram.svg');
  const coupleImgPath = path.join(publicDir, 'frames', 'ezgif-frame-001.jpg');

  const faviconSvgBuffer = fs.readFileSync(faviconSvgPath);
  const logoSvgBuffer = fs.readFileSync(logoMonogramSvgPath);

  // 1. Generate Favicon PNGs
  const p16 = await sharp(faviconSvgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), p16);

  const p32 = await sharp(faviconSvgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), p32);

  const p48 = await sharp(faviconSvgBuffer).resize(48, 48).png().toBuffer();

  // 2. Multi-size favicon.ico (16, 32, 48)
  const icoBuffer = createIco([p16, p32, p48], [16, 32, 48]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Generated favicon.ico, favicon-16x16.png, favicon-32x32.png');

  // 3. Apple Touch Icon (180x180, solid green background #0F3B2E, NO transparency, ~15% padding)
  const appleTouchSize = 180;
  const appleInnerSize = 132;
  const innerMonogramApple = await sharp(faviconSvgBuffer)
    .resize(appleInnerSize, appleInnerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: appleTouchSize,
      height: appleTouchSize,
      channels: 4,
      background: { r: 15, g: 59, b: 46, alpha: 1 }, // #0F3B2E
    },
  })
    .composite([{ input: innerMonogramApple, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  // 4. Standard PWA Icons (192 and 512)
  await sharp(faviconSvgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(faviconSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Generated icon-192.png and icon-512.png');

  // 5. Maskable Icon (512x512, monogram within central 80% safe zone: 400px diameter, solid green background)
  const maskableSize = 512;
  const maskableInnerSize = 370;
  const innerMonogramMaskable = await sharp(faviconSvgBuffer)
    .resize(maskableInnerSize, maskableInnerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 15, g: 59, b: 46, alpha: 1 },
    },
  })
    .composite([{ input: innerMonogramMaskable, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));
  console.log('✓ Generated icon-maskable-512.png');

  // 6. Social Share Previews (og-image.jpg: 1200x630, and og-image-square.jpg: 600x600)
  console.log('Generating social share preview images...');

  // Prepare couple photo for og-image
  const coupleArchWidth = 460;
  const coupleArchHeight = 490;
  
  // Arch mask SVG
  const archMaskSvg = Buffer.from(`
    <svg width="${coupleArchWidth}" height="${coupleArchHeight}" viewBox="0 0 ${coupleArchWidth} ${coupleArchHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${coupleArchWidth}" height="${coupleArchHeight}" rx="220" ry="220" fill="#FFF" />
      <rect x="0" y="240" width="${coupleArchWidth}" height="${coupleArchHeight - 240}" rx="12" ry="12" fill="#FFF" />
    </svg>
  `);

  const couplePhotoResized = await sharp(coupleImgPath)
    .resize(coupleArchWidth, coupleArchHeight, { fit: 'cover', position: 'top' })
    .composite([{ input: archMaskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Monogram for OG card (100x100)
  const ogMonogram = await sharp(logoSvgBuffer).resize(90, 90).png().toBuffer();

  // SVG overlay for 1200x630 card layout
  const ogCardSvg = Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#8C6F2A" />
          <stop offset="35%" stop-color="#C9A24B" />
          <stop offset="65%" stop-color="#E8D296" />
          <stop offset="100%" stop-color="#8C6F2A" />
        </linearGradient>
      </defs>

      <!-- Background: Cream #F7F2E7 -->
      <rect width="1200" height="630" fill="#F7F2E7" />
      
      <!-- Faint radial warm glow -->
      <radialGradient id="cardGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#E8D296" stop-opacity="0.32" />
        <stop offset="70%" stop-color="#F7F2E7" stop-opacity="0" />
      </radialGradient>
      <rect width="1200" height="630" fill="url(#cardGlow)" />

      <!-- Kasavu Gold Border Frame -->
      <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#C9A24B" stroke-width="2" />
      <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#E8D296" stroke-width="1" />

      <!-- Corner Ornaments -->
      <g stroke="#C9A24B" stroke-width="3" fill="none">
        <path d="M 22 44 L 22 22 L 44 22" />
        <path d="M 1156 22 L 1178 22 L 1178 44" />
        <path d="M 22 586 L 22 608 L 44 608" />
        <path d="M 1156 608 L 1178 608 L 1178 586" />
      </g>

      <!-- Left Text Content (Safe Margin x: 74px) -->
      <!-- Sub-badge -->
      <text x="74" y="210" font-family="Cinzel Decorative, Georgia, serif" font-size="14" font-weight="700" letter-spacing="4" fill="#8C6F2A">
        THE ROYAL WEDDING INVITATION
      </text>

      <!-- Couple Names Heading -->
      <text x="74" y="278" font-family="Cinzel Decorative, Georgia, serif" font-size="52" font-weight="800" letter-spacing="2" fill="url(#goldText)">
        ANANYA &amp; ROHAN
      </text>

      <!-- Kasavu Divider -->
      <line x1="74" y1="316" x2="320" y2="316" stroke="#C9A24B" stroke-width="2" />
      <circle cx="330" cy="316" r="3" fill="#C9A24B" />
      <line x1="340" y1="316" x2="580" y2="316" stroke="#C9A24B" stroke-width="2" />

      <!-- Date & Location -->
      <text x="74" y="365" font-family="Cormorant Garamond, Georgia, serif" font-size="28" font-style="italic" fill="#0F3B2E">
        December 11 – 13, 2026 • Kumarakom, Kerala
      </text>

      <!-- Venue & Description -->
      <text x="74" y="415" font-family="Plus Jakarta Sans, sans-serif" font-size="17" font-weight="500" fill="#0F3B2E" opacity="0.8">
        Kumarakom Lake Resort, Vembanad Backwaters
      </text>

      <!-- Auspicious Tagline (2 Lines for perfect margin) -->
      <text x="74" y="465" font-family="Cormorant Garamond, Georgia, serif" font-size="19" font-style="italic" fill="#8C6F2A">
        "Two souls, two traditions, one eternal journey
      </text>
      <text x="74" y="492" font-family="Cormorant Garamond, Georgia, serif" font-size="19" font-style="italic" fill="#8C6F2A">
        in God's Own Country."
      </text>

      <!-- Right Arch Outer Borders -->
      <g transform="translate(668, 70)">
        <rect x="-4" y="-4" width="468" height="498" rx="224" ry="224" fill="none" stroke="#C9A24B" stroke-width="3" />
        <rect x="0" y="240" width="460" height="258" rx="14" ry="14" fill="none" stroke="#C9A24B" stroke-width="3" />
        <rect x="-8" y="-8" width="476" height="506" rx="228" ry="228" fill="none" stroke="#E8D296" stroke-width="1.2" />
      </g>
    </svg>
  `);

  // Composite og-image.jpg
  await sharp(ogCardSvg)
    .composite([
      { input: ogMonogram, left: 74, top: 80 },
      { input: couplePhotoResized, left: 668, top: 70 },
    ])
    .jpeg({ quality: 82, progressive: true })
    .toFile(path.join(publicDir, 'og-image.jpg'));

  const ogStat = fs.statSync(path.join(publicDir, 'og-image.jpg'));
  console.log(`✓ Generated og-image.jpg: ${(ogStat.size / 1024).toFixed(1)} KB (target: < 300 KB)`);

  // 7. Square OpenGraph image (og-image-square.jpg: 600x600, < 200 KB)
  const squareSize = 600;
  const squareArchW = 280;
  const squareArchH = 300;
  const squareArchMask = Buffer.from(`
    <svg width="${squareArchW}" height="${squareArchH}" viewBox="0 0 ${squareArchW} ${squareArchH}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${squareArchW}" height="${squareArchH}" rx="140" ry="140" fill="#FFF" />
      <rect x="0" y="150" width="${squareArchW}" height="${squareArchH - 150}" rx="8" ry="8" fill="#FFF" />
    </svg>
  `);

  const squareCouplePhoto = await sharp(coupleImgPath)
    .resize(squareArchW, squareArchH, { fit: 'cover', position: 'top' })
    .composite([{ input: squareArchMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const squareMonogram = await sharp(logoSvgBuffer).resize(64, 64).png().toBuffer();

  const squareSvg = Buffer.from(`
    <svg width="${squareSize}" height="${squareSize}" viewBox="0 0 ${squareSize} ${squareSize}" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="600" fill="#F7F2E7" />
      <rect x="18" y="18" width="564" height="564" fill="none" stroke="#C9A24B" stroke-width="2" />
      <rect x="23" y="23" width="554" height="554" fill="none" stroke="#E8D296" stroke-width="1" />

      <!-- Center Names and Subtext -->
      <text x="300" y="420" font-family="Cinzel Decorative, Georgia, serif" font-size="28" font-weight="800" letter-spacing="1" fill="#0F3B2E" text-anchor="middle">
        ANANYA &amp; ROHAN
      </text>
      <text x="300" y="456" font-family="Cormorant Garamond, Georgia, serif" font-size="19" font-style="italic" fill="#8C6F2A" text-anchor="middle">
        Wedding Celebration • Kumarakom
      </text>
      <text x="300" y="492" font-family="Plus Jakarta Sans, sans-serif" font-size="14" font-weight="600" fill="#0F3B2E" opacity="0.8" text-anchor="middle">
        December 11 – 13, 2026 • Kerala
      </text>

      <!-- Arch border -->
      <g transform="translate(160, 65)">
        <rect x="-3" y="-3" width="286" height="306" rx="143" ry="143" fill="none" stroke="#C9A24B" stroke-width="2.5" />
        <rect x="0" y="150" width="280" height="156" rx="10" ry="10" fill="none" stroke="#C9A24B" stroke-width="2.5" />
      </g>
    </svg>
  `);

  await sharp(squareSvg)
    .composite([
      { input: squareCouplePhoto, left: 160, top: 65 },
      { input: squareMonogram, left: 268, top: 512 },
    ])
    .jpeg({ quality: 82 })
    .toFile(path.join(publicDir, 'og-image-square.jpg'));

  const squareStat = fs.statSync(path.join(publicDir, 'og-image-square.jpg'));
  console.log(`✓ Generated og-image-square.jpg: ${(squareStat.size / 1024).toFixed(1)} KB (target: < 200 KB)`);

  console.log('All icons and share preview images generated successfully!');
}

run().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

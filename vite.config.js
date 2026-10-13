import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-wedding-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          
          // Handle /wedding-video.mp4
          if (url.startsWith('/wedding-video.mp4') || url.startsWith('/video/')) {
            const videoPath = path.resolve(__dirname, '3D_chibi_wedding_animation_film_20261012141934.mp4');
            if (fs.existsSync(videoPath)) {
              const stat = fs.statSync(videoPath);
              const fileSize = stat.size;
              const range = req.headers.range;

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const file = fs.createReadStream(videoPath, { start, end });
                const head = {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
                return;
              } else {
                const head = {
                  'Content-Length': fileSize,
                  'Content-Type': 'video/mp4',
                  'Accept-Ranges': 'bytes',
                };
                res.writeHead(200, head);
                fs.createReadStream(videoPath).pipe(res);
                return;
              }
            }
          }

          // Handle /frames/ezgif-frame-XXX.jpg
          if (url.startsWith('/frames/')) {
            const filename = path.basename(url.split('?')[0]);
            const framePath = path.resolve(__dirname, 'ezgif-2c18fe3fa664c85a-jpg', filename);
            if (fs.existsSync(framePath)) {
              res.setHeader('Content-Type', 'image/jpeg');
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              fs.createReadStream(framePath).pipe(res);
              return;
            }
          }

          // Handle audio: /Love At First Sight.mp3 or /Love-At-First-Sight.mp3
          const decodedUrl = decodeURIComponent(url);
          if (decodedUrl.includes('Love At First Sight.mp3') || decodedUrl.includes('Love-At-First-Sight.mp3')) {
            const audioPath = path.resolve(__dirname, 'Love At First Sight.mp3');
            if (fs.existsSync(audioPath)) {
              const stat = fs.statSync(audioPath);
              const fileSize = stat.size;
              const range = req.headers.range;

              if (range) {
                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const file = fs.createReadStream(audioPath, { start, end });
                const head = {
                  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': chunksize,
                  'Content-Type': 'audio/mpeg',
                };
                res.writeHead(206, head);
                file.pipe(res);
                return;
              } else {
                const head = {
                  'Content-Length': fileSize,
                  'Content-Type': 'audio/mpeg',
                  'Accept-Ranges': 'bytes',
                };
                res.writeHead(200, head);
                fs.createReadStream(audioPath).pipe(res);
                return;
              }
            }
          }

          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/*.mp3', '**/*.mp4'],
    },
  },
});

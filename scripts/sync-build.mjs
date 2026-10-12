import fs from 'fs';

// Sync compiled assets to root ./assets and ./docs so GitHub Pages works directly from root or /docs
if (fs.existsSync('dist/assets')) {
  fs.mkdirSync('assets', { recursive: true });
  fs.cpSync('dist/assets', 'assets', { recursive: true });
}
if (fs.existsSync('dist')) {
  fs.mkdirSync('docs', { recursive: true });
  fs.cpSync('dist', 'docs', { recursive: true });
}
console.log('Build synchronized to ./assets and ./docs for direct GitHub Pages hosting!');

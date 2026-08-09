const fs = require('fs');
const path = require('path');

// Generate SVG files directly if canvas is not installed, convert SVG or write SVG icons
const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="url(#grad)" />
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="192" y2="192" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563EB" />
      <stop offset="1" stop-color="#1D4ED8" />
    </linearGradient>
  </defs>
  <rect x="80" y="44" width="32" height="104" rx="8" fill="#FFFFFF" />
  <rect x="44" y="80" width="104" height="32" rx="8" fill="#FFFFFF" />
</svg>`;

const svg512 = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="url(#grad)" />
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2563EB" />
      <stop offset="1" stop-color="#1D4ED8" />
    </linearGradient>
  </defs>
  <rect x="214" y="118" width="84" height="276" rx="20" fill="#FFFFFF" />
  <rect x="118" y="214" width="276" height="84" rx="20" fill="#FFFFFF" />
</svg>`;

const publicDir = path.join(__dirname, 'public');
fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), svg192);
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), svg512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), svg192);
console.log('PWA SVG icons created successfully!');

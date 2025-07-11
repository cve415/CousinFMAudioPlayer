# CousinFM Static Version

This is a static version of CousinFM that works without a backend database. All broadcast data is loaded from a JSON file and audio streams directly from your Pinata IPFS gateway.

## Features
- ✅ Full audio playback from IPFS
- ✅ Netflix-style streaming interface
- ✅ Waveform visualization
- ✅ All broadcast artwork and covers
- ✅ Responsive design
- ✅ No backend required

## Quick Start

1. **Development**:
   ```bash
   npm run dev
   ```

2. **Build for Production**:
   ```bash
   npm run build
   ```

3. **Preview Build**:
   ```bash
   npm run preview
   ```

## Deployment Options

### 1. Netlify
- Drag and drop the `dist` folder to Netlify
- Or connect your GitHub repo for automatic deployments

### 2. Vercel
- Import your project from GitHub
- Vercel will auto-detect the static build

### 3. GitHub Pages
- Push your code to GitHub
- Enable GitHub Pages in repo settings
- Point to the `dist` folder

### 4. Any Static Host
- Upload the `dist` folder to any web server
- No server-side processing required

## Audio Streaming
Audio files stream directly from your private Pinata IPFS gateway. No additional configuration needed.

## Customization
- Edit `client/src/data/broadcasts.json` to add/remove broadcasts
- Add images to `attached_assets/` folder
- Modify styles in `client/src/` components

## File Structure
```
├── client/src/               # React app source
├── attached_assets/          # Images and covers
├── dist/                     # Built static files
└── client/src/data/broadcasts.json  # Broadcast data
```

Your app is now ready to deploy anywhere!
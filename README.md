# CousinFMAudioPlayer

A decentralized audio streaming application that serves media content directly from IPFS. Built as a static React app with no backend dependencies.

## Problem It Solves

- **Censorship Resistance**: Content stored on IPFS cannot be easily taken down
- **Zero Infrastructure Costs**: No servers to maintain, completely static deployment
- **Global Accessibility**: IPFS provides distributed content delivery worldwide
- **Simple Deployment**: Deploy anywhere that serves static files

## Features

- 🎵 Stream audio directly from IPFS
- 📱 Mobile-first responsive design
- 🎨 Netflix-style audio player with background artwork
- 📅 Year-based filtering and search
- 🌊 Real-time waveform visualization
- ⚡ Fast loading with preloading and caching
- 🔒 Content Security Policy compliant

## Quick Start

```bash
git clone [your-repository]
npm install
npm run dev
```

Visit `http://localhost:5173` to start streaming.

## Architecture

### Core Components
- **StreamingPlayer**: Main audio player with full-screen display
- **BroadcastList**: Scrollable archive with filtering
- **MediaPlayer**: Audio controls with waveform visualization
- **WaveformVisualizer**: Dynamic audio visualization

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Storage**: IPFS for media, local JSON for metadata
- **Build**: Vite for fast development and production builds
- **Gateway**: Pinata for reliable IPFS access

## Project Structure

```
├── client/src/
│   ├── components/          # React components
│   ├── data/
│   │   └── broadcasts.json  # Broadcast metadata
│   └── types/              # TypeScript definitions
├── attached_assets/        # Local artwork files
└── dist/                  # Production build
```

## Data Model

Each broadcast follows this structure:

```typescript
interface Broadcast {
  id: number;
  cid: string;           // IPFS Content Identifier
  title: string;
  fileSizeMB: number;
  date: string;          // YYYY-MM-DD format
  imageCid?: string;     // Optional artwork
  createdAt: Date;
}
```

## Adding Content

1. Upload audio files to IPFS
2. Add artwork to `attached_assets/`
3. Update `broadcasts.json` with new entries:

```json
{
  "id": 1,
  "cid": "QmYourIPFSHash",
  "title": "Your Broadcast Title",
  "fileSizeMB": 25.4,
  "date": "2024-01-15",
  "imageCid": "your-artwork.jpg",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

4. Rebuild and deploy

## Deployment

Build the static files:

```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service:
- **Replit**: Zero-config deployment
- **Vercel**: Connect your Git repository
- **Netlify**: Drag and drop or Git integration
- **GitHub Pages**: Use GitHub Actions

## Performance

- **Bundle Size**: ~250KB total (gzipped)
- **First Paint**: <500ms on fast connections
- **Media Loading**: Depends on IPFS gateway speed
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Security

The application implements Content Security Policy to ensure safe media loading from IPFS gateways while preventing XSS attacks. All content integrity is verified through IPFS's cryptographic hashing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with existing broadcast data
5. Submit a pull request



---

*Built for the decentralized web. Content lives forever on IPFS.*
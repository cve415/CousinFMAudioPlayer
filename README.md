# CousinFM Audio Player

A modern, Netflix-style streaming web application for playing radio broadcasts stored on IPFS. Built for San Francisco's CousinFM radio station with a focus on decentralized media streaming and elegant user experience.

## 🎵 Features

- **Streaming Audio & Video**: Play MP3 and MP4 broadcasts directly from IPFS
- **Netflix-Style Interface**: Large hero player with scrollable archive playlist
- **Chronological Organization**: Newest broadcasts first, filterable by year
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Visual Feedback**: Dynamic waveform visualizer and broadcast artwork
- **San Francisco Branding**: Golden Gate Bridge imagery throughout
- **One-Click Playback**: Play buttons work directly from playlist with instant audio streaming
- **Individual Sharing**: Each broadcast has its own shareable URL for social media and direct links
- **Static Deployment**: No backend required - runs anywhere

## 🛠 Technical Architecture

### Why This Tech Stack?

**React + TypeScript**: Provides type safety and component reusability for complex media interfaces
**Static Architecture**: Eliminates server costs and complexity - perfect for radio stations with limited technical resources
**IPFS Integration**: Decentralized storage ensures broadcasts remain accessible without vendor lock-in
**Vite Build System**: Fast development with optimized production builds
**Tailwind CSS**: Rapid UI development with consistent design system

### Core Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite (development) + Static build (production)
- **Storage**: IPFS via Pinata Gateway
- **Data**: JSON file (no database required)
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React hooks + TanStack Query patterns

### Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── data/          # broadcasts.json
│   │   ├── pages/         # Route components
│   │   └── types/         # TypeScript definitions
├── attached_assets/       # Broadcast artwork
├── server/               # Development server only
└── dist/                # Production build
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Access to Pinata IPFS gateway
- Broadcast files uploaded to IPFS

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cousinfm-player.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Serve static files
npm run serve
```

## 📝 Adding New Broadcasts

### Quick Process

1. **Upload to IPFS**: Get CID from your Pinata account
2. **Add Images**: Place artwork in `attached_assets/[CID]_timestamp.jpg`
3. **Update JSON**: Add entry to `client/src/data/broadcasts.json`

### Example Entry

```json
{
  "id": 51,
  "cid": "QmYourBroadcastCID",
  "title": "CousinFM January 2025 Mix",
  "fileSizeMB": 87.3,
  "date": "2025-01-15",
  "imageCid": "QmYourBroadcastCID_1752221000000.jpg",
  "createdAt": "2025-01-15T00:00:00.000Z"
}
```

See `UPDATE-BROADCASTS.md` for detailed instructions.

## 🎨 Design Philosophy

### User Experience
- **Instant Playback**: Click any broadcast to start playing immediately
- **Visual Hierarchy**: Large player draws attention to current broadcast
- **Content Discovery**: Chronological ordering with year filters
- **Mobile-First**: Responsive design for all devices

### Technical Decisions
- **Static Over Dynamic**: Eliminates server complexity and costs
- **IPFS Over CDN**: Ensures long-term accessibility and decentralization
- **JSON Over Database**: Simplifies deployment and reduces infrastructure needs
- **Component-Based**: Modular architecture for easy maintenance

## 🌉 San Francisco Branding

The application features consistent San Francisco Golden Gate Bridge imagery:
- **Hero Backgrounds**: Dramatic sunset scenes when no broadcast artwork available
- **Fallback Images**: Consistent branding across all components
- **Local Identity**: Reflects CousinFM's San Francisco roots

## 📊 Current Archive

- **50 Broadcasts**: Spanning 2022-2024
- **Mixed Media**: Both audio (MP3) and video (MP4) content
- **Artwork Support**: Individual broadcast images with automatic fallbacks
- **Size Range**: 32-142 MB per broadcast

## 🔧 Development

### Key Files
- `client/src/data/broadcasts.json` - Broadcast metadata
- `client/src/components/StreamingPlayer.tsx` - Main player interface
- `client/src/components/BroadcastList.tsx` - Archive playlist
- `attached_assets/` - Broadcast artwork storage

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run serve` - Serve production build locally

## 🚀 Deployment

### Static Hosting Options
- **Replit Deployments**: One-click deployment
- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Build and deploy via Actions

### Environment Setup
No environment variables required - all configuration is file-based.

## 📈 Performance

- **Static Assets**: Optimized images and code splitting
- **IPFS Streaming**: Direct media streaming without server processing
- **Lazy Loading**: Components load as needed
- **Caching**: Browser caching for static assets

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🎧 About CousinFM

CousinFM is a San Francisco-based radio station focusing on independent music and community programming. This player showcases our archive of broadcasts while maintaining our commitment to decentralized, accessible media distribution.

---

**Live Demo**: [Add your deployment URL here]  
**Contact**: [Add your contact information]  
**Station**: CousinFM San Francisco, CA
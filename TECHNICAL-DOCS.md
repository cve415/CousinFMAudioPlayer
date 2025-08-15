# CousinFM Audio Player Technical Documentation

## Architecture Overview

CousinFM Audio Player is a static React application that streams media content from IPFS using a JSON-based data layer. The architecture prioritizes simplicity, performance, and decentralized content delivery.

### Core Architecture Principles

- **Static-First**: No backend server required for production
- **Decentralized Storage**: IPFS for media content, local JSON for metadata
- **Component-Based**: Modular React components with TypeScript
- **Mobile-First**: Responsive design with touch-friendly controls

## Technology Stack

### Frontend
```
React 18.2.0          # Component framework
TypeScript 5.0+       # Type safety
Tailwind CSS 3.3+     # Utility-first styling
Radix UI              # Accessible component primitives
Wouter                # Lightweight routing
TanStack Query        # Server state management patterns
```

### Build & Development
```
Vite 4.4+             # Build tool and dev server
ESBuild               # Fast TypeScript compilation
PostCSS               # CSS processing
Tailwind JIT          # Just-in-time CSS compilation
```

### Media & Storage
```
IPFS                  # Decentralized media storage
Pinata Gateway        # IPFS access layer
Local JSON            # Metadata storage
Browser Storage       # User preferences
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── StreamingPlayer.tsx    # Main hero player
│   │   │   ├── BroadcastList.tsx      # Archive playlist
│   │   │   ├── MediaPlayer.tsx        # Audio/video controls
│   │   │   └── WaveformVisualizer.tsx # Audio visualization
│   │   ├── data/
│   │   │   └── broadcasts.json        # Broadcast metadata
│   │   ├── pages/
│   │   │   └── home.tsx              # Main application page
│   │   └── types/
│   │       └── broadcast.ts          # TypeScript definitions
├── attached_assets/              # Broadcast artwork
├── server/                      # Development server only
└── dist/                       # Production build output
```

## Data Model

### Broadcast Schema
```typescript
interface Broadcast {
  id: number;           // Unique identifier
  cid: string;          // IPFS Content Identifier
  title: string;        // Display name
  fileSizeMB: number;   // File size in megabytes
  date: string;         // Broadcast date (YYYY-MM-DD)
  imageCid?: string;    // Optional artwork filename
  createdAt: Date;      // Timestamp
}
```

### Data Flow
1. JSON file loaded at application startup
2. Broadcasts sorted chronologically (newest first)
3. Media streamed directly from IPFS via Pinata Gateway
4. Images served from local assets with IPFS fallback

## Component Architecture

### StreamingPlayer
- **Purpose**: Netflix-style hero player with background artwork
- **Features**: Full-screen media display, gradient overlays, responsive design
- **Props**: Current broadcast, navigation controls, playback state

### BroadcastList
- **Purpose**: Scrollable archive with year filtering
- **Features**: Thumbnail display, year filters, infinite scroll, search
- **State**: Filter state, display count, loading states

### MediaPlayer
- **Purpose**: Audio/video controls with waveform visualization
- **Features**: Play/pause, seek, volume, next/previous navigation
- **Integration**: HTML5 audio/video elements with custom controls

### WaveformVisualizer
- **Purpose**: Dynamic audio visualization during playback
- **Implementation**: CSS animations with randomized bar heights
- **Performance**: Hardware-accelerated transforms

## IPFS Integration

### Gateway Configuration
```javascript
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
const mediaUrl = `${IPFS_GATEWAY}${broadcast.cid}`;
```

### Content Delivery
- **Audio/Video**: Direct streaming from IPFS gateway
- **Images**: Local assets with CID-based naming
- **Fallback**: San Francisco Golden Gate Bridge imagery

### Performance Optimization
- **Preloading**: Next/previous broadcasts preloaded
- **Caching**: Browser caching for static assets
- **Lazy Loading**: Images loaded on demand

## State Management

### Local State (React Hooks)
```typescript
const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
```

### Derived State
- **Filtered Broadcasts**: Year-based filtering
- **Sorted Broadcasts**: Chronological ordering
- **Display State**: Loading, error, success states

### No External State Management
- Complexity avoided by using React's built-in state
- Props drilling minimized through component composition
- State lifted only when necessary

## Build System

### Development
```bash
npm run dev          # Vite dev server with HMR
```

### Production
```bash
npm run build        # Static build to dist/
npm run serve        # Local preview of build
```

### Build Output
- **Static HTML**: Single-page application
- **Optimized JS**: Code splitting and tree shaking
- **Optimized CSS**: Purged unused styles
- **Assets**: Compressed images and fonts

## Performance Characteristics

### Bundle Size
- **Initial JS**: ~200KB gzipped
- **CSS**: ~50KB gzipped
- **Images**: Varies by broadcast artwork

### Runtime Performance
- **First Paint**: <500ms on fast connections
- **Interactivity**: <100ms click-to-play
- **Media Loading**: Dependent on IPFS gateway speed

### Optimization Strategies
- **Code Splitting**: Route-based chunks
- **Image Optimization**: WebP with fallbacks
- **CSS Optimization**: Tailwind purging
- **Caching**: Service worker for static assets

## Deployment Options

### Static Hosting
- **Replit Deployments**: Zero-config deployment
- **Vercel**: Git-based deployment
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Actions-based deployment

### Configuration
No environment variables or build-time configuration required.

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               media-src 'self' https://gateway.pinata.cloud; 
               img-src 'self' data: https://gateway.pinata.cloud;">
```

### IPFS Security
- **Gateway Trust**: Reliance on Pinata gateway availability
- **Content Integrity**: IPFS provides cryptographic verification
- **Privacy**: No user data stored or transmitted

## Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Media Metrics**: Play rate, completion rate
- **Error Tracking**: Failed loads, network errors

### User Analytics
- **Play Patterns**: Most popular broadcasts
- **User Flow**: Navigation patterns
- **Device Analytics**: Mobile vs desktop usage

## Maintenance & Updates

### Content Updates
1. Upload new broadcasts to IPFS
2. Add artwork to `attached_assets/`
3. Update `broadcasts.json`
4. Rebuild and deploy

### Code Updates
1. Develop in feature branches
2. Test with existing broadcast data
3. Build and deploy static assets
4. Monitor for issues

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Utility functions

### Integration Tests
- Media playback
- Navigation flow
- Filter functionality

### Performance Tests
- Bundle size analysis
- Runtime performance
- Memory usage monitoring

## Browser Support

### Modern Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Media Format Support
- **Audio**: MP3, AAC, OGG
- **Video**: MP4, WebM
- **Images**: JPEG, PNG, WebP

## Future Considerations

### Potential Enhancements
- **Offline Support**: Service worker caching
- **Audio Visualization**: Web Audio API integration
- **Search**: Full-text search across broadcasts
- **Playlists**: User-created playlists

### Scaling Considerations
- **CDN Integration**: Global content delivery
- **Database Migration**: If metadata grows large
- **API Layer**: If dynamic features needed

## Development Workflow

### Local Development
```bash
git clone [repository]
npm install
npm run dev
```

### Adding Features
1. Create component in `client/src/components/`
2. Add types in `client/src/types/`
3. Update routing in `client/src/App.tsx`
4. Test with existing broadcast data

### Deployment
```bash
npm run build
# Deploy dist/ folder to hosting service
```

This architecture provides a robust foundation for streaming media applications while maintaining simplicity and performance.
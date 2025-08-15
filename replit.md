# CousinFM Radio Player

## Overview

CousinFM is a modern web application for streaming radio broadcasts stored on IPFS. The application features a React frontend with a TypeScript Express backend, designed to display and play audio/video broadcasts with a sleek, mobile-responsive interface.

## User Preferences

Preferred communication style: Simple, everyday language.
Documentation preference: Brief but effective documentation suitable for engineers and business users of all levels.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CousinFM theme colors
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Static JSON file (no database required)
- **API**: RESTful endpoints for broadcast management

### Key Components

#### Data Models
- **Broadcast**: Contains ID, IPFS CID, title, file size, date, and timestamps
- **Schema**: Defined with Drizzle ORM and Zod validation

#### Frontend Components
- **BroadcastList**: Displays filterable list of broadcasts with year filtering
- **MediaPlayer**: Full-featured audio/video player with controls
- **MobileControls**: Responsive mobile-friendly playback controls
- **Header**: Application branding and broadcast count display
- **ErrorModal**: User-friendly error handling interface

#### Backend Services
- **Storage Interface**: Abstraction layer supporting both memory and database storage
- **Routes**: RESTful API endpoints for broadcast operations
- **Vite Integration**: Development server with HMR support

## Data Flow

1. **Initialization**: App loads broadcast data from JSON file into memory storage
2. **API Requests**: Frontend fetches broadcasts via TanStack Query
3. **Media Streaming**: IPFS content accessed through Pinata Gateway
4. **State Management**: React Query manages server state, local hooks handle UI state
5. **Error Handling**: Comprehensive error boundaries and user notifications

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **IPFS**: Pinata Gateway for decentralized media storage
- **UI Library**: Radix UI for accessible components
- **Validation**: Zod for runtime type checking

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS
- **Development**: Replit-specific plugins for enhanced development experience

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Uses TSX for hot reloading and Vite dev server
- **Production**: Compiled JavaScript with static file serving
- **Database**: Environment-based DATABASE_URL configuration

### File Structure
```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Common types and schemas
├── attached_assets/ # Static broadcast data
└── migrations/      # Database migration files
```

### Key Features
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Accessibility**: ARIA-compliant components via Radix UI
- **Performance**: Lazy loading and efficient state management
- **Error Resilience**: Comprehensive error handling and recovery
- **Type Safety**: End-to-end TypeScript with runtime validation
- **Image Support**: Database schema includes imageCid field for broadcast artwork
- **Large Media Player**: Prominent player design with broadcast images displayed above controls

### Recent Updates
- Redesigned layout with large media player on top and playlist below
- Added image support infrastructure ready for IPFS image integration
- Enhanced playlist with thumbnail image display capabilities
- Functional play buttons on individual broadcast items
- Implemented Netflix-style streaming interface with hero sections
- Added dynamic waveform visualizer for audio playback
- Created generic CousinFM cover for broadcasts without artwork
- Fixed broadcast title formatting issues (removed trailing 'Q' characters)
- Converted to static version - no backend database required
- All broadcast data loaded from JSON file for easy deployment
- **January 2025**: Chronological sorting (newest first), fully functional playlist play buttons with instant playback, San Francisco Golden Gate Bridge branding with cropped borders, 2025 year filter preparation, individual broadcast sharing system with URL parameters and auto-play functionality, iframe communication support for domain forwarding, production deployment optimization guide, mobile-first responsive typography and UI improvements
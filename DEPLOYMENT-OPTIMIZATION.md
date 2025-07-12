# CousinFM Production Deployment Guide

## Current Performance Issues

### User Capacity Limitations
- **~80 concurrent users** before auto-scaling triggers
- **Free tier throttling** causing playback issues
- **10 GiB monthly data transfer** insufficient for audio streaming
- **Multiple user failures** indicate capacity exceeded

### Domain Forwarding Problems
- **GoDaddy masked forwarding** uses iframe, breaking responsive design
- **"Shows up small"** due to iframe height restrictions
- **Mobile users** especially affected by iframe limitations

## Immediate Solutions

### 1. Upgrade Replit Plan
**Required for reliable streaming:**
- **Replit Core Plan** ($20-25/month)
- **100 GiB data transfer** (10x increase)
- **Autoscale Deployment** ($1/month + usage)
- **Automatic scaling** beyond 80 concurrent users

### 2. Fix Domain Forwarding
**Option A: Replace GoDaddy Forwarding (Recommended)**
1. Change DNS A record to point directly to Replit IP
2. Configure custom domain in Replit Deployments
3. Eliminates iframe issues entirely

**Option B: Keep Forwarding with Iframe Fix**
- Added PostMessage communication for dynamic resizing
- Improves mobile compatibility
- Still has SEO limitations

### 3. Optimize for Scale
**Audio Streaming Optimization:**
- Move audio files to external CDN (Cloudflare, AWS)
- Implement audio compression/transcoding
- Add progressive loading for large files

**Database Optimization:**
- Use external PostgreSQL for multi-instance scaling
- Implement proper caching strategies
- Add Redis for session management

## Recommended Architecture

### High-Traffic Setup
```
Domain (cousinfm.com)
    ↓
Replit Autoscale Deployment
    ↓
External CDN (audio files)
    ↓
External Database (PostgreSQL)
```

### Cost Breakdown
- **Replit Core**: $25/month
- **Autoscale Deployment**: $1/month + $0.02/1000 requests
- **External CDN**: ~$10/month for audio delivery
- **External Database**: ~$15/month for PostgreSQL
- **Total**: ~$50/month for reliable streaming

## Implementation Steps

### Phase 1: Immediate Fixes
1. **Upgrade to Replit Core** - removes throttling
2. **Enable Autoscale Deployment** - handles user spikes
3. **Fix domain forwarding** - improves mobile experience

### Phase 2: Optimization
1. **Move audio to CDN** - reduces server load
2. **Implement external database** - enables true scaling
3. **Add monitoring** - track performance metrics

### Phase 3: Long-term Scaling
1. **Consider dedicated hosting** - for 1000+ concurrent users
2. **Implement load balancing** - distribute traffic
3. **Add global CDN** - reduce latency worldwide

## Monitoring & Alerts

### Key Metrics to Track
- **Concurrent users** (target: <80 per instance)
- **Data transfer** (monitor monthly limits)
- **Error rates** (audio playback failures)
- **Response times** (under 2 seconds)

### Alert Thresholds
- **>70 concurrent users**: Scale up warning
- **>90% data transfer**: Upgrade plan alert
- **>5% error rate**: Performance degradation
- **>3 second load time**: Optimization needed

## Mobile Optimization

### Added Features
- **PostMessage iframe communication** for dynamic sizing
- **Responsive design** maintains usability in iframes
- **Touch-friendly controls** for mobile users
- **Progressive loading** for slower connections

## Security Considerations

### Domain Forwarding Security
- **Cross-origin policies** properly configured
- **PostMessage validation** prevents malicious injection
- **HTTPS enforcement** for all traffic
- **Content Security Policy** headers added

## Fallback Strategy

### If Replit Becomes Insufficient
1. **Export to static site** (GitHub Pages, Netlify)
2. **Migrate to VPS** (DigitalOcean, Linode)
3. **Use cloud platform** (Vercel, AWS Amplify)

### Data Portability
- **JSON broadcast data** easily exportable
- **Standard React build** deployable anywhere
- **No vendor lock-in** architecture

## Next Steps

1. **Immediate**: Upgrade Replit plan and fix domain forwarding
2. **Short-term**: Move audio files to CDN
3. **Long-term**: Implement external database and monitoring

The current setup can handle **~20-30 concurrent users** reliably on free tier, but needs upgrades for broader public access.
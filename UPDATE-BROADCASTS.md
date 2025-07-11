# How to Update CousinFM Broadcasts

## Overview
Your CousinFM app loads broadcasts from a JSON file. When you have new broadcasts, you'll need to update this file and add any new images.

## Step-by-Step Process

### 1. Upload New Audio/Video Files to IPFS
- Upload your new broadcast files to your Pinata IPFS account
- Note the CID (Content Identifier) for each file
- Upload any artwork/images and note their CIDs

### 2. Add Images to Your Project
- Save new images to the `attached_assets/` folder
- Name them using the format: `[CID]_[timestamp].jpg` or `[CID]_[timestamp].png`
- Example: `QmNewBroadcastCID_1752221000000.jpg`

### 3. Update the JSON File
Edit `client/src/data/broadcasts.json` and add your new broadcasts:

```json
{
  "id": 51,
  "cid": "QmYourNewBroadcastCID",
  "title": "Your New Broadcast Title",
  "fileSizeMB": 95.5,
  "date": "2025-01-15",
  "imageCid": "QmYourNewBroadcastCID_1752221000000.jpg",
  "createdAt": "2025-01-15T00:00:00.000Z"
}
```

### 4. JSON File Structure
Each broadcast needs:
- **id**: Unique number (increment from last broadcast)
- **cid**: IPFS CID of the audio/video file
- **title**: Display name for the broadcast
- **fileSizeMB**: File size in megabytes
- **date**: Broadcast date in YYYY-MM-DD format
- **imageCid**: Filename of the image in attached_assets folder
- **createdAt**: ISO timestamp

### 5. File Locations
- **Broadcasts JSON**: `client/src/data/broadcasts.json`
- **Images**: `attached_assets/` folder
- **Audio/Video**: Hosted on your Pinata IPFS gateway

## Tips
- New broadcasts automatically appear at the top (newest first)
- If no image is available, the Golden Gate Bridge image will be used
- Make sure your Pinata gateway URL is working: `https://gateway.pinata.cloud/ipfs/`
- Test new broadcasts by selecting them in the player

## Example New Broadcast Entry
```json
{
  "id": 51,
  "cid": "QmExampleNewBroadcast2025",
  "title": "CousinFM January 2025 Mix",
  "fileSizeMB": 87.3,
  "date": "2025-01-15",
  "imageCid": "QmExampleNewBroadcast2025_1752221000000.jpg",
  "createdAt": "2025-01-15T00:00:00.000Z"
}
```

Just add this to the array in broadcasts.json and save the file. The app will automatically load the new broadcast next time it starts.
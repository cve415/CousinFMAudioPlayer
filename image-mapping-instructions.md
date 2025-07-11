# Image Mapping Instructions

## Step 1: Create the Mapping File

1. **Create a JSON file** called `image-mapping.json` in the project root
2. **Format**: Each broadcast CID maps to its corresponding image CID
3. **Example structure**:
```json
{
  "Qma9YJpugNaorhBnYwRWVTYnCbCzcZt8M6tcAbUzxupT88": "QmImageCID123abc...",
  "QmAnotherBroadcastCID456def...": "QmImageCID789xyz...",
  "QmYetAnotherBroadcastCID...": "QmImageCID456uvw..."
}
```

## Step 2: Get Your Broadcast CIDs

To see all current broadcast CIDs in the database:
```bash
curl http://localhost:5000/api/broadcasts | jq '.[] | {id: .id, cid: .cid, title: .title}'
```

Or check the attached JSON file: `attached_assets/cousinfm_playlist_1752208465676.json`

## Step 3: Upload Images to IPFS

1. **Organize your images** as `{broadcast-cid}.jpg`
2. **Upload to IPFS** via Pinata or your preferred method
3. **Record the image CIDs** that are returned

## Step 4: Create Your Mapping File

Create `image-mapping.json` with your actual CIDs:
```json
{
  "Qma9YJpugNaorhBnYwRWVTYnCbCzcZt8M6tcAbUzxupT88": "QmYourActualImageCID1...",
  "QmSecondBroadcastCID...": "QmYourActualImageCID2..."
}
```

## Step 5: Run the Batch Update Script

```bash
curl -X POST http://localhost:5000/api/broadcasts/batch-update-images \
  -H "Content-Type: application/json" \
  -d @image-mapping.json
```

## Step 6: Verify Updates

Check that images were added:
```bash
curl http://localhost:5000/api/broadcasts | jq '.[] | {id: .id, title: .title, imageCid: .imageCid}'
```

## Troubleshooting

- **Invalid CID**: Make sure broadcast CIDs in mapping file exactly match database CIDs
- **Image not loading**: Verify image CIDs are correct and accessible via Pinata gateway
- **Permission errors**: Ensure you have write access to the database
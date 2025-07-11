import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the playlist to get broadcast data
const playlistPath = path.join(__dirname, 'attached_assets', 'cousinfm_playlist_1752208465676.json');
const playlist = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));

// Get all image files from attached_assets
const assetsDir = path.join(__dirname, 'attached_assets');
const imageFiles = fs.readdirSync(assetsDir).filter(file => 
  file.match(/\.(jpg|jpeg|png)$/i) && file.includes('_')
);

console.log('Found image files:', imageFiles.length);

// Extract CID from filename (before the underscore)
const cidToFilename = {};
imageFiles.forEach(file => {
  const cid = file.split('_')[0];
  cidToFilename[cid] = file;
});

console.log('CID mappings:', Object.keys(cidToFilename).length);

// Generate SQL update statements
const updates = [];
playlist.forEach((broadcast, index) => {
  const broadcastId = index + 1; // Assuming 1-based IDs
  
  // Check if we have an image for this broadcast's CID
  if (cidToFilename[broadcast.cid]) {
    const imageCid = cidToFilename[broadcast.cid];
    updates.push(`UPDATE broadcasts SET "imageCid" = '${imageCid}' WHERE id = ${broadcastId};`);
    console.log(`Mapping broadcast ${broadcastId} (${broadcast.cid}) to image ${imageCid}`);
  } else {
    console.log(`No image found for broadcast ${broadcastId} (${broadcast.cid})`);
  }
});

// Write SQL file
const sqlContent = updates.join('\n');
fs.writeFileSync('update-images.sql', sqlContent);

console.log(`Generated ${updates.length} SQL update statements`);
console.log('SQL file written to update-images.sql');

// Also generate a mapping report
const report = {
  totalBroadcasts: playlist.length,
  totalImages: imageFiles.length,
  mappedBroadcasts: updates.length,
  unmappedBroadcasts: playlist.length - updates.length,
  mappings: {}
};

playlist.forEach((broadcast, index) => {
  const broadcastId = index + 1;
  report.mappings[broadcastId] = {
    title: broadcast.title,
    cid: broadcast.cid,
    hasImage: !!cidToFilename[broadcast.cid],
    imageCid: cidToFilename[broadcast.cid] || null
  };
});

fs.writeFileSync('image-mapping-report.json', JSON.stringify(report, null, 2));
console.log('Mapping report written to image-mapping-report.json');
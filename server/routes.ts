import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all broadcasts
  app.get("/api/broadcasts", async (req, res) => {
    try {
      const broadcasts = await storage.getAllBroadcasts();
      res.json(broadcasts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broadcasts" });
    }
  });

  // Get broadcast by ID
  app.get("/api/broadcasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid broadcast ID" });
      }
      
      const broadcast = await storage.getBroadcastById(id);
      if (!broadcast) {
        return res.status(404).json({ error: "Broadcast not found" });
      }
      
      res.json(broadcast);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch broadcast" });
    }
  });

  // Get broadcast stream URL
  app.get("/api/broadcasts/:id/stream", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid broadcast ID" });
      }
      
      const broadcast = await storage.getBroadcastById(id);
      if (!broadcast) {
        return res.status(404).json({ error: "Broadcast not found" });
      }
      
      const streamUrl = `https://gateway.pinata.cloud/ipfs/${broadcast.cid}`;
      res.json({ streamUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to get stream URL" });
    }
  });

  // Batch update broadcast images
  app.post("/api/broadcasts/batch-update-images", async (req, res) => {
    try {
      const imageMapping = req.body;
      
      if (!imageMapping || typeof imageMapping !== 'object') {
        return res.status(400).json({ error: "Invalid mapping format. Expected object with broadcast CID keys and image CID values." });
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const [broadcastCid, imageCid] of Object.entries(imageMapping)) {
        try {
          const broadcast = await storage.getBroadcastByCid(broadcastCid);
          if (!broadcast) {
            results.push({ 
              broadcastCid, 
              status: 'error', 
              message: `Broadcast with CID ${broadcastCid} not found` 
            });
            errorCount++;
            continue;
          }

          await storage.updateBroadcastImage(broadcast.id, imageCid as string);
          results.push({ 
            broadcastCid, 
            imageCid, 
            status: 'success', 
            broadcastTitle: broadcast.title 
          });
          successCount++;
        } catch (error) {
          results.push({ 
            broadcastCid, 
            status: 'error', 
            message: `Failed to update: ${error instanceof Error ? error.message : 'Unknown error'}` 
          });
          errorCount++;
        }
      }

      res.json({
        summary: {
          total: Object.keys(imageMapping).length,
          success: successCount,
          errors: errorCount
        },
        results
      });
    } catch (error) {
      console.error("Error in batch update:", error);
      res.status(500).json({ error: "Failed to process batch update" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

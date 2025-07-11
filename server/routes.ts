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

  const httpServer = createServer(app);
  return httpServer;
}

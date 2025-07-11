import { broadcasts, type Broadcast, type InsertBroadcast } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import broadcastData from "../attached_assets/cousinfm_playlist_1752208465676.json";

export interface IStorage {
  getAllBroadcasts(): Promise<Broadcast[]>;
  getBroadcastById(id: number): Promise<Broadcast | undefined>;
  getBroadcastByCid(cid: string): Promise<Broadcast | undefined>;
  createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
}

export class DatabaseStorage implements IStorage {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    
    // Check if we have any broadcasts in the database
    const existingBroadcasts = await db.select().from(broadcasts).limit(1);
    
    if (existingBroadcasts.length === 0) {
      // Load broadcasts from JSON data into database
      const broadcastsToInsert = broadcastData.map(broadcast => ({
        cid: broadcast.cid,
        title: broadcast.title,
        fileSizeMB: broadcast.fileSizeMB,
        date: broadcast.date,
      }));
      
      await db.insert(broadcasts).values(broadcastsToInsert);
    }
    
    this.initialized = true;
  }

  async getAllBroadcasts(): Promise<Broadcast[]> {
    await this.initialize();
    return await db.select().from(broadcasts).orderBy(broadcasts.date);
  }

  async getBroadcastById(id: number): Promise<Broadcast | undefined> {
    await this.initialize();
    const [broadcast] = await db.select().from(broadcasts).where(eq(broadcasts.id, id));
    return broadcast || undefined;
  }

  async getBroadcastByCid(cid: string): Promise<Broadcast | undefined> {
    await this.initialize();
    const [broadcast] = await db.select().from(broadcasts).where(eq(broadcasts.cid, cid));
    return broadcast || undefined;
  }

  async createBroadcast(insertBroadcast: InsertBroadcast): Promise<Broadcast> {
    await this.initialize();
    const [broadcast] = await db
      .insert(broadcasts)
      .values(insertBroadcast)
      .returning();
    return broadcast;
  }
}

export const storage = new DatabaseStorage();

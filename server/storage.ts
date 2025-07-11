import { broadcasts, type Broadcast, type InsertBroadcast } from "@shared/schema";
import broadcastData from "../attached_assets/cousinfm_playlist_1752208465676.json";

export interface IStorage {
  getAllBroadcasts(): Promise<Broadcast[]>;
  getBroadcastById(id: number): Promise<Broadcast | undefined>;
  getBroadcastByCid(cid: string): Promise<Broadcast | undefined>;
  createBroadcast(broadcast: InsertBroadcast): Promise<Broadcast>;
}

export class MemStorage implements IStorage {
  private broadcasts: Map<number, Broadcast>;
  private currentId: number;

  constructor() {
    this.broadcasts = new Map();
    this.currentId = 1;
    this.initializeBroadcasts();
  }

  private initializeBroadcasts() {
    // Load broadcasts from JSON data
    broadcastData.forEach((broadcast) => {
      const id = this.currentId++;
      const broadcastRecord: Broadcast = {
        id,
        cid: broadcast.cid,
        title: broadcast.title,
        fileSizeMB: broadcast.fileSizeMB,
        date: broadcast.date,
        createdAt: new Date(),
      };
      this.broadcasts.set(id, broadcastRecord);
    });
  }

  async getAllBroadcasts(): Promise<Broadcast[]> {
    return Array.from(this.broadcasts.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getBroadcastById(id: number): Promise<Broadcast | undefined> {
    return this.broadcasts.get(id);
  }

  async getBroadcastByCid(cid: string): Promise<Broadcast | undefined> {
    return Array.from(this.broadcasts.values()).find(
      (broadcast) => broadcast.cid === cid
    );
  }

  async createBroadcast(insertBroadcast: InsertBroadcast): Promise<Broadcast> {
    const id = this.currentId++;
    const broadcast: Broadcast = {
      ...insertBroadcast,
      id,
      createdAt: new Date(),
    };
    this.broadcasts.set(id, broadcast);
    return broadcast;
  }
}

export const storage = new MemStorage();

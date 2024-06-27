import { RedisClientType, createClient } from "redis";
import { WebSocket } from "ws";

export class PubSubManager {
  private static instance: PubSubManager;
  private redisClient: RedisClientType;
  private subscriptions: Map<string, string[]>

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
    this.subscriptions = new Map();
  }

  public static getInstance() {
    if (!PubSubManager.instance) {
      PubSubManager.instance = new PubSubManager();
    }

    return PubSubManager.instance;
  }

  public addUserToStock(userId: string, stock: string, socket: WebSocket) {
    if (!this.subscriptions.has(stock)) {
      this.subscriptions.set(stock, []);
    }

    this.subscriptions.get(stock)?.push(userId);

    if (this.subscriptions.get(stock)?.length === 1) {
      this.redisClient.subscribe(stock, (message) => {
        this.handleMessage(stock, message, socket);
      });
      console.log(`Subscribed to Redis channel: ${stock}`);
    }
  }

  public removeUserFromStock(userId: string, stock: string) {
    this.subscriptions.set(stock, this.subscriptions.get(stock)?.filter((sub) => sub !== userId) || []);

    if (this.subscriptions.get(stock)?.length === 0) {
      this.redisClient.unsubscribe(stock);
      console.log(`Unsubscribed from the Redis channel: ${stock}`)
    }
  }

  private handleMessage(stock: string, message: string, socket: WebSocket) {
    console.log(`Message received on channel ${stock}: ${message}`);
    socket.send(message);
    this.subscriptions.get(stock)?.forEach((sub) => {
      console.log(`Sending message to user: ${sub}`);
    });
  }

  public async disconnect() {
    await this.redisClient.quit();
  }
}

// Import necessary dependencies and modules
import { Redis } from "@upstash/redis"; // Redis client for storing chat history
import { OpenAIEmbeddings } from "langchain/embeddings/openai"; // Embeddings for natural language processing
import { PineconeClient } from "@pinecone-database/pinecone"; // Pinecone database client for vector storage
import { PineconeStore } from "langchain/vectorstores/pinecone"; // Vector store using Pinecone

// Define a type for CompanionKey, representing the key to access companion-specific data
export type CompanionKey = {
  companionName: string; // Companion's name
  modelName: string; // Model name associated with the companion
  userId: string; // User's unique identifier
};

// Create a MemoryManager class to manage memory and chat history
export class MemoryManager {
  private static instance: MemoryManager; // Singleton instance
  private history: Redis; // Redis client for chat history storage
  private vectorDBClient: PineconeClient; // Pinecone client for vector storage

  public constructor() {
    // Initialize the Redis client for chat history from environment variables
    this.history = Redis.fromEnv();
    // Initialize the Pinecone client for vector storage
    this.vectorDBClient = new PineconeClient();
  }

  // Initialize the Pinecone client with API key and environment
  public async init() {
    if (this.vectorDBClient instanceof PineconeClient) {
      await this.vectorDBClient.init({
        apiKey: process.env.PINECONE_API_KEY!,
        environment: process.env.PINECONE_ENVIRONMENT!,
      });
    }
  }

  // Perform a vector search using Pinecone and return similar documents
  public async vectorSearch(recentChatHistory: string, companionFileName: string) {
    const pineconeClient = <PineconeClient>this.vectorDBClient;

    const pineconeIndex = pineconeClient.Index(
      process.env.PINECONE_INDEX! || ""
    );

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err);
      });
    return similarDocs;
  }

  // Get a singleton instance of MemoryManager and initialize it
  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  // Generate a Redis key based on the CompanionKey
  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  // Write a message to the chat history in Redis
  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });

    return result;
  }

  // Read the latest chat history for a user
  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  // Seed chat history for a user
  public async seedChatHistory(
    seedContent: string,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;
    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}

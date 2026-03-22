import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const options = {
  serverSelectionTimeoutMS: 4000,
  connectTimeoutMS: 4000,
};

const retryMs = Number(process.env.MONGODB_RETRY_MS || 60000);

type MongoRuntimeState = {
  client: MongoClient | null;
  pending: Promise<MongoClient | null> | null;
  unavailableUntil: number;
  lastWarnAt: number;
};

const globalWithMongo = global as typeof globalThis & {
  _mongoRuntimeState?: MongoRuntimeState;
};

if (!globalWithMongo._mongoRuntimeState) {
  globalWithMongo._mongoRuntimeState = {
    client: null,
    pending: null,
    unavailableUntil: 0,
    lastWarnAt: 0,
  };
}

const state = globalWithMongo._mongoRuntimeState;

function warnUnavailable(reason: unknown) {
  const now = Date.now();
  if (now - state.lastWarnAt >= retryMs) {
    console.warn('MongoDB is unavailable. Falling back to local JSON data.');
    if (process.env.NODE_ENV === 'development') {
      const message = reason instanceof Error ? reason.message : String(reason);
      console.warn(`MongoDB detail: ${message}`);
    }
    state.lastWarnAt = now;
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!uri) return null;
  if (state.client) return state.client;

  const now = Date.now();
  if (now < state.unavailableUntil) return null;

  if (!state.pending) {
    state.pending = (async () => {
      try {
        const client = new MongoClient(uri, options);
        await client.connect();
        state.client = client;
        state.unavailableUntil = 0;
        return client;
      } catch (error) {
        state.unavailableUntil = Date.now() + retryMs;
        warnUnavailable(error);
        return null;
      } finally {
        if (!state.client) {
          state.pending = null;
        }
      }
    })();
  }

  return state.pending;
}

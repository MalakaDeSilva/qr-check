import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB_NAME || "qr-release";

let client: MongoClient;
let db: Db;

export async function getDb(): Promise<Db> {
  if (db) return db;
  if (!uri) throw new Error("MONGODB_URI is not set");
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export async function getRequestsCollection() {
  const database = await getDb();
  return database.collection<RequestDoc>("requests");
}

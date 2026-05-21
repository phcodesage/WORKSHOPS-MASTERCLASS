import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      process.env[key] = value;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set.');
  process.exit(1);
}

async function main() {
  const client = new MongoClient(MONGODB_URI as string);
  await client.connect();
  
  const targets = [
    { db: 'teens-book-club', col: 'sitecontents' },
    { db: 'test', col: 'sitecontents' }
  ];

  for (const t of targets) {
    const db = client.db(t.db);
    const doc = await db.collection(t.col).findOne({});
    console.log(`\n--- DB: ${t.db}, Collection: ${t.col} ---`);
    if (doc) {
      console.log(`Document ID: ${doc._id}`);
      console.log(`Keys: ${Object.keys(doc).join(', ')}`);
      if (doc.type) console.log(`Type: ${doc.type}`);
      if (doc.data) {
        console.log(`Data count: ${doc.data.length}`);
        if (doc.data.length > 0) {
          console.log(`First item:`, JSON.stringify(doc.data[0], null, 2));
        }
      }
    } else {
      console.log('No document found');
    }
  }

  await client.close();
}

main().catch(console.error);

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
  
  const databases = ['test', 'teens-book-club', 'workshops-masterclass'];
  for (const dbName of databases) {
    const db = client.db(dbName);
    try {
      const collections = await db.listCollections().toArray();
      const colNames = collections.map(c => c.name);
      console.log(`\nDB: ${dbName}, Collections:`, colNames);
      if (colNames.includes('content')) {
        const docs = await db.collection('content').find({}).toArray();
        console.log(`  Collection "content" has ${docs.length} documents:`);
        for (const doc of docs) {
          console.log(`    - ID: ${doc._id}, type: ${doc.type}`);
          if (doc.data) {
            console.log(`      data length: ${doc.data.length}`);
            console.log(`      data sample:`, JSON.stringify(doc.data.slice(0, 2), null, 2));
          }
        }
      }
    } catch (e) {
      console.log(`Error reading ${dbName}:`, e);
    }
  }
  
  await client.close();
}

main().catch(console.error);

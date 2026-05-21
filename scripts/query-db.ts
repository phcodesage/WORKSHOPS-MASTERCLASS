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
  
  // List all databases
  const admin = client.db().admin();
  const dbs = await admin.listDatabases();
  const dbNames = dbs.databases.map(d => d.name);
  console.log('Databases on this cluster:', dbNames);

  for (const dbName of dbNames) {
    if (dbName === 'admin' || dbName === 'local') continue;
    const db = client.db(dbName);
    try {
      const collections = await db.listCollections().toArray();
      console.log(`\nDatabase: "${dbName}" has collections:`, collections.map(c => c.name));
      for (const colInfo of collections) {
        const colName = colInfo.name;
        const docs = await db.collection(colName).find({}).toArray();
        console.log(`  Collection "${colName}" has ${docs.length} documents:`);
        for (const doc of docs) {
          console.log(`    - ID: ${doc._id}, keys: ${Object.keys(doc).join(', ')}`);
          if (doc.type) console.log(`      type: ${doc.type}`);
          if (doc.data) {
            console.log(`      data count: ${doc.data.length}`);
            if (doc.data.length > 0) {
              console.log(`      first item title: ${doc.data[0].title}`);
              console.log(`      first item date: ${doc.data[0].date}`);
              console.log(`      first item price: ${doc.data[0].price}`);
              console.log(`      first item registrationUrl: ${doc.data[0].registrationUrl}`);
              if (doc.data.length > 1) {
                console.log(`      second item price: ${doc.data[1].price}`);
                console.log(`      second item registrationUrl: ${doc.data[1].registrationUrl}`);
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(`Error scanning database "${dbName}":`, e);
    }
  }
  
  await client.close();
}

main().catch(console.error);

import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

// Manually parse .env file to load MONGODB_URI
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
  console.error('❌ MONGODB_URI is not set in environment or .env file.');
  process.exit(1);
}

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  const client = new MongoClient(MONGODB_URI as string);
  await client.connect();
  console.log('✅ Connected successfully.');

  const db = client.db();

  console.log('📖 Reading local workshops.json...');
  const workshopsPath = path.join(process.cwd(), 'data', 'workshops.json');
  if (!fs.existsSync(workshopsPath)) {
    console.error('❌ data/workshops.json does not exist.');
    await client.close();
    process.exit(1);
  }
  const localWorkshops = JSON.parse(fs.readFileSync(workshopsPath, 'utf8'));

  console.log(`Loaded ${localWorkshops.length} workshops from local file.`);

  console.log('🔍 Locating workshops document in "content" collection...');
  const existingDoc = await db.collection('content').findOne({ type: 'workshops' });

  if (existingDoc) {
    console.log('Found existing database document. Updating...');
    const result = await db.collection('content').updateOne(
      { type: 'workshops' },
      { $set: { data: localWorkshops } }
    );
    console.log(`✅ Update result: ${JSON.stringify(result)}`);
  } else {
    console.log('No existing document found. Inserting a new one...');
    const result = await db.collection('content').insertOne({
      type: 'workshops',
      data: localWorkshops
    });
    console.log(`✅ Insert result: ${JSON.stringify(result)}`);
  }

  // Retrieve to verify
  const updatedDoc = await db.collection('content').findOne({ type: 'workshops' });
  console.log('Verified database content. Number of items:', updatedDoc?.data?.length);
  if (updatedDoc && Array.isArray(updatedDoc.data)) {
    console.log('First workshop title:', updatedDoc.data[0]?.title);
    console.log('Second workshop price:', updatedDoc.data[1]?.price);
    console.log('Second workshop url:', updatedDoc.data[1]?.registrationUrl);
  }

  await client.close();
  console.log('🔌 Disconnected from MongoDB.');
  console.log('🎉 DB Sync complete.');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

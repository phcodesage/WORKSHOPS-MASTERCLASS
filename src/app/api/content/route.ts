import { NextResponse } from 'next/server';
import { getMongoClient } from '../../../lib/mongodb';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'workshops.json');
  const getFallback = () => {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  };

  try {
    const client = await getMongoClient();
    if (!client) {
      return NextResponse.json(getFallback());
    }

    const db = client.db();
    
    const doc = await db.collection('content').findOne({ type: 'workshops' });
    
    if (doc && doc.data) {
      return NextResponse.json(doc.data);
    }
    
    const seedData = getFallback();
    if (seedData.length > 0) {
      await db.collection('content').updateOne(
        { type: 'workshops' },
        { $set: { data: seedData } },
        { upsert: true }
      );
    }
    return NextResponse.json(seedData);
  } catch (error: any) {
    console.error("MongoDB GET Error:", error);
    return NextResponse.json(getFallback());
  }
}

export async function POST(request: Request) {
  const filePath = path.join(process.cwd(), 'data', 'workshops.json');
  try {
    const newContent = await request.json();
    fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2));

    const client = await getMongoClient();
    if (client) {
      const db = client.db();

      await db.collection('content').updateOne(
        { type: 'workshops' },
        { $set: { data: newContent } },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Content POST fatal error:", error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

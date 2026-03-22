import { NextResponse } from 'next/server';
import { getMongoClient } from '../../../lib/mongodb';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const filePath = path.join(process.cwd(), 'data', 'analytics.json');
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const isMobile = /mobile/i.test(userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
    
    const newRecord = {
      id: Date.now().toString(),
      visitedAt: new Date().toISOString(),
      device
    };

    const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    data.push(newRecord);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    const client = await getMongoClient();
    if (client) {
      const db = client.db();

      await db.collection('analytics').insertOne({
        visitedAt: newRecord.visitedAt,
        device: newRecord.device
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Analytics POST fatal error:", error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'data', 'analytics.json');
  const getFallback = () => {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
  };

  try {
    const client = await getMongoClient();
    if (!client) {
      return NextResponse.json(getFallback());
    }

    const db = client.db();
    
    const analyticsCount = await db.collection('analytics').countDocuments();
    if (analyticsCount === 0) {
      const seedData = getFallback();
      if (seedData.length > 0) {
        await db.collection('analytics').insertMany(seedData.map((d: any) => ({
          visitedAt: d.visitedAt,
          device: d.device
        })));
      }
    }

    const analytics = await db.collection('analytics').find({}).toArray();
    
    const mapped = analytics.map(a => ({
      ...a,
      id: a._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error("MongoDB GET Analytics Error:", error);
    return NextResponse.json(getFallback());
  }
}

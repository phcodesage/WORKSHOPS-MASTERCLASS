import { NextResponse } from 'next/server';
import { getMongoClient } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, phone, reference, imageUrl, courseName, amount } = data;

    if (!name || !phone || !reference || !courseName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await getMongoClient();
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = client.db();
    const paymentsCollection = db.collection('payments');

    const result = await paymentsCollection.insertOne({
      name,
      phone,
      reference,
      imageUrl: imageUrl || null,
      courseName,
      amount,
      status: 'Pending',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Error saving payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const client = await getMongoClient();
    if (!client) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const db = client.db();
    const paymentsCollection = db.collection('payments');

    const payments = await paymentsCollection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

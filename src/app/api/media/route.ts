import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const PUBLIC_DIR = path.join(process.cwd(), 'public');

  const uploadsFiles = fs.readdirSync(UPLOADS_DIR).filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
  const publicFiles = fs.readdirSync(PUBLIC_DIR).filter(f => /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(f) && fs.statSync(path.join(PUBLIC_DIR, f)).isFile());

  const allMedia = [
    ...uploadsFiles.map(name => ({
      name,
      url: `/uploads/${name}`,
      folder: 'uploads',
      size: fs.statSync(path.join(UPLOADS_DIR, name)).size,
      createdAt: fs.statSync(path.join(UPLOADS_DIR, name)).ctime.toISOString(),
    })),
    ...publicFiles.map(name => ({
      name,
      url: `/${name}`,
      folder: 'root',
      size: fs.statSync(path.join(PUBLIC_DIR, name)).size,
      createdAt: fs.statSync(path.join(PUBLIC_DIR, name)).ctime.toISOString(),
    }))
  ];
  
  return NextResponse.json(allMedia.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const folder = searchParams.get('folder') || 'uploads';
  
  if (!name) return NextResponse.json({ error: 'No filename' }, { status: 400 });
  if (folder === 'root') return NextResponse.json({ error: 'Cannot delete site assets' }, { status: 403 });
  
  const filePath = path.join(UPLOADS_DIR, name);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return NextResponse.json({ success: true });
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy, CheckCheck, ImageIcon, Loader2, ExternalLink } from "lucide-react";

export default function MediaLibrary() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedUrl, setCopiedUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    const res = await fetch('/api/media');
    const data = await res.json();
    setMedia(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      await fetch('/api/media/upload', { method: 'POST', body: formData });
    }
    await fetchMedia();
    setUploading(false);
    setMessage(`${files.length} file(s) uploaded successfully!`);
    setTimeout(() => setMessage(""), 3000);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/media?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
    fetchMedia();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(""), 2000);
  };

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  if (loading) return (
    <div className="flex items-center justify-center py-40 text-slate-600">
      <Loader2 className="animate-spin mr-2 w-6 h-6" /> Loading media library...
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0e1f3e] flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#ca3433]" />
            Media Library
          </h1>
          <p className="text-sm text-slate-500 mt-1">{media.length} file{media.length !== 1 ? "s" : ""} in library</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleUpload}
          />
          <label htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center gap-2 bg-[#ca3433] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#0e1f3e] transition-all shadow-md">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? "Uploading..." : "Upload Images"}
          </label>
        </div>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
          <CheckCheck className="w-4 h-4" /> {message}
        </div>
      )}

      {media.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center text-slate-400 gap-3 cursor-pointer hover:border-[#ca3433] hover:text-[#ca3433] transition-colors"
        >
          <Upload className="w-12 h-12" />
          <p className="font-semibold text-lg">No images yet</p>
          <p className="text-sm">Click here to upload your first image</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((file) => (
            <div key={file.name} className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square bg-gray-100">
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(file.url)}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition text-slate-800"
                    title="Copy URL">
                    {copiedUrl === file.url ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a href={file.url} target="_blank" rel="noopener noreferrer"
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition text-slate-800"
                    title="Open in new tab">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => handleDelete(file.name)}
                    className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition text-white"
                    title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

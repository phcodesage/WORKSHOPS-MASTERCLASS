"use client";

import { useEffect, useState, useRef } from "react";
import { Save, AlertCircle, Edit3, Image as ImageIcon, Loader2, Plus, Trash2, FolderOpen, Upload, X } from "lucide-react";

export default function VisualEditor() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // Pexels Previews
  const [pexelsPreviews, setPexelsPreviews] = useState<Record<string, string>>({});

  // Media Modal States
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [mediaLibrary, setMediaLibrary] = useState<any[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialData, setInitialData] = useState<string>("[]");
  const isDirty = JSON.stringify(workshops) !== initialData;

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWorkshops(data);
          setInitialData(JSON.stringify(data));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href && !target.href.includes('/admin/editor')) {
        if (!window.confirm("You have unsaved changes. Are you sure you want to leave without saving?")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, [isDirty]);

  // Live Pexels Search Previews
  useEffect(() => {
    workshops.forEach(workshop => {
      // If there's no static URL but there is a search query, fetch the preview!
      if (!workshop.imageUrl && workshop.searchQuery && !pexelsPreviews[workshop.id]) {
        fetch(`/api/pexels?query=${encodeURIComponent(workshop.searchQuery)}&per_page=1`)
          .then(res => res.json())
          .then(data => {
            if (data.photos?.[0]?.src?.large) {
              setPexelsPreviews(prev => ({ ...prev, [workshop.id]: data.photos[0].src.large }));
            }
          })
          .catch(() => {});
      }
    });
  }, [workshops]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...workshops];
    updated[index] = { ...updated[index], [field]: value };
    // Clear the specific pexels preview cache if the search query changes so it fetches fresh
    if (field === "searchQuery") {
      setPexelsPreviews(prev => {
        const next = { ...prev };
        delete next[updated[index].id];
        return next;
      });
    }
    setWorkshops(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workshops)
      });
      if (res.ok) {
        setMessage("✓ Changes saved and live on site!");
        setMessageType("success");
        setInitialData(JSON.stringify(workshops));
      } else {
        setMessage("Error saving changes. Please try again.");
        setMessageType("error");
      }
    } catch (e) {
      setMessage("Network error. Please try again.");
      setMessageType("error");
    }
    setSaving(false);
    setTimeout(() => setMessage(""), 4000);
  };

  const addWorkshop = () => {
    const newItem = {
      id: `workshop-${Date.now()}`,
      title: "New Workshop",
      subtitle: "Workshop subtitle",
      date: "April 2026 • 6:00 PM",
      type: "Workshop",
      series: "Limitless Growth Series",
      searchQuery: "personal development motivation growth",
      imageUrl: "",
      registrationUrl: "https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01"
    };
    setWorkshops(prev => [...prev, newItem]);

    setTimeout(() => {
      // Scroll to bottom of the window
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      // Also attempt scrolling the main container in case it captures the overflow
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.scrollTo({ top: mainEl.scrollHeight, behavior: 'smooth' });
      }
    }, 150);
  };

  const removeWorkshop = (index: number) => {
    if (!confirm("Remove this section?")) return;
    setWorkshops(prev => prev.filter((_, i) => i !== index));
  };

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaLibrary(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Could not fetch media", e); }
  };

  const openMediaModal = (index: number) => {
    setActiveMediaIndex(index);
    setMediaModalOpen(true);
    fetchMedia();
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingMedia(true);
    let lastUrl = "";
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (data.url) lastUrl = data.url;
      }
    }
    await fetchMedia();
    setUploadingMedia(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (lastUrl && activeMediaIndex !== null) {
      handleChange(activeMediaIndex, 'imageUrl', lastUrl);
      setMediaModalOpen(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full py-40 text-slate-600">
      <Loader2 className="animate-spin mr-2 w-6 h-6" /> Loading content...
    </div>
  );

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Sticky Save Header */}
      <div className="sticky top-0 md:-top-8 z-40 bg-white border-b border-gray-200 shadow-sm px-4 md:px-8 py-4 w-full" style={{ top: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-[#0e1f3e] flex items-center gap-2">
            <Edit3 className="w-6 h-6 text-[#ca3433]" />
            Visual CMS Editor
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={addWorkshop}
              className="bg-[#0e1f3e] text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-slate-700 transition-all whitespace-nowrap text-sm"
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
            {message && (
              <span className={`flex items-center gap-1.5 text-sm font-medium ${messageType === "success" ? "text-green-600" : "text-red-600"}`}>
                <AlertCircle className="w-4 h-4" />
                {message}
              </span>
            )}
            {isDirty && !message && (
              <span className="text-sm font-medium text-amber-600 animate-pulse hidden sm:block">
                Unsaved changes...
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className={`${!isDirty ? 'bg-slate-300 text-slate-500' : 'bg-[#ca3433] text-white hover:bg-[#0e1f3e]'} px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow transition-all disabled:opacity-50 whitespace-nowrap`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save & Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Editor Cards */}
      <div className="flex-1 p-4 md:p-8 space-y-6">
        {workshops.map((workshop, index) => (
          <div key={workshop.id || index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
              <h2 className="font-bold text-slate-700 text-sm">
                Section {index + 1} — <span className="text-[#ca3433]">{workshop.title || "Untitled"}</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0e1f3e] text-white px-2 py-0.5 rounded-full">{workshop.type}</span>
                <button
                  onClick={() => removeWorkshop(index)}
                  className="p-1.5 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition"
                  title="Remove section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 grid md:grid-cols-2 gap-5">
              {/* Left: text fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Title</label>
                  <input type="text" value={workshop.title || ""}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                  <input type="text" value={workshop.subtitle || ""}
                    onChange={(e) => handleChange(index, 'subtitle', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date & Time</label>
                  <input type="text" value={workshop.date || ""}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type Label</label>
                  <input type="text" value={workshop.type || ""}
                    onChange={(e) => handleChange(index, 'type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none"
                    placeholder="e.g. Workshop, Masterclass, Course" />
                </div>
                {workshop.registrationUrl !== undefined && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stripe Registration Link</label>
                    <input type="text" value={workshop.registrationUrl || ""}
                      onChange={(e) => handleChange(index, 'registrationUrl', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none" />
                  </div>
                )}
              </div>

              {/* Right: image & search query */}
              <div className="space-y-4">
                {/* Image Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Image Preview</label>
                  <div className="w-full aspect-square max-h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                    {(workshop.imageUrl || workshop.image?.src || pexelsPreviews[workshop.id]) ? (
                      <img
                        src={workshop.imageUrl || workshop.image?.src || pexelsPreviews[workshop.id]}
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = '/icon.png';
                          (e.target as HTMLImageElement).classList.add('opacity-30', 'object-contain', 'p-8');
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400 gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        <span className="text-xs">Fetching Preview...</span>
                      </div>
                    )}
                    {(!workshop.imageUrl && !workshop.image?.src && pexelsPreviews[workshop.id]) && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                        Pexels Automated Match
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <label className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">Pexels Image Search Query</label>
                  <p className="text-xs text-blue-500 mb-2">Used to automatically fetch a relevant background image.</p>
                  <input type="text" value={workshop.searchQuery || ""}
                    onChange={(e) => handleChange(index, 'searchQuery', e.target.value)}
                    className="w-full border border-blue-200 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Static Image URL</label>
                    <button onClick={() => openMediaModal(index)} className="text-xs font-bold text-[#ca3433] hover:underline flex items-center gap-1">
                      <FolderOpen className="w-3 h-3" /> Browse Media Library
                    </button>
                  </div>
                  <input type="text" value={workshop.imageUrl || ""}
                    onChange={(e) => handleChange(index, 'imageUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#ca3433] outline-none"
                    placeholder="/uploads/your-image.jpg or https://..." />
                  <p className="text-xs text-slate-400 mt-1">Leave empty to use the Pexels query above.</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Picker Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <ImageIcon className="w-5 h-5 text-[#ca3433]" /> Select Image
              </h3>
              <div className="flex items-center gap-3">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" id="modal-upload" onChange={handleMediaUpload} />
                <label htmlFor="modal-upload" className="cursor-pointer bg-[#0e1f3e] text-white text-sm px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition flex items-center gap-2">
                  {uploadingMedia ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploadingMedia ? "Uploading..." : "Upload New"}
                </label>
                <button onClick={() => setMediaModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5 overflow-y-auto flex-1 bg-white">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaLibrary.map(file => (
                  <div key={file.name} 
                    onClick={() => {
                      if (activeMediaIndex !== null) handleChange(activeMediaIndex, 'imageUrl', file.url);
                      setMediaModalOpen(false);
                    }}
                    className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#ca3433] transition-all">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#ca3433] text-white text-xs font-bold px-3 py-1.5 rounded-full">Select</span>
                    </div>
                  </div>
                ))}
              </div>
              {mediaLibrary.length === 0 && !uploadingMedia && (
                <div className="text-center py-20 text-slate-500">No images found. Upload one to get started!</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

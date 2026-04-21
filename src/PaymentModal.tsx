"use client";

import { useState, useRef, useEffect } from "react";
import { X, CreditCard, Banknote, Send, CheckCircle2, UploadCloud, Image as ImageIcon } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  cashPrice: string;   // e.g. "$160"
  cardPrice: string;   // e.g. "$166.40" (price + 4%)
  stripeLink: string;
}

export function calcCardPrice(priceStr: string): string {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return priceStr;
  return "$" + (num * 1.04).toFixed(2);
}

export default function PaymentModal({
  isOpen,
  onClose,
  courseName,
  cashPrice,
  cardPrice,
  stripeLink,
}: PaymentModalProps) {
  const [step, setStep] = useState<"choose" | "zelle" | "done">("choose");
  const [form, setForm] = useState({ name: "", phone: "", reference: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when modal is open (works on iOS Safari too)
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleClose() {
    setStep("choose");
    setForm({ name: "", phone: "", reference: "" });
    setImageFile(null);
    setImagePreview(null);
    setLoading(false);
    setErrorMsg("");
    onClose();
  }

  function handleCardPay() {
    window.open(stripeLink, "_blank", "noopener,noreferrer");
    handleClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file.");
      return;
    }
    setErrorMsg("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  async function handleZelleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // Validate required image upload
    if (!imageFile) {
      setErrorMsg("Please upload a screenshot of your Zelle payment confirmation.");
      setLoading(false);
      return;
    }

    try {
      // Upload the required screenshot
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadRes = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl,
          courseName,
          amount: cashPrice,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit payment");

      setStep("done");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center items-center overflow-y-auto p-4 bg-black/60 backdrop-blur-sm custom-scrollbar"
      style={{ animation: "fadeIn 0.2s ease" }}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col my-auto relative" style={{ maxHeight: "calc(100dvh - 2rem)" }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b bg-[#05264d] shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Payment Options
            </p>
            <h2 className="text-lg font-bold text-white mt-0.5">{courseName}</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price Note Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex flex-col gap-1 shrink-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <Banknote className="w-4 h-4 shrink-0" />
            Cash (Zelle): <span className="text-green-700">{cashPrice}</span>
            <span className="text-amber-600 font-normal">— no extra fee</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <CreditCard className="w-4 h-4 shrink-0" />
            Card: <span className="text-[#d53033]">{cardPrice}</span>
            <span className="text-amber-600 font-normal">— includes 4% processing fee</span>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 min-h-0">
          {/* STEP: Choose */}
          {step === "choose" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Choose your preferred payment method below.
              </p>
              {/* Cash / Zelle */}
              <button
                onClick={() => setStep("zelle")}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Pay with Cash (Zelle)</p>
                  <p className="text-sm text-gray-600">
                    Send <strong className="text-green-700">{cashPrice}</strong> to{" "}
                    <span className="text-green-700 font-medium">payments@exceedlearningcenterny.com</span>
                  </p>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={handleCardPay}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#05264d] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900">Pay by Card (Stripe)</p>
                  <p className="text-sm text-gray-600">
                    <strong className="text-[#d53033]">{cardPrice}</strong>{" "}
                    <span className="text-gray-500">(includes 4% processing fee)</span>
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* STEP: Zelle form */}
          {step === "zelle" && (
            <div>
              <div className="mb-3 p-3 bg-green-50/80 border border-green-200 rounded-xl text-xs text-green-800">
                <p className="font-bold mb-1">Zelle Payment Steps:</p>
                <p className="mb-2 leading-relaxed">
                  Send <strong className="text-green-700">{cashPrice}</strong> to 
                  <br />
                  <strong className="text-green-700 select-all">payments@exceedlearningcenterny.com</strong>
                </p>
                <p>Then fill the form to confirm:</p>
              </div>

              <form id="zelle-payment-form" onSubmit={handleZelleSubmit} className="space-y-3 pb-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#05264d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#05264d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider">
                    Zelle Reference / Confirmation Number *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                    placeholder="e.g. ZL123456789"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#05264d]"
                  />
                </div>

                <div className="space-y-1 mt-2">
                  <label className="text-xs font-bold text-[#05264d] uppercase tracking-wider block mb-1">
                    Upload Reference Screenshot *
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 flex flex-col items-center py-1">
                        <UploadCloud className="w-7 h-7 mb-1 text-gray-400" />
                        <p className="text-xs font-medium">Add Screenshot Proof</p>
                        <p className="text-[10px] mt-0.5">JPG, PNG or GIF</p>
                      </div>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium mt-2">
                    {errorMsg}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Zelle Payment Confirmed!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Thank you, <strong>{form.name}</strong>! We have received your Zelle payment
                confirmation. Our team will verify your payment and send you enrollment details
                shortly.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-[#05264d] text-white font-bold text-sm hover:bg-[#05264d]/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Persistent bottom footer for Zelle step securely outside the scrollable body */}
        {step === "zelle" && (
          <div className="shrink-0 border-t border-gray-100 bg-gray-50 p-4 flex gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={() => setStep("choose")}
              className="flex-1 py-3 rounded-xl border border-gray-300 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
              Back
            </button>
            <button
              form="zelle-payment-form"
              disabled={loading}
              type="submit"
              className="flex-[2] py-3.5 rounded-xl bg-green-600 text-white font-extrabold text-base flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg ring-2 ring-green-400 ring-offset-1 active:scale-95 disabled:opacity-60"
            >
              <Send className="w-5 h-5" />
              {loading ? "Submitting..." : "Confirm Payment"}
            </button>
          </div>
        )}
      </div>

      {/* @ts-ignore */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ca3433;
        }
      `}</style>
    </div>
  );
}

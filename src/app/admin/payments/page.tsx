"use client";

import { useEffect, useState } from "react";
import { Search, Image as ImageIcon, X } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/payments')
      .then(res => res.json())
      .then(data => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load payments", err);
        setLoading(false);
      });
  }, []);

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.phone && p.phone.toLowerCase().includes(term)) ||
      (p.courseName && p.courseName.toLowerCase().includes(term)) ||
      (p.reference && p.reference.toLowerCase().includes(term))
    );
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0e1f3e]">Zelle Payments</h1>
          <p className="text-slate-500 mt-1">Track and verify manual Zelle submissions.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ca3433] focus:border-transparent outline-none w-full md:w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <BanknoteIcon />
            <p className="mt-4">No Zelle payments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b">
                  <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Name</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Course & Amount</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Contact</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Reference #</th>
                  <th className="p-4 font-semibold text-gray-600 text-sm">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(payment.createdAt).toLocaleDateString()} <br />
                      <span className="text-xs">{new Date(payment.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800">
                      {payment.name}
                    </td>
                    <td className="p-4 text-sm text-slate-700">
                      <div className="font-medium text-[#0e1f3e]">{payment.courseName}</div>
                      <div className="text-green-600 font-semibold">{payment.amount}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {payment.phone}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-mono text-xs">
                        {payment.reference}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {payment.imageUrl ? (
                        <button
                          onClick={() => setPreviewImage(payment.imageUrl)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                        >
                          <ImageIcon className="w-4 h-4" /> View
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No image</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
          style={{ animation: "fadeIn 0.2s ease" }}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Payment Reference"
              className="rounded-lg max-h-[85vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

function BanknoteIcon() {
  return (
    <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
    </svg>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalVisits = analytics.length;
  const mobileVisits = analytics.filter(a => a.device === 'Mobile').length;
  const desktopVisits = totalVisits - mobileVisits;
  
  const mobilePercent = totalVisits ? Math.round((mobileVisits / totalVisits) * 100) : 0;
  const desktopPercent = totalVisits ? Math.round((desktopVisits / totalVisits) * 100) : 0;

  if (loading) return <div className="text-slate-600">Loading analytics...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#0e1f3e]">Visitor Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
          <h3 className="text-gray-500 text-lg mb-2">Total Page Visits</h3>
          <p className="text-5xl font-bold text-[#ca3433]">{totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
          <h3 className="text-gray-500 text-lg mb-2">Mobile Uses</h3>
          <p className="text-4xl font-bold text-[#0e1f3e]">{mobileVisits}</p>
          <p className="text-sm text-gray-400 mt-2">{mobilePercent}% of traffic</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[160px]">
          <h3 className="text-gray-500 text-lg mb-2">Desktop Uses</h3>
          <p className="text-4xl font-bold text-[#0e1f3e]">{desktopVisits}</p>
          <p className="text-sm text-gray-400 mt-2">{desktopPercent}% of traffic</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-[#0e1f3e]">Recent Visitors</h2>
        {analytics.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No visits recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="p-4 text-sm font-semibold text-gray-600">Time</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Device Type</th>
                </tr>
              </thead>
              <tbody>
                {analytics.slice().reverse().slice(0, 10).map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-700">{new Date(a.visitedAt).toLocaleString()}</td>
                    <td className="p-4 text-sm text-gray-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${a.device === 'Mobile' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {a.device}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analytics.length > 10 && <p className="text-center text-sm text-gray-500 mt-4 py-2">Showing last 10 visits</p>}
          </div>
        )}
      </div>
    </div>
  );
}

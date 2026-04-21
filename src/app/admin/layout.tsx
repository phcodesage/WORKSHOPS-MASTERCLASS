"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, LayoutDashboard, Edit3, Globe, LogOut, Image as ImageIcon, Banknote } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminAuth", "true");
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setChecking(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0e1f3e] to-[#1a3a5c] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-[#ca3433] p-8 flex flex-col items-center">
            <img src="/exceed-new-logo-2026.png" alt="Logo" className="h-14 w-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-red-200 text-sm mt-1">Exceed Learning Center</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-[#ca3433] focus:border-transparent outline-none transition"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-12 text-slate-800 focus:ring-2 focus:ring-[#ca3433] focus:border-transparent outline-none transition"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={checking}
              className="w-full bg-[#ca3433] text-white p-3 rounded-lg font-bold hover:bg-[#0e1f3e] transition-all duration-300 shadow-md disabled:opacity-60"
            >
              {checking ? "Signing in..." : "Sign In"}
            </button>
            <div className="text-center">
              <Link href="/" className="text-sm text-[#ca3433] hover:underline">← Back to Live Site</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Analytics", icon: LayoutDashboard },
    { href: "/admin/editor", label: "Visual CMS", icon: Edit3 },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    { href: "/admin/payments", label: "Payments", icon: Banknote },
  ];

  return (
    <div className="h-screen bg-gray-100 flex flex-col text-slate-800 overflow-hidden">
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between bg-[#0e1f3e] text-white px-4 py-3 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-2">
          <img src="/exceed-new-logo-2026.png" alt="Logo" className="h-8 w-auto" />
          <span className="font-bold">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-700 transition flex flex-col gap-1.5 items-center"
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-white transition-all ${sidebarOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all ${sidebarOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-5 h-0.5 bg-white transition-all ${sidebarOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </button>
      </header>

      {/* Mobile slide-down nav */}
      {sidebarOpen && (
        <nav className="md:hidden bg-[#0e1f3e] text-white px-4 pb-4 space-y-1 border-t border-slate-700 shadow-xl z-40">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${pathname === href ? "bg-[#ca3433]" : "hover:bg-slate-700"}`}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
          <div className="border-t border-slate-700 pt-2 mt-2 space-y-1">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition text-sm">
              <Globe className="w-5 h-5" /> Back to Live Site
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-700 hover:bg-red-600 transition text-sm">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </div>
        </nav>
      )}

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-[#0e1f3e] text-white flex-col h-full border-r border-[#1a3a5c]">
          <div className="p-6 border-b border-slate-700">
            <img src="/exceed-new-logo-2026.png" alt="Logo" className="h-10 w-auto mb-3" />
            <h2 className="text-lg font-bold">Admin Dashboard</h2>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === href ? "bg-[#ca3433]" : "hover:bg-slate-700"}`}>
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700 space-y-1">
            <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition text-sm">
              <Globe className="w-5 h-5" /> Back to Live Site
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 bg-slate-700 text-sm rounded-lg hover:bg-red-600 transition">
              <LogOut className="w-5 h-5" /> Log out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

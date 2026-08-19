"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, Package, ShoppingBag, BarChart3, LogOut, Store, PlusCircle } from "lucide-react";

const sidebarItems = [
  { id: "orders", icon: ShoppingBag, label: "Orders", href: "/supplier" },
  { id: "products", icon: Package, label: "Products", href: "/supplier/products" },
];

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; user_metadata?: { fullname?: string } } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.classList.add("supplier-mode");
    const stored = localStorage.getItem("sipsmart_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    return () => { document.body.classList.remove("supplier-mode"); };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="size-8 text-neutral-900" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Supplier Portal</h2>
          <p className="text-neutral-400 mb-6">Sign in with your supplier account to manage orders and products.</p>
          <Link href="/login" className="bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-neutral-800">
          <Link href="/supplier" className="flex items-center gap-2 font-heading text-xl font-bold">
            <Wine className="size-6 text-gold-500" />
            Sip<span className="gold-text">Smart</span>
          </Link>
          <p className="text-xs text-neutral-500 mt-1">Supplier Dashboard</p>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = item.href === "/supplier" ? pathname === "/supplier" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? "bg-gold-500 text-neutral-900" : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-neutral-900 font-bold text-xs">
              {user.user_metadata?.fullname?.charAt(0) || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.user_metadata?.fullname || "Supplier"}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem("sipsmart_user"); window.location.href = "/login"; }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-800 hover:text-white w-full transition-colors cursor-pointer"
          >
            <LogOut className="size-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-900">
              {pathname === "/supplier" ? "Order Management" : pathname === "/supplier/products" ? "Product Management" : "Dashboard"}
            </h2>
          </div>
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            View Store →
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

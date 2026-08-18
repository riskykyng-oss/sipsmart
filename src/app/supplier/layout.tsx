"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Wine, Package, ShoppingBag, BarChart3, LogOut } from "lucide-react";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; user_metadata?: { fullname?: string } } | null>(null);
  const [active, setActive] = useState("orders");

  useEffect(() => {
    const stored = localStorage.getItem("sipsmart_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Supplier login required</h2>
        <p className="text-neutral-400 mb-6">You need a supplier account to access this dashboard.</p>
        <Link href="/login" className="bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-neutral-800 transition-colors inline-block">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-neutral-900 font-bold text-sm">
                {user.user_metadata?.fullname?.charAt(0) || "S"}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{user.user_metadata?.fullname || "Supplier"}</p>
                <p className="text-xs text-neutral-400">Supplier Account</p>
              </div>
            </div>
            <nav className="space-y-1">
              {[
                { id: "orders", icon: ShoppingBag, label: "Orders", href: "/supplier" },
                { id: "products", icon: Package, label: "Products", href: "/supplier/products" },
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active === item.id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                  onClick={() => setActive(item.id)}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { localStorage.removeItem("sipsmart_user"); window.location.href = "/login"; }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 w-full cursor-pointer"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

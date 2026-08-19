"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, ShoppingCart, Search, Package, User, Home } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/products", icon: Search, label: "Shop" },
  { href: "/tracking", icon: Package, label: "Orders" },
  { href: "/cart", icon: ShoppingCart, label: "Cart" },
  { href: "/login", icon: User, label: "Account" },
];

export function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/supplier")) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-white font-heading text-xl font-bold flex-shrink-0">
            <Wine className="size-6 text-gold-500" />
            Sip<span className="gold-text">Smart</span>
          </Link>

          <div className="flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
              />
            </div>
          </div>

          <Link
            href="/login"
            className="hidden sm:flex items-center gap-1.5 bg-gold-500 text-neutral-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            <User className="size-4" />
            Sign In
          </Link>
        </div>
      </nav>

      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50 safe-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-4 rounded-xl transition-colors ${
                  isActive ? "text-gold-500" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <item.icon className="size-5" />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

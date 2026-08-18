"use client";

import Link from "next/link";
import { useState } from "react";
import { Wine, ShoppingCart, Menu, X, Search, Package, User } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-white font-heading text-xl font-bold flex-shrink-0">
          <Wine className="size-6 text-gold-500" />
          Sip<span className="gold-text">Smart</span>
        </Link>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
            />
          </div>
        </div>

        <ul className="hidden lg:flex items-center gap-1 text-sm text-neutral-200">
          <li>
            <Link href="/" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50">
              Shop
            </Link>
          </li>
          <li>
            <Link href="/products" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/tracking" className="px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50">
              Track Order
            </Link>
          </li>
          <li className="ml-1">
            <Link href="/cart" className="relative flex items-center gap-1.5 px-3 py-2 hover:text-white transition-colors rounded-lg hover:bg-neutral-800/50">
              <ShoppingCart className="size-4" />
              Cart
            </Link>
          </li>
          <li className="ml-2">
            <Link href="/login" className="bg-gold-500 text-neutral-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors flex items-center gap-1.5">
              <User className="size-4" />
              Sign In
            </Link>
          </li>
        </ul>

        <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-neutral-800 border-t border-neutral-700 px-4 py-4 space-y-2">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-700 border border-neutral-600 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-gold-500"
            />
          </div>
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Shop" },
            { href: "/products", label: "Categories" },
            { href: "/tracking", label: "Track Order" },
            { href: "/cart", label: "Cart" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block text-neutral-200 hover:text-white py-2.5 px-3 rounded-lg hover:bg-neutral-700/50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block bg-gold-500 text-neutral-900 px-4 py-3 rounded-lg text-sm font-semibold text-center mt-3"
            onClick={() => setMobileOpen(false)}
          >
            Sign In
          </Link>
        </div>
      )}

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
        <div className="flex items-center justify-around py-2">
          {[
            { href: "/", icon: <Wine className="size-5" />, label: "Home" },
            { href: "/products", icon: <Search className="size-5" />, label: "Shop" },
            { href: "/tracking", icon: <Package className="size-5" />, label: "Orders" },
            { href: "/cart", icon: <ShoppingCart className="size-5" />, label: "Cart" },
            { href: "/login", icon: <User className="size-5" />, label: "Account" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-gold-500 transition-colors py-1 px-3"
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

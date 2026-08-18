"use client";

import Link from "next/link";
import { useState } from "react";
import { Wine, ShoppingCart, Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-green-900/95 backdrop-blur border-b border-green-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-heading text-xl font-bold">
          <Wine className="size-6 text-gold-500" />
          Sip<span className="gold-text">Smart</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm text-green-100">
          <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
          <li><Link href="/products" className="hover:text-white transition-colors">Shop</Link></li>
          <li>
            <Link href="/cart" className="flex items-center gap-1 hover:text-white transition-colors">
              <ShoppingCart className="size-4" />
              Cart
            </Link>
          </li>
          <li>
            <Link href="/login" className="bg-gold-500 text-green-900 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gold-400 transition-colors">
              Sign In
            </Link>
          </li>
        </ul>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-green-800 border-t border-green-700 px-4 py-4 space-y-3">
          <Link href="/" className="block text-green-100 hover:text-white" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/products" className="block text-green-100 hover:text-white" onClick={() => setOpen(false)}>Shop</Link>
          <Link href="/cart" className="block text-green-100 hover:text-white" onClick={() => setOpen(false)}>Cart</Link>
          <Link href="/login" className="block bg-gold-500 text-green-900 px-4 py-2 rounded-lg text-sm font-semibold text-center" onClick={() => setOpen(false)}>
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
}

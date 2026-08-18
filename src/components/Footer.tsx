import Link from "next/link";
import { Wine } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-green-900 text-green-100">
      <div className="bg-gold-100 text-gold-600 text-center py-2 text-sm font-medium">
        Not for persons under 18. Drink responsibly. Alcohol is harmful to your health.
      </div>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white font-heading text-lg font-bold mb-2">
            <Wine className="size-5 text-gold-500" />
            Sip<span className="gold-text">Smart</span>
          </Link>
          <p className="text-sm text-green-300">
            Zimbabwe&apos;s trusted online liquor delivery service. Order smart, stay safe.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <Link href="/products" className="block hover:text-gold-400 transition-colors">Shop</Link>
            <Link href="/cart" className="block hover:text-gold-400 transition-colors">Cart</Link>
            <Link href="/tracking" className="block hover:text-gold-400 transition-colors">Track Order</Link>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <div className="space-y-2 text-sm">
            <Link href="/login" className="block hover:text-gold-400 transition-colors">Sign In</Link>
            <Link href="/register" className="block hover:text-gold-400 transition-colors">Register</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-green-800 text-center py-4 text-xs text-green-400">
        &copy; {new Date().getFullYear()} SipSmart Zimbabwe. All rights reserved.
      </div>
    </footer>
  );
}

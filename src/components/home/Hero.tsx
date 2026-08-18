import Link from "next/link";
import { Shield, Clock, CreditCard } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-gradient text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium text-gold-400 mb-6">
            <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
            Premium Delivery Service
          </span>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Order Smart,{" "}
            <span className="gold-text">Stay Safe</span>
          </h1>

          <p className="text-neutral-300 text-lg leading-relaxed mb-8 max-w-lg">
            Zimbabwe&apos;s premier online liquor delivery service. Premium spirits, wines, beers and ciders delivered to your door — responsibly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="/products"
              className="bg-gold-500 text-neutral-900 px-8 py-3.5 rounded-xl text-base font-bold hover:bg-gold-400 transition-colors text-center"
            >
              Browse Collection
            </Link>
            <a
              href="#how-it-works"
              className="border border-neutral-500 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-neutral-800 transition-colors text-center"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-gold-500" />
              <span className="text-neutral-300">Age Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gold-500" />
              <span className="text-neutral-300">2h Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="size-4 text-gold-500" />
              <span className="text-neutral-300">Secure Pay</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center relative">
          <div className="relative">
            <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="relative bg-white/5 rounded-3xl border border-white/10 p-10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🍷</div>
                <p className="text-gold-400 font-heading text-xl font-semibold">Premium Collection</p>
                <p className="text-neutral-400 text-sm mt-1">Hand-picked selections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

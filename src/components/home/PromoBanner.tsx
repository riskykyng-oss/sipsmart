import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="bg-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 border border-neutral-700 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-6xl opacity-20">🥃</div>
            <span className="inline-block bg-gold-500/20 text-gold-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              New Arrivals
            </span>
            <h3 className="font-heading text-2xl font-bold text-white mb-3">
              Premium Whisky Collection
            </h3>
            <p className="text-neutral-400 text-sm mb-5 max-w-sm">
              Discover our hand-picked selection of single malts and premium blends. Perfect for connoisseurs.
            </p>
            <Link
              href="/products?category=spirits"
              className="inline-block bg-gold-500 text-neutral-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-gold-400 transition-colors"
            >
              Explore Now
            </Link>
          </div>

          <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-6xl opacity-20">🍷</div>
            <span className="inline-block bg-neutral-900/20 text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Weekend Special
            </span>
            <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-3">
              Wine of the Week
            </h3>
            <p className="text-neutral-800 text-sm mb-5 max-w-sm">
              Enjoy 15% off our selected wine collection this weekend. Limited time offer.
            </p>
            <Link
              href="/products?category=wine"
              className="inline-block bg-neutral-900 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-neutral-800 transition-colors"
            >
              Shop Wine
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

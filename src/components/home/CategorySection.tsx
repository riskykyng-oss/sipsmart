import Link from "next/link";

const categories = [
  { name: "Beer", slug: "beer", emoji: "🍺", color: "from-amber-500 to-amber-700" },
  { name: "Wine", slug: "wine", emoji: "🍷", color: "from-red-500 to-red-700" },
  { name: "Spirits", slug: "spirits", emoji: "🥃", color: "from-amber-700 to-amber-900" },
  { name: "Cider", slug: "cider", emoji: "🍎", color: "from-orange-400 to-orange-600" },
];

export function CategorySection() {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-green-900 mb-3">
            Shop by Category
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Explore our curated collection of Zimbabwe&apos;s finest beverages
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 hover:border-gold-500 transition-all hover:shadow-lg"
            >
              <div className={`bg-gradient-to-br ${cat.color} h-36 flex items-center justify-center`}>
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-semibold text-green-900 group-hover:text-gold-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">View all</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

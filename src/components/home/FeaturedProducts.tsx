"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string | null;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        const items = data.data || data || [];
        setProducts(items.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
              Featured Products
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-neutral-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-6 bg-neutral-100 rounded w-1/3 mt-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
            Featured Products
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Hand-picked selections from our premium collection
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-gold-500 hover:shadow-lg transition-all"
            >
              <div className="relative h-44 bg-neutral-50 flex items-center justify-center overflow-hidden">
                <img
                  src={product.image_url || "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=600"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur text-neutral-700 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-neutral-900 text-sm line-clamp-1 group-hover:text-gold-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5 capitalize">{product.category}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="size-3 fill-gold-500 text-gold-500" />
                  ))}
                  <span className="text-xs text-neutral-400 ml-1">(4.0)</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-neutral-900">
                    ${product.price.toFixed(2)}
                  </p>
                  <Button size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-white h-8 px-3 text-xs">
                    <ShoppingCart className="size-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/products"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-neutral-800 transition-colors"
          >
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}

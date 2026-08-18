"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
}

const categories = ["All", "Beer", "Wine", "Spirits", "Cider"];
const PLACEHOLDER = "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=600";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (search) params.set("search", search);
      const res = await fetch(`/api/products?${params}`);
      const json = await res.json();
      setProducts(json.data || json || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 350);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("sipsmart_cart") || "[]");
    setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
  }, []);

  const handleAddToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem("sipsmart_cart") || "[]");
    const existing = cart.find((i: Product) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("sipsmart_cart", JSON.stringify(cart));
    setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <div className="bg-neutral-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">
          Our <span className="gold-text">Products</span>
        </h1>
        <p className="text-neutral-400 mt-2">Premium drinks delivered to your door</p>
      </div>

      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <section className="py-8 max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-20 text-neutral-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-neutral-700 mb-1">No products found</h3>
            <p>Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-400 mb-6">
              Showing {products.length} product{products.length !== 1 ? "s" : ""}
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-[4/3] bg-neutral-100">
                    <img
                      src={p.image_url || PLACEHOLDER}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-neutral-900 text-white">{p.category}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-neutral-900 mb-1">{p.name}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-neutral-900">${p.price.toFixed(2)}</span>
                      <span className={`text-xs font-medium ${p.stock === 0 ? "text-error" : p.stock <= 5 ? "text-warning" : "text-success"}`}>
                        {p.stock === 0 ? "Out of stock" : p.stock <= 5 ? `Only ${p.stock} left` : "In stock"}
                      </span>
                    </div>
                    <Button
                      className={`w-full cursor-pointer transition-colors ${
                        addedId === p.id
                          ? "bg-success text-white"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      }`}
                      disabled={p.stock === 0}
                      onClick={() => handleAddToCart(p)}
                    >
                      <ShoppingCart className="size-4 mr-1" />
                      {addedId === p.id ? "Added!" : p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

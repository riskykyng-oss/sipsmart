"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
  created_at: string;
}

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.data || json || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          category: fd.get("category"),
          price: parseFloat(fd.get("price") as string),
          description: fd.get("description"),
          stock: parseInt(fd.get("stock") as string),
          image_url: fd.get("image_url") || "",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowForm(false);
        fetchProducts();
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch { /* ignore */ }
  };

  const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-3">
            <p className="text-xs text-neutral-400">Inventory Value</p>
            <p className="text-2xl font-bold text-neutral-900">${totalValue.toFixed(2)}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">
            <Plus className="size-4 mr-1" /> Add Product
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Add New Product</h3>
            <form onSubmit={addProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Product Name</Label><Input name="name" placeholder="e.g. Castle Lager 6-Pack" required /></div>
              <div>
                <Label>Category</Label>
                <select name="category" className="w-full border rounded-lg px-3 py-2 text-sm" required>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Spirits">Spirits</option>
                  <option value="Cider">Cider</option>
                </select>
              </div>
              <div><Label>Price (USD)</Label><Input name="price" type="number" step="0.01" min="0" required /></div>
              <div><Label>Stock</Label><Input name="stock" type="number" min="0" required /></div>
              <div className="sm:col-span-2"><Label>Description</Label><Input name="description" placeholder="Product description" /></div>
              <div className="sm:col-span-2"><Label>Image URL (optional)</Label><Input name="image_url" placeholder="https://..." /></div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit" className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer" disabled={saving}>
                  {saving ? "Saving..." : "Add Product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="cursor-pointer">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {["All", "Beer", "Wine", "Spirits", "Cider"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              filter === cat ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-400">Loading products...</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-4">
              <img src={p.image_url || "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=200"} alt={p.name} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-900 text-sm">{p.name}</h4>
                <p className="text-xs text-neutral-400 capitalize">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900">${p.price.toFixed(2)}</p>
                <p className={`text-xs font-medium ${p.stock === 0 ? "text-error" : p.stock <= 5 ? "text-warning" : "text-success"}`}>
                  {p.stock} in stock
                </p>
              </div>
              <button onClick={() => deleteProduct(p.id)} className="text-neutral-400 hover:text-error transition-colors cursor-pointer p-2">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

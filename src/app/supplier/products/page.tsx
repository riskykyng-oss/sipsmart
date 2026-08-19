"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Package, AlertTriangle, DollarSign, Layers } from "lucide-react";
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
  const lowStock = products.filter((p) => p.stock <= 5 && p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const categories = [
    { value: "All", label: "All Products", icon: Layers },
    { value: "Beer", label: "Beer", icon: Package },
    { value: "Wine", label: "Wine", icon: Package },
    { value: "Spirits", label: "Spirits", icon: Package },
    { value: "Cider", label: "Cider", icon: Package },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center">
              <Package className="size-5 text-neutral-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Products</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{products.length}</p>
          <p className="text-xs text-neutral-400 mt-1">Total items listed</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
              <DollarSign className="size-5 text-gold-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Inventory</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">${totalValue.toFixed(2)}</p>
          <p className="text-xs text-neutral-400 mt-1">Total stock value</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="size-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Low Stock</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{lowStock}</p>
          <p className="text-xs text-neutral-400 mt-1">Items running low</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Out of Stock</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{outOfStock}</p>
          <p className="text-xs text-neutral-400 mt-1">Need restocking</p>
        </div>
      </div>

      {/* Header with add button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">Product Catalog</h3>
        <Button onClick={() => setShowForm(!showForm)} className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">
          <Plus className="size-4 mr-1.5" /> Add Product
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <Card className="mb-6 border-neutral-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-neutral-900">Add New Product</h3>
            <form onSubmit={addProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Product Name</Label><Input name="name" placeholder="e.g. Castle Lager 6-Pack" required /></div>
              <div>
                <Label>Category</Label>
                <select name="category" className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm" required>
                  <option value="Beer">Beer</option>
                  <option value="Wine">Wine</option>
                  <option value="Spirits">Spirits</option>
                  <option value="Cider">Cider</option>
                </select>
              </div>
              <div><Label>Price (USD)</Label><Input name="price" type="number" step="0.01" min="0" required /></div>
              <div><Label>Stock Quantity</Label><Input name="stock" type="number" min="0" required /></div>
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

      {/* Category filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === cat.value ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <cat.icon className="size-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="text-center py-16 text-neutral-400">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="size-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500 font-medium">No products found</p>
          <p className="text-xs text-neutral-400 mt-1">
            {filter === "All" ? "Add your first product to get started" : `No products in ${filter}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              <img
                src={p.image_url || "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=400"}
                alt={p.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-neutral-900">{p.name}</h4>
                    <p className="text-xs text-neutral-400 capitalize">{p.category}</p>
                  </div>
                  <p className="text-lg font-bold text-neutral-900">${p.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stock === 0 ? "bg-red-100 text-red-700" :
                      p.stock <= 5 ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                    <p className="text-xs text-neutral-400 mt-1">Value: ${(p.price * p.stock).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

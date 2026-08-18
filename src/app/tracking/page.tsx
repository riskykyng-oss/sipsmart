"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  status: string;
  delivery_address: { street?: string; suburb?: string; city?: string };
  estimated_delivery: string | null;
  supplier_notes: string;
  created_at: string;
}

const statusSteps = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "accepted", label: "Accepted by Supplier", icon: CheckCircle },
  { key: "preparing", label: "Preparing", icon: Clock },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

const statusOrder = ["placed", "accepted", "preparing", "out_for_delivery", "delivered"];

export default function TrackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sipsmart_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        fetchOrders(u.id);
        const interval = setInterval(() => fetchOrders(u.id), 10000);
        return () => clearInterval(interval);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const res = await fetch(`/api/orders/user/${userId}`);
      const json = await res.json();
      setOrders(json.data || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Track Your Orders</h2>
        <p className="text-neutral-400 mb-6">Sign in to see your order status.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login"><Button className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">Sign In</Button></Link>
          <Link href="/register"><Button variant="outline" className="cursor-pointer">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">
          Track <span className="gold-text">Orders</span>
        </h1>
        <p className="text-neutral-400 mt-2">See the status of your deliveries</p>
      </div>

      <section className="py-8 max-w-4xl mx-auto px-4">
        {loading ? (
          <div className="text-center py-12 text-neutral-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <Package className="size-12 mx-auto mb-3 text-neutral-300" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-1">No orders yet</h3>
            <p>Place your first order to track it here.</p>
            <Link href="/products" className="mt-4 inline-block"><Button className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">Browse Products</Button></Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentIdx = statusOrder.indexOf(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono font-bold text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <p className="font-bold text-neutral-900">${order.total.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                    {statusSteps.map((step, i) => {
                      const isActive = i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      return (
                        <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400"} ${isCurrent ? "ring-2 ring-gold-500 ring-offset-2" : ""}`}>
                            <step.icon className="size-4" />
                          </div>
                          <span className={`text-xs font-medium ${isActive ? "text-neutral-900" : "text-neutral-400"}`}>{step.label}</span>
                          {i < statusSteps.length - 1 && <div className={`w-8 h-0.5 ${i < currentIdx ? "bg-neutral-900" : "bg-neutral-200"}`} />}
                        </div>
                      );
                    })}
                  </div>

                  {order.status === "rejected" && (
                    <div className="bg-red-50 rounded-lg p-3 text-sm text-red-700 flex items-center gap-2 mb-3">
                      <XCircle className="size-4" /> This order was rejected by the supplier. Your payment has been refunded.
                    </div>
                  )}

                  {order.estimated_delivery && order.status !== "delivered" && (
                    <div className="bg-gold-100 rounded-lg p-3 text-sm text-gold-700 mb-3">
                      Estimated delivery: <strong>{new Date(order.estimated_delivery).toLocaleString()}</strong>
                    </div>
                  )}

                  {order.supplier_notes && (
                    <div className="bg-neutral-50 rounded-lg p-3 text-sm text-neutral-600 mb-3 italic">
                      Supplier note: {order.supplier_notes}
                    </div>
                  )}

                  <div className="border-t border-neutral-100 pt-3">
                    <p className="text-xs text-neutral-400 mb-1">Items</p>
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-neutral-700">{item.name} × {item.quantity}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

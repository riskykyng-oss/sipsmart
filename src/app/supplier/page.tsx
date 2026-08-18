"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Truck, Package } from "lucide-react";

interface Order {
  id: string;
  user_id: string;
  user_email: string;
  items: { product_id: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
  delivery_address: { street?: string; suburb?: string; city?: string };
  payment_method: string;
  estimated_delivery: string | null;
  supplier_notes: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  preparing: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-neutral-100 text-neutral-600",
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [etaModal, setEtaModal] = useState<string | null>(null);
  const [etaValue, setEtaValue] = useState("");
  const [supplierNotes, setSupplierNotes] = useState("");
  const [salesTotal, setSalesTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      const items = json.data || [];
      setOrders(items);
      setSalesTotal(items.filter((o: Order) => o.status === "delivered").reduce((s: number, o: Order) => s + o.total, 0));
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateOrder = async (id: string, status: string, notes?: string, eta?: string) => {
    setUpdatingId(id);
    try {
      const body: Record<string, unknown> = { status };
      if (notes) body.supplier_notes = notes;
      if (eta) body.estimated_delivery = eta;
      await fetch(`/api/supplier/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      fetchOrders();
    } catch { /* ignore */ }
    setUpdatingId(null);
    setEtaModal(null);
    setEtaValue("");
    setSupplierNotes("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage and fulfill customer orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 px-6 py-3">
          <p className="text-xs text-neutral-400">Total Sales</p>
          <p className="text-2xl font-bold text-neutral-900">${salesTotal.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <Package className="size-12 mx-auto mb-3 text-neutral-300" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono font-bold text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-neutral-100 text-neutral-600"}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Items</p>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-neutral-700">{item.name} × {item.quantity} — ${(item.price * item.quantity).toFixed(2)}</p>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-1">Delivery to</p>
                  <p className="text-sm text-neutral-700">{order.delivery_address?.street}, {order.delivery_address?.suburb}</p>
                  <p className="text-xs text-neutral-400 mt-1">Payment: {order.payment_method}</p>
                  <p className="text-sm font-bold text-neutral-900 mt-1">Total: ${order.total.toFixed(2)}</p>
                  {order.estimated_delivery && (
                    <p className="text-xs text-green-600 mt-1">ETA: {new Date(order.estimated_delivery).toLocaleString()}</p>
                  )}
                  {order.supplier_notes && (
                    <p className="text-xs text-neutral-500 mt-1 italic">Note: {order.supplier_notes}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {order.status === "placed" && (
                  <>
                    <button
                      onClick={() => setEtaModal(order.id)}
                      disabled={updatingId === order.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="size-4 inline mr-1" /> Accept
                    </button>
                    <button
                      onClick={() => updateOrder(order.id, "rejected")}
                      disabled={updatingId === order.id}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="size-4 inline mr-1" /> Reject
                    </button>
                  </>
                )}
                {order.status === "accepted" && (
                  <button
                    onClick={() => updateOrder(order.id, "preparing")}
                    disabled={updatingId === order.id}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="size-4 inline mr-1" /> Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrder(order.id, "out_for_delivery")}
                    disabled={updatingId === order.id}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Truck className="size-4 inline mr-1" /> Out for Delivery
                  </button>
                )}
                {order.status === "out_for_delivery" && (
                  <button
                    onClick={() => updateOrder(order.id, "delivered")}
                    disabled={updatingId === order.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="size-4 inline mr-1" /> Mark Delivered
                  </button>
                )}
              </div>

              {etaModal === order.id && (
                <div className="mt-4 bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <p className="text-sm font-semibold text-neutral-900 mb-2">Set Estimated Delivery Time</p>
                  <input
                    type="datetime-local"
                    value={etaValue}
                    onChange={(e) => setEtaValue(e.target.value)}
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-2"
                  />
                  <input
                    type="text"
                    value={supplierNotes}
                    onChange={(e) => setSupplierNotes(e.target.value)}
                    placeholder="Notes for customer (optional)"
                    className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrder(order.id, "accepted", supplierNotes, etaValue ? new Date(etaValue).toISOString() : undefined)}
                      disabled={!etaValue || updatingId === order.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Confirm Accept
                    </button>
                    <button
                      onClick={() => { setEtaModal(null); setEtaValue(""); setSupplierNotes(""); }}
                      className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

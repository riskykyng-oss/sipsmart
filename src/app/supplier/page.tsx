"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Truck, Package, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

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
  placed: "bg-blue-100 text-blue-700 border-blue-200",
  accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
  preparing: "bg-amber-100 text-amber-700 border-amber-200",
  out_for_delivery: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  cancelled: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  placed: <AlertCircle className="size-3.5" />,
  accepted: <CheckCircle className="size-3.5" />,
  preparing: <Clock className="size-3.5" />,
  out_for_delivery: <Truck className="size-3.5" />,
  delivered: <CheckCircle className="size-3.5" />,
  rejected: <XCircle className="size-3.5" />,
};

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [etaModal, setEtaModal] = useState<string | null>(null);
  const [etaValue, setEtaValue] = useState("");
  const [supplierNotes, setSupplierNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      setOrders(json.data || []);
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

  const stats = {
    pending: orders.filter((o) => o.status === "placed").length,
    active: orders.filter((o) => ["accepted", "preparing", "out_for_delivery"].includes(o.status)).length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0),
  };

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="size-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Pending</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{stats.pending}</p>
          <p className="text-xs text-neutral-400 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="size-5 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Active</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{stats.active}</p>
          <p className="text-xs text-neutral-400 mt-1">In progress</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Delivered</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">{stats.delivered}</p>
          <p className="text-xs text-neutral-400 mt-1">Completed orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center">
              <DollarSign className="size-5 text-gold-600" />
            </div>
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-neutral-900">${stats.revenue.toFixed(2)}</p>
          <p className="text-xs text-neutral-400 mt-1">From delivered orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: "all", label: "All Orders", count: orders.length },
          { value: "placed", label: "New", count: stats.pending },
          { value: "accepted", label: "Accepted", count: orders.filter((o) => o.status === "accepted").length },
          { value: "preparing", label: "Preparing", count: orders.filter((o) => o.status === "preparing").length },
          { value: "out_for_delivery", label: "Out for Delivery", count: orders.filter((o) => o.status === "out_for_delivery").length },
          { value: "delivered", label: "Delivered", count: stats.delivered },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === tab.value ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 text-xs ${statusFilter === tab.value ? "text-gold-400" : "text-neutral-400"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="text-center py-16 text-neutral-400">Loading orders...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="size-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500 font-medium">No orders found</p>
          <p className="text-xs text-neutral-400 mt-1">
            {statusFilter === "all" ? "Orders from customers will appear here" : `No ${statusFilter.replace("_", " ")} orders`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
              {/* Order header */}
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-mono font-bold text-neutral-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-neutral-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status] || "bg-neutral-100 text-neutral-600 border-neutral-200"}`}>
                    {statusIcons[order.status]}
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-neutral-900">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-neutral-400">{order.payment_method}</p>
                </div>
              </div>

              {/* Order body */}
              <div className="px-5 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Items */}
                  <div className="sm:col-span-1">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Items</p>
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-neutral-700 mb-1">
                        {item.name} × {item.quantity} — <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>

                  {/* Delivery */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Delivery Address</p>
                    <p className="text-sm text-neutral-700">{order.delivery_address?.street}</p>
                    <p className="text-sm text-neutral-500">{order.delivery_address?.suburb}, {order.delivery_address?.city}</p>
                    {order.estimated_delivery && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                        <Clock className="size-3" />
                        ETA: {new Date(order.estimated_delivery).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Customer</p>
                    <p className="text-sm text-neutral-700">{order.user_email}</p>
                    {order.supplier_notes && (
                      <div className="mt-2 bg-neutral-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-neutral-500 italic">Your note: {order.supplier_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex gap-2 flex-wrap">
                {order.status === "placed" && (
                  <>
                    <button
                      onClick={() => setEtaModal(order.id)}
                      disabled={updatingId === order.id}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle className="size-4 inline mr-1.5" /> Accept Order
                    </button>
                    <button
                      onClick={() => updateOrder(order.id, "rejected")}
                      disabled={updatingId === order.id}
                      className="bg-white border border-red-200 text-red-600 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="size-4 inline mr-1.5" /> Reject
                    </button>
                  </>
                )}
                {order.status === "accepted" && (
                  <button
                    onClick={() => updateOrder(order.id, "preparing")}
                    disabled={updatingId === order.id}
                    className="bg-amber-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="size-4 inline mr-1.5" /> Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrder(order.id, "out_for_delivery")}
                    disabled={updatingId === order.id}
                    className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Truck className="size-4 inline mr-1.5" /> Out for Delivery
                  </button>
                )}
                {order.status === "out_for_delivery" && (
                  <button
                    onClick={() => updateOrder(order.id, "delivered")}
                    disabled={updatingId === order.id}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="size-4 inline mr-1.5" /> Mark Delivered
                  </button>
                )}
              </div>

              {/* ETA modal */}
              {etaModal === order.id && (
                <div className="px-5 py-4 bg-emerald-50 border-t border-emerald-100">
                  <p className="text-sm font-semibold text-emerald-900 mb-3">Set Estimated Delivery Time</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <input
                      type="datetime-local"
                      value={etaValue}
                      onChange={(e) => setEtaValue(e.target.value)}
                      className="w-full border border-emerald-200 rounded-lg px-3 py-2.5 text-sm bg-white"
                    />
                    <input
                      type="text"
                      value={supplierNotes}
                      onChange={(e) => setSupplierNotes(e.target.value)}
                      placeholder="Note for customer (optional)"
                      className="w-full border border-emerald-200 rounded-lg px-3 py-2.5 text-sm bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrder(order.id, "accepted", supplierNotes, etaValue ? new Date(etaValue).toISOString() : undefined)}
                      disabled={!etaValue || updatingId === order.id}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Confirm & Accept
                    </button>
                    <button
                      onClick={() => { setEtaModal(null); setEtaValue(""); setSupplierNotes(""); }}
                      className="bg-white border border-neutral-200 text-neutral-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
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

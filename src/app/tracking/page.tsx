"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed" },
  { key: "payment_confirmed", label: "Payment Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function TrackingPage() {
  return (
    <>
      <div className="bg-green-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">
          Track <span className="gold-text">Order</span>
        </h1>
        <p className="text-green-200/70 mt-2">Follow your delivery in real-time</p>
      </div>

      <section className="py-16 max-w-3xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Package className="size-16 text-green-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Track your orders</h2>
          <p className="text-neutral-400 mb-6">Sign in to view your order history and track deliveries in real-time.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button className="bg-green-800 text-white hover:bg-green-700 cursor-pointer">Sign In</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="cursor-pointer">Browse Products</Button>
            </Link>
          </div>
        </div>

        <Card className="text-left">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Order Status Flow</h3>
            <div className="space-y-3">
              {STATUS_STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DELIVERY_FEE = 2.0;
const PLACEHOLDER = "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=200";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState("ecocash");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("sipsmart_cart") || "[]"));
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  if (!cart.length && !success) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-400 mb-6">Add products before checking out.</p>
        <Link href="/products"><Button className="bg-green-800 text-white hover:bg-green-700 cursor-pointer">Browse Products</Button></Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Order Placed!</h2>
        <p className="text-neutral-400 mb-4">Thank you for your order. We&apos;ll start preparing it right away.</p>
        <div className="inline-block bg-green-50 text-green-800 font-mono font-bold px-4 py-2 rounded-lg mb-6">
          Order #{success.id.slice(0, 8).toUpperCase()}
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/tracking"><Button className="bg-green-800 text-white hover:bg-green-700 cursor-pointer">📦 Track My Order</Button></Link>
          <Link href="/products"><Button variant="outline" className="cursor-pointer">Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    setError("");
    const form = document.querySelector("form") as HTMLFormElement;
    if (!form) return;
    const fd = new FormData(form);
    const street = fd.get("street") as string;
    const suburb = fd.get("suburb") as string;
    const city = fd.get("city") as string;
    const phone = fd.get("phone") as string;

    if (!street || !suburb || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "guest",
          items: cart.map((i) => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          subtotal,
          delivery_fee: DELIVERY_FEE,
          total,
          delivery_address: { street, suburb, city },
          payment_method: payment,
          payment_phone: phone,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      localStorage.removeItem("sipsmart_cart");
      setSuccess(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="bg-green-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">Check<span className="gold-text">out</span></h1>
        <p className="text-green-200/70 mt-2">Almost there — complete your order</p>
      </div>

      <div className="responsible-bar py-3">
        <div className="max-w-6xl mx-auto px-4 text-sm text-neutral-700">
          ⚠️ <strong>Drink Responsibly.</strong> Alcohol abuse is dangerous to health. Do not share with persons under 18.
        </div>
      </div>

      <section className="py-8 max-w-6xl mx-auto px-4">
        <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-error text-sm p-3 rounded-lg">{error}</div>}

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">📍 Delivery Address</h3>
                  <div className="space-y-3">
                    <div><Label>Street Address</Label><Input name="street" placeholder="e.g. 12 Samora Machel Ave" required /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Suburb</Label><Input name="suburb" placeholder="e.g. Avondale" required /></div>
                      <div>
                        <Label>City</Label>
                        <select name="city" className="w-full border rounded-lg px-3 py-2 text-sm">
                          <option value="Harare">Harare</option>
                          <option value="Bulawayo">Bulawayo</option>
                        </select>
                      </div>
                    </div>
                    <div><Label>Delivery Instructions (optional)</Label><Textarea name="notes" placeholder="e.g. Blue gate, ring twice..." /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">💳 Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "ecocash", icon: "📱", name: "EcoCash" },
                      { id: "innbucks", icon: "🏦", name: "InnBucks" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          payment === m.id ? "border-green-700 bg-green-50" : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{m.icon}</span>
                        <span className="font-semibold text-sm">{m.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-sm text-green-800">
                    💰 Send payment to <strong>{payment === "ecocash" ? "EcoCash" : "InnBucks"}: 078 884 0432</strong> (SipSmart)
                  </div>
                  <div><Label>Mobile Number (for payment)</Label><Input name="phone" type="tel" placeholder="+263 77 123 4567" required /></div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Order Summary</h3>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image_url || PLACEHOLDER} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-neutral-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span>Delivery</span><span>${DELIVERY_FEE.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-green-800">${total.toFixed(2)}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="max-w-2xl mt-6">
            <Button type="submit" className="w-full bg-green-800 text-white hover:bg-green-700 cursor-pointer" size="lg" disabled={placing}>
              {placing ? "Placing order..." : `🛒 Place Order — $${total.toFixed(2)}`}
            </Button>
            <p className="text-center text-xs text-neutral-400 mt-2">
              By placing your order you confirm you are 18+ and agree to our terms.
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

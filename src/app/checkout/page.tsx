"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wallet, CreditCard } from "lucide-react";

const DELIVERY_FEE = 2.0;
const PLACEHOLDER = "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=200";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface UserData {
  id: string;
  email: string;
  user_metadata?: { fullname?: string };
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState("wallet");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loadingWallet, setLoadingWallet] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("sipsmart_cart") || "[]"));
    const stored = localStorage.getItem("sipsmart_user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as UserData;
        setUser(u);
        fetchWallet(u.id);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => { window.location.href = "/tracking"; }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchWallet = async (userId: string) => {
    setLoadingWallet(true);
    try {
      const res = await fetch(`/api/wallet?user_id=${userId}`);
      const json = await res.json();
      if (json.success) setWalletBalance(json.data.wallet.balance);
    } catch { /* ignore */ }
    setLoadingWallet(false);
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sign in required</h2>
        <p className="text-neutral-400 mb-6">You need an account to place an order.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login"><Button className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">Sign In</Button></Link>
          <Link href="/register"><Button variant="outline" className="cursor-pointer">Create Account</Button></Link>
        </div>
      </div>
    );
  }

  if (!cart.length && !success) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-400 mb-6">Add products before checking out.</p>
        <Link href="/products"><Button className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">Browse Products</Button></Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Order Placed!</h2>
        <p className="text-neutral-500 mb-4">Your order has been sent to a supplier. You&apos;ll see the status update once they accept it.</p>
        <div className="inline-block bg-neutral-100 text-neutral-800 font-mono font-bold px-4 py-2 rounded-lg mb-2">
          Order #{success.id.slice(0, 8).toUpperCase()}
        </div>
        <p className="text-xs text-neutral-400 mb-8">Redirecting to tracking in 3 seconds...</p>
        <div className="flex flex-col gap-3">
          <Link href="/tracking"><Button className="bg-gold-500 text-neutral-900 hover:bg-gold-400 font-bold cursor-pointer" size="lg">Track My Order</Button></Link>
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
    const phone = fd.get("phone") as string;

    if (!street || !suburb || !phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (payment === "wallet" && walletBalance < total) {
      setError("Insufficient wallet balance. Please top up or choose another payment method.");
      return;
    }

    setPlacing(true);
    try {
      if (payment === "wallet") {
        const holdRes = await fetch("/api/wallet/hold", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, total }),
        });
        const holdJson = await holdRes.json();
        if (!holdJson.success) throw new Error(holdJson.error);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          user_email: user.email,
          items: cart.map((i) => ({ product_id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          subtotal,
          delivery_fee: DELIVERY_FEE,
          total,
          delivery_address: { street, suburb, city: fd.get("city") as string || "Harare" },
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
      <div className="bg-neutral-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">Check<span className="gold-text">out</span></h1>
        <p className="text-neutral-400 mt-2">Almost there — complete your order</p>
      </div>

      <section className="py-8 max-w-6xl mx-auto px-4">
        <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-error text-sm p-3 rounded-lg">{error}</div>}

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg">Delivery Address</h3>
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
                  <h3 className="font-semibold text-lg">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "wallet", icon: <Wallet className="size-5" />, name: "SipSmart Wallet", extra: `$${walletBalance.toFixed(2)} available` },
                      { id: "ecocash", icon: <CreditCard className="size-5" />, name: "EcoCash", extra: "Mobile money" },
                      { id: "innbucks", icon: <CreditCard className="size-5" />, name: "InnBucks", extra: "Mobile money" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={`p-4 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          payment === m.id ? "border-gold-500 bg-gold-100/50" : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex justify-center mb-1 text-neutral-700">{m.icon}</div>
                        <span className="font-semibold text-sm block">{m.name}</span>
                        <span className="text-xs text-neutral-400">{m.extra}</span>
                      </button>
                    ))}
                  </div>
                  {payment === "wallet" && (
                    <div className="bg-gold-100 rounded-lg p-3 text-sm text-gold-700">
                      💰 Paying from your SipSmart Wallet. Balance after order: <strong>${(walletBalance - total).toFixed(2)}</strong>
                    </div>
                  )}
                  {payment !== "wallet" && (
                    <div className="bg-neutral-100 rounded-lg p-3 text-sm text-neutral-600">
                      Send payment to <strong>{payment === "ecocash" ? "EcoCash" : "InnBucks"}: 078 884 0432</strong> (SipSmart)
                    </div>
                  )}
                  <div><Label>Phone Number</Label><Input name="phone" type="tel" placeholder="+263 77 123 4567" required /></div>
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
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-neutral-900">${total.toFixed(2)}</span></div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="max-w-2xl mt-6">
            <Button type="submit" className="w-full bg-gold-500 text-neutral-900 hover:bg-gold-400 font-bold cursor-pointer" size="lg" disabled={placing}>
              {placing ? "Placing order..." : `Place Order — $${total.toFixed(2)}`}
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DELIVERY_FEE = 2.0;
const PLACEHOLDER = "https://images.pexels.com/photos/1267360/pexels-photo-1267360.jpeg?auto=compress&cs=tinysrgb&w=200";

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("sipsmart_cart") || "[]"));
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("sipsmart_cart", JSON.stringify(newCart));
  };

  const changeQty = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty <= 0 ? null : { ...item, quantity: newQty };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const removeItem = (id: string) => {
    saveCart(cart.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  if (!cart.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your cart is empty</h2>
        <p className="text-neutral-400 mb-6">Add some products to get started.</p>
        <Link href="/products">
          <Button className="bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-900 text-white py-12 text-center">
        <h1 className="font-heading text-4xl font-bold">
          Your <span className="gold-text">Cart</span>
        </h1>
        <p className="text-neutral-400 mt-2">Review your items before checkout</p>
      </div>

      <section className="py-8 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Items ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>
              <button onClick={() => saveCart([])} className="text-sm text-error hover:underline cursor-pointer">
                Remove all
              </button>
            </div>
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex gap-4 p-4">
                  <img src={item.image_url || PLACEHOLDER} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                    <p className="text-xs text-neutral-400">{item.category}</p>
                    <p className="text-sm text-neutral-600 mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-semibold text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-neutral-100 cursor-pointer">
                        <Minus className="size-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded border flex items-center justify-center hover:bg-neutral-100 cursor-pointer">
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-xs text-error hover:underline flex items-center gap-1 cursor-pointer">
                      <Trash2 className="size-3" /> Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Delivery Fee</span><span>${DELIVERY_FEE.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-neutral-900">${total.toFixed(2)}</span></div>
                <div className="text-xs text-neutral-400 space-y-1 bg-neutral-50 rounded-lg p-3">
                  <p>Delivery within 2 hours</p>
                  <p>Harare &amp; Bulawayo only</p>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-gold-500 text-neutral-900 hover:bg-gold-400 font-bold cursor-pointer" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/products" className="block text-center text-sm text-neutral-400 hover:text-neutral-700">
                  Continue Shopping
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

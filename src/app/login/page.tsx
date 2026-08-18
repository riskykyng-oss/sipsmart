"use client";

import { useState } from "react";
import Link from "next/link";
import { Wine, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Login failed");
      if (json.data?.user) {
        localStorage.setItem("sipsmart_user", JSON.stringify(json.data.user));
      }
      window.location.href = "/products";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex">
      <div className="hidden lg:flex lg:w-1/2 hero-gradient items-center justify-center p-12">
        <div className="text-white text-center">
          <Wine className="size-16 text-gold-500 mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold mb-2">Sip<span className="gold-text">Smart</span></h1>
          <p className="text-neutral-400 mb-8">Order Smart, Stay Safe</p>
          <ul className="space-y-3 text-neutral-300 text-left max-w-xs mx-auto">
            <li>✓ Fast 2-hour home delivery</li>
            <li>✓ Pay with SipSmart Wallet</li>
            <li>✓ Track your order in real-time</li>
            <li>✓ Premium selection of drinks</li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Welcome back</h2>
          <p className="text-neutral-400 mb-6">Sign in to your SipSmart account</p>

          {error && <div className="bg-red-50 border border-red-200 text-error text-sm p-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Email Address</Label><Input name="email" type="email" placeholder="you@example.com" required /></div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input name="password" type={showPass ? "text" : "password"} placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center my-6 text-sm text-neutral-400">New to SipSmart?</div>
          <Link href="/register">
            <Button variant="outline" className="w-full cursor-pointer">Create Account</Button>
          </Link>
          <p className="text-center text-xs text-neutral-400 mt-6">You must be 18 or older. Drink responsibly.</p>
        </div>
      </div>
    </div>
  );
}

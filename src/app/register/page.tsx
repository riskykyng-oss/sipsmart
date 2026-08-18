"use client";

import { useState } from "react";
import Link from "next/link";
import { Wine, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ageFeedback, setAgeFeedback] = useState("");

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = new Date(e.target.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
    if (age < 18) {
      setAgeFeedback(`❌ You must be 18+. You are currently ${age} years old.`);
    } else {
      setAgeFeedback(`✓ Age verified — ${age} years old`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const fullname = fd.get("fullname") as string;
    const phone = fd.get("phone") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const confirm = fd.get("confirm-password") as string;
    const dob = fd.get("dob") as string;
    const terms = fd.get("terms") as string;

    if (!fullname || !phone || !email || !password || !dob) { setError("Please fill in all required fields."); setLoading(false); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); setLoading(false); return; }
    if (password !== confirm) { setError("Passwords do not match."); setLoading(false); return; }
    if (!terms) { setError("You must agree to the Terms of Service."); setLoading(false); return; }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, phone, email, password, dob }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Registration failed");
      window.location.href = "/products";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
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
          <p className="text-green-200/70 mb-8">Order Smart, Stay Safe</p>
          <ul className="space-y-3 text-green-100 text-left max-w-xs mx-auto">
            <li>✓ Quick and easy registration</li>
            <li>✓ Secure age verification</li>
            <li>✓ Instant access to all products</li>
            <li>✓ EcoCash &amp; InnBucks payments</li>
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Create Account</h2>
          <p className="text-neutral-400 mb-6">Join SipSmart — Zimbabwe&apos;s premier liquor delivery</p>

          {error && <div className="bg-red-50 border border-red-200 text-error text-sm p-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full Name</Label><Input name="fullname" placeholder="John Doe" required /></div>
              <div><Label>Phone Number</Label><Input name="phone" placeholder="+263 77 123 4567" required /></div>
            </div>
            <div><Label>Email Address</Label><Input name="email" type="email" placeholder="you@example.com" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input name="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input name="confirm-password" type={showConfirm ? "text" : "password"} placeholder="Repeat password" required />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer">
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Label>Date of Birth <span className="text-error text-xs">(Must be 18+)</span></Label>
              <Input name="dob" type="date" required onChange={handleDobChange} />
              {ageFeedback && <p className={`text-xs mt-1 ${ageFeedback.startsWith("❌") ? "text-error" : "text-success"}`}>{ageFeedback}</p>}
            </div>
            <label className="flex items-start gap-2 text-sm text-neutral-700">
              <input type="checkbox" name="terms" className="mt-0.5" required />
              I confirm I am 18+ and agree to the <Link href="#" className="text-green-700 underline">Terms of Service</Link> and <Link href="#" className="text-green-700 underline">Privacy Policy</Link>.
            </label>
            <Button type="submit" className="w-full bg-green-800 text-white hover:bg-green-700 cursor-pointer" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center my-6 text-sm text-neutral-400">Already have an account?</div>
          <Link href="/login">
            <Button variant="outline" className="w-full cursor-pointer">Sign In</Button>
          </Link>
          <p className="text-center text-xs text-neutral-400 mt-6">⚠️ You must be 18 or older. You&apos;ll be asked to show ID on delivery.</p>
        </div>
      </div>
    </div>
  );
}

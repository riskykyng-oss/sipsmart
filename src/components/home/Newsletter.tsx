"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-neutral-900 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 text-6xl opacity-10">🍷</div>
          <div className="absolute bottom-4 left-4 text-6xl opacity-10">🥃</div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="size-6 text-gold-500" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
              Stay in the Loop
            </h2>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto text-sm">
              Get exclusive deals, new arrivals, and delivery updates straight to your inbox.
            </p>
            {submitted ? (
              <p className="text-gold-400 font-semibold">
                Thanks for subscribing! Check your inbox for a welcome offer.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-5 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold-500 text-neutral-900 px-6 py-3 rounded-xl font-bold hover:bg-gold-400 transition-colors flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

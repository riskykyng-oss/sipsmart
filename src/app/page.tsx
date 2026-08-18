import Link from "next/link";
import { Truck, Shield, MapPin, Award, Heart, Beer, Wine, Cherry, GlassWater } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Beer", icon: Beer, desc: "Local & imported lagers", href: "/products?category=Beer" },
  { name: "Wine", icon: Wine, desc: "Reds, whites & sparkling", href: "/products?category=Wine" },
  { name: "Spirits", icon: Cherry, desc: "Whisky, vodka, rum & more", href: "/products?category=Spirits" },
  { name: "Cider", icon: GlassWater, desc: "Crisp & refreshing ciders", href: "/products?category=Cider" },
];

const features = [
  { icon: Truck, title: "Fast Home Delivery", desc: "Orders delivered within 2 hours to your doorstep anywhere in Harare and Bulawayo." },
  { icon: Shield, title: "EcoCash & InnBucks", desc: "Pay conveniently with Zimbabwe's most trusted mobile money platforms." },
  { icon: Shield, title: "Age Verified & Secure", desc: "Strict 18+ verification at registration and delivery. Your data is always protected." },
  { icon: MapPin, title: "Real-Time Tracking", desc: "Track your order from placement to delivery with live status updates." },
  { icon: Award, title: "Premium Selection", desc: "Curated range of local and imported beers, wines, spirits and ciders." },
  { icon: Heart, title: "Drink Responsibly", desc: "We promote responsible drinking. Every order includes a safety reminder." },
];

const steps = [
  { num: 1, title: "Browse & Choose", desc: "Explore our wide selection and add your favourites to the cart." },
  { num: 2, title: "Checkout & Pay", desc: "Enter your delivery address and pay securely via EcoCash or InnBucks." },
  { num: 3, title: "Track & Receive", desc: "Follow your order in real-time and receive it at your door." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center text-white">
          <div className="inline-block bg-gold-500/20 text-gold-400 border border-gold-500/30 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Zimbabwe&apos;s Premier Delivery Service
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4">
            Sip<span className="gold-text">Smart</span>
          </h1>
          <p className="text-xl md:text-2xl text-green-100 mb-3 font-light">Order Smart, Stay Safe</p>
          <p className="text-green-200/80 max-w-xl mx-auto mb-8 text-lg">
            Premium spirits, wines, beers and ciders delivered straight to your door. Fast, reliable, and responsible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/products">
              <Button size="lg" className="bg-gold-500 text-green-900 hover:bg-gold-400 text-base px-8 cursor-pointer">
                Browse Products
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-green-400/40 text-white hover:bg-green-800 text-base px-8 cursor-pointer">
                Create Account
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">500+</div>
              <div className="text-green-200/70">Products</div>
            </div>
            <div className="w-px h-8 bg-green-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">2h</div>
              <div className="text-green-200/70">Delivery</div>
            </div>
            <div className="w-px h-8 bg-green-600" />
            <div className="text-center">
              <div className="text-2xl font-bold text-gold-400">18+</div>
              <div className="text-green-200/70">Age Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">Shop by Category</h2>
            <p className="text-neutral-400 mt-2">Find exactly what you&apos;re looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <Card className="group hover:shadow-lg hover:border-gold-500/50 transition-all cursor-pointer text-center py-8">
                  <CardContent>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 text-green-700 mb-4 group-hover:bg-green-100 transition-colors">
                      <cat.icon className="size-8" />
                    </div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-neutral-400">{cat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">Why Choose SipSmart?</h2>
            <p className="text-neutral-400 mt-2">The smarter way to order your favourites</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-700 mb-4">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900">How It Works</h2>
            <p className="text-neutral-400 mt-2">Three simple steps to delivery</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-6 md:gap-12">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-green-900 text-gold-400 flex items-center justify-center text-xl font-bold mb-3 mx-auto">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-neutral-400 max-w-[200px]">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block text-green-300 text-3xl">&rarr;</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/products">
              <Button size="lg" className="bg-green-800 text-white hover:bg-green-700 px-8 cursor-pointer">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Responsible Drinking */}
      <div className="responsible-bar py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-neutral-700">
            <strong>Drink Responsibly.</strong> Alcohol is harmful to your health. Not for sale to persons under 18. Do not drink and drive.
          </p>
        </div>
      </div>
    </>
  );
}

import { Shield, Clock, CreditCard, Award, Headphones, Truck } from "lucide-react";

const features = [
  { icon: Shield, title: "Age Verified", description: "All customers verified to ensure responsible service." },
  { icon: Clock, title: "Fast Delivery", description: "Get your order within 2 hours across Harare." },
  { icon: CreditCard, title: "SipSmart Wallet", description: "Pay with your built-in wallet, EcoCash or InnBucks." },
  { icon: Award, title: "Premium Quality", description: "Curated selection of Zimbabwe's finest beverages." },
  { icon: Headphones, title: "24/7 Support", description: "Our team is always ready to help via WhatsApp or phone." },
  { icon: Truck, title: "Real-Time Tracking", description: "Track your order from checkout to your doorstep." },
];

export function WhySipSmart() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
            Why Choose SipSmart?
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Zimbabwe&apos;s most trusted alcohol delivery service
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white rounded-2xl border border-neutral-200 p-6 hover:border-gold-500 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-neutral-900 transition-colors">
                <feature.icon className="size-6 text-neutral-700 group-hover:text-gold-500 transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

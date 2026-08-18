import { ShieldCheck, CreditCard, Clock, Award } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "18+ Age Verified", description: "Mandatory verification" },
  { icon: CreditCard, label: "Secure Payments", description: "EcoCash, InnBucks & Cards" },
  { icon: Clock, label: "Fast Delivery", description: "Within 2 hours" },
  { icon: Award, label: "Premium Selection", description: "Curated quality brands" },
];

export function TrustStrip() {
  return (
    <section className="bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <item.icon className="size-5 text-green-900" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-900">{item.label}</p>
              <p className="text-xs text-neutral-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import { UserCheck, Search, CreditCard, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Register & Verify",
    description: "Create your account and verify you're 18+. Quick and secure process.",
  },
  {
    number: "02",
    icon: Search,
    title: "Browse & Choose",
    description: "Explore our curated collection of premium spirits, wines, beers and ciders.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Order & Pay",
    description: "Secure checkout with your SipSmart Wallet, EcoCash or InnBucks.",
  },
  {
    number: "04",
    icon: Truck,
    title: "Track & Receive",
    description: "Real-time tracking. Your order delivered to your door within 2 hours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-neutral-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-3">
            How It Works
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Four simple steps to get your favorite drinks delivered
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center relative">
              <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-5 relative">
                <step.icon className="size-6 text-gold-500" />
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gold-500 text-neutral-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

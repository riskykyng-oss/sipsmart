import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Tendai M.",
    location: "Harare",
    rating: 5,
    quote: "Absolutely love the fast delivery! Ordered at 2pm and had my wine by 3:30pm. The packaging was premium too. Highly recommend SipSmart!",
  },
  {
    name: "Rudo K.",
    location: "Borrowdale",
    rating: 5,
    quote: "Finally a proper online liquor store in Zimbabwe. The selection is amazing and the prices are fair. The age verification gives me confidence.",
  },
  {
    name: "Tatenda P.",
    location: "Avondale",
    rating: 5,
    quote: "Great experience from start to finish. Easy to order, paid with EcoCash, and the driver was professional. Will definitely order again.",
  },
];

export function Testimonials() {
  return (
    <section className="bg-green-50 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold text-green-900 mb-3">
            What Our Customers Say
          </h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            Trusted by hundreds of satisfied customers across Zimbabwe
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-5 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-neutral-100 pt-4">
                <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center text-gold-500 font-semibold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-900">{testimonial.name}</p>
                  <p className="text-xs text-neutral-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ShieldAlert, Phone } from "lucide-react";

export function ResponsibleDrinking() {
  return (
    <section className="bg-green-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-green-800/50 rounded-2xl border border-green-700/50 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-gold-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="size-8 text-gold-500" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="font-heading text-2xl font-bold mb-3">
                Drink Responsibly
              </h3>
              <p className="text-green-300 leading-relaxed max-w-2xl">
                SipSmart promotes responsible alcohol consumption. We are committed to ensuring that alcohol is sold and delivered responsibly. Alcohol can be harmful to your health. Never drink and drive. If you or someone you know needs help, please reach out.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-green-200">
                  <Phone className="size-4 text-gold-500" />
                  <span className="text-sm">Helpline: +263 77 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-green-200">
                  <span className="text-gold-500 text-sm font-semibold">18+</span>
                  <span className="text-sm">Must be 18 years or older to purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

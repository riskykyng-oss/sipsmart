"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AgeGate() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("sipsmart-age-verified");
    if (!verified) setShow(true);
  }, []);

  const handleVerify = (approved: boolean) => {
    if (approved) {
      localStorage.setItem("sipsmart-age-verified", "true");
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-green-900/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="size-8 text-gold-500" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-green-900 mb-2">
          Welcome to SipSmart
        </h2>
        <p className="text-neutral-700 mb-2">
          You must be <span className="font-semibold">18 years or older</span> to enter this site.
        </p>
        <p className="text-neutral-500 text-sm mb-8">
          By entering this site, you confirm that you are of legal drinking age in Zimbabwe.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => handleVerify(true)}
            className="bg-green-900 hover:bg-green-800 text-white py-6 text-base font-semibold"
          >
            I am 18 or older — Enter
          </Button>
          <button
            onClick={() => handleVerify(false)}
            className="flex items-center justify-center gap-2 text-neutral-500 hover:text-red-600 transition-colors py-3 text-sm"
          >
            <AlertTriangle className="size-4" />
            I am under 18 — Exit
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-green-800 text-green-100 relative">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2 flex-1 justify-center">
          <span className="font-medium text-gold-400">Delivering Responsibly. Drinking Responsibly.</span>
          <span className="hidden sm:inline text-green-300">|</span>
          <span className="text-green-200">Fast delivery across Harare</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-green-300 hover:text-white transition-colors ml-4 flex-shrink-0"
          aria-label="Close announcement"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}

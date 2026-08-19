"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { AgeGate } from "@/components/AgeGate";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSupplier = pathname.startsWith("/supplier");

  return (
    <>
      <AgeGate />
      {!isSupplier && <AnnouncementBar />}
      {!isSupplier && <Navbar />}
      <main className={`flex-1 ${isSupplier ? "" : "pb-20"}`}>{children}</main>
      {!isSupplier && <Footer />}
    </>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;
    const { status } = await request.json();

    const { data: order, error: oErr } = await supabase
      .from("orders").select("*").eq("id", id).single();
    if (oErr) throw oErr;

    const { data, error } = await supabase
      .from("orders").update({ status }).eq("id", id).select().single();
    if (error) throw error;

    if (status === "delivered" && order.user_id !== "guest") {
      const { data: wallet } = await supabase
        .from("wallets").select("id, balance").eq("user_id", order.user_id).single();
      if (wallet) {
        await supabase.from("wallets").update({ balance: wallet.balance + order.total }).eq("id", wallet.id);
        await supabase.from("transactions").insert([{
          wallet_id: wallet.id,
          type: "release",
          amount: order.total,
          order_id: order.id,
          description: `Payment released for delivered order #${order.id.slice(0, 8).toUpperCase()}`,
        }]);
      }
    }

    if (status === "rejected" && order.user_id !== "guest") {
      const { data: wallet } = await supabase
        .from("wallets").select("id, balance").eq("user_id", order.user_id).single();
      if (wallet) {
        await supabase.from("wallets").update({ balance: wallet.balance + order.total }).eq("id", wallet.id);
        await supabase.from("transactions").insert([{
          wallet_id: wallet.id,
          type: "refund",
          amount: order.total,
          order_id: order.id,
          description: `Refund for rejected order #${order.id.slice(0, 8).toUpperCase()}`,
        }]);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

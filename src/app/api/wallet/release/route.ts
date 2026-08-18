import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { user_id, order_id, total } = await request.json();
    if (!user_id || !order_id || !total) {
      return NextResponse.json({ success: false, error: "user_id, order_id, total required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: wallet, error: wErr } = await supabase
      .from("wallets").select("*").eq("user_id", user_id).single();
    if (wErr) throw wErr;

    const newBalance = wallet.balance + total;
    await supabase.from("wallets").update({ balance: newBalance }).eq("id", wallet.id);
    await supabase.from("transactions").insert([{
      wallet_id: wallet.id,
      type: "release",
      amount: total,
      order_id: order_id,
      description: `Payment released for order #${order_id.slice(0, 8).toUpperCase()}`,
    }]);

    return NextResponse.json({ success: true, data: { balance: newBalance } });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

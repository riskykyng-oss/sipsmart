import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { user_id, amount, type, order_id, description } = await request.json();
    if (!user_id || !amount || !type) {
      return NextResponse.json({ success: false, error: "user_id, amount, type required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: wallet, error: wErr } = await supabase
      .from("wallets").select("*").eq("user_id", user_id).single();
    if (wErr) throw wErr;

    let newBalance = wallet.balance;
    if (type === "hold" || type === "debit") {
      newBalance = wallet.balance - amount;
      if (newBalance < 0) return NextResponse.json({ success: false, error: "Insufficient balance" }, { status: 400 });
    } else if (type === "release" || type === "deposit" || type === "refund") {
      newBalance = wallet.balance + amount;
    }

    const { error: bErr } = await supabase
      .from("wallets").update({ balance: newBalance }).eq("id", wallet.id);
    if (bErr) throw bErr;

    const { data: txn, error: tErr } = await supabase
      .from("transactions").insert([{ wallet_id: wallet.id, type, amount, order_id: order_id || null, description: description || "" }])
      .select().single();
    if (tErr) throw tErr;

    return NextResponse.json({ success: true, data: { balance: newBalance, transaction: txn } });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    if (!userId) return NextResponse.json({ success: false, error: "user_id required" }, { status: 400 });

    const supabase = createAdminClient();
    const { data: wallet, error: wErr } = await supabase
      .from("wallets").select("*").eq("user_id", userId).single();
    if (wErr) throw wErr;

    const { data: transactions } = await supabase
      .from("transactions").select("*").eq("wallet_id", wallet.id).order("created_at", { ascending: false }).limit(20);

    return NextResponse.json({ success: true, data: { wallet, transactions: transactions || [] } });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

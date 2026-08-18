import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { fullname, phone, email, password, dob } = await request.json();
    if (!fullname || !email || !password || !dob) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { fullname, phone, dob },
    });
    if (error) throw error;

    if (data.user) {
      await supabase.from("wallets").insert([{ user_id: data.user.id, balance: 10.00 }]);
      await supabase.from("user_roles").insert([{ user_id: data.user.id, role: "customer" }]);
      await supabase.from("transactions").insert([{
        wallet_id: (await supabase.from("wallets").select("id").eq("user_id", data.user.id).single()).data?.id,
        type: "deposit",
        amount: 10.00,
        description: "Welcome bonus — $10 credited to your SipSmart Wallet",
      }]);
    }

    return NextResponse.json({ success: true, data: { user: data.user } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

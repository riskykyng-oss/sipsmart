import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const {
      user_id,
      user_email,
      items,
      subtotal,
      delivery_fee,
      total,
      delivery_address,
      payment_method,
      payment_phone,
    } = body;

    if (!user_id || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: "user_id and items are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          user_email: user_email || "",
          items,
          subtotal: subtotal || 0,
          delivery_fee: delivery_fee || 2.0,
          total: total || 0,
          status: "placed",
          delivery_address: delivery_address || {},
          payment_method: payment_method || "ecocash",
          payment_phone: payment_phone || "",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

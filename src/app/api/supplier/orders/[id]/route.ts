import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, estimated_delivery, supplier_notes, supplier_id } = await request.json();
    const supabase = createAdminClient();

    const update: Record<string, unknown> = {};
    if (status) update.status = status;
    if (estimated_delivery) update.estimated_delivery = estimated_delivery;
    if (supplier_notes) update.supplier_notes = supplier_notes;
    if (supplier_id) update.supplier_id = supplier_id;
    if (status === "accepted") update.accepted_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("orders").update(update).eq("id", id).select().single();
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

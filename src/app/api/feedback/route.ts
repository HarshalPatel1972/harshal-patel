import { supabase } from "@/lib/supabase";
import { isAdminRequest } from "@/lib/adminAuth";
import { parseFeedback } from "@/lib/feedbackValidation";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Supabase Select Error:", { code: error.code, message: error.message, hint: error.hint });
      throw error;
    }
    
    // Map snake_case from DB back to camelCase for frontend consistency
    const formatted = (data || []).map((entry: any) => ({
      ...entry,
      userName: entry.user_name
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Feedback API GET Error:", { message: error?.message });
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseFeedback(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const entry = parsed.value;

    // Map camelCase to snake_case for DB
    // Return the actual inserted data (including the ID Supabase used) in a single round-trip
    const { data: insertedData, error } = await supabase
      .from('feedbacks')
      .insert([{
        id: entry.id,
        timestamp: Date.now(), // server clock, not whatever the client claims
        type: entry.type,
        message: entry.message,
        user_name: entry.userName,
        // leave these out when empty so the column defaults still apply
        ...(entry.color ? { color: entry.color } : {}),
        ...(entry.status ? { status: entry.status } : {}),
      }])
      .select('*')
      .single();

    if (error) {
      console.error("Supabase Insert Error:", { code: error.code, message: error.message, hint: error.hint });
      return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error: any) {
    console.error("Feedback API POST Error:", { message: error?.message });
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Security Gate: Only allow deletion if the key matches the secret environment variable
    if (!isAdminRequest(request)) {
      return NextResponse.json({ error: "Unauthorized: Invalid Security Key" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const { error, count } = await supabase
      .from('feedbacks')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error("Supabase Delete Error:", { code: error.code, message: error.message, hint: error.hint });
      throw error;
    }

    if (count === 0) {
      return NextResponse.json({ error: "No matching record found to delete. This usually means the record is already gone or permissions are missing." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Feedback API DELETE Error:", { message: error?.message });
    return NextResponse.json({ error: "Failed to erase feedback" }, { status: 500 });
  }
}

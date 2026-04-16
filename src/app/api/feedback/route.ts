import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Supabase Select Error:", error);
      throw error;
    }
    
    // Map snake_case from DB back to camelCase for frontend consistency
    const formatted = (data || []).map((entry: any) => ({
      ...entry,
      userName: entry.user_name
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Feedback API GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json();
    
    // Map camelCase to snake_case for DB
    const { error } = await supabase
      .from('feedbacks')
      .insert([{
        id: entry.id,
        timestamp: entry.timestamp,
        type: entry.type,
        message: entry.message,
        user_name: entry.userName,
        color: entry.color,
        status: entry.status
      }]);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Return the actual inserted data (including the ID Supabase used)
    const { data: insertedData } = await supabase
      .from('feedbacks')
      .select('*')
      .eq('timestamp', entry.timestamp)
      .limit(1)
      .single();

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error: any) {
    console.error("Feedback API POST Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save feedback" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const key = searchParams.get("key");

    // Security Gate: Only allow deletion if the key matches the secret environment variable
    if (key !== process.env.NEXT_PUBLIC_ADMIN_KEY) {
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
      console.error("Supabase Delete Error:", error);
      throw error;
    }

    if (count === 0) {
      return NextResponse.json({ error: "No matching record found to delete. This usually means the record is already gone or permissions are missing." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Feedback API DELETE Error:", error);
    return NextResponse.json({ error: error.message || "Failed to erase feedback" }, { status: 500 });
  }
}

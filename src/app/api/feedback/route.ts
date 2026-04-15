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
      throw error;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API POST Error:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

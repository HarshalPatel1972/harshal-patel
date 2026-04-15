import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

const FEEDBACK_KEY = "portfolio_feedback_v1";

export async function GET() {
  try {
    // Fetch all feedback entries from the Redis list
    const feedbacks = await kv.lrange(FEEDBACK_KEY, 0, -1);
    return NextResponse.json(feedbacks || []);
  } catch (error) {
    console.error("KV GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json();
    
    // Push new entry to the front of the list
    await kv.lpush(FEEDBACK_KEY, entry);
    
    // Keep only the last 100 entries to optimize performance
    await kv.ltrim(FEEDBACK_KEY, 0, 99);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("KV POST Error:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}

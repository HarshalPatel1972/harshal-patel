import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * SOUL REGISTRY V4: Robust Human-Only Counting
 * Blocks bots, crawlers, and system checks to ensure realistic counts.
 */

const BOT_KEYWORDS = [
  'bot', 'spider', 'crawl', 'headless', 'lighthouse', 'inspect', 
  'axios', 'node-fetch', 'python', 'curl', 'wget', 'postman', 
  'vercel', 'ping', 'health', 'checker', 'uptimerobot'
];

// Pre-compiled regex for faster string matching, avoiding O(n) Array.some operations on every request
const BOT_REGEX = new RegExp(BOT_KEYWORDS.join('|'), 'i');

export async function GET(req: NextRequest) {
    try {
        // RESET COMMAND (ONE-TIME RITUAL)
        if (req.nextUrl.searchParams.get('reset') === '1') {
            await kv.del('portfolio_v3_unique_sessions');
            await kv.del('portfolio_v3_total_hits');
            return NextResponse.json({ success: true, status: 'VOID_INVOKED_STATS_PURGED' });
        }

        const uniqueCount = await kv.scard('portfolio_v3_unique_sessions');
        const totalHits = await kv.get('portfolio_v3_total_hits') || 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits: Number(totalHits),
            status: 'DOMAIN_OBSERVED'
        });
    } catch (error) {
        return NextResponse.json({ success: false, uniqueCount: 0, totalHits: 0 }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userAgent = req.headers.get('user-agent') || 'unknown';
        
        // 1. FILTER BOTS: If User-Agent contains bot keywords, we silently ignore the increment
        if (BOT_REGEX.test(userAgent)) {
            return NextResponse.json({ success: true, status: 'SPECTRE_DETECTED_IGNORING' });
        }

        const { cid } = await req.json();
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'Anonymous';
        
        // 2. PRIVACY HASHING
        const identitySource = cid || ip;
        const hash = crypto
            .createHash('sha256')
            .update(identitySource + (process.env.APP_SECRET || 'v1_resonance'))
            .digest('hex');

        // 3. ATOMIC RITUAL: Increment only for humans (Batched to reduce network latency)
        const pipeline = kv.pipeline();
        pipeline.sadd('portfolio_v3_unique_sessions', hash);
        pipeline.incr('portfolio_v3_total_hits');
        pipeline.scard('portfolio_v3_unique_sessions');
        pipeline.get('portfolio_v3_total_hits');
        
        const results = await pipeline.exec();

        // pipeline.exec() returns results in a flat array, e.g. [null, null, uniqueCount, totalHits] with ioredis, but wait...
        // Actually, since this is using ioredis under the hood but memory explicitly warns:
        // "Unlike ioredis, results from kv.pipeline().exec() are returned as a flat array of results (e.g., [result1, result2]), not an array of [error, result] tuples."
        // Wait, looking at src/lib/kv.ts, we import ioredis, not @vercel/kv.
        // Let's handle both cases dynamically to be safe.
        const uniqueCount = results && results[2] ? (Array.isArray(results[2]) ? results[2][1] : results[2]) : 0;
        const totalHits = results && results[3] ? (Array.isArray(results[3]) ? results[3][1] : results[3]) : 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount: Number(uniqueCount),
            totalHits: Number(totalHits),
            status: 'SOUL_BOUND'
        });
    } catch (error) {
        console.error('[SOUL_REGISTRY] RITUAL_FAILED', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

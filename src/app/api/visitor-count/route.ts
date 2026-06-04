import { kv, redis } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * SOUL REGISTRY V4: Robust Human-Only Counting
 * Blocks bots, crawlers, and system checks to ensure realistic counts.
 */

const BOT_REGEX = /bot|spider|crawl|headless|lighthouse|inspect|axios|node-fetch|python|curl|wget|postman|vercel|ping|health|checker|uptimerobot/i;

export async function GET(req: NextRequest) {
    try {
        // RESET COMMAND (ONE-TIME RITUAL)
        if (req.nextUrl.searchParams.get('reset') === '1') {
            await kv.del('portfolio_v3_unique_sessions');
            await kv.del('portfolio_v3_total_hits');
            return NextResponse.json({ success: true, status: 'VOID_INVOKED_STATS_PURGED' });
        }

        // ⚡ Bolt: Pipeline Redis commands to reduce network round-trips
        const pipeline = redis.pipeline();
        pipeline.scard('portfolio_v3_unique_sessions');
        pipeline.get('portfolio_v3_total_hits');
        const results = await pipeline.exec();

        const extract = (res: [Error | null, any]) => res[1];
        const uniqueCount = results ? (extract(results[0]) as number) : 0;
        const totalHits = results ? (extract(results[1]) as string) || 0 : 0;

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
        // ⚡ Bolt: Using a single compiled regex outside the request handler is faster than Array.some
        const isBot = BOT_REGEX.test(userAgent);
        if (isBot) {
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

        // 3. ATOMIC RITUAL: Increment only for humans
        // ⚡ Bolt: Pipeline write and read operations to execute in a single round-trip
        const pipeline = redis.pipeline();
        pipeline.sadd('portfolio_v3_unique_sessions', hash);
        pipeline.incr('portfolio_v3_total_hits');
        pipeline.scard('portfolio_v3_unique_sessions');
        pipeline.get('portfolio_v3_total_hits');
        const results = await pipeline.exec();
        
        const extract = (res: [Error | null, any]) => res[1];
        const uniqueCount = results ? (extract(results[2]) as number) : 0;
        const totalHits = results ? (extract(results[3]) as string) || 0 : 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits: Number(totalHits),
            status: 'SOUL_BOUND'
        });
    } catch (error) {
        console.error('[SOUL_REGISTRY] RITUAL_FAILED', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

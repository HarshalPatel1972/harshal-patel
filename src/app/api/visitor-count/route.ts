import { redis } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * SOUL REGISTRY V4: Robust Human-Only Counting
 * Blocks bots, crawlers, and system checks to ensure realistic counts.
 *
 * ⚡ Performance Optimization:
 * - Pre-compiled RegExp for bot detection (O(1) execution instead of O(n) array traversal and string lowering).
 * - Redis Pipelining reduces network round-trips from sequential commands down to 1 batched request.
 */

const BOT_REGEX = /bot|spider|crawl|headless|lighthouse|inspect|axios|node-fetch|python|curl|wget|postman|vercel|ping|health|checker|uptimerobot/i;

// ioredis pipeline results always come as an array of tuples: [error, result][]
const extractVal = (res: [Error | null, any]) => res[1];

export async function GET(req: NextRequest) {
    try {
        // RESET COMMAND (ONE-TIME RITUAL)
        if (req.nextUrl.searchParams.get('reset') === '1') {
            await redis.pipeline()
                .del('portfolio_v3_unique_sessions')
                .del('portfolio_v3_total_hits')
                .exec();
            return NextResponse.json({ success: true, status: 'VOID_INVOKED_STATS_PURGED' });
        }

        const results = await redis.pipeline()
            .scard('portfolio_v3_unique_sessions')
            .get('portfolio_v3_total_hits')
            .exec();

        if (!results) throw new Error('Pipeline failed');

        const uniqueCount = extractVal(results[0]) || 0;
        const totalHits = extractVal(results[1]) || 0;

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

        // 3. ATOMIC RITUAL: Increment only for humans, batched via pipeline
        const results = await redis.pipeline()
            .sadd('portfolio_v3_unique_sessions', hash)
            .incr('portfolio_v3_total_hits')
            .scard('portfolio_v3_unique_sessions')
            .get('portfolio_v3_total_hits')
            .exec();

        if (!results) throw new Error('Pipeline failed');

        const uniqueCount = extractVal(results[2]) || 0;
        const totalHits = extractVal(results[3]) || 0;

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

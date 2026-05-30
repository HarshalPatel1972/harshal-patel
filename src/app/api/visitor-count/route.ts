import { kv, redis } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * SOUL REGISTRY V4: Robust Human-Only Counting
 * Blocks bots, crawlers, and system checks to ensure realistic counts.
 * Optimized with pre-compiled RegExp and Redis pipelining for lower latency.
 */

const BOT_REGEX = /bot|spider|crawl|headless|lighthouse|inspect|axios|node-fetch|python|curl|wget|postman|vercel|ping|health|checker|uptimerobot/i;

// Helper to extract values from Redis pipeline results
const extractResult = (res: [Error | null, any]) => res[1];

export async function GET(req: NextRequest) {
    try {
        // RESET COMMAND (ONE-TIME RITUAL)
        if (req.nextUrl.searchParams.get('reset') === '1') {
            const pipeline = redis.pipeline();
            pipeline.del('portfolio_v3_unique_sessions');
            pipeline.del('portfolio_v3_total_hits');
            await pipeline.exec();
            return NextResponse.json({ success: true, status: 'VOID_INVOKED_STATS_PURGED' });
        }

        const pipeline = redis.pipeline();
        pipeline.scard('portfolio_v3_unique_sessions');
        pipeline.get('portfolio_v3_total_hits');

        const results = await pipeline.exec();
        if (!results) throw new Error("Pipeline execution failed");

        const uniqueCount = extractResult(results[0]) || 0;
        const totalHits = extractResult(results[1]) || 0;

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
        
        // 1. FILTER BOTS: Pre-compiled RegExp avoids array iteration and string manipulation
        if (BOT_REGEX.test(userAgent)) {
            return NextResponse.json({ success: true, status: 'SPECTRE_DETECTED_IGNORING' });
        }

        const { cid } = await req.json();
        // Use req.ip to prevent X-Forwarded-For spoofing as per memory guidelines
        const ip = req.ip || 'Anonymous';
        
        // 2. PRIVACY HASHING
        const identitySource = cid || ip;
        const hash = crypto
            .createHash('sha256')
            .update(identitySource + (process.env.APP_SECRET || 'v1_resonance'))
            .digest('hex');

        // 3. ATOMIC RITUAL: Increment only for humans using Redis Pipeline
        const pipeline = redis.pipeline();
        pipeline.sadd('portfolio_v3_unique_sessions', hash);
        pipeline.incr('portfolio_v3_total_hits');
        pipeline.scard('portfolio_v3_unique_sessions');
        pipeline.get('portfolio_v3_total_hits');
        
        const results = await pipeline.exec();
        if (!results) throw new Error("Pipeline execution failed");

        const uniqueCount = extractResult(results[2]) || 0;
        const totalHits = extractResult(results[3]) || 0;

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

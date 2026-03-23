import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Live Visitor Tracking Engine (IP-Based)
 * Ensures 1:1 unique counting without storing raw IP data.
 */
export async function GET(req: NextRequest) {
    // Force Node.js runtime for Redis stability
    try {
        // 0. Connection Diagnostic
        if (!process.env.REDIS_URL && !process.env.STORAGE_KV_URL && !process.env.KV_REST_API_URL) {
            console.error('[HUD_SYSTEM] ENVIRONMENTAL_FAILURE: No Redis connection string.');
            return NextResponse.json({ success: false, error: 'NO_REDIS_CONFIG' }, { status: 500 });
        }

        // 1. Extract and Sanitize Global IP (Take the first one in the chain)
        let ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'Anonymous';
        
        if (ip.includes(':') && !ip.includes('[')) { // Avoid stripping IPv6
             ip = ip.split(':')[0];
        }

        // 2. Identify Action (Should we count this or just watch?)
        const shouldIncr = req.nextUrl.searchParams.get('incr') === '1';

        // 3. SHA-256 Hash for privacy protection
        const hash = crypto
            .createHash('sha256')
            .update(ip + (process.env.APP_SECRET || 'static_v1_salt'))
            .digest('hex');

        // 4. Write Phase (ONLY if specifically requested)
        if (shouldIncr) {
            await kv.sadd('portfolio_v3_unique_sessions', hash);
            await kv.incr('portfolio_v3_total_hits');
        }
        
        // 5. Read Phase (Always happens)
        const uniqueCount = await kv.scard('portfolio_v3_unique_sessions');
        const totalHits = await kv.get('portfolio_v3_total_hits') || 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits: Number(totalHits),
            timestamp: Date.now()
        });
    } catch (error: any) {
        console.error('[VISITOR_SYSTEM_FAILURE]', error);
        return NextResponse.json({ 
            success: false, 
            uniqueCount: 0, 
            totalHits: 0,
            error: error.message || 'INTERNAL_SERVER_ERROR',
            tip: 'If LOCAL: run "vercel env pull". If PROD: redeploy on Vercel.'
        }, { status: 500 });
    }
}

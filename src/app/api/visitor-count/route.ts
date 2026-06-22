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

export async function GET(req: NextRequest) {
    try {
        // RESET COMMAND (ONE-TIME RITUAL)
        if (req.nextUrl.searchParams.get('reset') === '1') {
            const pipe = kv.pipeline();
            pipe.del('portfolio_v3_unique_sessions');
            pipe.del('portfolio_v3_total_hits');
            await pipe.exec();
            return NextResponse.json({ success: true, status: 'VOID_INVOKED_STATS_PURGED' });
        }

        const pipe = kv.pipeline();
        pipe.scard('portfolio_v3_unique_sessions');
        pipe.get('portfolio_v3_total_hits');
        const results = await pipe.exec();

        const uniqueCount = Number(results[0]) || 0;
        const totalHits = Number(results[1]) || 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits,
            status: 'DOMAIN_OBSERVED'
        });
    } catch (error) {
        return NextResponse.json({ success: false, uniqueCount: 0, totalHits: 0 }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const userAgent = req.headers.get('user-agent')?.toLowerCase() || 'unknown';
        
        // 1. FILTER BOTS: If User-Agent contains bot keywords, we silently ignore the increment
        const isBot = BOT_KEYWORDS.some(keyword => userAgent.includes(keyword));
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
        const pipe = kv.pipeline();
        pipe.sadd('portfolio_v3_unique_sessions', hash);
        pipe.incr('portfolio_v3_total_hits');
        pipe.scard('portfolio_v3_unique_sessions');
        pipe.get('portfolio_v3_total_hits');

        const results = await pipe.exec();
        
        const uniqueCount = Number(results[2]) || 0;
        const totalHits = Number(results[3]) || 0;

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits,
            status: 'SOUL_BOUND'
        });
    } catch (error) {
        console.error('[SOUL_REGISTRY] RITUAL_FAILED', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

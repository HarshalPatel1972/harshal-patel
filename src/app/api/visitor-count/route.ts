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
        await kv.sadd('portfolio_v3_unique_sessions', hash);
        await kv.incr('portfolio_v3_total_hits');
        
        const uniqueCount = await kv.scard('portfolio_v3_unique_sessions');
        const totalHits = await kv.get('portfolio_v3_total_hits') || 0;

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

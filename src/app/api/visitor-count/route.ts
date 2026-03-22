import { kv } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Live Visitor Tracking Engine (IP-Based)
 * Ensures 1:1 unique counting without storing raw IP data.
 */
export async function GET(req: NextRequest) {
    try {
        // 1. Extract IP for unique identification
        const ip = req.headers.get('x-forwarded-for') || 'Anonymous';
        
        // 2. SHA-256 Hash for privacy protection
        const hash = crypto
            .createHash('sha256')
            .update(ip + (process.env.APP_SECRET || 'static_v1_salt'))
            .digest('hex');

        // 3. Increment "Unique" set in our Redis cloud store
        // We use a Set ('sadd') to ensure same user isn't counted twice
        await kv.sadd('portfolio_v3_unique_sessions', hash);
        
        // 4. Record Total Hits (Every page load)
        const totalHits = await kv.incr('portfolio_v3_total_hits');
        
        // 5. Retrieve current analytics
        const uniqueCount = await kv.scard('portfolio_v3_unique_sessions');

        return NextResponse.json({ 
            success: true, 
            uniqueCount, 
            totalHits,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('[VISITOR_SYSTEM_FAILURE]', error);
        return NextResponse.json({ 
            success: false, 
            uniqueCount: 0, 
            totalHits: 0 
        }, { status: 500 });
    }
}

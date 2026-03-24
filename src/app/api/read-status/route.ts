import { redis } from '@/lib/kv';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * SOUL MEMORY REGISTRY: Persistent Fact Status
 * Tracks which users have read which ofuda facts.
 */

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const cid = searchParams.get('cid');
        
        if (!cid) return NextResponse.json({ readIds: [] });

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'Anonymous';
        const hash = crypto
            .createHash('sha256')
            .update(cid + ip + (process.env.APP_SECRET || 'v1_resonance'))
            .digest('hex');

        // Retrieve the set of read IDs for this specific soul
        const readIdsArr = await redis.smembers(`soul_read_facts:${hash}`);
        const readIds = readIdsArr.map(id => parseInt(id, 10));

        return NextResponse.json({ success: true, readIds });
    } catch (error) {
        return NextResponse.json({ success: false, readIds: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { cid, factId } = await req.json();
        if (!cid || factId === undefined) {
             return NextResponse.json({ success: false, error: 'IDENTITY_MISSING' }, { status: 400 });
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'Anonymous';
        const hash = crypto
            .createHash('sha256')
            .update(cid + ip + (process.env.APP_SECRET || 'v1_resonance'))
            .digest('hex');

        // Commit to eternal memory
        await redis.sadd(`soul_read_facts:${hash}`, factId.toString());

        return NextResponse.json({ success: true, status: 'SOUL_SYNCHRONIZED' });
    } catch (error) {
        console.error('[SOUL_MEMORY] SYNC_FAILED', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { syncRepository } from '@/lib/repositories/syncRepositories';

export const maxDuration = 300;

// POST /api/repositories/sync
export async function POST(request: NextRequest) {
	try {
		const result = await syncRepository();

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json(
			{
				success: true,
				message: result.message,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error in sync endpoint:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

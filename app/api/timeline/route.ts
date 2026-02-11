import { NextResponse } from 'next/server';
import { GetAllRepositories } from '@/lib/db/repository.db';
import { dbConnect } from '@/lib/db/db';
import { combineTimeLine } from '@/app/utils/combineTimeLine';

export async function GET() {
	await dbConnect();
	try {
		const result = await GetAllRepositories();
		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}
		const timeline = combineTimeLine(result.data || []);

		return NextResponse.json([...timeline], { status: 200 });
	} catch (error) {
		console.error('Error in GET /api/timeline:', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

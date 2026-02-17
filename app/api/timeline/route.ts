import { NextRequest, NextResponse } from 'next/server';
import { GetAllRepositories } from '@/lib/db/repository.db';
import { dbConnect } from '@/lib/db/db';
import { combineTimeLine } from '@/app/utils/combineTimeLine';

export async function GET(request: NextRequest) {
	await dbConnect();
	// Time Line sync with commits pushed to git hub. Every time app loads time line or portfolio loads time line,
	// it is updated.
	// I need to change update till day early as sync can be triggered in the morning and creates the article but later on this
	// day there is more commits but they are not saved as app sees that there is article already.
	// Sinc should be run with one day delley. If sync is run now ( 10:00am ) it should sync repos till yeasterday 23:59.
	const baseUrl = new URL(request.url).origin;
	fetch(`${baseUrl}/api/repositories/sync`, {
		method: 'POST',
	});

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

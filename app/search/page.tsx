'use client';
import SearchRepository from '@/app/search/SearchRepository';
import DisplayArticle from '@/app/search/DisplayArticle';
import RepoStatusPanel from './RepoStatusPanel';
import PageBaseLayout from '../pagesBaseLayout/PageBaseLayout';

export default function Page() {
	return (
		<PageBaseLayout>
			<div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-3'>
				<SearchRepository />
				<RepoStatusPanel />
			</div>
			<DisplayArticle />
		</PageBaseLayout>
	);
}

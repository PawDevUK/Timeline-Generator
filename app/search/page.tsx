'use client';
import React from 'react';
import SearchRepository from '@/app/search/SearchRepository';
import DisplayArticle from '@/app/search/DisplayArticle';
export default function Page() {
	return (
		<div className='flex'>
			<SearchRepository />
			<DisplayArticle></DisplayArticle>
		</div>
	);
}

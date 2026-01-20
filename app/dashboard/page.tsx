'use client';
import React from 'react';
import GenerateArticle from '@/app/dashboard/generateArticle';
import DisplayArticle from '@/app/dashboard/displayArticle';
export default function Page() {
	return (
		<div>
			<GenerateArticle />
			<DisplayArticle></DisplayArticle>
		</div>
	);
}

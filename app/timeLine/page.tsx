'use client';
import React, { useRef, useEffect, useState } from 'react';
import Header from '@/app/components/common/Header';
import { combineTimeLine } from '@/app/utils/combineTimeLine';
import { Repository } from '@/types/repository.types';
import PageBaseLayout from '@/app/components/PageBaseLayout';

type Article = {
	_id?: string;
	title: string;
	date: string;
	description: string;
};

const TimelineList = () => {
	const [articles, setArticles] = useState<Article[]>([]);
	const scrollRef = useRef(null);

	useEffect(() => {
		fetch('/api/repositories')
			.then((res) => res.json())
			.then((data) => {
				const allArticles = combineTimeLine(data.repositories || []);
				setArticles(allArticles);
			})
			.catch((err) => {
				console.error('Error fetching articles:', err);
			});
	}, []);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		const slider = scrollRef.current as HTMLDivElement | null;
		if (!slider) return;
		slider.style.cursor = 'grabbing';
		slider.style.userSelect = 'none';
		const startY = e.pageY - slider.offsetTop;
		const scrollTop = slider.scrollTop;
		const handleMouseMove = (e: MouseEvent) => {
			e.preventDefault();
			const y = e.pageY - slider.offsetTop;
			const walk = (y - startY) * 2;
			slider.scrollTop = scrollTop - walk;
		};
		const handleMouseUp = () => {
			slider.style.cursor = 'grab';
			slider.style.userSelect = 'auto';
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleDelete = async (id: string) => {
		await fetch(`/api/repositories/articles/${id}`, { method: 'DELETE' });
		// Refresh articles
		fetch('/api/repositories')
			.then((res) => res.json())
			.then((data) => {
				const allArticles = combineTimeLine(data.repositories || []);
				setArticles(allArticles);
			});
	};

	return (
		<PageBaseLayout>
			<section className='bg-gray-50 py-6 md:py-10'>
				<div className='max-w-2xl mx-auto'>
					<div
						ref={scrollRef}
						onMouseDown={handleMouseDown}
						className='ml-0 sm:ml-2 pl-1 max-h-[500px] overflow-y-auto overflow-x-hidden cursor-grab scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
						style={{ WebkitOverflowScrolling: 'touch' }}>
						<div className='relative'>
							{/* Timeline vertical line */}
							<div className='absolute left-2 top-0 h-full w-0.5 bg-gray-300' />
							{articles.map((article, articleIndex) => (
								<div key={article._id || articleIndex} className={`relative pl-6 sm:pl-12 pr-2 sm:pr-6 ${articleIndex !== articles.length - 1 ? 'mb-8' : ''}`}>
									{/* Marker */}
									<span className='absolute left-0 top-3 w-3 h-3 rounded-full border-2 border-gray-50 bg-blue-500' style={{ zIndex: 1 }} />
									{/* Date Header */}
									<Header>{article.title}</Header>
									<button className='ml-2 px-2 py-1 bg-red-500 text-white rounded' onClick={() => article._id && handleDelete(article._id)}>
										Delete
									</button>
									<div className='text-sm text-gray-500 mb-2 font-bold'>{article.date}</div>
									{/* Description */}
									<p className='text-gray-700 text-sm'>{article.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</PageBaseLayout>
	);
};

export default TimelineList;

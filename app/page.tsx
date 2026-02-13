'use client';
import type { FC, ReactNode } from 'react';
import { RefreshCcw, KeySquare, BrainCircuit, ChartBar, CloudCog, DatabaseBackup } from 'lucide-react';
import PageBaseLayout from '@/app/components/PageBaseLayout';
const FeatureCard: FC<{
	icon: ReactNode;
	title: string;
	description: string;
}> = ({ icon, title, description }) => (
	<div className='card-panel'>
		<div className='flex items-start gap-2'>
			<span className='main-color shrink-0'>{icon}</span>
			<div>
				<h3 className='text-gray-900 font-semibold text-base sm:text-lg leading-tight mb-1.5'>{title}</h3>
				<p className='text-gray-600 text-md leading-relaxed '>{description}</p>
			</div>
		</div>
	</div>
);

export default function Home() {
	const iconSize = 25;
	return (
		<PageBaseLayout>
			<div className='card-panel mb-6'>
				<h1 className='text-gray-900 font-semibold text-xl md:text-2xl leading-tight mb-3'>Time Line Generator </h1>
				<p className='text-gray-600 text-md leading-relaxed'>
					Time Line Generator (TLG) is a full-stack Next.js application that automatically tracks GitHub repositories and generates AI-powered daily summaries of
					development activity. Built with TypeScript, TLG fetches commit history from GitHub, analyzes development patterns, and uses OpenAI&apos;s ChatGPT API to create
					human-readable articles that document your coding journey. The application features secure authentication, repository management, and an interactive timeline
					interface for browsing your development history.
				</p>
			</div>
			<div className='md:col-span-7 lg:col-span-8'>
				<div className='grid sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-6'>
					<FeatureCard
						icon={<RefreshCcw size={iconSize} />}
						title='Automated Repository Tracking'
						description='Automatically fetches and monitors GitHub repository commits with intelligent date filtering and pagination'
					/>
					<FeatureCard
						icon={<BrainCircuit size={iconSize} />}
						title='AI-Powered Summaries'
						description="Generates professional, human-readable summary articles using OpenAI's GPT API with customizable tone and length"
					/>
					<FeatureCard
						icon={<KeySquare size={iconSize} />}
						title='Secure Authentication'
						description='Multi-provider authentication via NextAuth.js supporting GitHub OAuth and credentials-based login'
					/>
					<FeatureCard
						icon={<ChartBar size={iconSize} />}
						title='Interactive Dashboard'
						description='Modern web interface for searching repositories, managing tracked repos, and visualizing development timelines'
					/>
					<FeatureCard
						icon={<CloudCog size={iconSize} />}
						title='RESTful API'
						description='Comprehensive API endpoints for commits, repository management, article CRUD operations, and user management'
					/>
					<FeatureCard
						icon={<DatabaseBackup size={iconSize} />}
						title='Database Integration'
						description='MongoDB with Mongoose ODM for persistent storage of users, repositories, and generated timeline articles'
					/>
				</div>
			</div>
		</PageBaseLayout>
	);
}

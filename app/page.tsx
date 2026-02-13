'use client';
import type { FC } from 'react';

const FeatureCard: FC<{
	icon: string;
	title: string;
	description: string;
}> = ({ icon, title, description }) => (
	<div className='card-panel'>
		<div className='flex items-start gap-2'>
			<div className='text-xl sm:text-3xl mt-1'>{icon}</div>
			<div>
				<h3 className='text-gray-900 font-semibold text-base sm:text-lg leading-tight mb-1.5'>{title}</h3>
				<p className='text-gray-600 text-sm leading-relaxed line-clamp-3'>{description}</p>
			</div>
		</div>
	</div>
);

export default function Home() {
	return (
		<div className='md:col-span-7 lg:col-span-8'>
			<div className='grid sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:gap-6'>
				<FeatureCard
					icon='🔄'
					title='Automated Repository Tracking'
					description='Automatically fetches and monitors GitHub repository commits with intelligent date filtering and pagination'
				/>
				<FeatureCard
					icon='✨'
					title='AI-Powered Summaries'
					description="Generates professional, human-readable summary articles using OpenAI's GPT API with customizable tone and length"
				/>
				<FeatureCard
					icon='🔒'
					title='Secure Authentication'
					description='Multi-provider authentication via NextAuth.js supporting GitHub OAuth and credentials-based login'
				/>
				<FeatureCard
					icon='📊'
					title='Interactive Dashboard'
					description='Modern web interface for searching repositories, managing tracked repos, and visualizing development timelines'
				/>
				<FeatureCard
					icon='🛠️'
					title='RESTful API'
					description='Comprehensive API endpoints for commits, repository management, article CRUD operations, and user management'
				/>
				<FeatureCard
					icon='🗄️'
					title='Database Integration'
					description='MongoDB with Mongoose ODM for persistent storage of users, repositories, and generated timeline articles'
				/>
			</div>
		</div>
	);
}

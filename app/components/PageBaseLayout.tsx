import React from 'react';

export default function PageBaseLayout({ children }: { children: React.ReactNode }) {
	return <div className='px-10 py-12'>{children}</div>;
}

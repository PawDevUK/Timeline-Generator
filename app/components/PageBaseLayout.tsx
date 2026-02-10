import React from 'react';

export default function PageBaseLayout({ children }: { children: React.ReactNode }) {
	return <div className='p-10 m-10'>{children}</div>;
}

'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ formattedName }) {
    const router = useRouter();

    function handleBack(e) {
        e.preventDefault();
        router.push(`/${formattedName}`);
        router.refresh();
    }

    return (
        <button onClick={handleBack} className="group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="max-sm:w-6 max-sm:h-6 w-7 h-7 sm:ml-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
            <span className="max-sm:hidden overflow-hidden opacity-0 max-w-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-1000 ease-in-out">
                <span className="pl-2 whitespace-nowrap">Back</span>
            </span>
        </button>
    );
}
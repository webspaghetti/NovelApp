import { useEffect } from 'react';

export default function SetUserProgress({ userID, novelID, currentChapter }) {
    useEffect(() => {
        async function updateProgress() {
            if (novelID === undefined) return;

            try {
                const response = await fetch('/api/user_progress', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        novelId: novelID,
                        currentChapter: currentChapter
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user progress');
                }

            } catch (error) {
                console.error('Error updating user progress:', error);
            }
        }

        updateProgress();
    }, [userID, novelID, currentChapter]);

    return null;  // This component doesn't render anything
}
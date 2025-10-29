'use client';

import { useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CircularProgress from "@mui/material/CircularProgress";


export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();


    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    newPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Password reset failed');
            }

            // Sign in again with the new password to get a fresh session
            const username = session.user.username;

            await signOut({ redirect: false });

            const result = await signIn('credentials', {
                username,
                password: newPassword,
                redirect: false,
            });

            if (result?.ok) {
                router.push('/');
                router.refresh();
            } else {
                setError('Password updated but re-login failed. Please login manually.');
            }
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full mx-2 p-6 bg-black/40 border-2 border-secondary/10 shadow-lg rounded-lg">
                <h1 className="max-sm:text-2xl text-3xl font-bold text-center mb-6 text-secondary link_outline select-none">
                    Reset Password
                </h1>
                <p className="text-center mb-6 text-secondary select-none">
                    Please set a new password for your account.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block max-sm:text-base text-lg font-semibold mb-2 text-secondary">
                            New Password
                        </label>
                        <div className="border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary">
                            <input
                                type="password"
                                value={newPassword}
                                placeholder="Enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full select-none flex-1 bg-transparent border-none text-secondary px-2 py-1 leading-tight focus:outline-none caret-primary placeholder-gray-500 disabled:opacity-60"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block max-sm:text-base text-lg font-semibold mb-2 text-secondary">
                            Confirm New Password
                        </label>
                        <div className="border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary">
                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm new password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full select-none flex-1 bg-transparent border-none text-secondary px-2 py-1 leading-tight focus:outline-none caret-primary placeholder-gray-500 disabled:opacity-60"
                            />
                        </div>
                    </div>
                    {error && <div className="text-red-500 mb-6 select-none text-center">{error}</div>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full justify-center p-3 text-secondary rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
                    >
                        {isLoading ? (
                            <CircularProgress sx={{ color: "#FAFAFA" }} size={28} thickness={8} />
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
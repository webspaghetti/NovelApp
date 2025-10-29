'use client';

import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CircularProgress from "@mui/material/CircularProgress";


export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Auto login after registration
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            });

            if (result.error) {
                router.push('/login');
            } else {
                router.push('/');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full mx-2 p-6 bg-black/40 border-2 border-secondary/10 shadow-lg rounded-lg">
                <h1 className="max-sm:text-2xl text-3xl font-bold text-center mb-6 text-secondary link_outline select-none">
                    Register
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block max-sm:text-base text-lg font-semibold mb-2 text-secondary">
                            Username
                        </label>
                        <div className="border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary">
                            <input
                                type="text"
                                value={username}
                                placeholder="Enter username"
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full select-none flex-1 bg-transparent border-none text-secondary px-2 py-1 leading-tight focus:outline-none caret-primary placeholder-gray-500 disabled:opacity-60"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block max-sm:text-base text-lg font-semibold mb-2 text-secondary">
                            Password
                        </label>
                        <div className="border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary">
                            <input
                                type="password"
                                value={password}
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full select-none flex-1 bg-transparent border-none text-secondary px-2 py-1 leading-tight focus:outline-none caret-primary placeholder-gray-500 disabled:opacity-60"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block max-sm:text-base text-lg font-semibold mb-2 text-secondary">
                            Confirm Password
                        </label>
                        <div className="border border-gray-700 bg-navbar rounded-lg px-2 py-2 focus-within:border-primary">
                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm password"
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
                            'Register'
                        )}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    {isLoading ? (
                        <span className="text-sm invisible">
                        Already have an account? Login
                    </span>
                    ) : (
                        <Link href={"/login"} className={"text-blue-500 text-sm hover:underline select-none"}>
                            Already have an account? Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
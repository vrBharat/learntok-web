'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { googleSignIn, clearError } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleGoogleSignIn = async () => {
        dispatch(clearError());
        const result = await dispatch(googleSignIn());
        if (googleSignIn.fulfilled.match(result)) {
            router.push('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#fdfaf6] text-black px-4 font-sans">
            <div className="w-full max-w-sm p-8 bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">learntok.in</h2>
                    <p className="text-sm font-mono text-gray-600">Sign in or create an account.</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-500 text-red-700 text-sm font-mono">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'LOADING...' : 'CONTINUE WITH GOOGLE'}
                </button>

                <div className="text-center mt-4">
                    <p className="text-sm font-mono mt-2">
                        <button
                            onClick={() => router.push('/')}
                            className="text-gray-500 hover:underline"
                        >
                            ← Back home
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

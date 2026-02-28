'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, BookOpen, Chrome } from 'lucide-react';
import { signIn, googleSignIn, clearError } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());
        const result = await dispatch(signIn({ email, password }));
        if (signIn.fulfilled.match(result)) {
            router.push('/');
        }
    };

    const handleGoogleSignIn = async () => {
        dispatch(clearError());
        const result = await dispatch(googleSignIn());
        if (googleSignIn.fulfilled.match(result)) {
            router.push('/');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <View className="w-full max-w-md gap-8 p-8 bg-surface rounded-3xl border border-border shadow-2xl">
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary p-3 rounded-2xl shadow-glow">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <Text variant="h2">Welcome Back</Text>
                    <Text variant="caption">Continue your learning journey</Text>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={18} />}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        required
                    />

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-2 text-text-tertiary">Or continue with</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="full"
                    onClick={handleGoogleSignIn}
                    className="gap-2"
                >
                    <Chrome size={20} />
                    Google
                </Button>

                <Text variant="caption" className="text-center">
                    Don't have an account?{' '}
                    <button
                        onClick={() => router.push('/auth/signup')}
                        className="text-primary font-semibold hover:underline"
                    >
                        Sign Up
                    </button>
                </Text>
            </View>
        </div>
    );
}

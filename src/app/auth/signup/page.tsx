'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, AtSign, BookOpen, Chrome } from 'lucide-react';
import { signUp, googleSignIn, clearError } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError());
        const result = await dispatch(signUp({ email, password, username, displayName }));
        if (signUp.fulfilled.match(result)) {
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
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <View className="w-full max-w-md gap-8 p-8 bg-surface rounded-3xl border border-border shadow-2xl">
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary p-3 rounded-2xl shadow-glow">
                        <BookOpen size={32} className="text-white" />
                    </div>
                    <Text variant="h2">Create Account</Text>
                    <Text variant="caption">Join the future of learning</Text>
                </div>

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                    <Input
                        label="Display Name"
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        icon={<User size={18} />}
                        required
                    />
                    <Input
                        label="Username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={<AtSign size={18} />}
                        required
                    />
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
                        Get Started
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-surface px-2 text-text-tertiary">Or join with</span>
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
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/auth/login')}
                        className="text-primary font-semibold hover:underline"
                    >
                        Log In
                    </button>
                </Text>
            </View>
        </div>
    );
}

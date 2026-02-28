'use client';

import { useAuthObserver } from '@/hooks/useAuthObserver';

export function AuthInit({ children }: { children: React.ReactNode }) {
    useAuthObserver();
    return <>{children}</>;
}

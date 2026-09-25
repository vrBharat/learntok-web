'use client';

import React from 'react';
import { Home, Search, PlusSquare, Bell, User, BookOpen } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Discover', href: '/search' },
    { icon: PlusSquare, label: 'Upload', href: '/upload' },
    { icon: Bell, label: 'Inbox', href: '/notifications' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="fixed left-0 top-0 hidden h-full w-64 border-r border-border sidebar-glass px-4 py-8 md:flex flex-col gap-8 z-50">
                <div className="flex items-center gap-2 px-2 pb-4 border-b border-border mb-4 cursor-pointer group" onClick={() => router.push('/')}>
                    <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BookOpen size={24} className="text-primary" />
                    </div>
                    <span className="text-xl font-bold text-text-primary tracking-tight">LearnTok</span>
                </div>

                <div className="flex flex-col gap-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={cn(
                                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-text-secondary hover:bg-surface-light hover:text-text-primary'
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                                <Icon size={22} className={cn('transition-transform duration-200 group-hover:scale-110', isActive && 'stroke-[2.5px]')} />
                                <span className={cn('text-base font-medium', isActive && 'font-semibold')}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto p-5 rounded-2xl bg-surface-light border border-border relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
                    <p className="text-sm font-bold text-text-primary mb-1 relative z-10">Learn Premium</p>
                    <p className="text-xs text-text-tertiary mb-4 relative z-10 leading-relaxed">Unlock advanced AI tutors and ad-free learning.</p>
                    <button className="w-full py-2.5 bg-primary text-white font-bold rounded-xl text-sm hover:bg-primary-dark transition-all shadow-glow-sm hover:shadow-glow relative z-10">
                        Upgrade Now
                    </button>
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 flex w-full items-center justify-around border-t border-border bg-background px-2 py-3 md:hidden z-50">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <button
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 min-w-[64px]',
                                isActive ? 'text-primary' : 'text-text-tertiary'
                            )}
                        >
                            <Icon size={24} className={cn(isActive && 'stroke-[2.5px]')} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </>
    );
};

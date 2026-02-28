import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar = ({ src, name, size = 'md', className }: AvatarProps) => {
    const sizes = {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-16 w-16 text-xl',
        xl: 'h-24 w-24 text-3xl',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div
            className={cn(
                'relative flex items-center justify-center overflow-hidden rounded-full bg-surface-light text-text-secondary border border-border',
                sizes[size],
                className
            )}
        >
            {src ? (
                <img src={src} alt={name} className="h-full w-full object-cover" />
            ) : (
                <span>{name ? getInitials(name) : '?'}</span>
            )}
        </div>
    );
};

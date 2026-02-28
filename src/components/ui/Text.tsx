import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'tiny';
}

export const Text = ({ children, className, variant = 'body', ...props }: TextProps) => {
    const variants = {
        h1: 'text-3xl font-bold text-text-primary',
        h2: 'text-2xl font-semibold text-text-primary',
        h3: 'text-xl font-semibold text-text-primary',
        h4: 'text-lg font-medium text-text-primary',
        body: 'text-base text-text-primary',
        caption: 'text-sm text-text-secondary',
        tiny: 'text-xs text-text-tertiary',
    };

    return (
        <p className={cn(variants[variant], className)} {...props}>
            {children}
        </p>
    );
};

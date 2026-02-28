import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'full';
    isLoading?: boolean;
}

export const Button = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white',
        outline: 'border border-border hover:bg-surface-light text-text-primary',
        ghost: 'hover:bg-surface-light text-text-secondary hover:text-text-primary',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        full: 'w-full py-3 text-base',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {children}
        </button>
    );
};

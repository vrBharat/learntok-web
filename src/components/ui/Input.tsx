import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = ({ label, error, icon, className, ...props }: InputProps) => {
    return (
        <div className="flex w-full flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        'flex h-12 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        icon && 'pl-10',
                        error && 'border-red-500 focus-visible:ring-red-500',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

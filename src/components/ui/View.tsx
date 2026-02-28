import React from 'react';
import { cn } from '@/lib/utils';

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

export const View = ({ children, className, ...props }: ViewProps) => {
    return (
        <div className={cn('flex flex-col', className)} {...props}>
            {children}
        </div>
    );
};

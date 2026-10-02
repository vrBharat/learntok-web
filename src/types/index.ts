/**
 * LearnTok Type Definitions
 * TypeScript interfaces for all data models
 */

// User Types
export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    bio: string;
    profilePic: string;
    followersCount: number;
    followingCount: number;
    videosCount: number;
    isPremium: boolean;
    isCreator: boolean;
    isAdmin: boolean;
    streak: number;
    totalWatchTime: number;
    badges: Badge[];
    totalLikesReceived: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: Date;
}

// Experience Categories
export type Category =
    | 'Career'
    | 'Moving'
    | 'Education'
    | 'Business'
    | 'Languages'
    | 'Freelancing'
    | 'Other';

// Notification Types
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
    read: boolean;
    createdAt: Date;
}

export type NotificationType =
    | 'question'
    | 'reply'
    | 'system';

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    hasMore: boolean;
    lastDoc?: any;
}

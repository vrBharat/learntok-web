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

// Video Types
export interface Video {
    id: string;
    creatorId: string;
    creator?: User;
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    category: Category;
    hashtags: string[];
    duration: number;
    likesCount: number;
    commentsCount: number;
    viewsCount: number;
    sharesCount: number;
    savesCount: number;
    status: VideoStatus;
    isLiked?: boolean;
    isSaved?: boolean;
    transcript?: string;
    aiSummary?: string;
    quiz?: Quiz;
    createdAt: Date;
    updatedAt: Date;
}

export type VideoStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

export type Category =
    | 'coding'
    | 'english'
    | 'finance'
    | 'productivity'
    | 'career'
    | 'exam-prep'
    | 'design'
    | 'communication';

// Comment Types
export interface Comment {
    id: string;
    videoId: string;
    userId: string;
    user?: User;
    text: string;
    likesCount: number;
    isLiked?: boolean;
    replies?: Comment[];
    parentId?: string;
    createdAt: Date;
}

// Like Types
export interface Like {
    id: string;
    userId: string;
    videoId: string;
    createdAt: Date;
}

// Save Types
export interface SavedVideo {
    id: string;
    userId: string;
    videoId: string;
    video?: Video;
    createdAt: Date;
}

// Follow Types
export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
}

// Watch History
export interface WatchHistory {
    id: string;
    userId: string;
    videoId: string;
    video?: Video;
    watchedAt: Date;
    duration: number;
    completed: boolean;
}

// AI Features
export interface Quiz {
    id: string;
    videoId: string;
    questions: QuizQuestion[];
    createdAt: Date;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface AISummary {
    id: string;
    videoId: string;
    summary: string;
    keyPoints: string[];
    createdAt: Date;
}

export interface DoubtQuery {
    id: string;
    userId: string;
    videoId: string;
    question: string;
    answer: string;
    createdAt: Date;
}

// Note Types
export interface Note {
    id: string;
    userId: string;
    videoId: string;
    videoTitle: string;
    text: string;
    timestampSeconds: number;
    createdAt: Date;
}

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
    | 'like'
    | 'comment'
    | 'follow'
    | 'video_approved'
    | 'video_rejected'
    | 'streak'
    | 'badge'
    | 'system';

// Report Types
export interface Report {
    id: string;
    reporterId: string;
    videoId?: string;
    commentId?: string;
    userId?: string;
    reason: ReportReason;
    description: string;
    status: ReportStatus;
    createdAt: Date;
}

export type ReportReason =
    | 'spam'
    | 'inappropriate'
    | 'harassment'
    | 'misinformation'
    | 'copyright'
    | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

// Premium Subscription
export interface Subscription {
    id: string;
    userId: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
}

export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

// Upload Progress
export interface UploadProgress {
    progress: number;
    status: 'idle' | 'uploading' | 'processing' | 'complete' | 'error';
    error?: string;
}

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

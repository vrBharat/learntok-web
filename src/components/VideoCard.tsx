'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share2, Play, Pause, Volume2, VolumeX, UserPlus, UserCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleLike, toggleSave, fetchComments, postComment, toggleCommentLike } from '@/store/slices/videoSlice';
import { toggleFollow } from '@/store/slices/userSlice';
import { Avatar } from './ui/Avatar';
import { Text } from './ui/Text';
import { View } from './ui/View';
import { CommentsModal } from './CommentsModal';
import { cn } from '@/lib/utils';
import { Video } from '@/types';
import { checkIfLiked, checkIfSaved, checkIfFollowing } from '@/services/firebase/firestore';

interface VideoCardProps {
    video: Video;
    isActive: boolean;
}

export const VideoCard = ({ video, isActive }: VideoCardProps) => {
    const [isPaused, setIsPaused] = useState(!isActive);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { comments, isCommentsLoading } = useSelector((state: RootState) => state.video);

    const [isLiked, setIsLiked] = useState(video.isLiked || false);
    const [isSaved, setIsSaved] = useState(video.isSaved || false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch(() => setIsPaused(true));
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setIsPaused(true);
            }
        }
    }, [isActive]);

    useEffect(() => {
        const checkInteractions = async () => {
            if (isAuthenticated && user && video.id) {
                const [liked, saved, following] = await Promise.all([
                    checkIfLiked(user.id, video.id),
                    checkIfSaved(user.id, video.id),
                    checkIfFollowing(user.id, video.creatorId)
                ]);
                setIsLiked(liked);
                setIsSaved(saved);
                setIsFollowing(following);
            }
        };
        checkInteractions();
    }, [isAuthenticated, user, video.id, video.creatorId]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
            setIsPaused(!isPaused);
        }
    };

    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || !user) return;
        setIsLiked(!isLiked);
        dispatch(toggleLike({
            userId: user.id,
            videoId: video.id,
            isLiked: isLiked
        }));
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || !user) return;
        setIsSaved(!isSaved);
        dispatch(toggleSave({
            userId: user.id,
            videoId: video.id,
            isSaved: isSaved
        }));
    };

    const handleFollow = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated || !user) return;
        setIsFollowing(!isFollowing);
        dispatch(toggleFollow({
            followerId: user.id,
            followingId: video.creatorId,
            isFollowing: isFollowing
        }));
    };

    const handleOpenComments = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCommentsOpen(true);
        dispatch(fetchComments(video.id));
    };

    const handleAddComment = (text: string) => {
        if (!isAuthenticated || !user) return;
        dispatch(postComment({
            videoId: video.id,
            userId: user.id,
            text
        }));
    };

    const handleToggleCommentLike = (commentId: string, isLiked: boolean) => {
        if (!isAuthenticated || !user) return;
        dispatch(toggleCommentLike({
            videoId: video.id,
            commentId,
            isLiked
        }));
    };


    return (
        <div className="video-item relative w-full h-full flex flex-col items-center justify-center py-4 bg-background">
            <View
                className="relative w-full max-w-[400px] h-full max-h-[750px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-border/50 transition-transform duration-300 hover:scale-[1.01]"
                onClick={togglePlay}
            >
                <video
                    ref={videoRef}
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={isMuted}
                />

                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6">
                    <div className="flex flex-col gap-3 max-w-[85%]">
                        <div className="flex items-center gap-3">
                            <Avatar src={video.creator?.profilePic} name={video.creator?.displayName} size="sm" className="border-2 border-primary" />
                            <div className="flex flex-col">
                                <Text className="text-white font-bold text-sm tracking-tight">{video.creator?.displayName}</Text>
                                <Text className="text-text-tertiary text-[10px]">@{video.creator?.username}</Text>
                            </div>
                            {user?.id !== video.creatorId && (
                                <button
                                    onClick={handleFollow}
                                    className={cn(
                                        "ml-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1",
                                        isFollowing
                                            ? "bg-surface-light text-text-secondary border border-border"
                                            : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                                    )}
                                >
                                    {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            )}
                        </div>

                        <Text className="text-white text-sm font-medium leading-snug line-clamp-2">
                            {video.title}
                        </Text>

                        <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-secondary/20 text-secondary border border-secondary/30 rounded text-[9px] font-bold uppercase tracking-widest">
                                {video.category}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interaction Column */}
                <div className="absolute right-4 bottom-20 flex flex-col gap-5 items-center z-10">
                    <InteractionButton
                        icon={<Heart size={24} className={cn(isLiked && "fill-red-500 text-red-500")} />}
                        count={video.likesCount}
                        onClick={handleLike}
                        active={isLiked}
                    />
                    <InteractionButton
                        icon={<MessageCircle size={24} />}
                        count={video.commentsCount}
                        onClick={handleOpenComments}
                    />
                    <InteractionButton
                        icon={<Bookmark size={24} className={cn(isSaved && "fill-accent text-accent")} />}
                        count={video.savesCount}
                        onClick={handleSave}
                        active={isSaved}
                    />
                    <InteractionButton
                        icon={<Share2 size={24} />}
                        onClick={(e) => { e.stopPropagation(); /* Share */ }}
                    />
                </div>

                {/* Play/Pause Indicator */}
                {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/40 backdrop-blur-sm p-5 rounded-full animate-in zoom-in duration-200">
                            <Play size={40} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                )}

                {/* Mute Toggle */}
                <button
                    className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </View>

            <CommentsModal
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                comments={comments[video.id] || []}
                onAddComment={handleAddComment}
                onToggleLike={handleToggleCommentLike}
                isLoading={isCommentsLoading}
            />
        </div>
    );
};

const InteractionButton = ({
    icon,
    count,
    onClick,
    active
}: {
    icon: React.ReactNode,
    count?: number,
    onClick: (e: React.MouseEvent) => void,
    active?: boolean
}) => (
    <div className="flex flex-col items-center gap-1">
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-full transition-all duration-200 group relative overflow-hidden active:scale-95",
                "bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/10",
                active && "border-red-500/50 bg-red-500/10"
            )}
        >
            <div className="relative z-10 transition-transform duration-200 group-hover:scale-110">
                {icon}
            </div>
        </button>
        {count !== undefined && (
            <span className="text-[11px] font-bold text-white drop-shadow-md">{count}</span>
        )}
    </div>
);

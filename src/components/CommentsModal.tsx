import React, { useState } from 'react';
import { X, Send, Heart } from 'lucide-react';
import { View } from './ui/View';
import { Text } from './ui/Text';
import { Avatar } from './ui/Avatar';
import { Comment } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface CommentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[];
    onAddComment: (text: string) => void;
    onToggleLike: (commentId: string, isLiked: boolean) => void;
    isLoading?: boolean;
}

export const CommentsModal = ({
    isOpen,
    onClose,
    comments,
    onAddComment,
    onToggleLike,
    isLoading
}: CommentsModalProps) => {
    const [text, setText] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAddComment(text);
        setText('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-300">
            <View className="w-full max-w-lg h-[80vh] sm:h-[600px] bg-surface rounded-t-3xl sm:rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <View className="flex-row items-center gap-2">
                        <Text variant="h3" className="text-lg">Comments</Text>
                        <div className="px-2 py-0.5 bg-primary/10 rounded-full">
                            <Text variant="tiny" className="text-primary font-bold">{comments.length}</Text>
                        </div>
                    </View>
                    <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
                    {comments.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 gap-2">
                            <Text variant="caption">No comments yet.</Text>
                            <Text variant="tiny">Be the first to share your thoughts!</Text>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-left duration-300 group/item">
                                <Avatar src={comment.user?.profilePic} name={comment.user?.displayName} size="sm" />
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Text className="text-xs font-bold text-white tracking-tight">{comment.user?.displayName || `@${comment.user?.username}`}</Text>
                                        <Text variant="tiny" className="opacity-40">
                                            {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : ''}
                                        </Text>
                                    </div>
                                    <Text className="text-sm text-text-secondary leading-relaxed bg-surface-light p-3 rounded-2xl rounded-tl-none border border-border/50">
                                        {comment.text}
                                    </Text>
                                    <div className="flex gap-4 mt-1 ml-1 items-center">
                                        <button className="text-[10px] font-bold text-text-tertiary hover:text-primary transition-colors uppercase tracking-wider">Reply</button>
                                        <button
                                            onClick={() => onToggleLike(comment.id, comment.isLiked || false)}
                                            className={cn(
                                                "flex items-center gap-1 text-[10px] font-bold transition-all uppercase tracking-wider",
                                                comment.isLiked ? "text-red-500" : "text-text-tertiary hover:text-red-500"
                                            )}
                                        >
                                            <Heart size={10} className={cn(comment.isLiked && "fill-red-500")} />
                                            {comment.likesCount > 0 ? comment.likesCount : 'Like'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-surface-light flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add an educational insight..."
                            className="w-full bg-background border border-border rounded-full py-2.5 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </View>
        </div>
    );
};

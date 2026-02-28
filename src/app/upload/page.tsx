'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X, CheckCircle2, AlertCircle, Film, FileText, Tag, Music } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { uploadVideo } from '@/services/cloudinary';
import { createVideo } from '@/services/firebase/firestore';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { View } from '@/components/ui/View';
import { Input } from '@/components/ui/Input';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES: Category[] = ['Mathematics', 'Science', 'History', 'Technology', 'Languages', 'Art', 'Business', 'Other'];

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category>('Mathematics');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return (
            <AppLayout>
                <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
                    <Upload size={64} className="text-text-tertiary opacity-20" />
                    <Text variant="h2">Share your knowledge</Text>
                    <Text variant="caption">Log in to upload educational shorts.</Text>
                    <Button variant="primary" onClick={() => router.push('/auth/login')}>Log In</Button>
                </div>
            </AppLayout>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please select a valid video file.');
        }
    };

    const handleUpload = async () => {
        if (!file || !title || !user) return;

        setIsUploading(true);
        setUploadProgress(10);
        setError(null);

        try {
            // 1. Upload to Cloudinary
            const uploadResult = await uploadVideo(file, (p) => {
                setUploadProgress(10 + (p.progress * 0.7));
            });

            if (!uploadResult.success || !uploadResult.url) {
                throw new Error(uploadResult.error || 'Cloudinary upload failed');
            }

            setUploadProgress(85);

            // 2. Create Firestore Document
            await createVideo({
                title,
                description,
                category,
                videoUrl: uploadResult.url,
                thumbnailUrl: uploadResult.thumbnailUrl || '',
                creatorId: user.id,
                likesCount: 0,
                commentsCount: 0,
                viewsCount: 0,
                sharesCount: 0,
                savesCount: 0,
                status: 'approved',
                duration: uploadResult.duration || 0,
            });

            setUploadProgress(100);
            setTimeout(() => {
                router.push('/profile');
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Failed to upload video');
            setIsUploading(false);
        }
    };

    return (
        <AppLayout>
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                <Text variant="h2" className="mb-8">Upload Video</Text>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Upload Zone */}
                    <div className="flex-1">
                        {!file ? (
                            <label className="flex flex-col items-center justify-center w-full aspect-[9/16] max-h-[600px] border-2 border-dashed border-border rounded-3xl cursor-pointer hover:border-primary/50 hover:bg-surface-light transition-all group overflow-hidden relative">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                                    <div className="p-6 bg-surface-light rounded-full border border-border group-hover:scale-110 transition-transform shadow-glow-sm">
                                        <Upload size={32} className="text-primary" />
                                    </div>
                                    <View className="items-center text-center px-8">
                                        <Text className="font-bold text-white mb-2">Select video to upload</Text>
                                        <Text variant="tiny" className="text-text-tertiary">Or drag and drop a file</Text>
                                        <Text variant="tiny" className="text-text-tertiary mt-1">MP4 or WebM, up to 60 seconds</Text>
                                    </View>
                                    <Button variant="primary" className="mt-4 pointer-events-none">Select File</Button>
                                </div>
                                <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
                            </label>
                        ) : (
                            <div className="relative aspect-[9/16] max-h-[600px] bg-black rounded-3xl overflow-hidden group border border-border">
                                <video
                                    src={URL.createObjectURL(file)}
                                    className="w-full h-full object-cover"
                                    controls
                                />
                                <button
                                    onClick={() => setFile(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2">
                                    <Film size={14} className="text-primary" />
                                    <Text variant="tiny" className="text-white font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</Text>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata Form */}
                    <div className="flex-[1.5] flex flex-col gap-6">
                        <Input
                            label="Title"
                            placeholder="What's this educational short about?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            icon={<FileText size={18} />}
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary">Description</label>
                            <textarea
                                className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                                placeholder="Provide some context for your learners..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-text-secondary flex items-center gap-2">
                                <Tag size={16} /> Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all",
                                            category === cat
                                                ? "bg-secondary border-secondary text-white shadow-glow-secondary"
                                                : "bg-surface-light border-border text-text-tertiary hover:border-text-tertiary"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                                <AlertCircle size={20} />
                                <Text className="text-sm font-medium">{error}</Text>
                            </div>
                        )}

                        {isUploading ? (
                            <div className="flex flex-col gap-3">
                                <div className="w-full bg-surface-light h-3 rounded-full overflow-hidden border border-border">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <Text variant="tiny" className="font-bold flex items-center gap-2">
                                        <div className="h-2 w-2 animate-ping rounded-full bg-primary" />
                                        {uploadProgress < 85 ? 'Uploading assets...' : uploadProgress < 100 ? 'Finalizing...' : 'Complete!'}
                                    </Text>
                                    <Text variant="tiny" className="font-mono">{Math.round(uploadProgress)}%</Text>
                                </div>
                            </div>
                        ) : (
                            <Button
                                variant="primary"
                                size="lg"
                                className="mt-4 shadow-glow"
                                disabled={!file || !title}
                                onClick={handleUpload}
                            >
                                Publish Video
                            </Button>
                        )}

                        <View className="p-4 border border-border/50 rounded-2xl bg-surface-light/30 gap-3">
                            <div className="flex items-center gap-2 text-primary">
                                <CheckCircle2 size={16} />
                                <Text className="text-xs font-bold uppercase tracking-wider">Creator Tips</Text>
                            </div>
                            <ul className="text-[11px] text-text-tertiary space-y-2 list-disc pl-4">
                                <li>Resolution: 1080x1920 (9:16 aspect ratio)</li>
                                <li>Duration: up to 60 seconds</li>
                                <li>Make the first 3 seconds count!</li>
                            </ul>
                        </View>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

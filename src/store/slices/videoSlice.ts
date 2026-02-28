/**
 * Video Slice - Manages video feed state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Video, Category, UploadProgress } from '@/types';
import {
    getVideoFeed,
    getVideo,
    likeVideo,
    unlikeVideo,
    saveVideo,
    unsaveVideo,
    incrementViewCount,
    searchVideos,
    getFollowingFeed,
} from '@/services/firebase/firestore';

interface VideoState {
    videos: Video[];
    currentIndex: number;
    isLoading: boolean;
    isRefreshing: boolean;
    hasMore: boolean;
    lastDoc: any;
    error: string | null;
    selectedCategory: Category | null;
    uploadProgress: UploadProgress;
    searchResults: Video[];
    isSearching: boolean;
    feedMode: 'forYou' | 'following';
}

const initialState: VideoState = {
    videos: [],
    currentIndex: 0,
    isLoading: false,
    isRefreshing: false,
    hasMore: true,
    lastDoc: null,
    error: null,
    selectedCategory: null,
    uploadProgress: {
        progress: 0,
        status: 'idle',
    },
    searchResults: [],
    isSearching: false,
    feedMode: 'forYou',
};

// Async Thunks
export const fetchVideos = createAsyncThunk(
    'video/fetchVideos',
    async (
        { refresh = false }: { refresh?: boolean } = {},
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as { video: VideoState };
            const lastDoc = refresh ? undefined : state.video.lastDoc;
            const category = state.video.selectedCategory || undefined;

            const result = await getVideoFeed(lastDoc, category);
            return { ...result, refresh };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchVideoById = createAsyncThunk(
    'video/fetchVideoById',
    async (videoId: string, { rejectWithValue }) => {
        try {
            const video = await getVideo(videoId);
            return video;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleLike = createAsyncThunk(
    'video/toggleLike',
    async (
        { userId, videoId, isLiked }: { userId: string; videoId: string; isLiked: boolean },
        { rejectWithValue }
    ) => {
        try {
            if (isLiked) {
                await unlikeVideo(userId, videoId);
            } else {
                await likeVideo(userId, videoId);
            }
            return { videoId, isLiked: !isLiked };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleSave = createAsyncThunk(
    'video/toggleSave',
    async (
        { userId, videoId, isSaved }: { userId: string; videoId: string; isSaved: boolean },
        { rejectWithValue }
    ) => {
        try {
            if (isSaved) {
                await unsaveVideo(userId, videoId);
            } else {
                await saveVideo(userId, videoId);
            }
            return { videoId, isSaved: !isSaved };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const recordView = createAsyncThunk(
    'video/recordView',
    async (videoId: string, { rejectWithValue }) => {
        try {
            await incrementViewCount(videoId);
            return videoId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const searchForVideos = createAsyncThunk(
    'video/searchForVideos',
    async (query: string, { rejectWithValue }) => {
        try {
            const results = await searchVideos(query);
            return results;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchFollowingVideos = createAsyncThunk(
    'video/fetchFollowingVideos',
    async (
        { userId, refresh = false }: { userId: string; refresh?: boolean },
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as { video: VideoState };
            const lastDoc = refresh ? undefined : state.video.lastDoc;
            const result = await getFollowingFeed(userId, lastDoc);
            return { ...result, refresh };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
            state.selectedCategory = action.payload;
            state.videos = [];
            state.lastDoc = null;
            state.hasMore = true;
        },
        setFeedMode: (state, action: PayloadAction<'forYou' | 'following'>) => {
            state.feedMode = action.payload;
            state.videos = [];
            state.lastDoc = null;
            state.hasMore = true;
            state.currentIndex = 0;
        },
        setUploadProgress: (state, action: PayloadAction<UploadProgress>) => {
            state.uploadProgress = action.payload;
        },
        resetUploadProgress: (state) => {
            state.uploadProgress = { progress: 0, status: 'idle' };
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        updateVideoLikeStatus: (
            state,
            action: PayloadAction<{ videoId: string; isLiked: boolean; likesCount: number }>
        ) => {
            const video = state.videos.find((v) => v.id === action.payload.videoId);
            if (video) {
                video.isLiked = action.payload.isLiked;
                video.likesCount = action.payload.likesCount;
            }
        },
    },
    extraReducers: (builder) => {
        // Fetch Videos
        builder
            .addCase(fetchVideos.pending, (state, action) => {
                if (action.meta.arg?.refresh) {
                    state.isRefreshing = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;

                if (action.payload.refresh) {
                    state.videos = action.payload.items;
                } else {
                    const existingIds = new Set(state.videos.map((v) => v.id));
                    const uniqueNewVideos = action.payload.items.filter(
                        (v) => !existingIds.has(v.id)
                    );
                    state.videos = [...state.videos, ...uniqueNewVideos];
                }

                state.hasMore = action.payload.hasMore;
                state.lastDoc = action.payload.lastDoc;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;
                state.error = action.payload as string;
            });

        // Toggle Like
        builder.addCase(toggleLike.fulfilled, (state, action) => {
            const video = state.videos.find((v) => v.id === action.payload.videoId);
            if (video) {
                video.isLiked = action.payload.isLiked;
                video.likesCount += action.payload.isLiked ? 1 : -1;
            }
        });

        // Toggle Save
        builder.addCase(toggleSave.fulfilled, (state, action) => {
            const video = state.videos.find((v) => v.id === action.payload.videoId);
            if (video) {
                video.isSaved = action.payload.isSaved;
                video.savesCount += action.payload.isSaved ? 1 : -1;
            }
        });

        // Search Videos
        builder
            .addCase(searchForVideos.pending, (state) => {
                state.isSearching = true;
            })
            .addCase(searchForVideos.fulfilled, (state, action) => {
                state.isSearching = false;
                state.searchResults = action.payload;
            })
            .addCase(searchForVideos.rejected, (state) => {
                state.isSearching = false;
            });

        // Fetch Following Videos
        builder
            .addCase(fetchFollowingVideos.pending, (state, action) => {
                if (action.meta.arg?.refresh) {
                    state.isRefreshing = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(fetchFollowingVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;

                if (action.payload.refresh) {
                    state.videos = action.payload.items;
                } else {
                    const existingIds = new Set(state.videos.map((v) => v.id));
                    const uniqueNewVideos = action.payload.items.filter(
                        (v) => !existingIds.has(v.id)
                    );
                    state.videos = [...state.videos, ...uniqueNewVideos];
                }

                state.hasMore = action.payload.hasMore;
                state.lastDoc = action.payload.lastDoc;
            })
            .addCase(fetchFollowingVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.isRefreshing = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setCurrentIndex,
    setSelectedCategory,
    setUploadProgress,
    resetUploadProgress,
    clearSearchResults,
    updateVideoLikeStatus,
    setFeedMode,
} = videoSlice.actions;

export default videoSlice.reducer;

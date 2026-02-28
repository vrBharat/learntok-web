/**
 * User Slice - Manages user profile and activity
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Video, SavedVideo, WatchHistory } from '@/types';
import {
    getUser,
    updateUser,
    getSavedVideos,
    getWatchHistory,
    getVideosByCreator,
    getLikedVideos,
    followUser,
    unfollowUser,
    checkIfFollowing,
} from '@/services/firebase/firestore';

interface UserState {
    profile: User | null;
    viewedProfile: User | null;
    savedVideos: SavedVideo[];
    watchHistory: WatchHistory[];
    userVideos: Video[];
    likedVideos: Video[];
    isLoading: boolean;
    error: string | null;
    isFollowing: boolean;
}

const initialState: UserState = {
    profile: null,
    viewedProfile: null,
    savedVideos: [],
    watchHistory: [],
    userVideos: [],
    likedVideos: [],
    isLoading: false,
    error: null,
    isFollowing: false,
};

// Async Thunks
export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            const user = await getUser(userId);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchViewedProfile = createAsyncThunk(
    'user/fetchViewedProfile',
    async (
        { userId, currentUserId }: { userId: string; currentUserId: string },
        { rejectWithValue }
    ) => {
        try {
            const [user, isFollowing] = await Promise.all([
                getUser(userId),
                checkIfFollowing(currentUserId, userId),
            ]);
            return { user, isFollowing };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (
        {
            userId,
            updates,
        }: {
            userId: string;
            updates: Partial<User>;
        },
        { rejectWithValue }
    ) => {
        try {
            await updateUser(userId, updates);
            const updatedUser = await getUser(userId);
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchSavedVideos = createAsyncThunk(
    'user/fetchSavedVideos',
    async (userId: string, { rejectWithValue }) => {
        try {
            const result = await getSavedVideos(userId);
            return result.items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchWatchHistory = createAsyncThunk(
    'user/fetchWatchHistory',
    async (userId: string, { rejectWithValue }) => {
        try {
            const result = await getWatchHistory(userId);
            return result.items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserVideos = createAsyncThunk(
    'user/fetchUserVideos',
    async (userId: string, { rejectWithValue }) => {
        try {
            const result = await getVideosByCreator(userId);
            return result.items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchLikedVideos = createAsyncThunk(
    'user/fetchLikedVideos',
    async (userId: string, { rejectWithValue }) => {
        try {
            const result = await getLikedVideos(userId);
            return result.items;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleFollow = createAsyncThunk(
    'user/toggleFollow',
    async (
        {
            followerId,
            followingId,
            isFollowing,
        }: {
            followerId: string;
            followingId: string;
            isFollowing: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            if (isFollowing) {
                await unfollowUser(followerId, followingId);
            } else {
                await followUser(followerId, followingId);
            }
            return !isFollowing;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<User | null>) => {
            state.profile = action.payload;
        },
        clearViewedProfile: (state) => {
            state.viewedProfile = null;
            state.isFollowing = false;
            state.userVideos = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch User Profile
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Viewed Profile
        builder
            .addCase(fetchViewedProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchViewedProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.viewedProfile = action.payload.user;
                state.isFollowing = action.payload.isFollowing;
            })
            .addCase(fetchViewedProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update User Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Saved Videos
        builder
            .addCase(fetchSavedVideos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSavedVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.savedVideos = action.payload;
            })
            .addCase(fetchSavedVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Watch History
        builder
            .addCase(fetchWatchHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchWatchHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.watchHistory = action.payload;
            })
            .addCase(fetchWatchHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch User Videos
        builder
            .addCase(fetchUserVideos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userVideos = action.payload;
            })
            .addCase(fetchUserVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Liked Videos
        builder
            .addCase(fetchLikedVideos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLikedVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.likedVideos = action.payload;
            })
            .addCase(fetchLikedVideos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Toggle Follow
        builder.addCase(toggleFollow.fulfilled, (state, action) => {
            state.isFollowing = action.payload;
            if (state.viewedProfile) {
                state.viewedProfile.followersCount += action.payload ? 1 : -1;
            }
        });
    },
});

export const { setProfile, clearViewedProfile, clearError } = userSlice.actions;
export default userSlice.reducer;

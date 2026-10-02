/**
 * User Slice - Manages user profile and activity
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import {
    getUser,
    updateUser,
} from '@/services/firebase/firestore';

interface UserState {
    profile: User | null;
    viewedProfile: User | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    profile: null,
    viewedProfile: null,
    isLoading: false,
    error: null,
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
        { userId }: { userId: string },
        { rejectWithValue }
    ) => {
        try {
            const user = await getUser(userId);
            return { user };
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

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<User | null>) => {
            state.profile = action.payload;
        },
        clearViewedProfile: (state) => {
            state.viewedProfile = null;
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
    },
});

export const { setProfile, clearViewedProfile, clearError } = userSlice.actions;
export default userSlice.reducer;

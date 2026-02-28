/**
 * Auth Slice - Manages authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    getUserData,
} from '@/services/firebase/auth';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    isInitialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    isInitialized: false,
};

// Async Thunks
export const signUp = createAsyncThunk(
    'auth/signUp',
    async (
        {
            email,
            password,
            username,
            displayName,
        }: {
            email: string;
            password: string;
            username: string;
            displayName: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const user = await signUpWithEmail(email, password, username, displayName);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const signIn = createAsyncThunk(
    'auth/signIn',
    async (
        { email, password }: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const user = await signInWithEmail(email, password);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const googleSignIn = createAsyncThunk(
    'auth/googleSignIn',
    async (_, { rejectWithValue }) => {
        try {
            const user = await signInWithGoogle();
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await signOut();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            await resetPassword(email);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserData = createAsyncThunk(
    'auth/fetchUserData',
    async (userId: string, { rejectWithValue }) => {
        try {
            const user = await getUserData(userId);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.isInitialized = true;
        },
        clearError: (state) => {
            state.error = null;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },
        updateFollowingCount: (state, action: PayloadAction<number>) => {
            if (state.user) {
                state.user.followingCount = (state.user.followingCount || 0) + action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        // Sign Up
        builder
            .addCase(signUp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Sign In
        builder
            .addCase(signIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Google Sign In
        builder
            .addCase(googleSignIn.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(googleSignIn.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(googleSignIn.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Logout
        builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Forgot Password
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch User Data
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.isInitialized = true;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.isInitialized = true;
            });
    },
});

export const { setUser, clearError, setInitialized, updateFollowingCount } = authSlice.actions;
export default authSlice.reducer;

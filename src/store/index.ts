/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types (Firebase timestamps)
                ignoredActions: [
                    'auth/setUser',
                    'auth/signIn/fulfilled',
                    'auth/signUp/fulfilled',
                    'auth/googleSignIn/fulfilled',
                    'auth/fetchUserData/fulfilled',
                    'user/setProfile',
                    'user/updateUserProfile/fulfilled',
                    'user/fetchUserProfile/fulfilled',
                    'user/fetchViewedProfile/fulfilled',
                ],
                // Ignore these field paths in state
                ignoredPaths: [
                    'auth.user.createdAt',
                    'auth.user.updatedAt',
                    'user.profile',
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

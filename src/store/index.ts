/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import videoReducer from './slices/videoSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        user: userReducer,
        ui: uiReducer,
        notification: notificationReducer,
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
                    'video/setVideos',
                    'video/fetchVideos/fulfilled',
                    'video/fetchVideoById/fulfilled',
                    'user/setProfile',
                    'user/fetchSavedVideos/fulfilled',
                    'user/fetchWatchHistory/fulfilled',
                    'user/fetchUserVideos/fulfilled',
                    'user/fetchLikedVideos/fulfilled',
                    'user/updateUserProfile/fulfilled',
                    'user/fetchUserProfile/fulfilled',
                    'user/fetchViewedProfile/fulfilled',
                    'video/fetchFollowingVideos/fulfilled',
                    'notification/fetchNotifications/fulfilled',
                ],
                // Ignore these field paths in state
                ignoredPaths: [
                    'auth.user.createdAt',
                    'auth.user.updatedAt',
                    'video.videos',
                    'video.lastDoc',
                    'user.profile',
                    'user.savedVideos',
                    'user.watchHistory',
                    'user.userVideos',
                    'notification.notifications',
                    'notification.lastDoc',
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Notification Slice - Manages user notifications
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification, PaginatedResponse } from '@/types';
import { getNotifications, markNotificationAsRead } from '@/services/firebase/firestore';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    hasMore: boolean;
    lastDoc: any;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    hasMore: true,
    lastDoc: null,
    error: null,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async (
        { userId, refresh = false }: { userId: string; refresh?: boolean },
        { getState, rejectWithValue }
    ) => {
        try {
            const state = getState() as { notification: NotificationState };
            const lastDoc = refresh ? undefined : state.notification.lastDoc;
            const result = await getNotifications(userId, lastDoc);
            return { ...result, refresh };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            await markNotificationAsRead(notificationId);
            return notificationId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.lastDoc = null;
            state.hasMore = true;
        },
    },
    extraReducers: (builder) => {
        // Fetch Notifications
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.refresh) {
                    state.notifications = action.payload.items;
                } else {
                    const existingIds = new Set(state.notifications.map((n) => n.id));
                    const uniqueNewItems = action.payload.items.filter(
                        (n) => !existingIds.has(n.id)
                    );
                    state.notifications = [...state.notifications, ...uniqueNewItems];
                }
                state.hasMore = action.payload.hasMore;
                state.lastDoc = action.payload.lastDoc;

                // Update unread count
                state.unreadCount = state.notifications.filter(n => !n.read).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Mark as Read
        builder.addCase(markAsRead.fulfilled, (state, action) => {
            const notification = state.notifications.find((n) => n.id === action.payload);
            if (notification && !notification.read) {
                notification.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        });
    },
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;

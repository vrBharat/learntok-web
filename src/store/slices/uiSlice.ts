/**
 * UI Slice - Manages UI state like modals, toasts, etc.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface UIState {
    isCommentSheetOpen: boolean;
    selectedVideoIdForComments: string | null;
    isShareSheetOpen: boolean;
    selectedVideoIdForShare: string | null;
    toasts: Toast[];
    isQuizModalOpen: boolean;
    isAskDoubtModalOpen: boolean;
    isSummaryModalOpen: boolean;
    selectedVideoIdForAI: string | null;
    isMuted: boolean;
    showVideoProgress: boolean;
    playbackSpeed: number;
}

const initialState: UIState = {
    isCommentSheetOpen: false,
    selectedVideoIdForComments: null,
    isShareSheetOpen: false,
    selectedVideoIdForShare: null,
    toasts: [],
    isQuizModalOpen: false,
    isAskDoubtModalOpen: false,
    isSummaryModalOpen: false,
    selectedVideoIdForAI: null,
    isMuted: false,
    showVideoProgress: true,
    playbackSpeed: 1.0,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openCommentSheet: (state, action: PayloadAction<string>) => {
            state.isCommentSheetOpen = true;
            state.selectedVideoIdForComments = action.payload;
        },
        closeCommentSheet: (state) => {
            state.isCommentSheetOpen = false;
            state.selectedVideoIdForComments = null;
        },
        openShareSheet: (state, action: PayloadAction<string>) => {
            state.isShareSheetOpen = true;
            state.selectedVideoIdForShare = action.payload;
        },
        closeShareSheet: (state) => {
            state.isShareSheetOpen = false;
            state.selectedVideoIdForShare = null;
        },
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const id = Date.now().toString();
            state.toasts.push({ ...action.payload, id });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((t) => t.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },
        openQuizModal: (state, action: PayloadAction<string>) => {
            state.isQuizModalOpen = true;
            state.selectedVideoIdForAI = action.payload;
        },
        closeQuizModal: (state) => {
            state.isQuizModalOpen = false;
            state.selectedVideoIdForAI = null;
        },
        openAskDoubtModal: (state, action: PayloadAction<string>) => {
            state.isAskDoubtModalOpen = true;
            state.selectedVideoIdForAI = action.payload;
        },
        closeAskDoubtModal: (state) => {
            state.isAskDoubtModalOpen = false;
            state.selectedVideoIdForAI = null;
        },
        openSummaryModal: (state, action: PayloadAction<string>) => {
            state.isSummaryModalOpen = true;
            state.selectedVideoIdForAI = action.payload;
        },
        closeSummaryModal: (state) => {
            state.isSummaryModalOpen = false;
            state.selectedVideoIdForAI = null;
        },
        toggleMute: (state) => {
            state.isMuted = !state.isMuted;
        },
        setMuted: (state, action: PayloadAction<boolean>) => {
            state.isMuted = action.payload;
        },
        setShowVideoProgress: (state, action: PayloadAction<boolean>) => {
            state.showVideoProgress = action.payload;
        },
        setPlaybackSpeed: (state, action: PayloadAction<number>) => {
            state.playbackSpeed = action.payload;
        },
        cyclePlaybackSpeed: (state) => {
            const speeds = [0.5, 1.0, 1.5, 2.0];
            const currentIdx = speeds.indexOf(state.playbackSpeed);
            state.playbackSpeed = speeds[(currentIdx + 1) % speeds.length];
        },
    },
});

export const {
    openCommentSheet,
    closeCommentSheet,
    openShareSheet,
    closeShareSheet,
    addToast,
    removeToast,
    clearToasts,
    openQuizModal,
    closeQuizModal,
    openAskDoubtModal,
    closeAskDoubtModal,
    openSummaryModal,
    closeSummaryModal,
    toggleMute,
    setMuted,
    setShowVideoProgress,
    setPlaybackSpeed,
    cyclePlaybackSpeed,
} = uiSlice.actions;

export default uiSlice.reducer;

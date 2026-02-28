/**
 * Firestore Database Service
 * CRUD operations for all collections
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    increment,
    serverTimestamp,
    DocumentSnapshot,
    QueryConstraint,
    writeBatch,
    documentId,
} from 'firebase/firestore';
import { db } from './config';
import {
    User,
    Video,
    Comment,
    Like,
    SavedVideo,
    Follow,
    WatchHistory,
    Category,
    Note,
    PaginatedResponse
} from '@/types';

// Collection Names
const COLLECTIONS = {
    USERS: 'users',
    VIDEOS: 'videos',
    COMMENTS: 'comments',
    LIKES: 'likes',
    SAVED: 'saved',
    FOLLOWS: 'follows',
    WATCH_HISTORY: 'watchHistory',
    NOTIFICATIONS: 'notifications',
    REPORTS: 'reports',
    NOTES: 'notes',
};

// ==================== USER OPERATIONS ====================

/**
 * Get user by ID
 */
export const getUser = async (userId: string): Promise<User | null> => {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as User;
};

/**
 * Update user profile
 */
export const updateUser = async (
    userId: string,
    updates: Partial<User>
): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
    });
};

/**
 * Search users by username or display name
 */
export const searchUsers = async (
    searchTerm: string,
    limitCount = 20
): Promise<User[]> => {
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(
        usersRef,
        where('username', '>=', searchTerm.toLowerCase()),
        where('username', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
    })) as User[];
};

// ==================== VIDEO OPERATIONS ====================

/**
 * Get video feed with pagination
 */
export const getVideoFeed = async (
    lastDoc?: DocumentSnapshot,
    category?: Category,
    pageSize = 10
): Promise<PaginatedResponse<Video>> => {
    const videosRef = collection(db, COLLECTIONS.VIDEOS);
    const constraints: QueryConstraint[] = [
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
    ];

    if (category) {
        constraints.unshift(where('category', '==', category));
    }

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);

    const videos = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const creator = await getUser(data.creatorId);
            return {
                id: docSnap.id,
                ...data,
                creator,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Video;
        })
    );

    return {
        items: videos,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
};

/**
 * Get video by ID
 */
export const getVideo = async (videoId: string): Promise<Video | null> => {
    const docRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    const creator = await getUser(data.creatorId);

    return {
        id: docSnap.id,
        ...data,
        creator,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    } as Video;
};

/**
 * Create new video
 */
export const createVideo = async (
    videoData: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
    const docRef = await addDoc(collection(db, COLLECTIONS.VIDEOS), {
        ...videoData,
        likesCount: videoData.likesCount || 0,
        commentsCount: videoData.commentsCount || 0,
        viewsCount: videoData.viewsCount || 0,
        sharesCount: videoData.sharesCount || 0,
        savesCount: videoData.savesCount || 0,
        status: videoData.status || 'approved',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    // Update creator's video count
    await updateDoc(doc(db, COLLECTIONS.USERS, videoData.creatorId), {
        videosCount: increment(1),
    });

    return docRef.id;
};

/**
 * Get videos by creator
 */
export const getVideosByCreator = async (
    creatorId: string,
    lastDoc?: DocumentSnapshot,
    pageSize = 10
): Promise<PaginatedResponse<Video>> => {
    const videosRef = collection(db, COLLECTIONS.VIDEOS);
    const constraints: QueryConstraint[] = [
        where('creatorId', '==', creatorId),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
    ];

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    const q = query(videosRef, ...constraints);

    const snapshot = await getDocs(q);

    const videos = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate(),
        updatedAt: docSnap.data().updatedAt?.toDate(),
    })) as Video[];

    return {
        items: videos,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
};

/**
 * Increment video view count
 */
export const incrementViewCount = async (videoId: string): Promise<void> => {
    const docRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    await updateDoc(docRef, {
        viewsCount: increment(1),
    });
};

/**
 * Search videos
 */
export const searchVideos = async (
    searchTerm: string,
    limitCount = 20
): Promise<Video[]> => {
    const videosRef = collection(db, COLLECTIONS.VIDEOS);
    const q = query(
        videosRef,
        where('status', '==', 'approved'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const creator = await getUser(data.creatorId);
            return {
                id: docSnap.id,
                ...data,
                creator,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Video;
        })
    );
};

// ==================== LIKE OPERATIONS ====================

/**
 * Like a video
 */
export const likeVideo = async (
    userId: string,
    videoId: string
): Promise<void> => {
    const batch = writeBatch(db);

    const likeRef = doc(collection(db, COLLECTIONS.LIKES));
    batch.set(likeRef, {
        userId,
        videoId,
        createdAt: serverTimestamp(),
    });

    const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    batch.update(videoRef, {
        likesCount: increment(1),
    });

    await batch.commit();
};

/**
 * Unlike a video
 */
export const unlikeVideo = async (
    userId: string,
    videoId: string
): Promise<void> => {
    const likesRef = collection(db, COLLECTIONS.LIKES);
    const q = query(
        likesRef,
        where('userId', '==', userId),
        where('videoId', '==', videoId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
        batch.update(videoRef, {
            likesCount: increment(-1),
        });

        await batch.commit();
    }
};

/**
 * Check if user liked a video
 */
export const checkIfLiked = async (
    userId: string,
    videoId: string
): Promise<boolean> => {
    const likesRef = collection(db, COLLECTIONS.LIKES);
    const q = query(
        likesRef,
        where('userId', '==', userId),
        where('videoId', '==', videoId),
        limit(1)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

// ==================== SAVE OPERATIONS ====================

/**
 * Save a video
 */
export const saveVideo = async (
    userId: string,
    videoId: string
): Promise<void> => {
    const batch = writeBatch(db);

    const saveRef = doc(collection(db, COLLECTIONS.SAVED));
    batch.set(saveRef, {
        userId,
        videoId,
        createdAt: serverTimestamp(),
    });

    const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
    batch.update(videoRef, {
        savesCount: increment(1),
    });

    await batch.commit();
};

/**
 * Unsave a video
 */
export const unsaveVideo = async (
    userId: string,
    videoId: string
): Promise<void> => {
    const savedRef = collection(db, COLLECTIONS.SAVED);
    const q = query(
        savedRef,
        where('userId', '==', userId),
        where('videoId', '==', videoId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        const videoRef = doc(db, COLLECTIONS.VIDEOS, videoId);
        batch.update(videoRef, {
            savesCount: increment(-1),
        });

        await batch.commit();
    }
};

/**
 * Get user's saved videos
 */
export const getSavedVideos = async (
    userId: string,
    lastDoc?: DocumentSnapshot,
    pageSize = 10
): Promise<PaginatedResponse<SavedVideo>> => {
    const savedRef = collection(db, COLLECTIONS.SAVED);
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
    ];

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    const q = query(savedRef, ...constraints);
    const snapshot = await getDocs(q);

    const savedVideos = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const video = await getVideo(data.videoId);
            return {
                id: docSnap.id,
                ...data,
                video,
                createdAt: data.createdAt?.toDate(),
            } as SavedVideo;
        })
    );

    return {
        items: savedVideos,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
};

// ==================== FOLLOW OPERATIONS ====================

/**
 * Follow a user
 */
export const followUser = async (
    followerId: string,
    followingId: string
): Promise<void> => {
    const batch = writeBatch(db);

    const followRef = doc(collection(db, COLLECTIONS.FOLLOWS));
    batch.set(followRef, {
        followerId,
        followingId,
        createdAt: serverTimestamp(),
    });

    const followerRef = doc(db, COLLECTIONS.USERS, followerId);
    batch.update(followerRef, {
        followingCount: increment(1),
    });

    const followingRef = doc(db, COLLECTIONS.USERS, followingId);
    batch.update(followingRef, {
        followersCount: increment(1),
    });

    await batch.commit();
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (
    followerId: string,
    followingId: string
): Promise<void> => {
    const followsRef = collection(db, COLLECTIONS.FOLLOWS);
    const q = query(
        followsRef,
        where('followerId', '==', followerId),
        where('followingId', '==', followingId)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        const followerRef = doc(db, COLLECTIONS.USERS, followerId);
        batch.update(followerRef, {
            followingCount: increment(-1),
        });

        const followingRef = doc(db, COLLECTIONS.USERS, followingId);
        batch.update(followingRef, {
            followersCount: increment(-1),
        });

        await batch.commit();
    }
};

/**
 * Check if user is following another user
 */
export const checkIfFollowing = async (
    followerId: string,
    followingId: string
): Promise<boolean> => {
    const followsRef = collection(db, COLLECTIONS.FOLLOWS);
    const q = query(
        followsRef,
        where('followerId', '==', followerId),
        where('followingId', '==', followingId),
        limit(1)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

/**
 * Get video feed from followed creators
 */
export const getFollowingFeed = async (
    userId: string,
    lastDoc?: DocumentSnapshot,
    pageSize = 10
): Promise<PaginatedResponse<Video>> => {
    const followsRef = collection(db, COLLECTIONS.FOLLOWS);
    const followsQuery = query(
        followsRef,
        where('followerId', '==', userId)
    );
    const followsSnapshot = await getDocs(followsQuery);
    const followingIds = followsSnapshot.docs.map((doc) => doc.data().followingId);

    if (followingIds.length === 0) {
        return { items: [], hasMore: false };
    }

    const batchSize = 10;
    const batch = followingIds.slice(0, batchSize);

    const videosRef = collection(db, COLLECTIONS.VIDEOS);
    const constraints: QueryConstraint[] = [
        where('creatorId', 'in', batch),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc'),
        limit(pageSize),
    ];

    if (lastDoc) {
        constraints.push(startAfter(lastDoc));
    }

    const q = query(videosRef, ...constraints);
    const snapshot = await getDocs(q);

    const videos = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const creator = await getUser(data.creatorId);
            return {
                id: docSnap.id,
                ...data,
                creator,
                createdAt: data.createdAt?.toDate(),
                updatedAt: data.updatedAt?.toDate(),
            } as Video;
        })
    );

    return {
        items: videos,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
};

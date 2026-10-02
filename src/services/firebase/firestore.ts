/**
 * Firestore Database Service
 * CRUD operations for all collections
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    limit,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
    User,
} from '@/types';

// Collection Names
const COLLECTIONS = {
    USERS: 'users',
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

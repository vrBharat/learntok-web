/**
 * Firebase Authentication Service
 * Handles all authentication operations
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types';

/**
 * Sign up with email and password
 */
export const signUpWithEmail = async (
    email: string,
    password: string,
    username: string,
    displayName: string
): Promise<User> => {
    try {
        // Create auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Update profile with display name
        await updateProfile(user, { displayName });

        // Create user document in Firestore
        const userData: Omit<User, 'id'> = {
            email,
            username: username.toLowerCase(),
            displayName,
            bio: '',
            profilePic: '',
            followersCount: 0,
            followingCount: 0,
            videosCount: 0,
            isPremium: false,
            isCreator: false,
            isAdmin: false,
            streak: 0,
            totalWatchTime: 0,
            badges: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return { id: user.uid, ...userData };
    } catch (error: any) {
        throw handleAuthError(error);
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = await getUserData(userCredential.user.uid);
        return userData;
    } catch (error: any) {
        throw handleAuthError(error);
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const { user } = userCredential;

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            const userData: Omit<User, 'id'> = {
                email: user.email || '',
                username: user.email?.split('@')[0].toLowerCase() || '',
                displayName: user.displayName || '',
                bio: '',
                profilePic: user.photoURL || '',
                followersCount: 0,
                followingCount: 0,
                videosCount: 0,
                isPremium: false,
                isCreator: false,
                isAdmin: false,
                streak: 0,
                totalWatchTime: 0,
                badges: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return { id: user.uid, ...userData };
        }

        return await getUserData(user.uid);
    } catch (error: any) {
        throw handleAuthError(error);
    }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw handleAuthError(error);
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw handleAuthError(error);
    }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId: string): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
        throw new Error('User not found');
    }

    const data = userDoc.data();
    return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    } as User;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (
    callback: (user: FirebaseUser | null) => void
) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
    return auth.currentUser;
};

/**
 * Handle Firebase auth errors
 */
const handleAuthError = (error: any): Error => {
    const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Password is too weak',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Please check your connection',
    };

    return new Error(errorMessages[error.code] || error.message);
};

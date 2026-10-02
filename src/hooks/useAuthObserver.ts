'use client';
import { logger } from '@/lib/logger';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { setUser, setInitialized } from '@/store/slices/authSlice';
import { getUserData } from '@/services/firebase/auth';

const setAuthCookie = (isAuth: boolean) => {
    if (typeof document !== 'undefined') {
        if (isAuth) {
            document.cookie = "isAuth=1; path=/; max-age=2592000; SameSite=Lax";
        } else {
            document.cookie = "isAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
};

export const useAuthObserver = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await getUserData(firebaseUser.uid);
                    if (userData) {
                        dispatch(setUser(userData));
                        setAuthCookie(true);
                    } else {
                        // User exists in Auth but not Firestore
                        dispatch(setUser(null));
                        setAuthCookie(false);
                    }
                } catch (error) {
                    logger.error('Error fetching user data:', error);
                    dispatch(setUser(null));
                    setAuthCookie(false);
                }
            } else {
                dispatch(setUser(null));
                setAuthCookie(false);
            }
            dispatch(setInitialized(true));
        });

        return () => unsubscribe();
    }, [dispatch]);
};

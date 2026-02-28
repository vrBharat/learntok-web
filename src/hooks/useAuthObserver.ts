'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { setUser, setInitialized } from '@/store/slices/authSlice';
import { getUserData } from '@/services/firebase/auth';

export const useAuthObserver = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await getUserData(firebaseUser.uid);
                    dispatch(setUser(userData));
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    dispatch(setUser(null));
                }
            } else {
                dispatch(setUser(null));
            }
            dispatch(setInitialized(true));
        });

        return () => unsubscribe();
    }, [dispatch]);
};

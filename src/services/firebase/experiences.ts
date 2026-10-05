import { logger } from '@/lib/logger';
import { collection, doc, addDoc, getDoc, getDocs, query, orderBy, limit, serverTimestamp, where, getCountFromServer, deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from './config';

export interface ExperienceData {
  id?: string;
  userId?: string; // For security
  title: string;
  author: string;
  category: string;
  goal?: string;
  origin?: string;
  destination?: string;
  duration: string;
  cost?: string;
  year: string;
  quote?: string;
  whatWorked?: string;
  whatDidnt?: string;
  createdAt?: any;
  views?: number;
}

const COLLECTION_NAME = 'experiences';

export const addExperience = async (data: Omit<ExperienceData, 'id' | 'createdAt'>, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    logger.error("Error adding experience: ", error);
    throw error;
  }
};

export const getExperiences = async (max: number = 20): Promise<ExperienceData[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(max)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ExperienceData));
  } catch (error) {
    logger.error("Error getting experiences: ", error);
    return [];
  }
};

export const getExperiencesByUsername = async (username: string): Promise<ExperienceData[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('author', '==', username),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ExperienceData[];
  } catch (error) {
    logger.error("Error getting user experiences: ", error);
    return [];
  }
};

export const getExperienceById = async (id: string): Promise<ExperienceData | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as ExperienceData;
    }
    return null;
  } catch (error) {
    logger.error("Error getting experience: ", error);
    return null;
  }
};

export const getCategoryCounts = async (): Promise<Record<string, number>> => {
  const categories = ['Career', 'Moving', 'Education', 'Business', 'Languages', 'Freelancing'];
  const counts: Record<string, number> = {};
  
  try {
    // Also fetch lower case for case-insensitivity or depending on how it's saved
    for (const cat of categories) {
      const q = query(collection(db, COLLECTION_NAME), where('category', '==', cat.toLowerCase()));
      const snapshot = await getCountFromServer(q);
      
      const qCap = query(collection(db, COLLECTION_NAME), where('category', '==', cat));
      const snapshotCap = await getCountFromServer(qCap);

      counts[cat.toLowerCase()] = snapshot.data().count + snapshotCap.data().count;
    }
  } catch (error) {
    logger.error("Error getting category counts: ", error);
  }
  return counts;
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    logger.error("Error deleting experience: ", error);
    throw error;
  }
};

export const updateExperience = async (id: string, data: Partial<ExperienceData>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Remove id and userId to prevent accidental overwrite if they exist in data
    const { id: _id, userId: _userId, createdAt: _createdAt, ...updateData } = data as any;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    logger.error("Error updating experience: ", error);
    throw error;
  }
};

export const incrementViewCount = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      views: increment(1)
    });
  } catch (error) {
    logger.error("Error incrementing view count: ", error);
  }
};


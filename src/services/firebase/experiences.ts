import { collection, doc, addDoc, getDoc, getDocs, query, orderBy, limit, serverTimestamp, where } from 'firebase/firestore';
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
  createdAt?: any;
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
    console.error("Error adding experience: ", error);
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
    console.error("Error getting experiences: ", error);
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
    console.error("Error getting user experiences: ", error);
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
    console.error("Error getting experience: ", error);
    return null;
  }
};

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export interface FeedbackData {
  type: 'feedback' | 'bug';
  message: string;
  userId?: string;
  username?: string;
  email?: string;
  path?: string; // which page they were on
}

const COLLECTION_NAME = 'feedback';

export const submitFeedback = async (data: FeedbackData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding feedback: ", error);
    throw error;
  }
};

import { collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export interface QuestionData {
  id?: string;
  experienceId: string;
  askerId?: string; // For security
  askerUsername: string;
  text: string;
  reply?: string;
  createdAt?: any;
  repliedAt?: any;
}

const COLLECTION_NAME = 'questions';

export const addQuestion = async (experienceId: string, askerId: string, askerUsername: string, text: string) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      experienceId,
      askerId,
      askerUsername,
      text,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding question: ", error);
    throw error;
  }
};

export const getQuestionsForExperience = async (experienceId: string): Promise<QuestionData[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('experienceId', '==', experienceId),
      orderBy('createdAt', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuestionData));
  } catch (error) {
    console.error("Error getting questions: ", error);
    return [];
  }
};

export const replyToQuestion = async (questionId: string, replyText: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, questionId);
    await updateDoc(docRef, {
      reply: replyText,
      repliedAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error replying to question: ", error);
    throw error;
  }
};

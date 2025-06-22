import { collection, getDocs, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FirestoreDocument {
  id: string;
  [key: string]: any; // Allow any other properties
}

/**
 * Fetches data from Firestore on the client-side.
 * This is subject to Firestore security rules.
 */
export const fetchDataFromFirestore = async (collectionName: string): Promise<FirestoreDocument[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const data: FirestoreDocument[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FirestoreDocument {
  id: string;
  [key: string]: any; // Allow any other properties
}

export const fetchDataFromFirestore = async (collectionName: string): Promise<FirestoreDocument[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const data: FirestoreDocument[] = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import * as admin from 'firebase-admin';

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
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

// --- Server-side logic ---

/**
 * Initializes the Firebase Admin SDK.
 * It ensures the SDK is initialized only once.
 * This function should only be called in a server environment.
 */
const initializeAdminApp = () => {
    if (admin.apps.length === 0) {
      try {
        // This uses the service account key from the root directory.
        // It's loaded via require() which is available in the Node.js environment on the server.
        const serviceAccount = require('../../serviceAccountKey.json');
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } catch (error: any) {
        console.error('Firebase admin initialization error:', error);
        // Throw an error to make it clear that server-side operations will fail.
        throw new Error('Could not initialize Firebase Admin SDK. Please ensure serviceAccountKey.json is present in the root directory.');
      }
    }
    return admin.firestore();
};

/**
 * Fetches data from Firestore on the server-side using the Admin SDK.
 * This bypasses security rules and is useful for fetching data in Server Components.
 */
export const fetchDataFromFirestoreOnServer = async (collectionName: string): Promise<FirestoreDocument[]> => {
    const adminDb = initializeAdminApp();
    const querySnapshot = await adminDb.collection(collectionName).get();
    const data: FirestoreDocument[] = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
};

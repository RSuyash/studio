import * as admin from 'firebase-admin';

interface FirestoreDocument {
    id: string;
    [key: string]: any; // Allow any other properties
}

/**
 * Initializes the Firebase Admin SDK.
 * It ensures the SDK is initialized only once.
 * This function should only be called in a server environment.
 */
const initializeAdminApp = () => {
    if (admin.apps.length === 0) {
      try {
        // Use a static relative path for the service account key.
        // This is necessary because the Next.js bundler for Server Components
        // does not correctly handle dynamic `require` paths (e.g., using `process.cwd()`).
        const serviceAccount = require('../../../serviceAccountKey.json');

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } catch (error: any) {
        console.error('Firebase admin initialization error:', error.stack);
        // Throw an error to make it clear that server-side operations will fail.
        throw new Error('Could not initialize Firebase Admin SDK. Please ensure serviceAccountKey.json is present in the root directory and is valid.');
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

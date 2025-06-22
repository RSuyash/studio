import { adminDb } from '@/lib/firebase-admin';

interface FirestoreDocument {
    id: string;
    [key: string]: any;
}

/**
 * Fetches data from Firestore on the server-side using the Admin SDK.
 * This bypasses security rules and is useful for fetching data in Server Components.
 */
export const fetchDataFromFirestoreOnServer = async (collectionName: string): Promise<FirestoreDocument[]> => {
    const querySnapshot = await adminDb.collection(collectionName).get();
    const data: FirestoreDocument[] = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    return data;
};

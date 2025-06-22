import { getAdminDb } from '@/lib/firebase-admin';

interface FirestoreDocument {
    id: string;
    [key: string]: any;
}

/**
 * Fetches data from Firestore on the server-side using the Admin SDK.
 * This bypasses security rules and is useful for fetching data in Server Components.
 */
export const fetchDataFromFirestoreOnServer = async (collectionName: string): Promise<FirestoreDocument[]> => {
    try {
        const adminDb = getAdminDb();
        const querySnapshot = await adminDb.collection(collectionName).get();
        const data: FirestoreDocument[] = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error(`Firestore server fetch error from collection "${collectionName}":`, error);
        // This is a more specific error that will be caught by the page's try-catch block.
        throw new Error('Failed to fetch data from Firestore on the server. This is likely due to an initialization error or invalid credentials. Please check your server logs and .env file.');
    }
};

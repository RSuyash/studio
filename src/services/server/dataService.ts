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
    } catch (error: any) {
        console.error(`Firestore server fetch error from collection "${collectionName}":`, error);
        // Propagate a more specific error message.
        throw new Error(`Failed to fetch data from Firestore. Please check server logs for the full error. A common cause is incorrect Firebase credentials in the .env file. Original error: ${error.message}`);
    }
};

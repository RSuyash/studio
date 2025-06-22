import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// This ensures that credentials are loaded for both the app and migration scripts.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let db: admin.firestore.Firestore | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase credentials not found in .env file. Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.'
    );
  }
  
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Could not initialize Firebase Admin SDK. Check your .env credentials.');
  }
}

/**
 * Returns a memoized instance of the Firebase Admin Firestore database.
 * Initialization is done on the first call.
 */
export function getAdminDb(): admin.firestore.Firestore {
  if (db) {
    return db;
  }

  initializeAdminApp();
  db = admin.firestore();
  return db;
}

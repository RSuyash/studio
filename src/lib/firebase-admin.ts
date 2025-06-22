import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Explicitly replace \\n with \n
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error('Missing Firebase Admin SDK credentials in environment variables.');
  }

  const serviceAccount = {
    projectId: projectId,
    privateKey: privateKey,
    clientEmail: clientEmail,
  };

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Updated error message to reflect using environment variables
    throw new Error('Could not initialize Firebase Admin SDK. Check your environment variables.');
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

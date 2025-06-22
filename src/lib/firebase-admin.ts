import * as admin from 'firebase-admin';

// This structure prevents the SDK from being initialized multiple times.
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      'Firebase credentials are not set in the environment. Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set in your .env file.'
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        // The private key from the .env file needs newlines to be correctly formatted.
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Could not initialize Firebase Admin SDK. Please check your credentials in the .env file.');
  }
}

// Export the initialized admin database instance.
export const adminDb = admin.firestore();

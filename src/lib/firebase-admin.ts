import * as admin from 'firebase-admin';

// This structure prevents the SDK from being initialized multiple times.
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    // Log a warning if credentials are not set, but don't throw an error here.
    // The error will be handled gracefully where the adminDb is used.
    console.warn(
      'Firebase credentials are not set in the environment. Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set in your .env file for server-side features to work.'
    );
  } else {
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
      // Don't throw here; let the app continue running.
      // The error will be caught where adminDb is accessed.
    }
  }
}

// Export the initialized admin database instance.
// Note: This will throw an error if accessed when initialization has failed.
// We will handle this gracefully in our data service.
export const adminDb = admin.firestore();

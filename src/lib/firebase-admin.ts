import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// This structure prevents the SDK from being initialized multiple times.
if (!admin.apps.length) {
  try {
    // Construct an absolute path to the service account key file.
    // process.cwd() gives the project root directory in Next.js.
    const keyPath = path.join(process.cwd(), 'scripts', 'serviceAccountKey.json');
    const serviceAccountString = fs.readFileSync(keyPath, 'utf8');
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    // Throw a more specific error to help with debugging.
    throw new Error('Could not initialize Firebase Admin SDK. Please ensure serviceAccountKey.json is present in the /scripts directory and is valid.');
  }
}

// Export the initialized admin database instance.
export const adminDb = admin.firestore();

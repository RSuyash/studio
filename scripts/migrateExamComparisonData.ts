import * as admin from 'firebase-admin';
import * as path from 'path';
import { examComparisonData } from '../src/lib/exam-comparison-data';
import * as dotenv from 'dotenv';

// Load environment variables from .env file at the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Standardized Firebase Admin SDK initialization
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.error('Firebase credentials not found in .env file. Please ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.');
    process.exit(1);
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey: privateKey.replace(/\\n/g, '\n'),
        clientEmail,
      }),
    });
    console.log('Firebase Admin SDK initialized successfully for exam comparison migration.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

const migrateExamComparisonData = async () => {
  const collectionRef = db.collection('examComparisons');
  let batch = db.batch();
  let writeCount = 0;

  console.log(`Starting migration of ${examComparisonData.length} exam comparison records...`);

  const sanitizeDocumentId = (id: string): string => {
    return id.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
  };

  for (const item of examComparisonData) {
    const sanitizedExamId = sanitizeDocumentId(item.exam);
    const docRef = collectionRef.doc(sanitizedExamId);
    batch.set(docRef, item);
    writeCount++;

    if (writeCount % 499 === 0) {
      await batch.commit();
      console.log(`Batch committed after writing ${writeCount} records.`);
      batch = db.batch();
    }
  }

  if (writeCount > 0 && writeCount % 499 !== 0) {
    await batch.commit();
    console.log(`Final batch committed.`);
  }

  console.log(`Successfully migrated ${writeCount} exam comparison records to Firestore.`);
};

migrateExamComparisonData().catch((error) => {
    console.error("Error during exam comparison data migration:", error);
});

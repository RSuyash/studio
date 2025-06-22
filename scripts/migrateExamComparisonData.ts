import * as admin from 'firebase-admin';
import * as path from 'path';
import { examComparisonData } from '../src/lib/exam-comparison-data';

// Standardized Firebase Admin SDK initialization
if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
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

  try {
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

    if (writeCount % 499 !== 0) {
      await batch.commit();
      console.log(`Final batch committed.`);
    }

    console.log(`Successfully migrated ${writeCount} exam comparison records to Firestore.`);

  } catch (error) {
    console.error("Error during exam comparison data migration:", error);
  }
};

migrateExamComparisonData();

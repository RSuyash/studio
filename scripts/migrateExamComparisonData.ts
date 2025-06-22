import * as admin from 'firebase-admin';
import * as path from 'path';
import { examComparisonData } from '../src/lib/exam-comparison-data';

// Initialize Firebase Admin SDK
// Replace './serviceAccountKey.json' with the actual path to your service account key file
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


const db = admin.firestore();

const migrateExamComparisonData = async () => {
  const collectionRef = db.collection('examComparisons');
  let batch = db.batch(); // Use 'let' so we can reassign
  let writeCount = 0;

  console.log(`Starting migration of ${examComparisonData.length} exam comparison records...`);

  const sanitizeDocumentId = (id: string): string => {
    // Remove characters not allowed in Firestore document IDs and convert to lowercase
    return id.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
  };

  try {
    examComparisonData.forEach(item => {
      // Use the 'exam' field as the document ID for easy querying if it's unique
      // Otherwise, Firestore will auto-generate an ID
      const sanitizedExamId = sanitizeDocumentId(item.exam);
      const docRef = collectionRef.doc(sanitizedExamId); // Use sanitized exam name as ID
      batch.set(docRef, item);
      writeCount++;

      // Commit the batch periodically to avoid exceeding the maximum batch size (500 writes)
      if (writeCount % 499 === 0) {
        batch.commit().then(() => {
          console.log(`Batch committed after writing ${writeCount} records.`);
        }).catch(error => {
          console.error("Error committing batch:", error);
        });
        // Start a new batch
        batch = db.batch();
      }
    });
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

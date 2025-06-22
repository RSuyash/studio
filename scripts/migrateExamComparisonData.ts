import * as admin from 'firebase-admin';
import { examComparisonData } from '../src/lib/exam-comparison-data';

// Initialize Firebase Admin SDK
// Replace './serviceAccountKey.json' with the actual path to your service account key file
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const migrateExamComparisonData = async () => {
  const collectionRef = db.collection('examComparisons');
  let batch = db.batch(); // Use 'let' so we can reassign
  let writeCount = 0;

  console.log(`Starting migration of ${examComparisonData.length} exam comparison records...`);

  try {
    examComparisonData.forEach(item => {
      // Use the 'exam' field as the document ID for easy querying if it's unique
      // Otherwise, Firestore will auto-generate an ID
      const docRef = collectionRef.doc(item.exam.replace(/\s+/g, '-').toLowerCase()); // Example: use a slugified exam name as ID
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
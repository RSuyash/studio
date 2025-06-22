import { examComparisonData } from '../src/lib/exam-comparison-data';
import { getAdminDb } from '../src/lib/firebase-admin';

const db = getAdminDb();

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

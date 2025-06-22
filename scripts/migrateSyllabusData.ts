import * as admin from 'firebase-admin';
import * as path from 'path';
import { initialSyllabusData, SyllabusTopic } from '../src/lib/syllabus-data'; // Adjust the import path if necessary

// Initialize Firebase Admin SDK
// Ensure you have downloaded your service account key and placed it in your project
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json')); // Adjust the path to your service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const migrateSyllabusData = async () => {
  console.log('Starting syllabus data migration...');

  const syllabusCollectionRef = db.collection('syllabus');
  let batch = db.batch();
  let batchCount = 0;

  const processTopic = async (topic: SyllabusTopic, parentDocRef?: admin.firestore.DocumentReference) => {
    const topicData: any = { ...topic };
    delete topicData.subtopics; // Don't embed subtopics directly, use subcollections

    let docRef: admin.firestore.DocumentReference;
    if (parentDocRef) {
      // This is a subtopic, create a document in the parent's subtopics subcollection
      docRef = parentDocRef.collection('subtopics').doc(topic.id);
    } else {
      // This is a top-level topic, create a document in the main syllabus collection
      docRef = syllabusCollectionRef.doc(topic.id);
    }

    batch.set(docRef, topicData);
    batchCount++;

    // Commit batch if it reaches the limit (500 operations per batch)
    if (batchCount === 500) {
      console.log('Committing batch...');
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
      // Start a new batch
      // Note: In a real-world large migration, you'd need to handle creating a new batch object
      // and potentially new batchCount variable scope or pass it around.
      // For simplicity here, we'll just log and continue (assuming data isn't excessively large).
      console.warn('Batch limit reached. Data might not be fully migrated in one run without batch handling logic.');
    }


    // Recursively process subtopics
    if (topic.subtopics && topic.subtopics.length > 0) {
      for (const subtopic of topic.subtopics) {
        await processTopic(subtopic, docRef);
      }
    }
  };

  try {
    // Process top-level topics
    for (const topic of initialSyllabusData) {
      await processTopic(topic);
    }

    // Commit the remaining batch
    if (batchCount > 0) {
      console.log('Committing final batch...');
      await batch.commit();
    }

    console.log('Syllabus data migration completed successfully!');
  } catch (error) {
    console.error('Error migrating syllabus data:', error);
  }
};

migrateSyllabusData();

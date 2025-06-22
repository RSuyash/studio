import type * as admin from 'firebase-admin';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { initialSyllabusData, type SyllabusTopic } from '../src/lib/syllabus-data';
import { getAdminDb } from '../src/lib/firebase-admin';

// Load environment variables from .env file at the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = getAdminDb();

const migrateSyllabusData = async () => {
  console.log('Starting syllabus data migration...');

  const syllabusCollectionRef = db.collection('syllabus');
  let batch = db.batch();
  let batchCount = 0;

  const processTopic = async (topic: SyllabusTopic, parentDocRef?: admin.firestore.DocumentReference) => {
    const { subtopics, ...topicData } = topic;

    let docRef: admin.firestore.DocumentReference;
    if (parentDocRef) {
      docRef = parentDocRef.collection('subtopics').doc(topic.id);
    } else {
      docRef = syllabusCollectionRef.doc(topic.id);
    }

    batch.set(docRef, topicData);
    batchCount++;

    if (batchCount >= 499) {
      await batch.commit();
      console.log(`Committing batch of ${batchCount} writes.`);
      batch = db.batch();
      batchCount = 0;
    }

    if (subtopics && subtopics.length > 0) {
      for (const subtopic of subtopics) {
        await processTopic(subtopic, docRef);
      }
    }
  };

  for (const topic of initialSyllabusData) {
    await processTopic(topic);
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log('Committing final batch...');
  }

  console.log('Syllabus data migration completed successfully!');
};

migrateSyllabusData().catch((error) => {
    console.error('Error migrating syllabus data:', error);
});

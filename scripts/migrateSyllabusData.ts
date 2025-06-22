import * as admin from 'firebase-admin';
import * as path from 'path';
import { initialSyllabusData, SyllabusTopic } from '../src/lib/syllabus-data';

// Standardized Firebase Admin SDK initialization
if (!admin.apps.length) {
  try {
    const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully for syllabus migration.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

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

    if (batchCount >= 500) {
      console.log('Committing batch...');
      await batch.commit();
      batch = db.batch();
      batchCount = 0;
    }

    if (subtopics && subtopics.length > 0) {
      for (const subtopic of subtopics) {
        await processTopic(subtopic, docRef);
      }
    }
  };

  try {
    for (const topic of initialSyllabusData) {
      await processTopic(topic);
    }

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

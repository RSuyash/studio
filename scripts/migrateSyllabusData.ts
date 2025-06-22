import * as admin from 'firebase-admin';
import * as path from 'path';
import { initialSyllabusData, SyllabusTopic } from '../src/lib/syllabus-data';
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

import * as admin from 'firebase-admin';
import * as path from 'path';
import { upscCseExam } from '../src/lib/exam-data';
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
    console.log('Firebase Admin SDK initialized successfully for exam data migration.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1);
  }
}

const db = admin.firestore();

const migrateExamData = async () => {
  const examRef = db.collection('exams').doc(upscCseExam.id);
  const examData = {
    id: upscCseExam.id,
    title: upscCseExam.title,
    description: upscCseExam.description,
    finalScore: upscCseExam.finalScore,
  };

  await examRef.set(examData);
  console.log(`Upserted Exam: ${upscCseExam.title}`);

  for (const stage of upscCseExam.stages) {
    const stageRef = examRef.collection('stages').doc(stage.title.replace(/\s+/g, '-').toLowerCase());
    const { papers, subStages, ...stageData } = stage;
    await stageRef.set(stageData);
    console.log(`  Upserted Stage: ${stage.title}`);

    if (papers && papers.length > 0) {
      for (const paper of papers) {
        const paperRef = stageRef.collection('papers').doc(paper.name.replace(/\s+/g, '-').toLowerCase());
        await paperRef.set(paper);
        console.log(`    Upserted Paper: ${paper.name}`);
      }
    }

    if (subStages && subStages.length > 0) {
        for (const subStage of subStages) {
            const subStageRef = stageRef.collection('subStages').doc(subStage.title.replace(/\s+/g, '-').toLowerCase());
            const { papers: subPapers, ...subStageData } = subStage;
            await subStageRef.set(subStageData);
            console.log(`    Upserted SubStage: ${subStage.title}`);

             if (subPapers && subPapers.length > 0) {
                for (const paper of subPapers) {
                    const paperRef = subStageRef.collection('papers').doc(paper.name.replace(/\s+/g, '-').toLowerCase());
                    await paperRef.set(paper);
                    console.log(`      Upserted Paper: ${paper.name}`);
                }
            }
        }
    }
  }

  console.log('Exam data migration completed successfully.');
};

migrateExamData().catch((error) => {
  console.error('Error during exam data migration:', error);
});

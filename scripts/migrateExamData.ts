import * as admin from 'firebase-admin';
import { upscCseExam, Exam, Stage, Paper } from '../src/lib/exam-data'; // Assuming the path is correct

// Initialize Firebase Admin SDK
// Replace './serviceAccountKey.json' with the actual path to your service account key file
try {
  admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (error: any) {
  if (error.code === 'app/duplicate-app') {
    console.log('Firebase Admin SDK already initialized.');
  } else {
    console.error('Error initializing Firebase Admin SDK:', error);
    process.exit(1); // Exit if initialization fails
  }
}


const db = admin.firestore();

const migrateExamData = async () => {
  let batch = db.batch();
  const examRef = db.collection('exams').doc(upscCseExam.id);

  // Add the main exam document
  batch.set(examRef, {
    id: upscCseExam.id,
    title: upscCseExam.title,
    description: upscCseExam.description,
    finalScore: upscCseExam.finalScore, // Embed finalScore
  });

  console.log(`Adding Exam: ${upscCseExam.title}`);

  // Keep track of documents added to the batch to manage batch size
  let batchSize = 0;
  const MAX_BATCH_SIZE = 500; // Firestore limit is 500



  // Add stages as subcollections
  for (const stage of upscCseExam.stages) {
    const stageRef = examRef.collection('stages').doc(); // Firestore generates stage ID

    batch.set(stageRef, {
      title: stage.title,
      description: stage.description,
      notes: stage.notes || null,
    });

    batchSize++;

    if (batchSize >= MAX_BATCH_SIZE) {
        await batch.commit();
        batch = db.batch();
        batchSize = 0;
        console.log('  Batch committed. Starting new batch.');
    }

    console.log(`  Adding Stage: ${stage.title}`);

    // Add papers as subcollections under the stage
    if (stage.papers && stage.papers.length > 0) {
      for (const paper of stage.papers) {
        const paperRef = stageRef.collection('papers').doc(); // Firestore generates paper ID
        batch.set(paperRef, paper);
        batchSize++;
        if (batchSize >= MAX_BATCH_SIZE) {
            await batch.commit();
            batch = db.batch();
            batchSize = 0; // Reset batch size
        console.log('    Batch committed. Starting new batch.');
        }
        console.log(`    Adding Paper: ${paper.name}`);
      }
    }

    // Add subStages as subcollections under the stage
    if (stage.subStages && stage.subStages.length > 0) {
        for (const subStage of stage.subStages) {
            const subStageRef = stageRef.collection('subStages').doc(); // Firestore generates subStage ID
            batch.set(subStageRef, {
                title: subStage.title,
                description: subStage.description,
                syllabus: subStage.syllabus || null, // Embed syllabus if it exists
            });
            console.log(`    Adding SubStage: ${subStage.title}`);
            batchSize++;
            if (batchSize >= MAX_BATCH_SIZE) {
                await batch.commit();
                batch = db.batch();
                batchSize = 0; // Reset batch size
        console.log('    Batch committed. Starting new batch.');
            }

             // If sub-stages can have their own nested sub-stages or papers, you'd recurse here
             // This example assumes sub-stages only have syllabus and not further complex nesting of papers/stages.
             // If they do, you'd need a recursive function or similar logic.

            // You might need to add more logic here if subStages have nested subtopics or resources
            // Similar to how the syllabus migration handles nested subtopics.
            // For the current structure, embedding syllabus is done above.
        }
    }
  }

  // Commit the final batch if there are any remaining documents
  try {
    if (batchSize > 0) {
        await batch.commit();
        console.log(`Committed final batch with ${batchSize} documents.`);
    } else {
        console.log('No remaining documents to commit in the final batch.');
    }
    console.log('Exam data migration completed successfully.');
  } catch (error) {
    console.error('Error committing exam data migration batch:', error);
  }
};

migrateExamData().catch((error) => {
  console.error('Error during exam data migration:', error);
});
import * as path from 'path';
import * as dotenv from 'dotenv';
import { upscCseExam } from '../src/lib/exam-data';
import { getAdminDb } from '../src/lib/firebase-admin';

// Load environment variables from .env file at the project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const db = getAdminDb();

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

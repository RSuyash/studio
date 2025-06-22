import { mpscRajyasevaExam } from '../src/lib/mpsc-exam-data';
import { getAdminDb } from '../src/lib/firebase-admin';

const db = getAdminDb();

const migrateMpscData = async () => {
  const examRef = db.collection('exams').doc(mpscRajyasevaExam.id);
  const examData = {
    id: mpscRajyasevaExam.id,
    title: mpscRajyasevaExam.title,
    description: mpscRajyasevaExam.description,
    finalScore: mpscRajyasevaExam.finalScore,
  };

  await examRef.set(examData);
  console.log(`Upserted Exam: ${mpscRajyasevaExam.title}`);

  for (const stage of mpscRajyasevaExam.stages) {
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

  console.log('MPSC exam data migration completed successfully.');
};

migrateMpscData().catch((error) => {
  console.error('Error during MPSC exam data migration:', error);
});

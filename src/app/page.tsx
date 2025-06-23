import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { getSyllabusDataForExam, getResourceData, getExamData, getComparisonData, getSavedStudyPlans } from '@/lib/data-service';

export default async function Home() {
  // Fetch all data dynamically
  const comparisonData = await getComparisonData();
  comparisonData.sort((a, b) => a.exam.localeCompare(b.exam));
  
  const upscSyllabusData = await getSyllabusDataForExam('upsc');
  const mpscSyllabusData = await getSyllabusDataForExam('mpsc');
  const ifosSyllabusData = await getSyllabusDataForExam('ifos');
  
  const allResourceData = await getResourceData();
  
  const upscExamData = await getExamData('upsc');
  const mpscExamData = await getExamData('mpsc');
  const ifosExamData = await getExamData('ifos');

  const savedPlansData = await getSavedStudyPlans();

  return (
    <>
      <MainLayout 
        comparisonData={comparisonData} 
        upscSyllabusData={upscSyllabusData}
        mpscSyllabusData={mpscSyllabusData}
        ifosSyllabusData={ifosSyllabusData}
        resourceData={allResourceData}
        upscExamData={upscExamData}
        mpscExamData={mpscExamData}
        ifosExamData={ifosExamData}
        savedPlansData={savedPlansData}
      />
      <Toaster />
    </>
  );
}

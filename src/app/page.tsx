import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { examComparisonData } from "@/lib/exam-comparison-data";
import { getSyllabusDataForExam, getResourceData, getExamData } from '@/lib/data-service';
import type { ExamComparisonData, Exam } from "@/lib/types";

export default async function Home() {
  // Static data can still be sourced from local files
  const comparisonData: ExamComparisonData[] = examComparisonData.sort((a, b) => a.exam.localeCompare(b.exam));
  
  // Fetch dynamic data from the database (or fallback to TS files)
  const upscSyllabusData = await getSyllabusDataForExam('upsc');
  const mpscSyllabusData = await getSyllabusDataForExam('mpsc');
  const ifosSyllabusData = await getSyllabusDataForExam('ifos');
  
  const allResourceData = await getResourceData();
  
  const upscExamData = await getExamData('upsc');
  const mpscExamData = await getExamData('mpsc');
  const ifosExamData = await getExamData('ifos');

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
      />
      <Toaster />
    </>
  );
}

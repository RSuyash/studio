import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { examComparisonData } from "@/lib/exam-comparison-data";
import { getSyllabusDataForExam, getResourceData } from '@/lib/data-service';
import type { ExamComparisonData } from "@/lib/types";

export default async function Home() {
  // Static data can still be sourced from local files
  const comparisonData: ExamComparisonData[] = examComparisonData.sort((a, b) => a.exam.localeCompare(b.exam));
  
  // Fetch dynamic data from the database (or fallback to TS files)
  const upscSyllabusData = await getSyllabusDataForExam('upsc');
  const mpscSyllabusData = await getSyllabusDataForExam('mpsc');
  const allResourceData = await getResourceData();

  return (
    <>
      <MainLayout 
        comparisonData={comparisonData} 
        upscSyllabusData={upscSyllabusData}
        mpscSyllabusData={mpscSyllabusData}
        resourceData={allResourceData}
      />
      <Toaster />
    </>
  );
}

import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { fetchDataFromFirestoreOnServer } from "@/services/server/dataService";
import type { ExamComparisonData } from "@/lib/exam-comparison-data";

export default async function Home() {
  let comparisonData: ExamComparisonData[] = [];
  let comparisonDataError: string | null = null;
  
  try {
    const fetchedData = await fetchDataFromFirestoreOnServer('examComparisons');
    // Simple sort to ensure a consistent order
    comparisonData = (fetchedData as ExamComparisonData[]).sort((a, b) => a.exam.localeCompare(b.exam));
  } catch (err: any) {
    console.error("Error fetching exam comparison data on server:", err);
    comparisonDataError = "Failed to load exam comparison data. Please ensure your Firebase configuration is correct, the migration script has been run, and Firestore security rules allow server-side reads.";
  }

  return (
    <>
      <MainLayout comparisonData={comparisonData} comparisonDataError={comparisonDataError} />
      <Toaster />
    </>
  );
}

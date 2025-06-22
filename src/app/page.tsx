import MainLayout from "@/components/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { examComparisonData, type ExamComparisonData } from "@/lib/exam-comparison-data";

export default function Home() {
  // Data is now sourced directly from a local TypeScript file.
  const comparisonData = examComparisonData.sort((a, b) => a.exam.localeCompare(b.exam));

  return (
    <>
      <MainLayout comparisonData={comparisonData} />
      <Toaster />
    </>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExamComparisonData } from '@/lib/exam-comparison-data';
import { fetchDataFromFirestoreOnServer } from '@/services/server/dataService';


export default async function ExamComparisonTable() {
  let data: ExamComparisonData[] = [];
  let error: string | null = null;

  try {
    const fetchedData = await fetchDataFromFirestoreOnServer('examComparisons');
    // Simple sort to ensure a consistent order
    data = (fetchedData as ExamComparisonData[]).sort((a, b) => a.exam.localeCompare(b.exam));
  } catch (err) {
    console.error("Error fetching exam comparison data:", err);
    error = "Failed to load exam comparison data. Please ensure your Firebase configuration is correct, the migration script has been run, and Firestore security rules allow server-side reads.";
  }
  
  if (error) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive/50 bg-destructive/10 p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">Error Loading Data</h3>
            <p className="max-w-md text-sm text-destructive/80">{error}</p>
        </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Exam</TableHead>
            <TableHead>Major Topics</TableHead>
            <TableHead>Overlap with UPSC GS</TableHead>
            <TableHead>Notes (Gaps)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((exam: ExamComparisonData, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{exam.exam}</TableCell>
              <TableCell>{exam.majorTopics}</TableCell>
              <TableCell>{exam.overlap}</TableCell>
              <TableCell>{exam.notes}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">No data found. Please run the `npm run migrate:comparison` script.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

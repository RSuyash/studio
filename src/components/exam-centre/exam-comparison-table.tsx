import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExamComparisonData } from '@/lib/exam-comparison-data';

interface ExamComparisonTableProps {
  data: ExamComparisonData[];
  error: string | null;
}

export default function ExamComparisonTable({ data, error }: ExamComparisonTableProps) {
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

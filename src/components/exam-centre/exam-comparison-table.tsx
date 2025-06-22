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
}

export default function ExamComparisonTable({ data }: ExamComparisonTableProps) {
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
          {data.map((exam: ExamComparisonData, index: number) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{exam.exam}</TableCell>
              <TableCell>{exam.majorTopics}</TableCell>
              <TableCell>{exam.overlap}</TableCell>
              <TableCell>{exam.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

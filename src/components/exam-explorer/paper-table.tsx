
import { type Paper } from '@/lib/exam-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PaperTable({ papers }: { papers: Paper[] }) {
  if (!papers || papers.length === 0) return null;

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Qualifying Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.map((paper, index) => (
            <TableRow key={index} className={paper.nature === 'Qualifying' ? 'bg-muted/50' : ''}>
              <TableCell className="font-medium">{paper.name}</TableCell>
              <TableCell>{paper.subject}</TableCell>
              <TableCell>{paper.duration}</TableCell>
              <TableCell>{paper.marks}</TableCell>
              <TableCell>{paper.qualifyingMarks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

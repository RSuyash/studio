
import * as React from 'react';
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
            <React.Fragment key={index}>
              <TableRow className={paper.nature === 'Qualifying' ? 'bg-muted/50' : ''}>
                <TableCell className="font-medium">{paper.name}</TableCell>
                <TableCell>{paper.subject}</TableCell>
                <TableCell>{paper.duration}</TableCell>
                <TableCell>{paper.marks}</TableCell>
                <TableCell>{paper.qualifyingMarks}</TableCell>
              </TableRow>
              {paper.syllabus && paper.syllabus.length > 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="p-4 bg-card">
                     <div className="space-y-2 rounded-md border border-dashed bg-muted/25 p-3">
                        {paper.syllabus.map((item, i) => {
                           if (item.startsWith('**') && item.endsWith('**')) {
                               return <h4 key={i} className="font-semibold text-sm text-foreground mt-2 first:mt-0">{item.replace(/\*\*/g, '')}</h4>;
                           }
                           return <p key={i} className="text-xs text-muted-foreground pl-2">{item}</p>;
                        })}
                     </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

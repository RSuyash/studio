
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Stage } from '@/lib/exam-data';
import PaperTable from './paper-table';

interface StageCardProps {
  stage: Stage;
  stageNumber: number;
}

export default function StageCard({ stage, stageNumber }: StageCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{stageNumber}</span>
            {stage.title}
        </CardTitle>
        <CardDescription>{stage.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stage.papers && <PaperTable papers={stage.papers} />}
        
        {stage.notes && stage.notes.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Key Assessment Areas</h4>
             <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {stage.notes.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

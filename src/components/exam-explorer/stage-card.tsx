
import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Stage } from '@/lib/types';
import PaperTable from './paper-table';
import { CheckCircle } from 'lucide-react';

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
             <div className="space-y-2">
              {stage.notes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { type SyllabusTopic } from '@/lib/syllabus-data';

interface FocusModeDialogProps {
  topic: SyllabusTopic | null;
  isOpen: boolean;
  onClose: () => void;
}

const masteryTextMap: Record<SyllabusTopic['mastery'], string> = {
  none: 'Not Started',
  novice: 'Novice',
  advanced: 'Advanced',
  expert: 'Expert',
};

export default function FocusModeDialog({ topic, isOpen, onClose }: FocusModeDialogProps) {
  if (!topic) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{topic.title}</DialogTitle>
          <DialogDescription className="pt-2">
            {topic.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Mastery Level</h4>
              <p>{masteryTextMap[topic.mastery]}</p>
            </div>
             <div>
              <h4 className="text-sm font-semibold text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {topic.tags.length > 0 ? (
                  topic.tags.map((tag) => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">No tags.</p>
                )}
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

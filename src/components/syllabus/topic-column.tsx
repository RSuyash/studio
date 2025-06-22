
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type SyllabusTopic } from '@/lib/syllabus-data';

export const TopicColumn = ({ topics, title, onSelect }: { topics: SyllabusTopic[], title: string, onSelect: (id: string) => void }) => {
  return (
    <div className="h-full w-full flex-shrink-0 md:w-80 md:border-r">
      <div className="p-4">
        <h2 className="font-headline text-lg font-bold tracking-tight text-primary">{title}</h2>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-2">
          {topics.map(topic => {
            const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
            return (
              <button
                key={topic.id}
                onClick={() => onSelect(topic.id)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md p-3 text-left text-sm transition-colors',
                  'hover:bg-muted/50'
                )}
              >
                <span className="flex-1 truncate pr-2">{topic.title}</span>
                {hasSubtopics && <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

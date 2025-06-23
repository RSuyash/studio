
"use client";

import * as React from "react";
import type { SyllabusTopic } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, ChevronRight, Circle, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface SyllabusExplorerProps {
    data: SyllabusTopic[];
    selectedTopicId: string | null;
    onSelectTopic: (id: string) => void;
    title: string;
}

const TopicNode: React.FC<{
  topic: SyllabusTopic;
  level: number;
  selectedTopicId: string | null;
  onSelectTopic: (id: string) => void;
}> = ({ topic, level, selectedTopicId, onSelectTopic }) => {
  const [isExpanded, setIsExpanded] = React.useState(level < 1); // Expand top levels by default
  const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
  const isActive = selectedTopicId === topic.id;

  const Icon = topic.mastery === 'expert' ? CheckCircle : topic.mastery === 'advanced' ? Info : Circle;

  const handleSelect = () => {
    onSelectTopic(topic.id);
  };

  return (
    <div>
        <div className={cn(
            "group flex items-center gap-2 rounded-md pr-2",
            isActive && "bg-primary/10"
        )}>
            <Button
                variant="ghost"
                onClick={handleSelect}
                className={cn(
                  "flex-1 justify-start truncate whitespace-nowrap text-left font-normal",
                  isActive && "font-semibold text-primary",
                )}
                style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
            >
                <Icon className={cn("mr-2 h-4 w-4 shrink-0", 
                  topic.mastery === 'expert' ? 'text-green-500' : 'text-muted-foreground'
                )} />
                {topic.title}
            </Button>
            {hasSubtopics && (
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
                </Button>
            )}
        </div>
      {isExpanded && hasSubtopics && (
        <div className="flex flex-col">
          {topic.subtopics.map(subtopic => (
            <TopicNode 
              key={subtopic.id} 
              topic={subtopic} 
              level={level + 1} 
              selectedTopicId={selectedTopicId}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </div>
      )}
    </div>
  );
};


export const SyllabusExplorer: React.FC<SyllabusExplorerProps> = ({ data, selectedTopicId, onSelectTopic, title }) => {
  return (
    <div className="flex h-full flex-col">
       <div className="flex h-14 items-center px-4">
            <h3 className="text-lg font-medium">{title}</h3>
       </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {data.map(topic => (
                <TopicNode 
                    key={topic.id}
                    topic={topic}
                    level={0}
                    selectedTopicId={selectedTopicId}
                    onSelectTopic={onSelectTopic}
                />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};


"use client";

import * as React from "react";
import type { SyllabusTopic } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { findTopicById } from "@/lib/resource-utils";
import { SyllabusBreadcrumb } from "./syllabus-breadcrumb";
import { TopicColumn } from "./topic-column";
import { DetailPane } from "./detail-pane";


export const SyllabusExplorer = ({ data, onUpdate, onFocus }: { data: SyllabusTopic[], onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
  const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (data.length > 0 && selectedPath.length > 0) {
        let validPath = true;
        let currentTopics = data;
        for (const topicId of selectedPath) {
            const found = findTopicById(currentTopics, topicId);
            if (found) {
                currentTopics = found.subtopics || [];
            } else {
                validPath = false;
                break;
            }
        }
        if (!validPath) {
            setSelectedPath([]);
        }
    }
  }, [data, selectedPath]);
  
  const breadcrumbTopics: SyllabusTopic[] = React.useMemo(() => {
    const topics: SyllabusTopic[] = [];
    let currentLevelTopics = data;
    for (const topicId of selectedPath) {
      const foundTopic = findTopicById(currentLevelTopics, topicId);
      if (foundTopic) {
        topics.push(foundTopic);
        currentLevelTopics = foundTopic.subtopics || [];
      } else {
        break; 
      }
    }
    return topics;
  }, [data, selectedPath]);

  const activeColumnParent = breadcrumbTopics[breadcrumbTopics.length - 1];
  const activeTopics = activeColumnParent ? activeColumnParent.subtopics || [] : data;
  const activeColumnTitle = activeColumnParent ? activeColumnParent.title : "UPSC Syllabus";
  const detailTopic = activeColumnParent;
  
  const handleSelect = (topicId: string) => {
    setSelectedPath(prev => [...prev, topicId]);
  };
  
  const handleBreadcrumbClick = (level: number) => {
    setSelectedPath(prev => prev.slice(0, level));
  };
  
  const hasSubtopics = activeTopics && activeTopics.length > 0;
  
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-inner">
      <SyllabusBreadcrumb 
        topics={breadcrumbTopics}
        onClickHome={() => handleBreadcrumbClick(0)}
        onClickTopic={handleBreadcrumbClick}
      />
       <div className="flex flex-1 overflow-hidden">
        {hasSubtopics ? (
          <>
            <TopicColumn
              topics={activeTopics}
              title={activeColumnTitle}
              onSelect={handleSelect}
            />
            <Separator orientation="vertical" className="h-full" />
          </>
        ) : null}
        
        {detailTopic ? (
          <DetailPane topic={detailTopic} onUpdate={onUpdate} onFocus={onFocus} />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <Icons.Library className="h-16 w-16 mb-4 text-primary/50" />
            <h3 className="font-headline text-xl font-semibold">Welcome to Nexus Cortex</h3>
            <p className="max-w-md text-sm">Select a topic from the syllabus on the left to begin your journey. Each selection will reveal more details and sub-topics.</p>
          </div>
        )}
      </div>
    </div>
  );
};

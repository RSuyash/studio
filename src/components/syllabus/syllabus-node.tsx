"use client";

import * as React from "react";
import { ChevronRight, Maximize, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { type SyllabusTopic, type MasteryLevel } from "@/lib/syllabus-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MasteryControl from "./mastery-control";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SyllabusNodeProps {
  topic: SyllabusTopic;
  onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void;
  onFocus: (topic: SyllabusTopic) => void;
  level: number;
  isLastChild: boolean;
}

const masteryColorMap: Record<MasteryLevel, string> = {
  none: "border-transparent",
  novice: "border-l-4 border-yellow-400",
  advanced: "border-l-4 border-blue-400",
  expert: "border-l-4 border-green-400",
};

export default function SyllabusNode({ topic, onUpdate, onFocus, level = 0, isLastChild = false }: SyllabusNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(level < 1);
  const [newTag, setNewTag] = React.useState('');

  const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;

  const handleMasteryChange = (level: MasteryLevel) => {
    onUpdate(topic.id, { mastery: level });
  };
  
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag && !topic.tags.includes(newTag.toLowerCase())) {
      onUpdate(topic.id, { tags: [...topic.tags, newTag.toLowerCase().trim()] });
      setNewTag('');
    }
  };

  return (
    <div
      className={cn(
        "relative",
        level > 0 && "pl-6" // Indent sub-topics
      )}
    >
      {/* Connector lines for indented items */}
      {level > 0 && (
        <>
          {/* The vertical line that connects siblings. It's shorter for the last item. */}
          <div
            className="absolute -left-px w-px bg-border"
            style={{
              top: 0,
              height: isLastChild ? '2.5rem' : '100%',
            }}
          />
          {/* The horizontal line that connects to the card. "T" junction. */}
          <div className="absolute -left-px top-10 h-px w-6 bg-border" />
        </>
      )}
      <Card className={cn("mb-4", masteryColorMap[topic.mastery])}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
          {hasSubtopics && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 shrink-0"
              aria-expanded={isExpanded}
            >
              <ChevronRight
                className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
              />
            </Button>
          )}
          <div className="flex-1 grid gap-1">
            <CardTitle className="text-lg">{topic.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <MasteryControl
              currentLevel={topic.mastery}
              onLevelChange={handleMasteryChange}
            />
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onFocus(topic)}>
              <Maximize className="h-4 w-4" />
              <span className="sr-only">Focus Mode</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <CardDescription className="mb-4">{topic.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-2">
            {topic.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-6 w-6">
                    <Tag className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                 <form onSubmit={handleAddTag} className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Add Tag</h4>
                    <p className="text-sm text-muted-foreground">
                      Add a new tag to this topic.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="new-tag" className="sr-only">New Tag</Label>
                    <Input id="new-tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g. 'core-concept'"/>
                    <Button type="submit" size="sm">Add Tag</Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
      {hasSubtopics && (
        <div
          className={cn(
            "transform-gpu overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          {topic.subtopics?.map((subtopic, index) => (
            <SyllabusNode
              key={subtopic.id}
              topic={subtopic}
              onUpdate={onUpdate}
              onFocus={onFocus}
              level={level + 1}
              isLastChild={index === topic.subtopics.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

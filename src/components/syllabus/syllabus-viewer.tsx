"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { initialSyllabusData, type SyllabusTopic, type MasteryLevel } from "@/lib/syllabus-data";
import FocusModeDialog from "./focus-mode-dialog";
import FilterPanel from "./filter-panel";
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Maximize, ChevronRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Icons } from "@/components/icons";

// Helper function to find a topic by ID in the tree
const findTopicById = (topics: SyllabusTopic[], id: string): SyllabusTopic | null => {
  for (const topic of topics) {
    if (topic.id === id) return topic;
    if (topic.subtopics) {
      const found = findTopicById(topic.subtopics, id);
      if (found) return found;
    }
  }
  return null;
};

// Recursive function to update a topic in the nested structure
const updateTopicInTree = (
  topics: SyllabusTopic[],
  id: string,
  updates: Partial<SyllabusTopic>
): SyllabusTopic[] => {
  return topics.map((topic) => {
    if (topic.id === id) {
      return { ...topic, ...updates };
    }
    if (topic.subtopics) {
      return {
        ...topic,
        subtopics: updateTopicInTree(topic.subtopics, id, updates),
      };
    }
    return topic;
  });
};

// Recursive function to get all unique tags from the tree
const getAllTagsFromTree = (topics: SyllabusTopic[]): Set<string> => {
  const tags = new Set<string>();
  topics.forEach((topic) => {
    topic.tags.forEach((tag) => tags.add(tag));
    if (topic.subtopics) {
      getAllTagsFromTree(topic.subtopics).forEach((tag) => tags.add(tag));
    }
  });
  return tags;
};

// Recursive function to filter the syllabus
const filterSyllabus = (
  topics: SyllabusTopic[],
  selectedTags: Set<string>
): SyllabusTopic[] => {
  if (selectedTags.size === 0) {
    return topics;
  }

  return topics.reduce<SyllabusTopic[]>((acc, topic) => {
    const hasMatchingTag = Array.from(selectedTags).some(tag => topic.tags.includes(tag));
    const filteredSubtopics = topic.subtopics ? filterSyllabus(topic.subtopics, selectedTags) : [];
    
    if (hasMatchingTag || filteredSubtopics.length > 0) {
      acc.push({ ...topic, subtopics: filteredSubtopics });
    }
    return acc;
  }, []);
};


const BreadcrumbColumn = ({ topic, onClick }: { topic: SyllabusTopic; onClick: () => void }) => {
  const Icon = topic.icon ? Icons[topic.icon as keyof typeof Icons] || Icons.Folder : Icons.Folder;
  return (
    <div className="flex h-full w-16 flex-shrink-0 flex-col items-center border-r bg-muted/30 p-2">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mb-4 h-12 w-12 rounded-lg bg-background shadow-sm"
              onClick={onClick}
            >
              <Icon className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{topic.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Separator />
    </div>
  );
};

const TopicColumn = ({ topics, title, onSelect }: { topics: SyllabusTopic[], title: string, onSelect: (id: string) => void }) => {
  return (
    <div className="h-full w-80 flex-shrink-0 border-r">
      <div className="p-4">
        <h2 className="mb-4 text-lg font-bold tracking-tight text-primary">{title}</h2>
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


const DetailPane = ({ topic, onUpdate, onFocus }: { topic: SyllabusTopic, onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
    const [newTag, setNewTag] = React.useState('');

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
        <ScrollArea className="flex-1">
            <div className="p-6">
                <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="font-headline text-2xl text-primary">{topic.title}</CardTitle>
                        <div className="flex gap-2 flex-shrink-0">
                            <MasteryControl currentLevel={topic.mastery} onLevelChange={handleMasteryChange} />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onFocus(topic)}>
                                <Maximize className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardDescription>{topic.description}</CardDescription>
                    
                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Tags</h4>
                        <div className="flex flex-wrap items-center gap-2">
                            {topic.tags.length > 0 ? (
                                topic.tags.map((tag) => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)
                            ) : (
                                <p className="text-sm text-muted-foreground">No tags for this topic.</p>
                            )}
                            <Popover onOpenChange={(isOpen) => !isOpen && setNewTag('')}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-6 w-6">
                                        <Tag className="h-3 w-3" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-60">
                                    <form onSubmit={handleAddTag} className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Add Tag</h4>
                                            <p className="text-sm text-muted-foreground">Add a new tag to this topic.</p>
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
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
};

const SyllabusExplorer = ({ data, onUpdate, onFocus }: { data: SyllabusTopic[], onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
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
  
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-inner">
      {/* Home breadcrumb */}
      {selectedPath.length > 0 && (
        <BreadcrumbColumn 
          topic={{id: 'root', title: 'Home', description: '', tags: [], mastery: 'none', icon: 'Home'}} 
          onClick={() => handleBreadcrumbClick(0)} 
        />
      )}
      
      {/* Path breadcrumbs */}
      {breadcrumbTopics.map((topic, index) => (
          <BreadcrumbColumn key={topic.id} topic={topic} onClick={() => handleBreadcrumbClick(index + 1)} />
      ))}
      
      {/* Active Column */}
      {(activeTopics.length > 0) && (
        <TopicColumn
            topics={activeTopics}
            title={activeColumnTitle}
            onSelect={handleSelect}
        />
      )}
      
      {/* Detail Pane or Welcome message */}
      {detailTopic ? (
        <DetailPane topic={detailTopic} onUpdate={onUpdate} onFocus={onFocus} />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <Icons.Library className="h-16 w-16 mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold">Welcome to Nexus Cortex</h3>
          <p className="max-w-md text-sm">Select a topic from the syllabus on the left to begin your journey. Each selection will reveal more details and sub-topics.</p>
        </div>
      )}
    </div>
  );
};

export default function SyllabusViewer() {
  const [syllabusData, setSyllabusData] = React.useState(initialSyllabusData);
  const [focusTopic, setFocusTopic] = React.useState<SyllabusTopic | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(null);

  React.useEffect(() => {
    setPortalContainer(document.getElementById('sidebar-content-portal'));
  }, []);

  const handleUpdateTopic = React.useCallback(
    (id: string, updates: Partial<SyllabusTopic>) => {
      setSyllabusData((currentData) => updateTopicInTree(currentData, id, updates));
    },
    []
  );

  const handleFocusTopic = React.useCallback((topic: SyllabusTopic) => {
    setFocusTopic(topic);
  }, []);

  const handleTagToggle = React.useCallback((tag: string) => {
    setSelectedTags(prev => {
        const newTags = new Set(prev);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        return newTags;
    });
  }, []);

  const allTags = React.useMemo(() => Array.from(getAllTagsFromTree(initialSyllabusData)).sort(), []);
  const filteredData = React.useMemo(() => filterSyllabus(syllabusData, selectedTags), [syllabusData, selectedTags]);

  const filterPanel = (
    <FilterPanel 
      allTags={allTags}
      selectedTags={selectedTags}
      onTagToggle={handleTagToggle}
    />
  );
  
  return (
    <>
      {portalContainer ? ReactDOM.createPortal(filterPanel, portalContainer) : null}
      {filteredData.length > 0 ? (
        <SyllabusExplorer
          data={filteredData}
          onUpdate={handleUpdateTopic}
          onFocus={handleFocusTopic}
        />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center h-[calc(100vh-8rem)]">
          <h3 className="text-lg font-semibold">No topics match your filter.</h3>
          <p className="text-sm text-muted-foreground">Try selecting different tags or clearing the filter.</p>
        </div>
      )}
      <FocusModeDialog
        isOpen={!!focusTopic}
        topic={focusTopic}
        onClose={() => setFocusTopic(null)}
      />
    </>
  );
}

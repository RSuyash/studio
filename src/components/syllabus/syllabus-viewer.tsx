"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { initialSyllabusData, type SyllabusTopic, type MasteryLevel } from "@/lib/syllabus-data";
import FocusModeDialog from "./focus-mode-dialog";
import FilterPanel from "./filter-panel";
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Maximize, ChevronRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const SyllabusColumnItem = ({ topic, isSelected, onSelect }: { topic: SyllabusTopic, isSelected: boolean, onSelect: () => void }) => {
    const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
  
    return (
      <button
        onClick={onSelect}
        className={cn(
          'flex w-full items-center justify-between rounded-md p-3 text-left text-sm transition-colors',
          isSelected ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/50'
        )}
      >
        <span className="flex-1 truncate pr-2">{topic.title}</span>
        {hasSubtopics && <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />}
      </button>
    );
}

const SyllabusExplorer = ({ data, onUpdate, onFocus }: { data: SyllabusTopic[], onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
    const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
    const [newTag, setNewTag] = React.useState('');

    // Reset path if filtered data changes and path is no longer valid
    React.useEffect(() => {
        if (selectedPath.length > 0 && data.length > 0 && !findTopicById(data, selectedPath[0])) {
            setSelectedPath([]);
        }
    }, [data, selectedPath]);
  
    const columns = React.useMemo(() => {
      if (data.length === 0) return [];
      const cols: SyllabusTopic[][] = [data];
      let currentTopics = data;
  
      for (const id of selectedPath) {
        const selectedTopic = findTopicById(currentTopics, id);
        if (selectedTopic && selectedTopic.subtopics && selectedTopic.subtopics.length > 0) {
          cols.push(selectedTopic.subtopics);
          currentTopics = selectedTopic.subtopics;
        } else {
          break; 
        }
      }
      return cols;
    }, [data, selectedPath]);
  
    const activeTopic = React.useMemo(() => {
      if (selectedPath.length === 0 || data.length === 0) return null;
      return findTopicById(data, selectedPath[selectedPath.length - 1]);
    }, [data, selectedPath]);
    
    const handleSelectTopic = (topicId: string, level: number) => {
      const newPath = selectedPath.slice(0, level);
      newPath.push(topicId);
      setSelectedPath(newPath);
    };
    
    const handleMasteryChange = (level: MasteryLevel) => {
      if (activeTopic) {
          onUpdate(activeTopic.id, { mastery: level });
      }
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (activeTopic && newTag && !activeTopic.tags.includes(newTag.toLowerCase())) {
          onUpdate(activeTopic.id, { tags: [...activeTopic.tags, newTag.toLowerCase().trim()] });
          setNewTag('');
        }
      };
  
    return (
      <div className="flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-inner">
        <ScrollArea className="flex-shrink-0 border-r">
           <div className="flex h-full">
            {columns.map((columnTopics, level) => (
              <div key={level} className="h-full w-72 flex-shrink-0 border-r last:border-r-0">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    {columnTopics.map((topic) => (
                      <SyllabusColumnItem
                        key={topic.id}
                        topic={topic}
                        isSelected={selectedPath[level] === topic.id}
                        onSelect={() => handleSelectTopic(topic.id, level)}
                       />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <ScrollArea className="flex-1">
            <div className="p-6">
                {activeTopic ? (
                <div className="space-y-6">
                    <div className="flex items-start justify-between gap-4">
                        <CardTitle className="font-headline text-2xl text-primary">{activeTopic.title}</CardTitle>
                        <div className="flex gap-2 flex-shrink-0">
                            <MasteryControl currentLevel={activeTopic.mastery} onLevelChange={handleMasteryChange} />
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onFocus(activeTopic)}>
                            <Maximize className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardDescription>{activeTopic.description}</CardDescription>
                    
                    <div>
                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Tags</h4>
                    <div className="flex flex-wrap items-center gap-2">
                        {activeTopic.tags.length > 0 ? (
                        activeTopic.tags.map((tag) => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)
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
                    </div>
                </div>
                ) : (
                <div className="flex h-full min-h-[50vh] flex-col items-center justify-center text-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4"><path d="m15 12-8.5 8.5"/><path d="M12 15l8.5 8.5"/><path d="M12 12v9"/><path d="M12 3v1"/></svg>
                    <h3 className="text-lg font-semibold">Select a topic to view details</h3>
                    <p className="text-sm">Choose from the list on the left to start exploring.</p>
                </div>
                )}
            </div>
        </ScrollArea>
      </div>
    );
}

export default function SyllabusViewer() {
  const [syllabusData, setSyllabusData] = React.useState(initialSyllabusData);
  const [focusTopic, setFocusTopic] = React.useState<SyllabusTopic | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(null);

  React.useEffect(() => {
    // Find portal container after mount on client
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

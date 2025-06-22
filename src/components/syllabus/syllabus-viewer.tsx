
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { initialSyllabusData, type SyllabusTopic, type MasteryLevel, type Resource } from "@/lib/syllabus-data";
import FocusModeDialog from "./focus-mode-dialog";
import FilterPanel from "./filter-panel";
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Maximize, ChevronRight, Tag, Link, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MindMapView = dynamic(() => import("./mind-map-view"), {
  ssr: false,
  loading: () => <Skeleton className="h-[75vh] w-full rounded-lg border bg-card" />,
});


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

const SyllabusBreadcrumb = ({ topics, onClickHome, onClickTopic }: { topics: SyllabusTopic[], onClickHome: () => void, onClickTopic: (index: number) => void }) => {
    const HomeIcon = Icons['Home'];
    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2 md:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onClickHome}>
                <HomeIcon className="h-4 w-4" />
            </Button>
            {topics.map((topic, index) => (
                <React.Fragment key={topic.id}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Button variant="ghost" className="h-8 px-2 text-left" onClick={() => onClickTopic(index + 1)}>
                        {topic.title}
                    </Button>
                </React.Fragment>
            ))}
        </div>
    )
}

const TopicColumn = ({ topics, title, onSelect }: { topics: SyllabusTopic[], title: string, onSelect: (id: string) => void }) => {
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


const DetailPane = ({ topic, onUpdate, onFocus }: { topic: SyllabusTopic, onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
    // State for adding new items
    const [newTag, setNewTag] = React.useState('');
    const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);
    const [newResourceTitle, setNewResourceTitle] = React.useState('');
    const [newResourceUrl, setNewResourceUrl] = React.useState('');
    const [resourcePopoverOpen, setResourcePopoverOpen] = React.useState(false);
    
    // State for editing/deleting resources
    const [editingResource, setEditingResource] = React.useState<Resource | null>(null);
    const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [editUrl, setEditUrl] = React.useState('');
    
    React.useEffect(() => {
        if (editingResource) {
            setEditTitle(editingResource.title);
            setEditUrl(editingResource.url);
        }
    }, [editingResource]);

    const handleMasteryChange = (level: MasteryLevel) => {
        onUpdate(topic.id, { mastery: level });
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag && !topic.tags.includes(newTag.toLowerCase())) {
            onUpdate(topic.id, { tags: [...topic.tags, newTag.toLowerCase().trim()] });
            setNewTag('');
            setTagPopoverOpen(false);
        }
    };
    
    const handleAddResource = (e: React.FormEvent) => {
        e.preventDefault();
        if (newResourceTitle && newResourceUrl) {
            let url = newResourceUrl;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = `https://${url}`;
            }
            const newResource: Resource = {
                id: `res-${Date.now()}`,
                title: newResourceTitle,
                url: url,
            };
            const updatedResources = [...(topic.resources || []), newResource];
            onUpdate(topic.id, { resources: updatedResources });
            setNewResourceTitle('');
            setNewResourceUrl('');
            setResourcePopoverOpen(false);
        }
    };

    const handleEditResourceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingResource || !editTitle || !editUrl) return;
        
        let url = editUrl;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }
        
        const updatedResource: Resource = { ...editingResource, title: editTitle, url };
        const updatedResources = (topic.resources || []).map(r => r.id === updatedResource.id ? updatedResource : r);
        
        onUpdate(topic.id, { resources: updatedResources });
        setEditingResource(null);
    };

    const handleConfirmDelete = () => {
        if (!resourceToDelete) return;
        const updatedResources = (topic.resources || []).filter(r => r.id !== resourceToDelete.id);
        onUpdate(topic.id, { resources: updatedResources });
        setResourceToDelete(null);
    };
    
    return (
        <ScrollArea className="hidden flex-1 md:block">
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
                            <Popover open={tagPopoverOpen} onOpenChange={(isOpen) => { setTagPopoverOpen(isOpen); if (!isOpen) setNewTag(''); }}>
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

                    <Separator />

                    <div>
                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Resources</h4>
                        <div className="space-y-2">
                            {(topic.resources && topic.resources.length > 0) ? (
                                topic.resources.map((resource) => (
                                    <div key={resource.id} className="group flex items-center gap-3 rounded-md border p-3 transition-colors">
                                        <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm font-medium hover:underline">
                                            {resource.title}
                                        </a>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => setEditingResource(resource)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => setResourceToDelete(resource)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No resources added for this topic yet.</p>
                            )}
                        </div>
                         <Popover open={resourcePopoverOpen} onOpenChange={(isOpen) => { setResourcePopoverOpen(isOpen); if(!isOpen) { setNewResourceTitle(''); setNewResourceUrl(''); } }}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Resource
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <form onSubmit={handleAddResource} className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Add Resource</h4>
                                        <p className="text-sm text-muted-foreground">Add a link to a helpful resource.</p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="resource-title">Title</Label>
                                        <Input id="resource-title" value={newResourceTitle} onChange={(e) => setNewResourceTitle(e.target.value)} placeholder="e.g., 'NCERT Chapter PDF'" />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="resource-url">URL</Label>
                                        <Input id="resource-url" value={newResourceUrl} onChange={(e) => setNewResourceUrl(e.target.value)} placeholder="example.com" />
                                    </div>
                                    <Button type="submit" size="sm">Add Resource</Button>
                                </form>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>
            {/* Edit Resource Dialog */}
            <Dialog open={!!editingResource} onOpenChange={(isOpen) => !isOpen && setEditingResource(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Resource</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditResourceSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-resource-title">Title</Label>
                            <Input id="edit-resource-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-resource-url">URL</Label>
                            <Input id="edit-resource-url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!resourceToDelete} onOpenChange={(isOpen) => !isOpen && setResourceToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                           This action cannot be undone. This will permanently delete the resource "{resourceToDelete?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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

export default function SyllabusViewer({ syllabusData, onUpdate }: { syllabusData: SyllabusTopic[], onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void }) {
  const [focusTopic, setFocusTopic] = React.useState<SyllabusTopic | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());

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
  
  return (
    <>
      <div className="flex h-full items-start gap-6">
        <aside className="sticky top-6 hidden w-64 flex-shrink-0 lg:block">
          <FilterPanel 
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </aside>
        <div className="min-w-0 flex-1">
          <Tabs defaultValue="explorer" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="explorer">Explorer</TabsTrigger>
              <TabsTrigger value="mindmap">
                Mind Map
              </TabsTrigger>
              <TabsTrigger value="timeline" disabled>
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explorer">
              {filteredData.length > 0 ? (
                <SyllabusExplorer
                  data={filteredData}
                  onUpdate={onUpdate}
                  onFocus={handleFocusTopic}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
                  <h3 className="text-lg font-semibold">No topics match your filter.</h3>
                  <p className="text-sm text-muted-foreground">Try selecting different tags or clearing the filter.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="mindmap">
              <MindMapView data={syllabusData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FocusModeDialog
        isOpen={!!focusTopic}
        topic={focusTopic}
        onClose={() => setFocusTopic(null)}
      />
    </>
  );
}

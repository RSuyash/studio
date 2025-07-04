
"use client";

import * as React from "react";
import type { SyllabusTopic, MasteryLevel, Resource, ResourceCategory } from "@/lib/types";
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Tag, Plus, MoreVertical, Edit, Trash2, Library, Book, Video, FileText, StickyNote, BarChartHorizontal, ChevronRight, HelpCircle, Target, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SyllabusBreadcrumb } from "./syllabus-breadcrumb";
import { findTopicPath } from "@/lib/resource-utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { explainSyllabusTopic } from "@/ai/flows/explain-topic-flow";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Skeleton } from "../ui/skeleton";

// Mapping category to icon and color
const categoryInfo: Record<ResourceCategory, { icon: React.ElementType, color: string }> = {
    book: { icon: Book, color: 'bg-blue-100 text-blue-600' },
    video: { icon: Video, color: 'bg-red-100 text-red-600' },
    pdf: { icon: FileText, color: 'bg-green-100 text-green-600' },
    note: { icon: StickyNote, color: 'bg-yellow-100 text-yellow-600' },
};

const ResourceCard = ({ resource, onEdit, onDelete }: { resource: Resource; onEdit: (resource: Resource) => void; onDelete: (resource: Resource) => void; }) => {
    const { icon: Icon, color } = categoryInfo[resource.category] || categoryInfo.note;

    return (
        <div className="group relative rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
            <div className="flex items-start gap-4">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", color)}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 truncate">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline">
                        {resource.title}
                    </a>
                    <p className="truncate text-xs text-muted-foreground">{resource.description || resource.url}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onEdit(resource)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => onDelete(resource)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Library className="h-16 w-16 mb-4 text-primary/20" />
        <h3 className="text-xl font-semibold text-foreground">Select a Topic</h3>
        <p className="max-w-md text-sm">Choose a topic from the syllabus on the left to see its details, add resources, and track your mastery level.</p>
    </div>
)

export const DetailPane = ({ 
    syllabusData, 
    selectedTopicId, 
    onUpdateTopic, 
    onSelectTopic,
    resourceData,
    setResourceData
}: { 
    syllabusData: SyllabusTopic[], 
    selectedTopicId: string | null, 
    onUpdateTopic: (id: string, updates: Partial<SyllabusTopic>) => void, 
    onSelectTopic: (id: string) => void,
    resourceData: Record<string, Resource[]>,
    setResourceData: React.Dispatch<React.SetStateAction<Record<string, Resource[]>>>
}) => {
    
    const [topic, setTopic] = React.useState<SyllabusTopic | null>(null);
    const [path, setPath] = React.useState<SyllabusTopic[]>([]);

    // AI feature state
    const [explanation, setExplanation] = React.useState<string | null>(null);
    const [isExplaining, setIsExplaining] = React.useState(false);
    const { toast } = useToast();


    React.useEffect(() => {
        if (selectedTopicId) {
            const { topic, path } = findTopicPath(syllabusData, selectedTopicId) || {};
            setTopic(topic || null);
            setPath(path || []);
            // Reset AI features when topic changes
            setExplanation(null);
            setIsExplaining(false);
        } else {
            setTopic(null);
            setPath([]);
        }
    }, [selectedTopicId, syllabusData]);

    const topicResources = (selectedTopicId && resourceData[selectedTopicId]) || [];

    // Resource form state
    const [isResourceDialogOpen, setResourceDialogOpen] = React.useState(false);
    const [editingResource, setEditingResource] = React.useState<Resource | null>(null);
    
    // State for deleting resources
    const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
    
    // State for adding/editing tags
    const [newTag, setNewTag] = React.useState('');
    const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);

    if (!topic) {
        return <EmptyState />;
    }

    const handleMasteryChange = (level: MasteryLevel) => {
        onUpdateTopic(topic.id, { mastery: level });
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTag && !topic.tags.includes(newTag.toLowerCase())) {
            onUpdateTopic(topic.id, { tags: [...topic.tags, newTag.toLowerCase().trim()] });
            setNewTag('');
            setTagPopoverOpen(false);
        }
    };
    
    const handleAddOrEditResource = (values: { title: string, url: string, description?: string, category: ResourceCategory }) => {
        const topicId = topic.id;
        
        setResourceData(currentData => {
            const newData = { ...currentData };
            const currentTopicResources = [...(newData[topicId] || [])];
            
            const resource: Omit<Resource, 'id' | 'status'> = {
                title: values.title,
                url: values.url.startsWith('http') ? values.url : `https://${values.url}`,
                description: values.description,
                category: values.category,
            };

            if (editingResource) {
                const index = currentTopicResources.findIndex(r => r.id === editingResource.id);
                if (index > -1) {
                    currentTopicResources[index] = { ...currentTopicResources[index], ...resource };
                }
            } else {
                const newResource: Resource = { ...resource, id: `res-${Date.now()}`, status: 'todo' };
                currentTopicResources.push(newResource);
            }

            newData[topicId] = currentTopicResources;
            return newData;
        });
        
        setResourceDialogOpen(false);
        setEditingResource(null);
    };

    const handleConfirmDelete = () => {
        if (!resourceToDelete) return;
        const topicId = topic.id;

        setResourceData(currentData => {
            const newData = { ...currentData };
            const updatedResources = (newData[topicId] || []).filter(r => r.id !== resourceToDelete.id);
            
            if (updatedResources.length > 0) {
                newData[topicId] = updatedResources;
            } else {
                delete newData[topicId];
            }
            
            return newData;
        });

        setResourceToDelete(null);
    };

    const handleExplainTopic = async () => {
        if (!topic) return;
        setIsExplaining(true);
        setExplanation(null);
        try {
            const result = await explainSyllabusTopic({
                title: topic.title,
                description: topic.description,
            });
            setExplanation(result.explanation);
        } catch (error) {
            console.error("AI explanation failed:", error);
            toast({
                variant: "destructive",
                title: "AI Explanation Failed",
                description: "Could not generate an explanation for this topic. Please try again later.",
            });
        } finally {
            setIsExplaining(false);
        }
    };
    
    const externalResources = topicResources.filter(r => r.category !== 'note');
    const notes = topicResources.filter(r => r.category === 'note');

    return (
        <ScrollArea className="h-full">
            <div className="space-y-8 p-6">
                <SyllabusBreadcrumb path={path} />

                <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <h1 className="text-3xl font-bold font-headline flex-1">{topic.title}</h1>
                        <div className="flex items-center gap-2 flex-wrap">
                             <Button variant="outline" size="sm" onClick={handleExplainTopic} disabled={isExplaining} className="h-8">
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isExplaining ? 'Thinking...' : 'Explain'}
                            </Button>
                            <MasteryControl currentLevel={topic.mastery} onLevelChange={handleMasteryChange} />
                        </div>
                    </div>
                    {(isExplaining || explanation) && (
                        <div className="pt-2">
                             {isExplaining && (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                             )}
                             {explanation && (
                                <Alert className="bg-primary/5 border-primary/20">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <AlertTitle className="text-primary font-semibold">AI Explanation</AlertTitle>
                                    <AlertDescription className="text-foreground/90">
                                        {explanation}
                                    </AlertDescription>
                                </Alert>
                             )}
                        </div>
                    )}
                </div>

                <p className="text-muted-foreground">{topic.description}</p>
                
                {(topic.marks || topic.questions) && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border bg-muted/50 p-4">
                        {topic.marks && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Target className="h-4 w-4 text-primary" />
                                <div>
                                    <span className="font-semibold text-foreground">{topic.marks}</span>
                                    <span className="ml-1.5">Marks</span>
                                </div>
                            </div>
                        )}
                        {topic.questions && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <HelpCircle className="h-4 w-4 text-primary" />
                                <div>
                                    <span className="font-semibold text-foreground">{topic.questions}</span>
                                    <span className="ml-1.5">Questions</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Tags</h4>
                    <div className="flex flex-wrap items-center gap-2">
                        {topic.tags.length > 0 ? (
                            topic.tags.map((tag) => <Badge key={tag} variant="secondary" className="capitalize">{tag}</Badge>)
                        ) : (
                            <p className="text-sm text-muted-foreground">No tags have been added to this topic.</p>
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

                {topic.subtopics && topic.subtopics.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Topics Covered</h4>
                        <div className="space-y-2">
                        {topic.subtopics.map((subtopic) => (
                            <div 
                                key={subtopic.id}
                                onClick={() => onSelectTopic(subtopic.id)}
                                className="flex cursor-pointer items-center justify-between rounded-lg border bg-card p-3 text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                            >
                                <span className="font-medium">{subtopic.title}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))}
                        </div>
                    </div>
                )}
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">Resources</h4>
                        <Button variant="outline" size="sm" onClick={() => { setEditingResource(null); setResourceDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Resource
                        </Button>
                    </div>
                    {externalResources.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {externalResources.map((resource) => (
                                <ResourceCard 
                                    key={resource.id} 
                                    resource={resource}
                                    onEdit={() => { setEditingResource(resource); setResourceDialogOpen(true); }}
                                    onDelete={() => setResourceToDelete(resource)}
                                />
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No external resources added yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">My Notes</h4>
                         <Button variant="outline" size="sm" disabled>
                            <Plus className="mr-2 h-4 w-4" /> Add Note (Coming Soon)
                        </Button>
                    </div>
                    {notes.length > 0 ? (
                       <div className="grid gap-4 sm:grid-cols-2">
                            {notes.map((resource) => (
                                <ResourceCard 
                                    key={resource.id} 
                                    resource={resource}
                                    onEdit={() => { setEditingResource(resource); setResourceDialogOpen(true); }}
                                    onDelete={() => setResourceToDelete(resource)}
                                />
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No notes created for this topic yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">Performance Analytics</h4>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
                        <BarChartHorizontal className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-semibold">Analytics Coming Soon</h3>
                        <p className="max-w-md text-sm text-muted-foreground">
                            After you take mock tests, your performance data for this topic will appear here.
                        </p>
                    </div>
                </div>

            </div>

            <ResourceFormDialog
                key={editingResource?.id || 'new'}
                isOpen={isResourceDialogOpen}
                onOpenChange={setResourceDialogOpen}
                onSubmit={handleAddOrEditResource}
                resource={editingResource}
            />
            
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

// A sub-component for the resource form dialog
function ResourceFormDialog({ isOpen, onOpenChange, onSubmit, resource }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: { title: string, url: string, description?: string, category: ResourceCategory }) => void;
    resource: Resource | null;
}) {
    const [title, setTitle] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState<ResourceCategory>('book');

    React.useEffect(() => {
        if (isOpen) {
            setTitle(resource?.title || '');
            setUrl(resource?.url || '');
            setDescription(resource?.description || '');
            setCategory(resource?.category || 'book');
        }
    }, [isOpen, resource]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, url, description, category });
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{resource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
                    <DialogDescription>
                        {resource ? 'Update the details for this resource.' : 'Link a new external resource to this topic.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="resource-title">Title</Label>
                        <Input id="resource-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., 'Chapter 5: Parliament'" required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="resource-url">URL</Label>
                        <Input id="resource-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="www.example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="resource-description">Description (Optional)</Label>
                        <Textarea id="resource-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short note about this resource..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="resource-category">Category</Label>
                        <Select onValueChange={(v) => setCategory(v as ResourceCategory)} value={category}>
                            <SelectTrigger id="resource-category"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="book">Book/Article</SelectItem>
                                <SelectItem value="pdf">PDF Document</SelectItem>
                                <SelectItem value="video">YouTube Video/Playlist</SelectItem>
                                <SelectItem value="note">External Note</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{resource ? 'Save Changes' : 'Add Resource'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

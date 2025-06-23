
"use client";

import * as React from "react";
import type { SyllabusTopic, MasteryLevel, Resource, ResourceCategory } from "@/lib/types";
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Tag, Link as LinkIcon, Plus, MoreHorizontal, Edit, Trash2, FileText, Library } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SyllabusBreadcrumb } from "./syllabus-breadcrumb";
import { findTopicPath } from "@/lib/resource-utils";
import { cn } from "@/lib/utils";

const ResourceDisplayCard = ({ resource }: { resource: Resource }) => {
    const isLink = resource.category === 'lecture-playlist' || resource.category === 'lecture-video';
    const Icon = isLink ? LinkIcon : FileText;

    return (
        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-4 p-4">
                 <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    isLink ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"
                 )}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 truncate">
                    <p className="truncate font-medium">{resource.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{resource.url}</p>
                </div>
            </div>
        </a>
    )
}

const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Library className="h-16 w-16 mb-4 text-primary/20" />
        <h3 className="text-xl font-semibold text-foreground">Select a Topic</h3>
        <p className="max-w-md text-sm">Choose a topic from the syllabus on the left to see its details, add resources, and track your mastery level.</p>
    </div>
)

export const DetailPane = ({ syllabusData, selectedTopicId, onUpdate }: { syllabusData: SyllabusTopic[], selectedTopicId: string | null, onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void }) => {
    
    const [topic, setTopic] = React.useState<SyllabusTopic | null>(null);
    const [path, setPath] = React.useState<SyllabusTopic[]>([]);

    React.useEffect(() => {
        if (selectedTopicId) {
            const { topic, path } = findTopicPath(syllabusData, selectedTopicId) || {};
            setTopic(topic || null);
            setPath(path || []);
        } else {
            setTopic(null);
            setPath([]);
        }
    }, [selectedTopicId, syllabusData]);

    // State for adding new items
    const [newTag, setNewTag] = React.useState('');
    const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);
    
    // Resource form state
    const [resourcePopoverOpen, setResourcePopoverOpen] = React.useState(false);
    const [newResourceTitle, setNewResourceTitle] = React.useState('');
    const [newResourceUrl, setNewResourceUrl] = React.useState('');
    const [newResourceCategory, setNewResourceCategory] = React.useState<ResourceCategory>('book');

    // State for editing/deleting resources
    const [editingResource, setEditingResource] = React.useState<Resource | null>(null);
    const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [editUrl, setEditUrl] = React.useState('');
    const [editCategory, setEditCategory] = React.useState<ResourceCategory>('book');
    
    React.useEffect(() => {
        if (editingResource) {
            setEditTitle(editingResource.title);
            setEditUrl(editingResource.url);
            setEditCategory(editingResource.category);
        }
    }, [editingResource]);

    if (!topic) {
        return <EmptyState />;
    }

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
                category: newResourceCategory,
                status: 'todo',
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
        
        const updatedResource: Resource = { ...editingResource, title: editTitle, url, category: editCategory, status: editingResource.status };
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
        <ScrollArea className="h-full">
            <div className="space-y-6 p-6">
                <SyllabusBreadcrumb path={path} />

                <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl font-bold">{topic.title}</h1>
                    <MasteryControl currentLevel={topic.mastery} onLevelChange={handleMasteryChange} />
                </div>

                <p className="text-muted-foreground">{topic.description}</p>
                
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
                
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Resources</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {(topic.resources && topic.resources.length > 0) &&
                            topic.resources.map((resource) => (
                                <ResourceDisplayCard key={resource.id} resource={resource} />
                            ))
                        }
                    </div>

                    <Popover open={resourcePopoverOpen} onOpenChange={(isOpen) => { setResourcePopoverOpen(isOpen); if(!isOpen) { setNewResourceTitle(''); setNewResourceUrl(''); } }}>
                        <PopoverTrigger asChild>
                           <Button variant="ghost" className="mt-4 w-full justify-start border-2 border-dashed p-4 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
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
                                <div className="grid gap-2">
                                    <Label htmlFor="resource-category">Category</Label>
                                    <Select onValueChange={(v) => setNewResourceCategory(v as ResourceCategory)} defaultValue={newResourceCategory}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="book">Reference Book</SelectItem>
                                            <SelectItem value="pdf">NCERT Book</SelectItem>
                                            <SelectItem value="video">YouTube Playlist</SelectItem>
                                            <SelectItem value="note">YouTube Video</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" size="sm">Add Resource</Button>
                            </form>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

             {/* Edit Resource Dialog - Kept for functionality */}
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
                         <div className="grid gap-2">
                            <Label htmlFor="edit-resource-category">Category</Label>
                            <Select onValueChange={(v) => setEditCategory(v as ResourceCategory)} value={editCategory}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="book">Reference Book</SelectItem>
                                    <SelectItem value="pdf">NCERT Book</SelectItem>
                                    <SelectItem value="video">YouTube Playlist</SelectItem>
                                    <SelectItem value="note">YouTube Video</SelectItem>
                                </SelectContent>
                            </Select>
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

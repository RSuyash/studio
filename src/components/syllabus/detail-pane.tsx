
"use client";

import * as React from "react";
import type { SyllabusTopic, MasteryLevel, Resource, ResourceCategory } from "@/lib/types";
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MasteryControl from "./mastery-control";
import { Button } from '@/components/ui/button';
import { Maximize, Tag, Link, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const DetailPane = ({ topic, onUpdate, onFocus }: { topic: SyllabusTopic, onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void, onFocus: (topic: SyllabusTopic) => void }) => {
    // State for adding new items
    const [newTag, setNewTag] = React.useState('');
    const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);
    
    // Resource form state
    const [resourcePopoverOpen, setResourcePopoverOpen] = React.useState(false);
    const [newResourceTitle, setNewResourceTitle] = React.useState('');
    const [newResourceUrl, setNewResourceUrl] = React.useState('');
    const [newResourceCategory, setNewResourceCategory] = React.useState<ResourceCategory>('book-reference');

    // State for editing/deleting resources
    const [editingResource, setEditingResource] = React.useState<Resource | null>(null);
    const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [editUrl, setEditUrl] = React.useState('');
    const [editCategory, setEditCategory] = React.useState<ResourceCategory>('book-reference');
    
    React.useEffect(() => {
        if (editingResource) {
            setEditTitle(editingResource.title);
            setEditUrl(editingResource.url);
            setEditCategory(editingResource.category);
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
                category: newResourceCategory,
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
        
        const updatedResource: Resource = { ...editingResource, title: editTitle, url, category: editCategory };
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
                                    <div className="grid gap-2">
                                        <Label htmlFor="resource-category">Category</Label>
                                        <Select onValueChange={(v) => setNewResourceCategory(v as ResourceCategory)} defaultValue={newResourceCategory}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="book-reference">Reference Book</SelectItem>
                                                <SelectItem value="book-ncert">NCERT Book</SelectItem>
                                                <SelectItem value="lecture-playlist">YouTube Playlist</SelectItem>
                                                <SelectItem value="lecture-video">YouTube Video</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                         <div className="grid gap-2">
                            <Label htmlFor="edit-resource-category">Category</Label>
                            <Select onValueChange={(v) => setEditCategory(v as ResourceCategory)} value={editCategory}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="book-reference">Reference Book</SelectItem>
                                    <SelectItem value="book-ncert">NCERT Book</SelectItem>
                                    <SelectItem value="lecture-playlist">YouTube Playlist</SelectItem>
                                    <SelectItem value="lecture-video">YouTube Video</SelectItem>
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

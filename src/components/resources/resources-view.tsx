
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type SyllabusTopic, type Resource, type ResourceCategory } from '@/lib/syllabus-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, Library, MoreHorizontal, Edit, Trash2, Plus, Book, Youtube, ListVideo, Video, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '../ui/scroll-area';

// Helper to find a topic by ID in a nested structure
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

// Helper function to update a topic in the nested structure
const updateTopicInTree = (
  topics: SyllabusTopic[],
  id: string,
  updater: (topic: SyllabusTopic) => SyllabusTopic
): SyllabusTopic[] => {
  return topics.map((topic) => {
    if (topic.id === id) {
      return updater(topic);
    }
    if (topic.subtopics) {
      return {
        ...topic,
        subtopics: updateTopicInTree(topic.subtopics, id, updater),
      };
    }
    return topic;
  });
};


interface ResourceWithTopicInfo extends Resource {
  topicId: string;
  topicTitle: string;
  topicPath: string;
}

// Helper to get a flat list of all resources with their topic path
const getAllResources = (
  topics: SyllabusTopic[],
  currentPath: string[] = []
): ResourceWithTopicInfo[] => {
  let results: ResourceWithTopicInfo[] = [];
  topics.forEach((topic) => {
    const newPath = [...currentPath, topic.title];
    if (topic.resources && topic.resources.length > 0) {
      topic.resources.forEach(resource => {
        results.push({
          ...resource,
          topicId: topic.id,
          topicTitle: topic.title,
          topicPath: newPath.join(' / '),
        });
      });
    }
    if (topic.subtopics) {
      results = [...results, ...getAllResources(topic.subtopics, newPath)];
    }
  });
  return results;
};

const resourceSchema = z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters long.' }),
    url: z.string().url({ message: 'Please enter a valid URL.' }),
    description: z.string().optional(),
    category: z.enum(['book-ncert', 'book-reference', 'lecture-playlist', 'lecture-video']),
    topicId: z.string().min(1, { message: 'Please select a final syllabus topic.' }),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

const categoryInfo: Record<ResourceCategory, { title: string; icon: React.ElementType }> = {
    'book-ncert': { title: 'NCERT Books', icon: Book },
    'book-reference': { title: 'Reference Books', icon: Book },
    'lecture-playlist': { title: 'YouTube Playlists', icon: ListVideo },
    'lecture-video': { title: 'YouTube Videos', icon: Youtube },
}

export default function ResourcesView({
  syllabusData,
  setSyllabusData,
}: {
  syllabusData: SyllabusTopic[];
  setSyllabusData: React.Dispatch<React.SetStateAction<SyllabusTopic[]>>;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingResource, setEditingResource] = React.useState<ResourceWithTopicInfo | null>(null);
  const [resourceToDelete, setResourceToDelete] = React.useState<ResourceWithTopicInfo | null>(null);
  
  const allResources = React.useMemo(() => getAllResources(syllabusData), [syllabusData]);
  
  const groupedResources = React.useMemo(() => {
    return allResources.reduce((acc, resource) => {
      (acc[resource.category] = acc[resource.category] || []).push(resource);
      return acc;
    }, {} as Record<ResourceCategory, ResourceWithTopicInfo[]>);
  }, [allResources]);

  const handleEditClick = (resource: ResourceWithTopicInfo) => {
    setEditingResource(resource);
    setDialogOpen(true);
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingResource(null);
    }
    setDialogOpen(open);
  };

  const handleConfirmDelete = () => {
    if (!resourceToDelete) return;
    
    setSyllabusData(currentData =>
      updateTopicInTree(currentData, resourceToDelete.topicId, (topic) => ({
        ...topic,
        resources: (topic.resources || []).filter(r => r.id !== resourceToDelete.id),
      }))
    );
    setResourceToDelete(null);
  };
  
  const handleFormSubmit = (values: ResourceFormValues) => {
    const { topicId, ...resourceData } = values;
    
    if (editingResource) { // This is an edit
      const updatedResource = { ...editingResource, ...resourceData };
      
      setSyllabusData(currentData => {
        let newData = [...currentData];
        // If topic has changed, move the resource
        if (editingResource.topicId !== topicId) {
          // 1. Remove from old topic
          newData = updateTopicInTree(newData, editingResource.topicId, topic => ({
            ...topic,
            resources: (topic.resources || []).filter(r => r.id !== editingResource.id),
          }));
          // 2. Add to new topic
          newData = updateTopicInTree(newData, topicId, topic => ({
            ...topic,
            resources: [...(topic.resources || []), updatedResource],
          }));
        } else { // Just update in the same topic
          newData = updateTopicInTree(newData, topicId, topic => ({
            ...topic,
            resources: (topic.resources || []).map(r => r.id === editingResource.id ? updatedResource : r),
          }));
        }
        return newData;
      });
      
    } else { // This is a new resource
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        ...resourceData,
      };
      
      setSyllabusData(currentData =>
        updateTopicInTree(currentData, topicId, topic => ({
          ...topic,
          resources: [...(topic.resources || []), newResource],
        }))
      );
    }
    setDialogOpen(false);
    setEditingResource(null);
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Library className="h-6 w-6" />
            <h2 className="text-lg font-semibold">My Resources</h2>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </header>
      <ScrollArea className="h-[calc(100vh-3.5rem)]">
        <main className="flex-1 space-y-6 p-4 md:p-6">
            {allResources.length > 0 ? (
                Object.entries(groupedResources).map(([category, resources]) => {
                    const info = categoryInfo[category as ResourceCategory];
                    return (
                        <Card key={category}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <info.icon className="h-6 w-6 text-primary" />
                                    {info.title}
                                </CardTitle>
                                <CardDescription>All saved resources in the "{info.title}" category.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {resources.map((resource) => (
                                    <div key={resource.id} className="group flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
                                        <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                        <div className="flex-1">
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="truncate text-sm font-medium hover:underline">
                                                {resource.title}
                                            </a>
                                            <p className="text-xs text-muted-foreground">{resource.topicPath}</p>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => handleEditClick(resource)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onSelect={() => setResourceToDelete(resource)} className="text-destructive focus:text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )
                })
            ) : (
                <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
                    <Folder className="h-16 w-16 mb-4 text-primary/50" />
                    <h3 className="text-lg font-semibold">Your Resource Library is Empty</h3>
                    <p className="max-w-md text-sm text-muted-foreground">
                        Click the "Add Resource" button to start building your collection of study materials.
                    </p>
                </div>
            )}
        </main>
      </ScrollArea>

      <ResourceFormDialog 
        isOpen={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleFormSubmit}
        resourceToEdit={editingResource}
        syllabusData={syllabusData}
      />
      
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
    </>
  );
}

const findPathToTopic = (topics: SyllabusTopic[], id: string, currentPath: string[] = []): string[] | null => {
    for (const topic of topics) {
        const newPath = [...currentPath, topic.id];
        if (topic.id === id) {
            return newPath;
        }
        if (topic.subtopics) {
            const foundPath = findPathToTopic(topic.subtopics, id, newPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
};


// Reusable Dialog for Add/Edit Resource
function ResourceFormDialog({ 
    isOpen, 
    onOpenChange, 
    onSubmit,
    resourceToEdit,
    syllabusData
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: ResourceFormValues) => void;
    resourceToEdit: ResourceWithTopicInfo | null;
    syllabusData: SyllabusTopic[];
}) {
    const form = useForm<ResourceFormValues>({
        resolver: zodResolver(resourceSchema),
        defaultValues: {
            title: '',
            url: '',
            description: '',
            category: 'book-reference',
            topicId: '',
        }
    });

    const [selectedPath, setSelectedPath] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            if (resourceToEdit) {
                form.reset({
                    title: resourceToEdit.title,
                    url: resourceToEdit.url,
                    description: resourceToEdit.description || '',
                    category: resourceToEdit.category,
                    topicId: resourceToEdit.topicId,
                });
                const path = findPathToTopic(syllabusData, resourceToEdit.topicId);
                setSelectedPath(path || []);
            } else {
                form.reset({
                    title: '',
                    url: '',
                    description: '',
                    category: 'book-reference',
                    topicId: '',
                });
                setSelectedPath([]);
            }
        }
    }, [resourceToEdit, form, isOpen, syllabusData]);

    const renderCascadingSelects = () => {
        const selects = [];
        let currentLevelTopics = syllabusData;

        for (let i = 0; i <= selectedPath.length; i++) {
            if (!currentLevelTopics || currentLevelTopics.length === 0) break;

            const currentIterationTopics = [...currentLevelTopics];
            const selectedValue = selectedPath[i] || "";

            selects.push(
                 <FormItem key={`level-${i}`}>
                    <FormLabel>{i === 0 ? 'Syllabus Topic' : 'Sub-topic'}</FormLabel>
                    <Select
                        value={selectedValue}
                        onValueChange={(value) => {
                            const newPath = [...selectedPath.slice(0, i), value];
                            setSelectedPath(newPath);

                            const selectedTopic = findTopicById(syllabusData, value);
                            if (selectedTopic && (!selectedTopic.subtopics || selectedTopic.subtopics.length === 0)) {
                                form.setValue('topicId', value, { shouldValidate: true });
                            } else {
                                form.setValue('topicId', '', { shouldValidate: true });
                            }
                        }}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={i === 0 ? 'Select a top-level topic...' : 'Select a sub-topic...'} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <ScrollArea className="h-60">
                                {currentIterationTopics.map(topic => (
                                    <SelectItem key={topic.id} value={topic.id}>
                                        {topic.title}
                                    </SelectItem>
                                ))}
                            </ScrollArea>
                        </SelectContent>
                    </Select>
                </FormItem>
            );

            if (selectedValue) {
                const nextParent = currentIterationTopics.find(t => t.id === selectedValue);
                currentLevelTopics = nextParent?.subtopics || [];
            } else {
                break;
            }
        }
        return selects;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{resourceToEdit ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
                    <DialogDescription>
                        {resourceToEdit ? 'Update the details of your resource.' : 'Fill in the details for your new resource.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., 'Indian Polity by M. Laxmikanth'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A short note about this resource..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(categoryInfo).map(([key, {title}]) => (
                                                <SelectItem key={key} value={key}>{title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="topicId"
                            render={({ field }) => (
                                <div className="space-y-2">
                                    {renderCascadingSelects()}
                                    <input type="hidden" {...field} />
                                    <FormMessage />
                                </div>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">
                                {resourceToEdit ? 'Save Changes' : 'Add Resource'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

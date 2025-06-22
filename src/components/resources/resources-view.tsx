
'use client';

import * as React from 'react';
import { type SyllabusTopic, type Resource } from '@/lib/syllabus-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, Library, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TopicWithResources extends SyllabusTopic {
  path: string;
}

// Helper function to find all topics with resources
const findTopicsWithResources = (
  topics: SyllabusTopic[],
  currentPath: string[] = []
): TopicWithResources[] => {
  let results: TopicWithResources[] = [];

  topics.forEach((topic) => {
    const newPath = [...currentPath, topic.title];
    if (topic.resources && topic.resources.length > 0) {
      results.push({ ...topic, path: newPath.join(' / ') });
    }
    if (topic.subtopics) {
      results = [...results, ...findTopicsWithResources(topic.subtopics, newPath)];
    }
  });

  return results;
};

export default function ResourcesView({
  syllabusData,
  onUpdate,
}: {
  syllabusData: SyllabusTopic[];
  onUpdate: (id: string, updates: Partial<SyllabusTopic>) => void;
}) {
  const [editingResource, setEditingResource] = React.useState<{ resource: Resource; topicId: string } | null>(null);
  const [resourceToDelete, setResourceToDelete] = React.useState<{ resource: Resource; topicId: string } | null>(null);
  const [editTitle, setEditTitle] = React.useState('');
  const [editUrl, setEditUrl] = React.useState('');
  
  const topicsWithResources = React.useMemo(() => findTopicsWithResources(syllabusData), [syllabusData]);
  
  React.useEffect(() => {
    if (editingResource) {
      setEditTitle(editingResource.resource.title);
      setEditUrl(editingResource.resource.url);
    }
  }, [editingResource]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editTitle || !editUrl) return;

    const { resource, topicId } = editingResource;
    const parentTopic = findTopicsWithResources(syllabusData).find(t => t.id === topicId);
    if (!parentTopic) return;
    
    let url = editUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
    }

    const updatedResource = { ...resource, title: editTitle, url };
    const updatedResources = parentTopic.resources?.map(r => r.id === resource.id ? updatedResource : r);

    onUpdate(topicId, { resources: updatedResources });
    setEditingResource(null);
  };
  
  const handleConfirmDelete = () => {
    if (!resourceToDelete) return;
    
    const { resource, topicId } = resourceToDelete;
    const parentTopic = findTopicsWithResources(syllabusData).find(t => t.id === topicId);
    if (!parentTopic) return;
    
    const updatedResources = parentTopic.resources?.filter(r => r.id !== resource.id);
    onUpdate(topicId, { resources: updatedResources });
    setResourceToDelete(null);
  };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
        <Library className="h-6 w-6" />
        <h2 className="text-lg font-semibold">My Resources</h2>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-6">
        {topicsWithResources.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Saved Resources</CardTitle>
              <CardDescription>Here are all the resources you've saved across your syllabus topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {topicsWithResources.map((topic) => (
                  <AccordionItem value={topic.id} key={topic.id}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold">{topic.title}</span>
                        <span className="text-xs font-normal text-muted-foreground">{topic.path}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {topic.resources?.map((resource: Resource) => (
                           <div key={resource.id} className="group flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
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
                                        <DropdownMenuItem onSelect={() => setEditingResource({ resource, topicId: topic.id })}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setResourceToDelete({ resource, topicId: topic.id })} className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
            <Library className="h-16 w-16 mb-4 text-primary/50" />
            <h3 className="text-lg font-semibold">No Resources Found</h3>
            <p className="max-w-md text-sm text-muted-foreground">
              You haven't added any resources yet. Go to the Syllabus Explorer to start adding links to your topics.
            </p>
          </div>
        )}
      </main>

       {/* Edit Resource Dialog */}
      <Dialog open={!!editingResource} onOpenChange={(isOpen) => !isOpen && setEditingResource(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
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
              This action cannot be undone. This will permanently delete the resource "{resourceToDelete?.resource.title}".
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

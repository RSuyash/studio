'use client';

import * as React from 'react';
import { type SyllabusTopic, type Resource } from '@/lib/syllabus-data';
import { Library, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { ScrollArea } from '../ui/scroll-area';
import { updateTopicInTree, getAllResources, type ResourceWithTopicInfo } from '@/lib/resource-utils';
import type { ResourceFormValues } from './resource-form-dialog';
import ResourceFormDialog from './resource-form-dialog';
import ResourceList from './resource-list';

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
            <ResourceList
                resources={allResources}
                onEdit={handleEditClick}
                onDelete={setResourceToDelete}
            />
        </main>
      </ScrollArea>

      <ResourceFormDialog 
        isOpen={dialogOpen}
        onOpenChange={handleDialogClose}
        onSubmit={handleFormSubmit}
        resourceToEdit={editingResource}
        syllabusData={syllabusData}
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
    </>
  );
}

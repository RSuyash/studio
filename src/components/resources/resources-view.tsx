
'use client';

import * as React from 'react';
import type { SyllabusTopic, Resource, ResourceCategory, ResourceWithTopicInfo, ResourceStatus } from '@/lib/types';
import { Library, Plus, Search, Folder } from 'lucide-react';
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
import { updateTopicInTree, getAllResources, getHighLevelTopicName } from '@/lib/resource-utils';
import type { ResourceFormValues } from './resource-form-dialog';
import ResourceFormDialog from './resource-form-dialog';
import ResourceCard from './resource-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const resourceTypes: ResourceCategory[] = ['book', 'video', 'pdf', 'note'];
const resourceStatuses: ResourceStatus[] = ['todo', 'in-progress', 'completed'];

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center mt-8">
        <Folder className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold">No Resources Found</h3>
        <p className="max-w-md text-sm text-muted-foreground">
            Try adjusting your filters or add a new resource to get started.
        </p>
    </div>
);


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
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<ResourceCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = React.useState<ResourceStatus | 'all'>('all');

  const allResources = React.useMemo(() => getAllResources(syllabusData), [syllabusData]);

  const filteredResources = React.useMemo(() => {
    return allResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            getHighLevelTopicName(resource.topicPath).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || resource.category === typeFilter;
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [allResources, searchQuery, typeFilter, statusFilter]);


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
    
    if (editingResource) { 
      const updatedResource: Resource = {
        id: editingResource.id,
        title: resourceData.title,
        url: resourceData.url,
        category: resourceData.category,
        description: resourceData.description,
        status: resourceData.status,
      };
      
      setSyllabusData(currentData => {
        let newData = [...currentData];
        if (editingResource.topicId !== topicId) {
          newData = updateTopicInTree(newData, editingResource.topicId, topic => ({
            ...topic,
            resources: (topic.resources || []).filter(r => r.id !== editingResource.id),
          }));
          newData = updateTopicInTree(newData, topicId, topic => ({
            ...topic,
            resources: [...(topic.resources || []), updatedResource],
          }));
        } else {
          newData = updateTopicInTree(newData, topicId, topic => ({
            ...topic,
            resources: (topic.resources || []).map(r => r.id === editingResource.id ? updatedResource : r),
          }));
        }
        return newData;
      });
      
    } else { 
      const newResource: Resource = {
        id: `res-${Date.now()}`,
        title: resourceData.title,
        url: resourceData.url,
        category: resourceData.category,
        description: resourceData.description,
        status: resourceData.status,
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
      <ScrollArea className="h-screen">
        <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <Library className="h-7 w-7 text-muted-foreground" />
                    <h1 className="text-2xl font-bold tracking-tight">Resource Hub</h1>
                </div>
                <Button onClick={() => setDialogOpen(true)} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Resource
                </Button>
            </header>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search resources..." 
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {resourceTypes.map(type => (
                                <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {resourceStatuses.map(status => (
                                <SelectItem key={status} value={status} className="capitalize">{status.replace('-', ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {filteredResources.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onEdit={() => handleEditClick(resource)}
                            onDelete={() => setResourceToDelete(resource)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState />
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

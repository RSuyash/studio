'use client';

import * as React from 'react';
import type { SyllabusTopic, Resource, ResourceCategory, ResourceWithTopicInfo } from '@/lib/types';
import { Library, Plus, Folder } from 'lucide-react';
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
import { updateTopicInTree, getAllResources, getSubjectForResource, ncertClasses, subjects } from '@/lib/resource-utils';
import type { ResourceFormValues } from './resource-form-dialog';
import ResourceFormDialog from './resource-form-dialog';
import ResourceItem from './resource-item';
import ResourceCard from './resource-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
        <Folder className="h-12 w-12 mb-4 text-primary/50" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
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
  
  const allResources = React.useMemo(() => getAllResources(syllabusData), [syllabusData]);

  const groupedResources = React.useMemo(() => {
    const ncerts = allResources.filter(r => r.category === 'book-ncert');
    const standardBooks = allResources.filter(r => r.category === 'book-reference');
    const digital = allResources.filter(r => r.category === 'lecture-playlist' || r.category === 'lecture-video');

    const ncertsByClass = ncerts.reduce((acc, resource) => {
        const key = resource.class || 'Unclassified';
        if (!acc[key]) acc[key] = [];
        acc[key].push(resource);
        return acc;
    }, {} as Record<string, ResourceWithTopicInfo[]>);

    const standardBySubject = standardBooks.reduce((acc, resource) => {
        const subject = getSubjectForResource(resource, syllabusData);
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(resource);
        return acc;
    }, {} as Record<string, ResourceWithTopicInfo[]>);
    
    const digitalByCategory = digital.reduce((acc, resource) => {
      (acc[resource.category] = acc[resource.category] || []).push(resource);
      return acc;
    }, {} as Record<ResourceCategory, ResourceWithTopicInfo[]>);

    return { ncertsByClass, standardBySubject, digitalByCategory, hasNcerts: ncerts.length > 0, hasStandard: standardBooks.length > 0, hasDigital: digital.length > 0 };
  }, [allResources, syllabusData]);


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
        class: resourceData.class as any,
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
        class: resourceData.class as any,
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
          <Tabs defaultValue="ncerts" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ncerts">NCERTs</TabsTrigger>
              <TabsTrigger value="standard">Standard Books</TabsTrigger>
              <TabsTrigger value="digital">Digital Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ncerts" className="pt-4">
              {groupedResources.hasNcerts ? (
                <Accordion type="multiple" className="w-full">
                  {ncertClasses.map(c => {
                    const resourcesForClass = groupedResources.ncertsByClass[c];
                    return resourcesForClass && resourcesForClass.length > 0 ? (
                      <AccordionItem value={`class-${c}`} key={`class-${c}`}>
                        <AccordionTrigger>Class {c} ({resourcesForClass.length})</AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          {resourcesForClass.map(resource => (
                            <ResourceItem key={resource.id} resource={resource} onEdit={handleEditClick} onDelete={setResourceToDelete} />
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ) : null
                  })}
                </Accordion>
              ) : (
                <EmptyState title="No NCERTs Added" description="Add NCERT books and link them to syllabus topics to see them here." />
              )}
            </TabsContent>
            
            <TabsContent value="standard" className="pt-4">
               {groupedResources.hasStandard ? (
                  <Accordion type="multiple" className="w-full">
                    {subjects.map(subject => {
                        const resourcesForSubject = groupedResources.standardBySubject[subject];
                        return resourcesForSubject && resourcesForSubject.length > 0 ? (
                           <AccordionItem value={subject} key={subject}>
                              <AccordionTrigger>{subject} ({resourcesForSubject.length})</AccordionTrigger>
                              <AccordionContent className="space-y-2">
                                {resourcesForSubject.map(resource => (
                                    <ResourceItem key={resource.id} resource={resource} onEdit={handleEditClick} onDelete={setResourceToDelete} />
                                ))}
                              </AccordionContent>
                           </AccordionItem>
                        ) : null
                    })}
                  </Accordion>
                ) : (
                  <EmptyState title="No Standard Books Added" description="Add your reference books and link them to syllabus topics to see them organized by subject." />
                )}
            </TabsContent>
            
            <TabsContent value="digital" className="pt-4">
                {groupedResources.hasDigital ? (
                    <div className="space-y-6">
                        {Object.entries(groupedResources.digitalByCategory).map(([category, resources]) => (
                            resources.length > 0 && (
                                <ResourceCard
                                    key={category}
                                    category={category as ResourceCategory}
                                    resources={resources}
                                    onEdit={handleEditClick}
                                    onDelete={setResourceToDelete}
                                />
                            )
                        ))}
                    </div>
                ) : (
                    <EmptyState title="No Digital Resources" description="Add YouTube videos, playlists, or other links to see them here." />
                )}
            </TabsContent>
          </Tabs>
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

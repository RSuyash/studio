'use client';

import * as React from 'react';
import { Folder } from 'lucide-react';
import ResourceCard from './resource-card';
import { type ResourceWithTopicInfo } from '@/lib/resource-utils';
import { type ResourceCategory } from '@/lib/syllabus-data';

interface ResourceListProps {
  resources: ResourceWithTopicInfo[];
  onEdit: (resource: ResourceWithTopicInfo) => void;
  onDelete: (resource: ResourceWithTopicInfo) => void;
}

export default function ResourceList({ resources, onEdit, onDelete }: ResourceListProps) {
  const groupedResources = React.useMemo(() => {
    return resources.reduce((acc, resource) => {
      (acc[resource.category] = acc[resource.category] || []).push(resource);
      return acc;
    }, {} as Record<ResourceCategory, ResourceWithTopicInfo[]>);
  }, [resources]);

  if (resources.length === 0) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
        <Folder className="h-16 w-16 mb-4 text-primary/50" />
        <h3 className="text-lg font-semibold">Your Resource Library is Empty</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Click the "Add Resource" button to start building your collection of study materials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <ResourceCard
          key={category}
          category={category as ResourceCategory}
          resources={categoryResources}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

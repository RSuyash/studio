'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { ResourceWithTopicInfo } from '@/lib/types';

interface ResourceItemProps {
  resource: ResourceWithTopicInfo;
  onEdit: (resource: ResourceWithTopicInfo) => void;
  onDelete: (resource: ResourceWithTopicInfo) => void;
}

export default function ResourceItem({ resource, onEdit, onDelete }: ResourceItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50">
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
          <DropdownMenuItem onSelect={() => onEdit(resource)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onDelete(resource)} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

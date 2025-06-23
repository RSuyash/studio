
import * as React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Book, Video, FileText, StickyNote, MoreVertical, Edit, Trash2, Clock } from 'lucide-react';
import type { ResourceWithTopicInfo, ResourceCategory, ResourceStatus } from '@/lib/types';
import { getHighLevelTopicName } from '@/lib/resource-utils';
import { cn } from '@/lib/utils';

const categoryInfo: Record<ResourceCategory, { icon: React.ElementType, color: string }> = {
    book: { icon: Book, color: 'bg-blue-100 text-blue-600' },
    video: { icon: Video, color: 'bg-red-100 text-red-600' },
    pdf: { icon: FileText, color: 'bg-green-100 text-green-600' },
    note: { icon: StickyNote, color: 'bg-yellow-100 text-yellow-600' },
};

const statusInfo: Record<ResourceStatus, { color: string }> = {
    todo: { color: 'bg-muted-foreground' },
    'in-progress': { color: 'bg-blue-500' },
    completed: { color: 'bg-green-500' },
};

interface ResourceCardProps {
    resource: ResourceWithTopicInfo;
    onEdit: (resource: ResourceWithTopicInfo) => void;
    onDelete: (resource: ResourceWithTopicInfo) => void;
}

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
    const { icon: Icon, color } = categoryInfo[resource.category] || categoryInfo.note;
    const { color: statusColor } = statusInfo[resource.status] || statusInfo.todo;

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        <CardTitle>{resource.title}</CardTitle>
                    </a>
                    {resource.description && <CardDescription className="mt-1">{resource.description}</CardDescription>}
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
            </CardHeader>
            <CardContent className="flex-grow">
                {resource.category === 'book' && resource.progress !== undefined && resource.total && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{resource.progress} of {resource.total} chapters completed</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Badge variant="secondary">{getHighLevelTopicName(resource.topicPath)}</Badge>
                <div className={cn("h-3 w-3 rounded-full", statusColor)}></div>
            </CardFooter>
        </Card>
    );
}

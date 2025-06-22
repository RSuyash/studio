import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ResourceItem from './resource-item';
import { type ResourceWithTopicInfo } from '@/lib/resource-utils';
import { type ResourceCategory } from '@/lib/syllabus-data';
import { Book, ListVideo, Youtube } from 'lucide-react';

export const categoryInfoMap: Record<ResourceCategory, { title: string; icon: React.ElementType }> = {
    'book-ncert': { title: 'NCERT Books', icon: Book },
    'book-reference': { title: 'Reference Books', icon: Book },
    'lecture-playlist': { title: 'YouTube Playlists', icon: ListVideo },
    'lecture-video': { title: 'YouTube Videos', icon: Youtube },
};

interface ResourceCardProps {
    category: ResourceCategory;
    resources: ResourceWithTopicInfo[];
    onEdit: (resource: ResourceWithTopicInfo) => void;
    onDelete: (resource: ResourceWithTopicInfo) => void;
}

export default function ResourceCard({ category, resources, onEdit, onDelete }: ResourceCardProps) {
    const info = categoryInfoMap[category];

    if (!info || resources.length === 0) {
        return null;
    }

    const IconComponent = info.icon;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <IconComponent className="h-6 w-6 text-primary" />
                    {info.title}
                </CardTitle>
                <CardDescription>All saved resources in the "{info.title}" category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {resources.map((resource) => (
                    <ResourceItem
                        key={resource.id}
                        resource={resource}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </CardContent>
        </Card>
    );
}

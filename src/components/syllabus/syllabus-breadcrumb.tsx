
import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import type { SyllabusTopic } from '@/lib/types';
import { Home } from 'lucide-react';

export const SyllabusBreadcrumb = ({ path }: { path: SyllabusTopic[] }) => {
    return (
        <div className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Home className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
            {path.map((topic, index) => (
                <React.Fragment key={topic.id}>
                    <span>{topic.title}</span>
                    {index < path.length - 1 && <ChevronRight className="h-4 w-4" />}
                </React.Fragment>
            ))}
        </div>
    )
}

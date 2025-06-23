
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Icons } from '@/components/icons';
import type { SyllabusTopic } from '@/lib/types';

export const SyllabusBreadcrumb = ({ topics, onClickHome, onClickTopic }: { topics: SyllabusTopic[], onClickHome: () => void, onClickTopic: (index: number) => void }) => {
    const HomeIcon = Icons['Home'];
    return (
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2 md:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={onClickHome}>
                <HomeIcon className="h-4 w-4" />
            </Button>
            {topics.map((topic, index) => (
                <React.Fragment key={topic.id}>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <Button variant="ghost" className="h-8 px-2 text-left" onClick={() => onClickTopic(index + 1)}>
                        {topic.title}
                    </Button>
                </React.Fragment>
            ))}
        </div>
    )
}


'use client';

import * as React from 'react';
import { type SyllabusTopic, type Resource } from '@/lib/syllabus-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link, Library, ChevronRight } from 'lucide-react';

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

export default function ResourcesView({ syllabusData }: { syllabusData: SyllabusTopic[] }) {
  const topicsWithResources = React.useMemo(() => findTopicsWithResources(syllabusData), [syllabusData]);

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
                           <a
                                key={resource.id}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                            >
                                <Link className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                <span className="flex-1 truncate text-sm font-medium">{resource.title}</span>
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            </a>
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
    </>
  );
}


"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { initialSyllabusData, type SyllabusTopic } from "@/lib/syllabus-data";
import FocusModeDialog from "./focus-mode-dialog";
import FilterPanel from "./filter-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { updateTopicInTree, getAllTagsFromTree, filterSyllabus } from "@/lib/resource-utils";
import { SyllabusExplorer } from "./syllabus-explorer";

const MindMapView = dynamic(() => import("./mind-map-view"), {
  ssr: false,
  loading: () => <Skeleton className="h-[75vh] w-full rounded-lg border bg-card" />,
});


export default function SyllabusViewer({ syllabusData, setSyllabusData }: { syllabusData: SyllabusTopic[], setSyllabusData: React.Dispatch<React.SetStateAction<SyllabusTopic[]>> }) {
  const [focusTopic, setFocusTopic] = React.useState<SyllabusTopic | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());

  const handleFocusTopic = React.useCallback((topic: SyllabusTopic) => {
    setFocusTopic(topic);
  }, []);
  
  const handleUpdateTopic = React.useCallback(
    (id: string, updates: Partial<SyllabusTopic>) => {
      setSyllabusData((currentData) => updateTopicInTree(currentData, id, updates));
    },
    [setSyllabusData]
  );

  const handleTagToggle = React.useCallback((tag: string) => {
    setSelectedTags(prev => {
        const newTags = new Set(prev);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        return newTags;
    });
  }, []);

  const allTags = React.useMemo(() => Array.from(getAllTagsFromTree(initialSyllabusData)).sort(), []);
  const filteredData = React.useMemo(() => filterSyllabus(syllabusData, selectedTags), [syllabusData, selectedTags]);
  
  return (
    <>
      <div className="flex h-full items-start gap-6">
        <aside className="sticky top-6 hidden w-64 flex-shrink-0 lg:block">
          <FilterPanel 
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </aside>
        <div className="min-w-0 flex-1">
          <Tabs defaultValue="explorer" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="explorer">Explorer</TabsTrigger>
              <TabsTrigger value="mindmap">
                Mind Map
              </TabsTrigger>
              <TabsTrigger value="timeline" disabled>
                Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explorer">
              {filteredData.length > 0 ? (
                <SyllabusExplorer
                  data={filteredData}
                  onUpdate={handleUpdateTopic}
                  onFocus={handleFocusTopic}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
                  <h3 className="text-lg font-semibold">No topics match your filter.</h3>
                  <p className="text-sm text-muted-foreground">Try selecting different tags or clearing the filter.</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="mindmap">
              <MindMapView data={syllabusData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FocusModeDialog
        isOpen={!!focusTopic}
        topic={focusTopic}
        onClose={() => setFocusTopic(null)}
      />
    </>
  );
}

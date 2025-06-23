
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { SyllabusTopic, Resource } from "@/lib/types";
import FilterPanel from "./filter-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { updateTopicInTree, getAllTagsFromTree, filterSyllabus, findTopicById } from "@/lib/resource-utils";
import { SyllabusExplorer } from "./syllabus-explorer";
import { DetailPane } from "./detail-pane";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SyllabusType } from "../main-layout";

const MindMapView = dynamic(() => import("./mind-map-view"), {
  ssr: false,
  loading: () => <Skeleton className="h-[75vh] w-full rounded-lg border bg-card" />,
});

const SyllabusHeader = ({ 
  onFilterToggle, 
  activeSyllabus, 
  onSyllabusChange 
}: { 
  onFilterToggle: () => void; 
  activeSyllabus: SyllabusType; 
  onSyllabusChange: (value: SyllabusType) => void;
}) => (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6">
        <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Syllabus Explorer</h2>
        </div>
        <div className="flex items-center gap-2">
           <Select value={activeSyllabus} onValueChange={onSyllabusChange}>
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="upsc">UPSC CSE</SelectItem>
                  <SelectItem value="mpsc">MPSC Rajyaseva</SelectItem>
                  <SelectItem value="ifos">IFoS</SelectItem>
              </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onFilterToggle} className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
    </header>
);

const syllabusTitles: Record<SyllabusType, string> = {
    upsc: "UPSC Syllabus",
    mpsc: "MPSC Syllabus",
    ifos: "IFoS Syllabus",
};

export default function SyllabusViewer({ 
  syllabusData, 
  setSyllabusData, 
  activeSyllabus, 
  setActiveSyllabus,
  resourceData,
  setResourceData,
  selectedTopicId,
  onSelectTopic,
}: { 
  syllabusData: SyllabusTopic[], 
  setSyllabusData: React.Dispatch<React.SetStateAction<SyllabusTopic[]>>,
  activeSyllabus: SyllabusType,
  setActiveSyllabus: (syllabus: SyllabusType) => void,
  resourceData: Record<string, Resource[]>,
  setResourceData: React.Dispatch<React.SetStateAction<Record<string, Resource[]>>>,
  selectedTopicId: string | null,
  onSelectTopic: (id: string | null) => void,
}) {
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false);
  
  const handleUpdateTopic = React.useCallback(
    (id: string, updates: Partial<SyllabusTopic>) => {
      setSyllabusData((currentData) => updateTopicInTree(currentData, id, () => updates));
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

  const allTags = React.useMemo(() => Array.from(getAllTagsFromTree(syllabusData)).sort(), [syllabusData]);
  const filteredData = React.useMemo(() => filterSyllabus(syllabusData, selectedTags), [syllabusData, selectedTags]);
  
  // When switching syllabus or filtering, reset selection if the selected topic is no longer visible
  React.useEffect(() => {
      if (selectedTopicId && !findTopicById(filteredData, selectedTopicId)) {
          onSelectTopic(null);
      }
  }, [filteredData, selectedTopicId, onSelectTopic]);

  // Reset filters when syllabus source changes
  React.useEffect(() => {
    setSelectedTags(new Set<string>());
  }, [activeSyllabus]);


  const filterPanelContent = (
      <FilterPanel 
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />
  );
  
  return (
    <div className="flex h-screen flex-col">
      <SyllabusHeader 
        onFilterToggle={() => setMobileSheetOpen(true)}
        activeSyllabus={activeSyllabus}
        onSyllabusChange={(syllabus) => {
          setActiveSyllabus(syllabus);
        }}
      />
      <main className="flex min-h-0 flex-1">
        <div className="hidden h-full w-full max-w-xs border-r md:block">
           <SyllabusExplorer
            data={filteredData}
            selectedTopicId={selectedTopicId}
            onSelectTopic={onSelectTopic}
            title={syllabusTitles[activeSyllabus]}
          />
        </div>
        <div className="min-w-0 flex-1">
          <DetailPane 
            syllabusData={syllabusData}
            selectedTopicId={selectedTopicId}
            onUpdateTopic={handleUpdateTopic}
            onSelectTopic={onSelectTopic}
            resourceData={resourceData}
            setResourceData={setResourceData}
          />
        </div>
      </main>

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent className="flex flex-col">
            <SheetHeader>
                <SheetTitle>Syllabus Menu</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Filters</h3>
                {filterPanelContent}
            </div>
            <div className="flex-1 overflow-y-auto">
                <h3 className="mb-4 mt-4 border-t pt-4 text-sm font-semibold text-muted-foreground">Explorer</h3>
                <SyllabusExplorer
                  data={filteredData}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={(id) => {
                    onSelectTopic(id);
                    setMobileSheetOpen(false); // Close sheet on selection
                  }}
                  title={syllabusTitles[activeSyllabus]}
                />
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

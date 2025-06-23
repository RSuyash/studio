
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { SyllabusTopic } from "@/lib/types";
import FilterPanel from "./filter-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { updateTopicInTree, getAllTagsFromTree, filterSyllabus, findTopicById } from "@/lib/resource-utils";
import { SyllabusExplorer } from "./syllabus-explorer";
import { DetailPane } from "./detail-pane";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { BookOpen, SlidersHorizontal } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SyllabusType } from "../main-layout";
import { Icons } from "../icons";

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
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Syllabus Explorer</h2>
            </div>
        </div>
        <div className="flex items-center gap-2">
           <Select value={activeSyllabus} onValueChange={onSyllabusChange}>
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Exam" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="upsc">UPSC CSE</SelectItem>
                  <SelectItem value="mpsc">MPSC Rajyaseva</SelectItem>
              </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={onFilterToggle}>
              <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
    </header>
);

export default function SyllabusViewer({ 
  syllabusData, 
  setSyllabusData, 
  activeSyllabus, 
  setActiveSyllabus 
}: { 
  syllabusData: SyllabusTopic[], 
  setSyllabusData: React.Dispatch<React.SetStateAction<SyllabusTopic[]>>,
  activeSyllabus: SyllabusType,
  setActiveSyllabus: (syllabus: SyllabusType) => void,
}) {
  const [selectedTopicId, setSelectedTopicId] = React.useState<string | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  
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

  const allTags = React.useMemo(() => Array.from(getAllTagsFromTree(syllabusData)).sort(), [syllabusData]);
  const filteredData = React.useMemo(() => filterSyllabus(syllabusData, selectedTags), [syllabusData, selectedTags]);
  
  // When switching syllabus or filtering, reset selection if the selected topic is no longer visible
  React.useEffect(() => {
      if (selectedTopicId && !findTopicById(filteredData, selectedTopicId)) {
          setSelectedTopicId(null);
      }
  }, [filteredData, selectedTopicId]);

  // Reset selection and filters when syllabus source changes
  React.useEffect(() => {
    setSelectedTags(new Set<string>());
    setSelectedTopicId(null);
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
        onFilterToggle={() => setMobileFilterOpen(true)}
        activeSyllabus={activeSyllabus}
        onSyllabusChange={(syllabus) => {
          setActiveSyllabus(syllabus);
        }}
      />
      <main className="flex min-h-0 flex-1">
        <div className="hidden h-full w-full max-w-xs border-r lg:block">
          <SyllabusExplorer
            data={filteredData}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            title={activeSyllabus === 'upsc' ? "UPSC Syllabus" : "MPSC Syllabus"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <DetailPane 
            syllabusData={syllabusData}
            selectedTopicId={selectedTopicId}
            onUpdate={handleUpdateTopic}
          />
        </div>
      </main>

      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>Filter Syllabus</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                {filterPanelContent}
            </div>
             <SheetHeader className="mt-4 border-t pt-4">
                <SheetTitle>Explore Syllabus</SheetTitle>
            </SheetHeader>
             <div className="py-4">
                <SyllabusExplorer
                  data={filteredData}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={(id) => {
                    setSelectedTopicId(id);
                    setMobileFilterOpen(false); // Close sheet on selection
                  }}
                  title={activeSyllabus === 'upsc' ? "UPSC Syllabus" : "MPSC Syllabus"}
                />
            </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

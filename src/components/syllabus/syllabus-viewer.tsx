"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { initialSyllabusData, SyllabusTopic } from "@/lib/syllabus-data";
import SyllabusNode from "./syllabus-node";
import FocusModeDialog from "./focus-mode-dialog";
import FilterPanel from "./filter-panel";

// Recursive function to update a topic in the nested structure
const updateTopicInTree = (
  topics: SyllabusTopic[],
  id: string,
  updates: Partial<SyllabusTopic>
): SyllabusTopic[] => {
  return topics.map((topic) => {
    if (topic.id === id) {
      return { ...topic, ...updates };
    }
    if (topic.subtopics) {
      return {
        ...topic,
        subtopics: updateTopicInTree(topic.subtopics, id, updates),
      };
    }
    return topic;
  });
};

// Recursive function to get all unique tags from the tree
const getAllTagsFromTree = (topics: SyllabusTopic[]): Set<string> => {
  const tags = new Set<string>();
  topics.forEach((topic) => {
    topic.tags.forEach((tag) => tags.add(tag));
    if (topic.subtopics) {
      getAllTagsFromTree(topic.subtopics).forEach((tag) => tags.add(tag));
    }
  });
  return tags;
};

// Recursive function to filter the syllabus
const filterSyllabus = (
  topics: SyllabusTopic[],
  selectedTags: Set<string>
): SyllabusTopic[] => {
  if (selectedTags.size === 0) {
    return topics;
  }

  return topics.reduce<SyllabusTopic[]>((acc, topic) => {
    const hasMatchingTag = Array.from(selectedTags).some(tag => topic.tags.includes(tag));
    const filteredSubtopics = topic.subtopics ? filterSyllabus(topic.subtopics, selectedTags) : [];
    
    if (hasMatchingTag || filteredSubtopics.length > 0) {
      acc.push({ ...topic, subtopics: filteredSubtopics });
    }
    return acc;
  }, []);
};

export default function SyllabusViewer() {
  const [syllabusData, setSyllabusData] = React.useState(initialSyllabusData);
  const [focusTopic, setFocusTopic] = React.useState<SyllabusTopic | null>(null);
  const [selectedTags, setSelectedTags] = React.useState(new Set<string>());
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(null);

  React.useEffect(() => {
    // Find portal container after mount on client
    setPortalContainer(document.getElementById('sidebar-content-portal'));
  }, []);

  const handleUpdateTopic = React.useCallback(
    (id: string, updates: Partial<SyllabusTopic>) => {
      setSyllabusData((currentData) => updateTopicInTree(currentData, id, updates));
    },
    []
  );

  const handleFocusTopic = React.useCallback((topic: SyllabusTopic) => {
    setFocusTopic(topic);
  }, []);

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

  const allTags = React.useMemo(() => Array.from(getAllTagsFromTree(initialSyllabusData)).sort(), [initialSyllabusData]);
  const filteredData = React.useMemo(() => filterSyllabus(syllabusData, selectedTags), [syllabusData, selectedTags]);

  const filterPanel = (
    <FilterPanel 
      allTags={allTags}
      selectedTags={selectedTags}
      onTagToggle={handleTagToggle}
    />
  );
  
  return (
    <>
      {portalContainer ? ReactDOM.createPortal(filterPanel, portalContainer) : null}
      <div className="space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((topic) => (
            <SyllabusNode
              key={topic.id}
              topic={topic}
              onUpdate={handleUpdateTopic}
              onFocus={handleFocusTopic}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
            <h3 className="text-lg font-semibold">No topics match your filter.</h3>
            <p className="text-sm text-muted-foreground">Try selecting different tags or clearing the filter.</p>
          </div>
        )}
      </div>
      <FocusModeDialog
        isOpen={!!focusTopic}
        topic={focusTopic}
        onClose={() => setFocusTopic(null)}
      />
    </>
  );
}

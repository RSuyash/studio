
import type { SyllabusTopic, Resource, ResourceWithTopicInfo } from '@/lib/types';

// Helper to find a topic by ID in a nested structure
export const findTopicById = (topics: SyllabusTopic[], id: string): SyllabusTopic | null => {
    for (const topic of topics) {
      if (topic.id === id) return topic;
      if (topic.subtopics) {
        const found = findTopicById(topic.subtopics, id);
        if (found) return found;
      }
    }
    return null;
};

// Helper function to update a topic in the nested structure
export const updateTopicInTree = (
  topics: SyllabusTopic[],
  id: string,
  updater: (topic: SyllabusTopic) => Partial<SyllabusTopic>
): SyllabusTopic[] => {
  return topics.map((topic) => {
    if (topic.id === id) {
      return { ...topic, ...updater(topic) };
    }
    if (topic.subtopics) {
      return {
        ...topic,
        subtopics: updateTopicInTree(topic.subtopics, id, updater),
      };
    }
    return topic;
  });
};

// Helper to get a flat list of all resources with their topic path
export const getAllResources = (
  resourceData: Record<string, Resource[]>,
  topics: SyllabusTopic[],
): ResourceWithTopicInfo[] => {
  let results: ResourceWithTopicInfo[] = [];

  for (const topicId in resourceData) {
    const resources = resourceData[topicId];
    const topicInfo = findTopicPath(topics, topicId);
    if (topicInfo && resources) {
        const topicPath = topicInfo.path.map(p => p.title).join(' / ');
        resources.forEach(resource => {
            results.push({
                ...resource,
                topicId: topicId,
                topicTitle: topicInfo.topic.title,
                topicPath: topicPath,
            });
        });
    }
  }

  return results;
};


export const findPathToTopicId = (topics: SyllabusTopic[], id: string, currentPath: string[] = []): string[] | null => {
    for (const topic of topics) {
        const newPath = [...currentPath, topic.id];
        if (topic.id === id) {
            return newPath;
        }
        if (topic.subtopics) {
            const foundPath = findPathToTopicId(topic.subtopics, id, newPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
};

export const findTopicPath = (topics: SyllabusTopic[], topicId: string): { topic: SyllabusTopic, path: SyllabusTopic[] } | null => {
    const pathIds = findPathToTopicId(topics, topicId);
    if (!pathIds) return null;

    let currentTopics = topics;
    const path: SyllabusTopic[] = [];
    let foundTopic: SyllabusTopic | undefined;

    for (const id of pathIds) {
        foundTopic = currentTopics.find(t => t.id === id);
        if (foundTopic) {
            path.push(foundTopic);
            currentTopics = foundTopic.subtopics || [];
        } else {
            return null; // Should not happen if pathIds is correct
        }
    }

    if (!foundTopic) return null;

    return { topic: foundTopic, path };
};


// Recursive function to get all unique tags from the tree
export const getAllTagsFromTree = (topics: SyllabusTopic[]): Set<string> => {
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
export const filterSyllabus = (
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

// Gets a high-level topic name (e.g., GS Paper II) from a full topic path
export const getHighLevelTopicName = (topicPath: string): string => {
    const parts = topicPath.split(' / ');
    // Find the first part that looks like a paper name (e.g., contains "Paper")
    // or return the second-to-last part as a reasonable fallback for subject.
    const paperPart = parts.find(p => p.includes('Paper'));
    if (paperPart) {
        return paperPart.split(':')[0]; // E.g., "Paper II: General Studies I" -> "Paper II"
    }
    // Fallback logic
    if (parts.length > 2) {
        return parts[parts.length - 2];
    }
    if (parts.length > 1) {
        return parts[1];
    }
    return parts[0] || 'General';
};

// New function to serialize the syllabus tree for an AI prompt
export const serializeSyllabusForPrompt = (topics: SyllabusTopic[]): string => {
  let result = '';
  const recurse = (items: SyllabusTopic[], depth: number) => {
    items.forEach(item => {
      const prefix = '  '.repeat(depth);
      // Format as "[id] title"
      result += `${prefix}- [${item.id}] ${item.title}\n`;
      if (item.subtopics) {
        recurse(item.subtopics, depth + 1);
      }
    });
  };
  recurse(topics, 0);
  return result;
};

// New function to serialize the syllabus tree with mastery levels for the planner AI
export const serializeSyllabusWithMastery = (allSyllabusData: { [key: string]: SyllabusTopic[] }): string => {
  let result = '';
  
  const recurse = (items: SyllabusTopic[], depth: number) => {
    items.forEach(item => {
      const prefix = '  '.repeat(depth);
      // Format as "[id] [Mastery: novice] title"
      result += `${prefix}- [${item.id}] [Mastery: ${item.mastery}] ${item.title}\n`;
      if (item.subtopics) {
        recurse(item.subtopics, depth + 1);
      }
    });
  };
  
  for (const examKey in allSyllabusData) {
      result += `--- SYLLABUS FOR ${examKey.toUpperCase()} ---\n\n`;
      recurse(allSyllabusData[examKey], 0);
      result += '\n';
  }
  
  return result;
};

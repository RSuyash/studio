
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
  updater: (topic: SyllabusTopic) => SyllabusTopic
): SyllabusTopic[] => {
  return topics.map((topic) => {
    if (topic.id === id) {
      return updater(topic);
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
  topics: SyllabusTopic[],
  currentPath: string[] = []
): ResourceWithTopicInfo[] => {
  let results: ResourceWithTopicInfo[] = [];
  topics.forEach((topic) => {
    const newPath = [...currentPath, topic.title];
    if (topic.resources && topic.resources.length > 0) {
      topic.resources.forEach(resource => {
        results.push({
          ...resource,
          topicId: topic.id,
          topicTitle: topic.title,
          topicPath: newPath.join(' / '),
        });
      });
    }
    if (topic.subtopics) {
      results = [...results, ...getAllResources(topic.subtopics, newPath)];
    }
  });
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


export const subjectTopicMap: Record<string, string> = {
    'preliminary-exam': 'Prelims',
    'main-exam': 'Mains',
    'mains-gs1': 'GS-I: History, Geo, Society',
    'mains-gs2': 'GS-II: Polity, Gov, IR',
    'mains-gs3': 'GS-III: Economy, S&T, Security',
    'mains-gs4': 'GS-IV: Ethics',
    'mains-optional': 'Optional Subject',
    'interview': 'Interview'
};

export const subjects = Object.values(subjectTopicMap);
export const ncertClasses = ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const getSubjectForResource = (resource: ResourceWithTopicInfo, topics: SyllabusTopic[]): string => {
    const path = findPathToTopicId(topics, resource.topicId);
    if (!path || path.length === 0) {
        return 'Uncategorized';
    }
    
    // Find the most specific subject mapping from the path
    for (let i = path.length - 1; i >= 0; i--) {
        const topicId = path[i];
        if (subjectTopicMap[topicId]) {
            return subjectTopicMap[topicId];
        }
    }
    
    return 'Other';
};

// Maps user-friendly subject names to the most appropriate high-level topic ID.
export const bookSubjectTopicMap: Record<string, string> = {
  'History & Culture': 'mains-gs1-art-culture',
  'Modern History': 'mains-gs1-modern-history',
  'Geography': 'prelims-gs1-geography',
  'Indian Society': 'mains-gs1-society',
  'Polity & Governance': 'prelims-gs1-polity',
  'Social Justice & IR': 'mains-gs2',
  'Economy': 'prelims-gs1-economy',
  'Environment & Ecology': 'prelims-gs1-environment',
  'Science & Technology': 'prelims-gs1-science',
  'Internal Security & DM': 'mains-gs3',
  'Ethics': 'mains-gs4',
  'Optional Subject': 'mains-optional',
};

export const bookSubjects = Object.keys(bookSubjectTopicMap).sort();

// Create a reverse map for editing purposes (topicId -> subject).
export const topicIdToBookSubjectMap = Object.fromEntries(
  Object.entries(bookSubjectTopicMap).map(([subject, topicId]) => [topicId, subject])
);

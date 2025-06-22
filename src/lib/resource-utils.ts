import { type SyllabusTopic, type Resource } from '@/lib/syllabus-data';

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

export interface ResourceWithTopicInfo extends Resource {
  topicId: string;
  topicTitle: string;
  topicPath: string;
}

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


export const findPathToTopic = (topics: SyllabusTopic[], id: string, currentPath: string[] = []): string[] | null => {
    for (const topic of topics) {
        const newPath = [...currentPath, topic.id];
        if (topic.id === id) {
            return newPath;
        }
        if (topic.subtopics) {
            const foundPath = findPathToTopic(topic.subtopics, id, newPath);
            if (foundPath) return foundPath;
        }
    }
    return null;
};

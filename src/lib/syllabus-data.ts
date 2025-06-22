export type MasteryLevel = 'none' | 'novice' | 'advanced' | 'expert';

export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  mastery: MasteryLevel;
  subtopics?: SyllabusTopic[];
}

export const initialSyllabusData: SyllabusTopic[] = [
  {
    id: 'cs-foundations',
    title: 'Computer Science Foundations',
    description: 'Core concepts that form the bedrock of all computing disciplines.',
    tags: ['core-concept', 'theory'],
    mastery: 'none',
    subtopics: [
      {
        id: 'data-structures',
        title: 'Data Structures',
        description: 'Understanding how to store and organize data efficiently.',
        tags: ['programming', 'core-concept'],
        mastery: 'none',
        subtopics: [
          {
            id: 'arrays',
            title: 'Arrays & Lists',
            description: 'Fundamental linear data structures.',
            tags: ['fundamental'],
            mastery: 'none',
          },
          {
            id: 'trees',
            title: 'Trees, Tries & Graphs',
            description: 'Non-linear data structures for hierarchical or networked data.',
            tags: ['advanced'],
            mastery: 'none',
          },
        ],
      },
      {
        id: 'algorithms',
        title: 'Algorithms',
        description: 'Designing and analyzing step-by-step procedures for calculations.',
        tags: ['problem-solving', 'core-concept'],
        mastery: 'none',
        subtopics: [
            {
              id: 'sorting',
              title: 'Sorting Algorithms',
              description: 'Algorithms like Quicksort, Mergesort, and Bubblesort.',
              tags: ['fundamental'],
              mastery: 'none',
            },
            {
              id: 'searching',
              title: 'Search Algorithms',
              description: 'Techniques like Binary Search and Depth-First Search.',
              tags: ['fundamental', 'graphs'],
              mastery: 'none',
            },
        ]
      },
    ],
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Building modern applications for the World Wide Web.',
    tags: ['practical', 'frontend', 'backend'],
    mastery: 'none',
    subtopics: [
      {
        id: 'frontend',
        title: 'Frontend Technologies',
        description: 'Creating the user interface and experience of a web application.',
        tags: ['frontend', 'ui/ux'],
        mastery: 'none',
        subtopics: [
          {
            id: 'react',
            title: 'React & Frameworks',
            description: 'Building interactive UIs with component-based architecture.',
            tags: ['javascript', 'framework'],
            mastery: 'none',
          },
          {
            id: 'css-styling',
            title: 'CSS & Styling',
            description: 'Advanced styling techniques, preprocessors, and CSS-in-JS.',
            tags: ['css', 'design'],
            mastery: 'none',
          },
        ],
      },
      {
        id: 'backend',
        title: 'Backend Technologies',
        description: 'Managing servers, databases, and application logic.',
        tags: ['backend', 'server'],
        mastery: 'none',
      },
    ],
  },
];

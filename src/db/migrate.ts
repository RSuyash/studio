// A script to migrate data from TS files to a PostgreSQL database.
//
// To run this script:
// 1. Make sure you have a PostgreSQL database running.
// 2. Create a .env.local file with your DATABASE_URL.
//    e.g., DATABASE_URL=postgres://user:password@localhost:5432/database_name
// 3. Run `npm install`
// 4. Run `psql -d YOUR_DATABASE_URL -f src/db/schema.sql` to create tables.
// 5. Run `npm run db:migrate`

import { Pool } from 'pg';
import 'dotenv/config';

import { initialSyllabusData as upscSyllabus } from '@/lib/exams/upsc/upsc-syllabus-data';
import { mpscSyllabusData as mpscSyllabus } from '@/lib/exams/mpsc/mpsc-syllabus-data';
import { initialResourceData } from '@/lib/resources/resource-data';
import type { SyllabusTopic, Resource } from '@/lib/types';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface FlatTopic {
  id: string;
  title: string;
  description: string;
  icon: string | undefined;
  marks: number | undefined;
  questions: number | undefined;
  mastery: string;
  parent_id: string | null;
  exam_id: 'upsc' | 'mpsc';
  tags: string[];
}

// Recursively flattens the syllabus tree
const flattenSyllabus = (
  topics: SyllabusTopic[],
  exam_id: 'upsc' | 'mpsc',
  parent_id: string | null = null
): FlatTopic[] => {
  let flatList: FlatTopic[] = [];
  for (const topic of topics) {
    flatList.push({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      icon: topic.icon,
      marks: topic.marks,
      questions: topic.questions,
      mastery: topic.mastery,
      parent_id,
      exam_id,
      tags: topic.tags,
    });
    if (topic.subtopics) {
      flatList = flatList.concat(flattenSyllabus(topic.subtopics, exam_id, topic.id));
    }
  }
  return flatList;
};

async function main() {
  const client = await pool.connect();
  try {
    console.log('Starting database migration...');
    await client.query('BEGIN');

    // 1. Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM resources;');
    await client.query('DELETE FROM topic_tags;');
    await client.query('DELETE FROM syllabus_topics;');
    await client.query('DELETE FROM tags;');
    await client.query('DELETE FROM exams;');

    // 2. Insert exams
    console.log('Inserting exams...');
    await client.query(`
      INSERT INTO exams (id, name) VALUES 
      ('upsc', 'UPSC CSE'),
      ('mpsc', 'MPSC Rajyaseva');
    `);

    // 3. Process and flatten syllabus data
    console.log('Processing syllabus data...');
    const allFlatTopics = [
      ...flattenSyllabus(upscSyllabus, 'upsc'),
      ...flattenSyllabus(mpscSyllabus, 'mpsc'),
    ];

    const allTags = [...new Set(allFlatTopics.flatMap(t => t.tags))];

    // 4. Insert tags
    console.log(`Found ${allTags.length} unique tags. Inserting...`);
    if (allTags.length > 0) {
      const tagInsertQuery = 'INSERT INTO tags (name) SELECT unnest($1::text[]) ON CONFLICT (name) DO NOTHING;';
      await client.query(tagInsertQuery, [allTags]);
    }

    // Retrieve all tags with their IDs
    const tagsResult = await client.query('SELECT id, name FROM tags;');
    const tagMap = new Map(tagsResult.rows.map(row => [row.name, row.id]));
    console.log('Tags inserted and mapped.');

    // 5. Insert syllabus topics
    console.log(`Inserting ${allFlatTopics.length} syllabus topics...`);
    for (const topic of allFlatTopics) {
      await client.query(
        `INSERT INTO syllabus_topics (id, title, description, icon, marks, questions, mastery, parent_id, exam_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          topic.id,
          topic.title,
          topic.description,
          topic.icon,
          topic.marks,
          topic.questions,
          topic.mastery,
          topic.parent_id,
          topic.exam_id,
        ]
      );
    }
    console.log('Syllabus topics inserted.');

    // 6. Insert topic-tag relationships
    console.log('Inserting topic-tag relationships...');
    for (const topic of allFlatTopics) {
      for (const tagName of topic.tags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await client.query(
            'INSERT INTO topic_tags (topic_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
            [topic.id, tagId]
          );
        }
      }
    }
    console.log('Topic-tag relationships inserted.');

    // 7. Insert resources
    console.log('Inserting resources...');
    const allResources: (Resource & { topicId: string })[] = [];
    for (const topicId in initialResourceData) {
      initialResourceData[topicId].forEach(resource => {
        allResources.push({ ...resource, topicId });
      });
    }

    for (const resource of allResources) {
      await client.query(
        `INSERT INTO resources (id, title, url, category, status, description, progress, total, topic_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          resource.id,
          resource.title,
          resource.url,
          resource.category,
          resource.status,
          resource.description,
          resource.progress,
          resource.total,
          resource.topicId,
        ]
      );
    }
    console.log(`${allResources.length} resources inserted.`);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

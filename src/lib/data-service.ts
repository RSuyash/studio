import { pool } from './db';
import type { SyllabusTopic, Resource, Exam } from './types';
import type { PoolClient } from 'pg';

const placeholderIfosExam: Exam = {
    id: 'ifos',
    title: 'IFoS Exam Data Not Found',
    description: 'Please connect to the database to view this content. Run the migration script to populate the data.',
    stages: [],
    finalScore: [],
};

// Helper function to build a tree from a flat list of topics
const buildSyllabusTree = (topics: any[]): SyllabusTopic[] => {
    if (topics.length === 0) return [];
    
    const topicMap = new Map<string, any>();
    const roots: SyllabusTopic[] = [];

    // First pass: create a map of all topics
    topics.forEach(topic => {
        topicMap.set(topic.id, {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            icon: topic.icon,
            marks: topic.marks,
            questions: topic.questions,
            mastery: topic.mastery,
            tags: topic.tags || [],
            subtopics: []
        });
    });

    // Second pass: build the tree structure
    topics.forEach(topic => {
        if (topic.parent_id && topicMap.has(topic.parent_id)) {
            const parent = topicMap.get(topic.parent_id);
            // Ensure subtopics array exists
            if (!parent.subtopics) {
                parent.subtopics = [];
            }
            parent.subtopics.push(topicMap.get(topic.id));
        } else {
            roots.push(topicMap.get(topic.id));
        }
    });

    return roots;
};

export async function getSyllabusDataForExam(examId: 'upsc' | 'mpsc' | 'ifos'): Promise<SyllabusTopic[]> {
    if (!pool) {
        console.log(`Database not connected. Falling back to mock data for ${examId} syllabus.`);
        if (examId === 'ifos') {
            console.log('Database not connected. Returning empty syllabus for IFoS.');
            return [];
        }
        if (examId === 'upsc') {
            const { initialSyllabusData } = await import('@/lib/exams/upsc/upsc-syllabus-data');
            return initialSyllabusData;
        } else {
            const { mpscSyllabusData } = await import('@/lib/exams/mpsc/mpsc-syllabus-data');
            return mpscSyllabusData;
        }
    }

    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log(`Fetching syllabus from database for: ${examId}...`);
        const query = `
            SELECT 
                st.id, st.title, st.description, st.icon, st.marks, st.questions, st.mastery, st.parent_id,
                COALESCE(json_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '[]') as tags
            FROM syllabus_topics st
            LEFT JOIN topic_tags tt ON st.id = tt.topic_id
            LEFT JOIN tags t ON tt.tag_id = t.id
            WHERE st.exam_id = $1
            GROUP BY st.id
            ORDER BY st.title;
        `;
        const res = await client.query(query, [examId]);
        console.log(`Successfully fetched ${res.rows.length} total topic entries for ${examId} from database.`);
        return buildSyllabusTree(res.rows);
    } catch (e) {
        console.error(`Failed to fetch syllabus for ${examId} from database. Falling back to mock data.`, e);
        if (examId === 'ifos') {
            console.error('Failed to fetch IFoS syllabus from database. Returning empty syllabus.', e);
            return [];
        }
        if (examId === 'upsc') {
            const { initialSyllabusData } = await import('@/lib/exams/upsc/upsc-syllabus-data');
            return initialSyllabusData;
        } else {
            const { mpscSyllabusData } = await import('@/lib/exams/mpsc/mpsc-syllabus-data');
            return mpscSyllabusData;
        }
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getResourceData(): Promise<Record<string, Resource[]>> {
    if (!pool) {
         console.log('Database not connected. Falling back to mock data for resources.');
         const { initialResourceData } = await import('@/lib/resources/resource-data');
         return initialResourceData;
    }

    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log('Fetching resources from database...');
        const res = await client.query('SELECT * FROM resources');
        const resourceMap: Record<string, Resource[]> = {};
        
        res.rows.forEach(row => {
            const resource: Resource = {
                id: row.id,
                title: row.title,
                url: row.url,
                category: row.category,
                status: row.status,
                description: row.description,
                progress: row.progress,
                total: row.total,
            };
            if (!resourceMap[row.topic_id]) {
                resourceMap[row.topic_id] = [];
            }
            resourceMap[row.topic_id].push(resource);
        });
        console.log(`Successfully fetched resources for ${Object.keys(resourceMap).length} topics from database.`);
        return resourceMap;
    } catch (e) {
        console.error('Failed to fetch resources from database. Falling back to mock data.', e);
        const { initialResourceData } = await import('@/lib/resources/resource-data');
        return initialResourceData;
    } finally {
        if (client) {
            client.release();
        }
    }
}

export async function getExamData(examId: 'upsc' | 'mpsc' | 'ifos'): Promise<Exam> {
    if (!pool) {
        console.log(`Database not connected. Falling back to mock data for ${examId} exam structure.`);
        if (examId === 'ifos') {
            console.log('Database not connected. Returning placeholder for IFoS exam data.');
            return placeholderIfosExam;
        }
        if (examId === 'upsc') {
            const { upscCseExam } = await import('@/lib/exams/upsc/upsc-exam-data');
            return upscCseExam;
        } else {
            const { mpscRajyasevaExam } = await import('@/lib/exams/mpsc/mpsc-exam-data');
            return mpscRajyasevaExam;
        }
    }

    let client: PoolClient | undefined;
    try {
        client = await pool.connect();
        console.log(`Fetching exam structure from database for: ${examId}...`);
        const query = 'SELECT structure FROM exam_details WHERE id = $1';
        const res = await client.query(query, [examId]);
        if (res.rows.length === 0) {
             if (examId === 'ifos') {
                console.error('IFoS exam structure not found in database. Returning placeholder.');
                return placeholderIfosExam;
            }
            throw new Error(`Exam structure for ${examId} not found in database.`);
        }
        console.log(`Successfully fetched exam structure for ${examId} from database.`);
        return res.rows[0].structure as Exam;
    } catch (e) {
        console.error(`Failed to fetch exam structure for ${examId} from database. Falling back to mock data.`, e);
        if (examId === 'ifos') {
            console.error('Failed to fetch IFoS exam from database. Returning placeholder.', e);
            return placeholderIfosExam;
        }
        if (examId === 'upsc') {
            const { upscCseExam } = await import('@/lib/exams/upsc/upsc-exam-data');
            return upscCseExam;
        } else {
            const { mpscRajyasevaExam } = await import('@/lib/exams/mpsc/mpsc-exam-data');
            return mpscRajyasevaExam;
        }
    } finally {
        if (client) {
            client.release();
        }
    }
}

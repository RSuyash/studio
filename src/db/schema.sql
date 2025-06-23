-- This schema defines the database structure for the Nexus Cortex application.
-- To set up your local database, run:
-- psql -d YOUR_DATABASE_URL -f src/db/schema.sql

-- Drop existing tables in reverse order of creation to handle foreign keys
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS topic_tags;
DROP TABLE IF EXISTS syllabus_topics;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS exam_details;
DROP TABLE IF EXISTS exams;


-- Table for storing the main exams supported
CREATE TABLE exams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Table for storing the detailed structure of each exam as JSON
CREATE TABLE exam_details (
    id VARCHAR(50) PRIMARY KEY REFERENCES exams(id) ON DELETE CASCADE,
    structure JSONB NOT NULL
);

-- Table for storing tags that can be applied to topics
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Main table for syllabus topics with a recursive relationship
CREATE TABLE syllabus_topics (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    marks INTEGER,
    questions INTEGER,
    mastery VARCHAR(50) DEFAULT 'none',
    parent_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    exam_id VARCHAR(50) REFERENCES exams(id) ON DELETE CASCADE NOT NULL
);

-- Junction table for the many-to-many relationship between topics and tags
CREATE TABLE topic_tags (
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

-- Table for storing resources linked to syllabus topics
CREATE TABLE resources (
    id VARCHAR(255) PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'todo',
    description TEXT,
    progress INTEGER,
    total INTEGER,
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE NOT NULL
);
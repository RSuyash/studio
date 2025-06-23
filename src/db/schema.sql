
-- This schema is designed for a PostgreSQL database.

-- Exams Table: Stores the top-level information about each examination.
CREATE TABLE exams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Exam Details Table: Stores the complex JSON structure of each exam.
CREATE TABLE exam_details (
    id VARCHAR(50) PRIMARY KEY REFERENCES exams(id),
    structure JSONB NOT NULL
);

-- Tags Table: Stores all unique tags that can be applied to syllabus topics.
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Syllabus Topics Table: The core table for the syllabus structure.
CREATE TABLE syllabus_topics (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    marks INTEGER,
    questions INTEGER,
    mastery VARCHAR(50) NOT NULL,
    parent_id VARCHAR(255) REFERENCES syllabus_topics(id),
    exam_id VARCHAR(50) REFERENCES exams(id) NOT NULL
);

-- Topic-Tags Junction Table: Many-to-many relationship between topics and tags.
CREATE TABLE topic_tags (
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

-- Resources Table: Stores all user-added resources, linked to a specific syllabus topic.
CREATE TABLE resources (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    progress INTEGER,
    total INTEGER,
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE NOT NULL
);

-- Exam Comparison Table: Stores data for comparing various exams against UPSC.
CREATE TABLE exam_comparison (
    id SERIAL PRIMARY KEY,
    exam_name VARCHAR(255) NOT NULL,
    major_topics TEXT NOT NULL,
    overlap_with_upsc VARCHAR(255) NOT NULL,
    notes TEXT
);

-- Study Plans Table: Stores user-generated and saved study plans.
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    input_details JSONB NOT NULL,
    plan_data JSONB NOT NULL
);

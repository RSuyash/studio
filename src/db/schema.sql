
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS topic_tags;
DROP TABLE IF EXISTS syllabus_topics;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS exam_details;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS exam_comparison;

CREATE TABLE exams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE exam_details (
    id VARCHAR(50) PRIMARY KEY REFERENCES exams(id),
    structure JSONB NOT NULL
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE syllabus_topics (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    marks INTEGER,
    questions INTEGER,
    mastery VARCHAR(20) NOT NULL,
    parent_id VARCHAR(255) REFERENCES syllabus_topics(id),
    exam_id VARCHAR(50) REFERENCES exams(id) NOT NULL
);

CREATE TABLE topic_tags (
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (topic_id, tag_id)
);

CREATE TABLE resources (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    progress INTEGER,
    total INTEGER,
    topic_id VARCHAR(255) REFERENCES syllabus_topics(id) NOT NULL
);

CREATE TABLE exam_comparison (
    id SERIAL PRIMARY KEY,
    exam_name VARCHAR(255) NOT NULL,
    major_topics TEXT,
    overlap_with_upsc TEXT,
    notes TEXT
);

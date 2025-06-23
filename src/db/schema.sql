-- schema.sql
-- This file contains the SQL commands to set up the database schema for Project Nexus.

-- Drop tables in reverse order of dependency to avoid foreign key constraints errors
DROP TABLE IF EXISTS "resources" CASCADE;
DROP TABLE IF EXISTS "topic_tags" CASCADE;
DROP TABLE IF EXISTS "tags" CASCADE;
DROP TABLE IF EXISTS "syllabus_topics" CASCADE;
DROP TABLE IF EXISTS "exams" CASCADE;

-- Table to store the main exams (e.g., UPSC, MPSC)
CREATE TABLE "exams" (
  "id" VARCHAR(255) PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL
);

-- Table to store all syllabus topics in a hierarchical structure
CREATE TABLE "syllabus_topics" (
  "id" VARCHAR(255) PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "icon" VARCHAR(255),
  "marks" INTEGER,
  "questions" INTEGER,
  "mastery" VARCHAR(50) NOT NULL DEFAULT 'none',
  "parent_id" VARCHAR(255) REFERENCES "syllabus_topics"("id") ON DELETE CASCADE,
  "exam_id" VARCHAR(255) NOT NULL REFERENCES "exams"("id") ON DELETE CASCADE
);

-- Create an index on parent_id for faster hierarchical queries
CREATE INDEX "idx_syllabus_topics_parent_id" ON "syllabus_topics" ("parent_id");

-- Table for tags
CREATE TABLE "tags" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) UNIQUE NOT NULL
);

-- Join table for the many-to-many relationship between topics and tags
CREATE TABLE "topic_tags" (
  "topic_id" VARCHAR(255) NOT NULL REFERENCES "syllabus_topics"("id") ON DELETE CASCADE,
  "tag_id" INTEGER NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("topic_id", "tag_id")
);

-- Table to store user resources, linked to a specific syllabus topic
CREATE TABLE "resources" (
  "id" VARCHAR(255) PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "url" TEXT NOT NULL,
  "category" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'todo',
  "description" TEXT,
  "progress" INTEGER,
  "total" INTEGER,
  "topic_id" VARCHAR(255) NOT NULL REFERENCES "syllabus_topics"("id") ON DELETE CASCADE
);

-- Create an index on topic_id for faster resource lookups
CREATE INDEX "idx_resources_topic_id" ON "resources" ("topic_id");

-- Create an index on category for faster filtering
CREATE INDEX "idx_resources_category" ON "resources" ("category");

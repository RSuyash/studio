# Database Setup and Migration Guide

This guide provides instructions for setting up a local PostgreSQL database, migrating the application's data from TypeScript files, and running the app with a live database connection.

## How the Connection Works

The application is designed to be flexible. It looks for a `DATABASE_URL` environment variable on startup.
- **If `DATABASE_URL` is found**, it will connect to your PostgreSQL database to load and manage syllabus and resource data.
- **If `DATABASE_URL` is NOT found**, the app will gracefully fall back to using the static data from the TypeScript files located in `/src/lib/`. No database is required in this case.

---

## Local Setup Steps

### Prerequisites

1.  **PostgreSQL Installed**: You must have a PostgreSQL server running on your local machine.
2.  **`psql` CLI**: Ensure you have the `psql` command-line tool available, which usually comes with the PostgreSQL installation.

### Step 1: Create a Database

First, create a new database for the application. You can do this using `psql` or any database management tool.

```bash
# Example using psql
createdb nexus_cortex
```

### Step 2: Set Up Environment Variables

Create a new file named `.env.local` in the root directory of the project (at the same level as `package.json`).

Add your database connection string to this file. The format is `postgres://USER:PASSWORD@HOST:PORT/DATABASE`.

**File: `.env.local`**
```
DATABASE_URL=postgres://your_user:your_password@localhost:5432/nexus_cortex
```
*Replace `your_user` and `your_password` with your actual PostgreSQL credentials. If you don't have a password set up, the format might be `postgres://your_user@localhost:5432/nexus_cortex`.*

### Step 3: Install Dependencies

Make sure you have installed the necessary Node.js packages, including the `pg` driver for PostgreSQL.

```bash
npm install
```

### Step 4: Create Database Tables

The `schema.sql` file contains the commands to create all the necessary tables. Run this script against the database you created in Step 1.

```bash
# This command executes the schema file on your database
psql -d YOUR_DATABASE_URL -f src/db/schema.sql
```
*Replace `YOUR_DATABASE_URL` with the same connection string you used in your `.env.local` file.*

### Step 5: Run the Data Migration Script

Now, populate the tables with the initial data from the TypeScript files. The project has a pre-configured script for this.

```bash
npm run db:migrate
```
You should see console logs indicating that the data for exams, topics, tags, and resources has been inserted successfully.

### Step 6: Run the Application

You're all set! Start the Next.js development server.

```bash
npm run dev
```

The application will now automatically detect your `.env.local` file and connect to your PostgreSQL database on startup. All initial syllabus and resource data will be fetched directly from your local database.

# Database Migration

This directory contains scripts to migrate the application's data from TypeScript files to a PostgreSQL database.

## Prerequisites

1.  **PostgreSQL Instance**: You need a running PostgreSQL database.
2.  **Database URL**: You must set the `DATABASE_URL` environment variable to point to your PostgreSQL instance. The format is: `postgres://USER:PASSWORD@HOST:PORT/DATABASE`

    Create a `.env.local` file in the project root and add your connection string:
    ```
    DATABASE_URL=postgres://user:password@localhost:5432/nexus_cortex
    ```

## Setup & Migration Steps

1.  **Create the Database**:
    Manually create a new database in your PostgreSQL instance (e.g., `nexus_cortex`).

2.  **Create Tables**:
    Run the `schema.sql` file against your newly created database to set up the required tables. You can do this using a tool like `psql`:
    ```bash
    psql -d YOUR_DATABASE_URL -f src/db/schema.sql
    ```

3.  **Install Dependencies**:
    Make sure all project dependencies are installed:
    ```bash
    npm install
    ```

4.  **Run the Migration Script**:
    Execute the migration script. This will read the data from the `.ts` files in `src/lib/` and populate your PostgreSQL tables.
    ```bash
    npm run db:migrate
    ```

After these steps, your database will be populated with the syllabus and resource data, ready for the application to use once it's updated to connect to PostgreSQL.

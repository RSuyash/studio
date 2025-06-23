# Database Migration

This directory contains scripts to migrate the application's data from TypeScript files to a PostgreSQL database.

## Prerequisites

1.  **PostgreSQL Instance**: You need a running PostgreSQL database.
2.  **Database URL**: You must set the `DATABASE_URL` environment variable to point to your PostgreSQL instance. The format is: `postgres://USER:PASSWORD@HOST:PORT/DATABASE`

    Create a `.env.local` file in the project root and add your connection string:
    ```
    DATABASE_URL=postgres://user:password@localhost:5432/nexus_cortex
    ```
    *If you do not set this variable, the application will fall back to using the static TypeScript files in `src/lib/`.*

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

## Running the Application with PostgreSQL

Once you have completed the migration steps above, you can run the application, and it will load its data from your PostgreSQL database.

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

2.  **Verify Connection**:
    The application will now fetch all syllabus and resource data from your PostgreSQL instance on initial load. If the connection fails or the `DATABASE_URL` is not set, it will automatically fall back to using the local TypeScript files without crashing.

**Note**: Currently, only the initial data loading is connected to the database. Any updates, additions, or deletions you make within the application (e.g., changing mastery level, adding a resource) are handled in-memory and will not be persisted to the database yet. Full database persistence for write operations will be implemented in a future update.

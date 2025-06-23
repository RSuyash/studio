import { Pool } from 'pg';

let pool: Pool | undefined;

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });
    console.log("PostgreSQL connection pool created successfully.");
} else {
    // In a real app, you might want to throw an error here
    // or handle it more gracefully. For this context, we'll
    // allow the pool to be undefined if the URL is not set.
    console.warn("DATABASE_URL is not set. The app will fall back to using local TypeScript files for data.");
}

export { pool };

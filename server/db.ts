import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the project root robustly (works whether in src/server or dist/server)
const projectRoot = __dirname.includes('dist') ? path.join(__dirname, "../../") : path.join(__dirname, "../");

// Path to our SQLite database file
const dbPath = path.join(projectRoot, "bd.sqlite");
const sqlScriptPath = path.join(projectRoot, "bd.sql");

// Create or open the database
export const db = new Database(dbPath, {
    verbose: console.log
});

// Enable modern SQLite features for better performance and safety
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

/**
 * Initializes the database by running the bd.sql script if the tables don't exist.
 */
export function initializeDatabase() {
    try {
        // Check if a core table like 'Utilisateurs' exists
        const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='Utilisateurs'");
        const exists = tableCheck.get();

        if (!exists) {
            console.log("Database tables not found. Initializing from bd.sql...");
            const sqlScript = fs.readFileSync(sqlScriptPath, "utf-8");

            // better-sqlite3 handles multiple statements using .exec()
            // Note: SQLite doesn't natively support ENUMs like MySQL/MariaDB, 
            // but it will accept the syntax and map it to TEXT.
            db.exec(sqlScript);
            console.log("Database initialized successfully.");
        } else {
            console.log("Database tables already exist. Skipping initialization.");
        }
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}

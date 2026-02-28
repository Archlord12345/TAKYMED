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

            // Check for missing columns in Medicaments (Migration)
            const medicamentColumns = db.prepare("PRAGMA table_info(Medicaments)").all() as { name: string }[];
            const hasDateAjout = medicamentColumns.some(c => c.name === 'date_ajout');
            const hasPrix = medicamentColumns.some(c => c.name === 'prix');

            if (!hasDateAjout) {
                console.log("Adding date_ajout column to Medicaments...");
                db.exec("ALTER TABLE Medicaments ADD COLUMN date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP");
            }
            if (!hasPrix) {
                console.log("Adding prix column to Medicaments...");
                db.exec("ALTER TABLE Medicaments ADD COLUMN prix VARCHAR(50)");
            }

            // Check for missing columns in Pharmacies (Migration)
            const pharmacyColumns = db.prepare("PRAGMA table_info(Pharmacies)").all() as { name: string }[];
            const hasLat = pharmacyColumns.some(c => c.name === 'latitude');
            const hasLng = pharmacyColumns.some(c => c.name === 'longitude');

            if (!hasLat) {
                console.log("Adding latitude column to Pharmacies...");
                db.exec("ALTER TABLE Pharmacies ADD COLUMN latitude REAL");
            }
            if (!hasLng) {
                console.log("Adding longitude column to Pharmacies...");
                db.exec("ALTER TABLE Pharmacies ADD COLUMN longitude REAL");
            }
        }
    } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
    }
}

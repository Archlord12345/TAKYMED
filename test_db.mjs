import Database from "better-sqlite3";
import fs from "fs";

const db = new Database(":memory:");
const sql = fs.readFileSync("bd.sql", "utf-8");

const statements = sql.split(';').map(s => s.trim()).filter(Boolean);

statements.forEach((stmt, idx) => {
    try {
        db.exec(stmt);
    } catch (e) {
        console.error(`Error in statement ${idx + 1}:\n${stmt}\n\n-> ${e.message}`);
        process.exit(1);
    }
});
console.log("All statements executed successfully!");

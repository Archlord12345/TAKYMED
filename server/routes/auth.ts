import { Router } from "express";
import { db } from "../db";

const router = Router();

// Login route
router.post("/login", (req, res) => {
    const { email, phone, type, password } = req.body;

    try {
        // Map English frontend types to French DB types
        const typeMap: Record<string, string> = {
            standard: "Standard",
            professional: "Professionnel",
            pharmacist: "Pharmacien"
        };
        const dbType = typeMap[type] || "Standard";

        // In a real app we'd verify password hash. For now, we mock auth but *fetch real DB user data*
        // First, find the account type ID
        const typeRecord = db.prepare("SELECT id_type_compte FROM TypesComptes WHERE nom_type = ?").get(dbType) as { id_type_compte: number } | undefined;

        if (!typeRecord) {
            return res.status(400).json({ error: "Invalid account type" });
        }

        let user;
        if (type === "professional") {
            user = db.prepare(`
        SELECT u.*, p.nom_complet 
        FROM Utilisateurs u 
        LEFT JOIN ProfilsUtilisateurs p ON u.id_utilisateur = p.id_utilisateur 
        WHERE u.numero_telephone = ? AND u.id_type_compte = ?
      `).get(phone, typeRecord.id_type_compte);
        } else {
            user = db.prepare(`
        SELECT u.*, p.nom_complet 
        FROM Utilisateurs u 
        LEFT JOIN ProfilsUtilisateurs p ON u.id_utilisateur = p.id_utilisateur 
        WHERE u.email = ? AND u.id_type_compte = ?
      `).get(email, typeRecord.id_type_compte);
        }

        if (!user) {
            // Auto-register for demo purposes if user not found
            const stmt = db.prepare(`
        INSERT INTO Utilisateurs (email, numero_telephone, id_type_compte, est_pharmacien)
        VALUES (?, ?, ?, ?)
      `);
            const info = stmt.run(
                email || null,
                phone || null,
                typeRecord.id_type_compte,
                type === "pharmacist" ? 1 : 0
            );

            // Auto-create profile
            db.prepare(`INSERT INTO ProfilsUtilisateurs (id_utilisateur, nom_complet) VALUES (?, ?)`).run(
                info.lastInsertRowid,
                email ? email.split('@')[0] : "Nouvel Utilisateur"
            );

            // Fetch the newly created user
            user = db.prepare(`
        SELECT u.*, p.nom_complet 
        FROM Utilisateurs u 
        LEFT JOIN ProfilsUtilisateurs p ON u.id_utilisateur = p.id_utilisateur 
        WHERE u.id_utilisateur = ?
      `).get(info.lastInsertRowid);
        }

        res.json({
            id: user.id_utilisateur,
            email: user.email,
            phone: user.numero_telephone,
            type: type,
            name: user.nom_complet || "Utilisateur"
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const authRouter = router;

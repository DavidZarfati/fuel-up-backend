import connection from "../database/db.js";
import express from "express";
const router = express.Router();

// Endpoint per ottenere tutti i clienti
router.get("/clienti", (req, res) => {
    connection.query("SELECT * FROM customers", (err, results) => {
        if (err) {
            console.error("Errore durante la query:", err);
            return res.status(500).json({ error: "Errore del server" });
        }
        // Ogni cliente come oggetto ordinato
        const clientiOrdinati = results.map(c => ({
            id: c.id,
            name: c.name,
            surname: c.surname,
            email: c.email,
            nation: c.nation,
            city: c.city,
            postal_code: c.postal_code,
            phone_number: c.phone_number,
            address: c.address,
            street_number: c.street_number,
            created_at: c.created_at,
            modified_at: c.modified_at,
            fiscal_code: c.fiscal_code
        }));
        res.json(clientiOrdinati);
    });
});

export default router;

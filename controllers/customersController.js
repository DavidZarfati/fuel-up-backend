import connection from "../database/db.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM customers";

    connection.query(indexQuery, (err, result) => {
        if (err) {
            console.error("Errore durante la query:", err);
            return res.status(500).json({ error: "Errore del server" });
        }

        const clientiOrdinati = result.map(c => ({
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
    })
}



const controller = {
    index,
   
}

export default controller;
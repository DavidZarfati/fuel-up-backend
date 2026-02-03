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

function show(req, res, next) {
    const showQuery = "SELECT * FROM customers WHERE customers.id = ?";
    const id = req.params.id;
    connection.query(showQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ errore: "Errore nel recupero del cliente", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({
                errore: "ClienteNonTrovato",
                numero_errore: 404,
                descrizione: "Nessun cliente trovato con l'id fornito."
            });
        }
        const cliente = {
            id: results[0].id,
            name: results[0].name,
            surname: results[0].surname,
            email: results[0].email,
            nation: results[0].nation,
            city: results[0].city,
            postal_code: results[0].postal_code,
            phone_number: results[0].phone_number,
            address: results[0].address,
            street_number: results[0].street_number,
            created_at: results[0].created_at,
            modified_at: results[0].modified_at,
            fiscal_code: results[0].fiscal_code
        }
        res.json(cliente);
    });
}



const controller = {
    index, show
}

export default controller;
import connection from "../database/db.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM categories";

    connection.query(indexQuery, (err, result) => {
        if (err) {
            console.error("Errore durante la query:", err);
            return res.status(500).json({ error: "Errore del server" });
        }

        const categorieOrdinate = result.map(categoria => ({
            id: categoria.id,
            name: categoria.name,
            created_at: categoria.created_at,
            modified_at: categoria.modified_at
        }));
        res.json(categorieOrdinate);
    })
}

const controller = {
    index
}

export default controller;
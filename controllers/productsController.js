import connection from "../database/db.js";

// Funzione per ottenere tutti i prodotti
function index(req, res, next) {
    const indexQuery = "SELECT * FROM products";

    connection.query(indexQuery, (err, result) => {
        if (err) {
            console.error("Errore durante la query:", err);
            return res.status(500).json({ error: "Errore del server" });
        }

        // Mappa i risultati per restituire tutti i campi del prodotto
        const prodottiOrdinati = result.map(p => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            description: p.description,
            price: p.price,
            discount_price: p.discount_price,
            image: p.image,
            alt_text: p.alt_text,
            created_at: p.created_at,
            modified_at: p.modified_at,
            stocking_unit: p.stocking_unit,
            weight_kg: p.weight_kg,
            brand: p.brand,
            is_active: p.is_active,
            color: p.color,
            flavor: p.flavor,
            size: p.size,
            macro_categories_id: p.macro_categories_id,
            manufacturer_note: p.manufacturer_note
        }));
        res.json(prodottiOrdinati);
    })
}

// Funzione per ottenere un singolo prodotto tramite ID
function show(req, res, next) {
    const showQuery = "SELECT * FROM products WHERE products.id = ?";
    const id = req.params.id;

    connection.query(showQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ errore: "Errore nel recupero del prodotto", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({
                errore: "ProdottoNonTrovato",
                numero_errore: 404,
                descrizione: "Nessun prodotto trovato con l'id fornito."
            });
        }

        // Crea l'oggetto prodotto con tutti i campi
        const prodotto = {
            id: results[0].id,
            slug: results[0].slug,
            name: results[0].name,
            description: results[0].description,
            price: results[0].price,
            discount_price: results[0].discount_price,
            image: results[0].image,
            alt_text: results[0].alt_text,
            created_at: results[0].created_at,
            modified_at: results[0].modified_at,
            stocking_unit: results[0].stocking_unit,
            weight_kg: results[0].weight_kg,
            brand: results[0].brand,
            is_active: results[0].is_active,
            color: results[0].color,
            flavor: results[0].flavor,
            size: results[0].size,
            macro_categories_id: results[0].macro_categories_id,
            manufacturer_note: results[0].manufacturer_note
        }
        res.json(prodotto);
    });
}

// Esporta le funzioni del controller
const controller = {
    index,
    show
}

export default controller;
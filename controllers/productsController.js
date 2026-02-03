import connection from "../database/db.js";

// Funzione per ottenere tutti i prodotti
function indexProductsPage(req, res, next) {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const itemsforpage = 12;
    const offset = (page - 1) * itemsforpage

    const query = `select * from products limit ? offset ? `;
    connection.query(query, [itemsforpage, offset], (err, result) => {
        if (err) return next(err);

        const queryTotal = `select count(id) as total from products`;
        connection.query(queryTotal, (err, resultTotal) => {
            if (err) return next(err);

            const totalProducts = resultTotal[0].total;

            const productsList = result.map(product => ({
                id: product.id,
                slug: product.slug,
                name: product.name,
                description: product.description,
                price: product.price,
                discont_price: product.discount_price,
                image: product.image,
                alt_text: product.alt_text,
                created_at: product.created_at,
                modified_at: product.modified_at,
                stocking_unit: product.stocking_unit,
                weight_kg: product.weight_kg,
                brand: product.brand,
                is_active: product.is_active,
                color: product.color,
                flavor: product.flavor,
                size: product.size,
                macro_categories_id: product.macro_categories_id,
                manufacturer_note: product.manufacturer_note,

            }));

            return res.json({
                info: {
                    total: totalProducts,
                    pages: Math.ceil(totalProducts / itemsforpage),
                    currentPage: page,
                },
                result: productsList
            })
        })
    })
}

// Funzione per ottenere un singolo prodotto con tutti i dettagli correlati
function show(req, res, next) {
    const id = req.params.id;

    // Query per ottenere i dati del prodotto con la macro_categoria
    const productQuery = `
        SELECT 
            p.*,
            mc.name as macro_category_name
        FROM products p
        LEFT JOIN macro_categories mc ON p.macro_categories_id = mc.id
        WHERE p.id = ?
    `;

    // Query per ottenere le categorie associate al prodotto
    const categoriesQuery = `
        SELECT c.id, c.name
        FROM categories c
        INNER JOIN products_categories pc ON c.id = pc.category_id
        WHERE pc.product_id = ?
    `;

    // Query per ottenere le immagini aggiuntive del prodotto
    const imagesQuery = `
        SELECT id, url, alt_text
        FROM images
        WHERE product_id = ?
    `;

    // Esegui la query per il prodotto
    connection.query(productQuery, [id], (err, productResults) => {
        if (err) {
            console.error("Errore durante la query del prodotto:", err);
            return res.status(500).json({ errore: "Errore nel recupero del prodotto", details: err });
        }

        if (productResults.length === 0) {
            return res.status(404).json({
                errore: "ProdottoNonTrovato",
                numero_errore: 404,
                descrizione: "Nessun prodotto trovato con l'id fornito."
            });
        }

        const productData = productResults[0];

        // Esegui la query per le categorie
        connection.query(categoriesQuery, [id], (err, categoriesResults) => {
            if (err) {
                console.error("Errore durante la query delle categorie:", err);
                return res.status(500).json({ errore: "Errore nel recupero delle categorie", details: err });
            }

            // Esegui la query per le immagini
            connection.query(imagesQuery, [id], (err, imagesResults) => {
                if (err) {
                    console.error("Errore durante la query delle immagini:", err);
                    return res.status(500).json({ errore: "Errore nel recupero delle immagini", details: err });
                }

                // Costruisci l'oggetto prodotto completo
                const prodotto = {
                    id: productData.id,
                    slug: productData.slug,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    discount_price: productData.discount_price,
                    image: productData.image,
                    alt_text: productData.alt_text,
                    created_at: productData.created_at,
                    modified_at: productData.modified_at,
                    stocking_unit: productData.stocking_unit,
                    weight_kg: productData.weight_kg,
                    brand: productData.brand,
                    is_active: productData.is_active,
                    color: productData.color,
                    flavor: productData.flavor,
                    size: productData.size,
                    manufacturer_note: productData.manufacturer_note,
                    // Dati della macro_categoria
                    macro_category: {
                        id: productData.macro_categories_id,
                        name: productData.macro_category_name
                    },
                    // Array delle categorie associate
                    categories: categoriesResults.map(cat => ({
                        id: cat.id,
                        name: cat.name
                    })),
                    // Array delle immagini aggiuntive
                    additional_images: imagesResults.map(img => ({
                        id: img.id,
                        url: img.url,
                        alt_text: img.alt_text
                    }))
                };

                res.json(prodotto);
            });
        });
    });
}

// Esporta le funzioni del controller

const controller = {
    index: indexProductsPage,
    show
}

export default controller;
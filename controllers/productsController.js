import connection from "../database/db.js";

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

function singleProduct(req, res, next) {
    const slug = req.params.slug;

    const query = "SELECT * FROM products WHERE slug = ?";

    connection.query(query, [slug], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            return res.status(404).json({
                error: "Product not found",
                message: "Prodotto non trovato"
            });
        }
        const singleProduct = results.map((product) => ({
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
        }))

        res.json({
            result: singleProduct
        });
    });
}

const controller = {
    indexProductsPage,
    singleProduct
}
export default controller
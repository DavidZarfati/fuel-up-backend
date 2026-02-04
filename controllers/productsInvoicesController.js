import connection from "../database/db.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM products_invoices";

    connection.query(indexQuery, (err, indexResult) => {
        if (err) return next(err);

        return res.status(200).json({
            results: indexResult
        });
    });
}

function show(req, res, next) {
    const { id } = req.params;

    const showQuery = `
    SELECT *
    FROM products_invoices
    WHERE id IN ?`;

    connection.query(showQuery, [id], (err, showResult) => {
        if (err) return next(err);

        if (showResult.length === 0) {
            return res.status(404).json({ message: "products_invoice not found", status: 404 });
        }

        return res.status(200).json({
            result: showResult
        });
    });
}

const controller = 
{
    index,
    show,
}

export default controller;
import connection from "../database/db.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM invoices";

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
    FROM invoices
    WHERE id = ?`;

    connection.query(showQuery, [id], (err, showResult) => {
        if (err) return next(err);

        if (showResult.length === 0) {
            return res.status(404).json({ message: "Order not found", status: 404 });
        }

        return res.status(200).json({
            result: showResult
        });
    });
}

function store(req, res, next) {
    const post = req.body;

    const storeQuery =`
    INSERT INTO invoices
    (customers_id, order_number, delivery_fee, total_amount)
    VALUES
    (?, ?, ?, ?)`;

    const values = [post.customers_id, post.order_number, post.delivery_fee, post.total_amount];

    connection.query(storeQuery, values, (err, result) => {
        if (err) return next(err);

        return res.status(201).json({
            message: "Order created successfully",
            orderId: result
        });
    });
}

const controller = {
    index,
    show,
    store
}

export default controller;
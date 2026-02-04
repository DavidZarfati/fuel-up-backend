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

    connection.beginTransaction(err => {
        if (err) return next(err);


        const customerQuery = `
        INSERT INTO customers
        (name, surname, email, nation, city, postal_code, phone_number, address, street_number, fiscal_code)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const customerValues = [
            post.name,
            post.surname,
            post.email,
            post.nation,
            post.city,
            post.postal_code,
            post.phone_number,
            post.address,
            post.street_number,
            post.fiscal_code
        ];

        connection.query(customerQuery, customerValues, (err, customerResult) => {
            if (err) return connection.rollback(() => next(err));


            const customerId = customerResult.insertId;

            const invoiceQuery = `
            INSERT INTO invoices (customers_id, delivery_fee, total_amount)
            VALUES (?, ?, ?)`;

            const invoiceValues = [customerId, post.delivery_fee, post.total_amount];

            connection.query(invoiceQuery, invoiceValues, (err, invoiceResult) => {
                if (err) return connection.rollback(() => next(err));


                const invoiceId = invoiceResult.insertId;
                const orderNumber = `ORD-2026-${invoiceId + 10000}`;

                const updateQuery = `UPDATE invoices SET order_number = ? WHERE id = ?`;
                connection.query(updateQuery, [orderNumber, invoiceId], (err, updateResult) => {
                    if (err) return connection.rollback(() => next(err));


                    connection.commit(err => {
                        if (err) return connection.rollback(() => next(err));

                        return res.status(201).json({
                            message: "Customer and invoice created successfully",
                            customerId,
                            invoiceId,
                            orderNumber
                        });
                    });
                });
            });
        });
    });
}

/*
function store(req, res, next) {
    const post = req.body;
    console.log(post);


    const storeQuery = `
    INSERT INTO invoices
    (customers_id, delivery_fee, total_amount)
    VALUES
    (?, ?, ?)`;

    const values = [post.customers_id, post.delivery_fee, post.total_amount];

    connection.query(storeQuery, values, (err, result) => {
        if (err) return next(err);

        const newId = result.insertId;
        const orderNumber = `ORD-2026-${newId + 10000}`;

        // Aggiorna order_number con l'id appena creato
        const updateQuery = `UPDATE invoices SET order_number = ? WHERE id = ?`;
        connection.query(updateQuery, [orderNumber, newId], (err2) => {
            if (err2) return next(err2);

            return res.status(201).json({
                message: "Order created successfully",
                orderId: newId,
                orderNumber: orderNumber
            });
        });
    });
}
*/

const controller = {
        index,
        show,
        store
    }

    export default controller;
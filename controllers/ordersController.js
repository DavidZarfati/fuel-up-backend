import connection from "../database/db.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM invoices";

    connection.query(indexQuery, (err, indexResult) => {
        if (err) return next(err);

        const orders = indexResult.map(o => ({
            customerId: o.customers_id,
            order_number: o.order_number,
            delivery_fee: o.delivery_fee,
            total_amount: o.total_amount
        }));

        res.status(200).json(orders);
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

        const order = showResult.map(o => ({
            customerId: o.customers_id,
            order_number: o.order_number,
            delivery_fee: o.delivery_fee,
            total_amount: o.total_amount
        }));

        res.status(200).json(order);
    });
}

function store(req, res, next) {
    const post = req.body;
    const items = post.items || [];

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

            const slugs = items.map(i => i.slug);

            const customerId = customerResult.insertId;
            const orderNumber = `ORD-2026-${customerId + 10000}`

            const invoiceQuery = `
            INSERT INTO invoices (customers_id, delivery_fee, total_amount, order_number)
            VALUES (?, ?, ?, ?)`;

            //delivery_fee, total_amount are supposed to be updated later
            const invoiceValues = [customerId, 0, 0, orderNumber];

            connection.query(invoiceQuery, invoiceValues, (err, invoiceResult) => {
                if (err) return connection.rollback(() => next(err));
                const invoiceId = invoiceResult.insertId;

                const itemValues = [];
                let totalAmount = 0;
                let totalWeight = 0;

                connection.query(
                    `SELECT id, slug, discount_price, weight_kg FROM products WHERE slug IN (?)`,
                    [slugs],
                    (err, productsResult) => {
                        if (err) return connection.rollback(() => next(err));

                        const productMap = {};
                        productsResult.forEach(p => { productMap[p.slug] = p; });

                        for (const item of items) {
                            const product = productMap[item.slug];
                            const amount = item.amount;
                            const price = product.discount_price;
                            const weight = product.weight_kg;

                            totalAmount += price * amount;
                            totalWeight += weight * amount;

                            itemValues.push([invoiceId, product.id, amount, price]);
                        }

                        const insertItemsQuery = `
                        INSERT INTO products_invoices
                        (invoice_id, product_id, quantity, price_per_unit)
                        VALUES ?
                        `;

                        connection.query(insertItemsQuery, [itemValues], (err, insertResult) => {
                            if (err) return connection.rollback(() => next(err));

                            const delivery_fee = (totalAmount > 50) ? 0 : 3 + 0.15 * totalWeight;
                            const updateInvoiceQuery = `
                            UPDATE invoices
                            SET
                            total_amount = ?,
                            delivery_fee = ?
                            WHERE id = ?
                            `

                            connection.query(updateInvoiceQuery, [totalAmount, delivery_fee, invoiceId], (err, updateResult) => {
                                if (err) return connection.rollback(() => next(err));

                                connection.commit(err => {
                                    if (err) return connection.rollback(() => next(err));

                                    res.status(201).json({
                                        message: "Order created successfully",
                                        id_order: orderNumber
                                    })
                                });
                            })
                        })
                    }
                )
            });
        });
    });
}

const controller = {
    index,
    show,
    store
}

export default controller;
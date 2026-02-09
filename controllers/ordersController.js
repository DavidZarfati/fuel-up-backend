
import { text } from "express";
import connection from "../database/db.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMail = async (transporter, mailOptions) => {
    try {
        console.log("[DEBUG] Invio mail con mailOptions:", mailOptions);
        const info = await transporter.sendMail(mailOptions);
        console.log("[DEBUG] Risultato sendMail:", info);
        console.log("e-mail has been sent");
    } catch (error) {
        console.error("[DEBUG] Errore invio mail:", error);
    }
};



function index(req, res, next) {
    const indexQuery = "SELECT * FROM invoices";

    connection.query(indexQuery, (err, indexResult) => {
        if (err) return next(err);

        const orders = indexResult.map(o => ({
            order_number: o.order_number,
            delivery_fee: o.delivery_fee,
            total_amount: o.total_amount
        }));

        res.status(200).json(orders);
    });
}

function extendedIndex(req, res, next) {
    const extendedIndexQuery = `
    SELECT *
    FROM invoices
    LEFT JOIN customers
    ON invoices.customers_id = customers.id`;

    connection.query(extendedIndexQuery, (err, extendedIndexResult) => {
        if (err) return next(err);

        //console.log(extendedIndexQuery);
        //console.log(extendedIndexResult);

        const ordersCustomers = extendedIndexResult.map(oc => ({
            order_number: oc.order_number,
            delivery_fee: oc.delivery_fee,
            total_amount: oc.total_amount,
            name: oc.name,
            surname: oc.surname,
            email: oc.email,
            nation: oc.nation,
            city: oc.city,
            postal_code: oc.postal_code,
            phone_number: oc.phone_number,
            address: oc.address,
            street_number: oc.street_number,
            fiscal_code: oc.fiscal_code,
        }));

        res.status(200).json(ordersCustomers);
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
            order_number: o.order_number,
            delivery_fee: o.delivery_fee,
            total_amount: o.total_amount
        }));

        res.status(200).json(order);
    });
}

/*
function extendedShow(req, res, next) {
    const {id} = req.params;

    const extendedShowQuery = `
    SELECT *
    FROM invoices
    JOIN customers
    ON customers.id = invoices.id
    WHERE invoices.id = ?`;

    connection.query(extendedShowQuery, [id], (err, extendedShowResult) => {
        if(err) return next(err);
        
        if (extendedShowResult.length === 0) {
            return res.status(404).json({ message: "Order not found", status: 404 });
        }

        const orderCustomer = extendedShowResult.map(oc => ({
            name: oc.name,
            surname: oc.surname,
            email: oc.email,
            nation: oc.nation,
            city: oc.city,
            postal_code: oc.postal_code,
            phone_number: oc.phone_number,
            address: oc.address,
            street_number: oc.street_number,
            fiscal_code: oc.fiscal_code,
            order_number: oc.order_number,
            delivery_fee: oc.delivery_fee,
            total_amount: oc.total_amount
        }));

        res.status(200).json(orderCustomer);
    })
}
*/

function extendedShow(req, res, next) {
    const { id } = req.params;

    const extendedShowQuery = `
    SELECT
        i.id AS invoice_id,
        i.order_number,
        i.delivery_fee,
        i.total_amount,
        c.id AS customer_id,
        c.name AS customer_name,
        c.surname AS customer_surname,
        c.email AS customer_email,
        c.nation AS customer_nation,
        c.city AS customer_city,
        c.postal_code AS customer_postal_code,
        c.phone_number AS customer_phone_number,
        c.address AS customer_address,
        c.street_number AS customer_street_number,
        c.fiscal_code AS customer_fiscal_code,
        p.name AS product_name,
        pi.quantity AS product_quantity,
        pi.price_per_unit AS product_price
    FROM invoices i
    LEFT JOIN customers c ON i.customers_id = c.id
    LEFT JOIN products_invoices pi ON pi.invoice_id = i.id
    LEFT JOIN products p ON pi.product_id = p.id
    WHERE i.id = ?;
    `;

    connection.query(extendedShowQuery, [id], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) {
            return res.status(404).json({ message: "Order not found", status: 404 });
        }

        // Prepare single invoice object
        const order = {
            order_number: results[0].order_number,
            delivery_fee: results[0].delivery_fee,
            total_amount: results[0].total_amount,
            customer: {
                id: results[0].customer_id,
                name: results[0].customer_name,
                surname: results[0].customer_surname,
                email: results[0].customer_email,
                nation: results[0].customer_nation,
                city: results[0].customer_city,
                postal_code: results[0].customer_postal_code,
                phone_number: results[0].customer_phone_number,
                address: results[0].customer_address,
                street_number: results[0].customer_street_number,
                fiscal_code: results[0].customer_fiscal_code
            },
            items: []
        };

        // Collect all products
        results.forEach(row => {
            if (row.product_name) {
                order.items.push({
                    product_name: row.product_name,
                    amount: row.product_quantity,
                    price: row.product_price
                });
            }
        });

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
                        const itemList = [];
                        productsResult.forEach(p => { productMap[p.slug] = p; });

                        for (const item of items) {
                            const product = productMap[item.slug];
                            const amount = item.amount;
                            const price = product.discount_price;
                            const weight = product.weight_kg;

                            totalAmount += price * amount;
                            totalWeight += weight * amount;

                            itemValues.push([invoiceId, product.id, amount, price]);
                            itemList.push({ slug: product.slug, amount: amount, price: price });
                        }

                        //console.log(itemList);

                        const insertItemsQuery = `
                        INSERT INTO products_invoices
                        (invoice_id, product_id, quantity, price_per_unit)
                        VALUES ?
                        `;

                        connection.query(insertItemsQuery, [itemValues], (err, insertResult) => {
                            if (err) return connection.rollback(() => next(err));

                            const delivery_fee = (totalAmount > 100) ? 0 : 3 + 0.15 * totalWeight;
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
                                        order_number: orderNumber,
                                        total_cost: totalAmount,
                                        delivery_fee: delivery_fee,
                                        items: itemList
                                    });

                                    // Invia la mail di conferma ordine al cliente
                                    console.log("[DEBUG] post.email:", post.email);
                                    const mailOptions = {
                                        from: {
                                            name: "FuelUp",
                                            address: process.env.EMAIL_USER,
                                        },
                                        to: post.email, // email del cliente
                                        subject: "Conferma ordine FuelUp",
                                        text: `Grazie per il tuo ordine! Numero ordine: ${orderNumber}`
                                    };
                                    sendMail(transporter, mailOptions);

                                    // Invia la mail al venditore
                                    const sellerEmail = process.env.EMAIL_USER;
                                    // Crea un riepilogo dei prodotti venduti
                                    const soldSummary = itemList.map(item => `- ${item.amount} x ${item.slug} (prezzo: ${item.price})`).join("\n");
                                    const mailOptionsSeller = {
                                        from: {
                                            name: "FuelUp",
                                            address: process.env.EMAIL_USER,
                                        },
                                        to: sellerEmail,
                                        subject: `Hai venduto ${itemList.reduce((sum, i) => sum + i.amount, 0)} prodotti!`,
                                        text: `Hai venduto i seguenti prodotti con l'ordine ${orderNumber}:\n${soldSummary}`
                                    };
                                    sendMail(transporter, mailOptionsSeller);
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
    extendedIndex,
    show,
    extendedShow,
    store
}

export default controller;
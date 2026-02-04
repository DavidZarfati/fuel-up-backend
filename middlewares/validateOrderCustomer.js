import connection from "../database/db.js";

function validateOrderCustomer(req, res, next) {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    let { customers_id, delivery_fee, total_amount } = req.body;
    let { name, surname, email, nation, city, postal_code, phone_number, address, street_number, fiscal_code } = req.body;

    if ((!customers_id && customers_id != 0) || (!delivery_fee && delivery_fee != 0) || (!total_amount && total_amount != 0)) {
        return res.status(400).json({
            error: "Missing required order fields",
            required: ["customers_id", "delivery_fee", "total_amount"]
        });
    }

    if (!name || !surname || !email || !nation || !city || !postal_code || !phone_number || !address || !street_number || !fiscal_code) {
        return res.status(400).json({
            error: "Missing required customer fields",
            required: ["name", "surname", "email", "nation", "city", "postal_code", "phone_number", "address", "street_number", "fiscal_code"]
        });
    }

    //email
    const emailFormat = /^[^\s@]+@[^\s@]+$/;
    email = email.trim();
    if (emailFormat.test(email) === false) {
        return res.status(400).json({
            error: "The email is not valid",
            status: 400
        });
    }

    //postal_code
    const postal_code_format = /\s/;
    postal_code = postal_code.trim();
    if (postal_code_format.test(postal_code) === true) {
        return res.status(400).json({
            error: "The postal_code is not valid",
            status: 400
        });
    }

    //phone_number
    phone_number = phone_number.trim();
    const phone_number_regex = /^\+?\d{7,15}$/

    if (!phone_number_regex.test(phone_number)) {
        return res.status(400).json({
            error: "The phone number is not valid",
            status: 400
        });
    }

    //fiscal_code
    fiscal_code = fiscal_code.trim();
    const fiscal_code_regex = /^[A-Z0-9]{16}$/
    if (!fiscal_code_regex.test(fiscal_code)) {
    return res.status(400).json({
        error: "The fiscal code is not valid",
        status: 400
    });
}

    //total_amount
    if (typeof total_amount !== "number") {
        return res.status(400).json({
            error: "total_amount is not a number",
            status: 400
        });
    }
    else {
        if (total_amount <= 0 || total_amount > 999999.99) {
            return res.status(400).json({
                error: "total_amount is not a valid number",
                status: 400
            });
        }
    }

    //delivery_fee
    if (typeof delivery_fee !== "number") {
        return res.status(400).json({
            error: "delivery_fee is not a number",
            status: 400
        });
    }
    else {
        if (delivery_fee < 0 || delivery_fee > 999999.99) {
            return res.status(400).json({
                error: "delivery_fee is not a valid number",
                status: 400
            });
        }
    }

    next();
}

export default validateOrderCustomer;
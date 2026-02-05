import connection from "../database/db.js";

function validateOrderCustomer(req, res, next) {
    if (!req.body) {
        return res.status(400).json({ error: "Request body is missing" });
    }

    let { name, surname, email, nation, city, postal_code, phone_number, address, street_number, fiscal_code } = req.body;

    let items = req.body.items;

    if (!items || items.length === 0) {
        return res.status(400).json({
            error: "No items",
            required: ["items: [{slug, amount}, ...]"]
        })
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

    //Amount
    for (let i = 0; i < items.length; i++) {
        const amount = items[i].amount;
        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).json({
                error: "Amount of items must be a positive number",
                status: 400
            });
        }
    }

    //Slug
    const slugs = items.map(item => item.slug);

    const slugQuery = `SELECT * FROM products WHERE slug IN (?)`;

    connection.query(slugQuery, [slugs], (err, slugResults) => {
        if (err) return next(err);

        const existingSlugs = slugResults.map(row => row.slug);
        const missingSlugs = slugs.filter(slug => !existingSlugs.includes(slug));

        /*
        console.log("Existing slugs\n");
        console.log(existingSlugs);
        console.log("\n\nMissing slugs\n");
        console.log(missingSlugs);
        */

        if (missingSlugs.length > 0) {
            return res.status(400).json({
                error: "Some items are invalid",
                status: 400
            });
        }

        next();
    });
}

export default validateOrderCustomer;
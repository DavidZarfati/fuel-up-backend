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

    if(!name)
    {
        return res.status(400).json({
            error: "Missing required name field",
            status: 400 
        })
    }

    if(!surname)
    {
        return res.status(400).json({
            error: "Missing required surname field",
            status: 400 
        })
    }

    if(!email)
    {
        return res.status(400).json({
            error: "Missing required email field",
            status: 400 
        })
    }

    if(!nation)
    {
        return res.status(400).json({
            error: "Missing required nation field",
            status: 400 
        })
    }

    if(!city)
    {
        return res.status(400).json({
            error: "Missing required city field",
            status: 400 
        })
    }

    if(!postal_code)
    {
        return res.status(400).json({
            error: "Missing required postal_code field",
            status: 400 
        })
    }

    if(!phone_number)
    {
        return res.status(400).json({
            error: "Missing required phone_number field",
            status: 400 
        })
    }

    if(!address)
    {
        return res.status(400).json({
            error: "Missing required address field",
            status: 400 
        })
    }

    if(!street_number)
    {
        return res.status(400).json({
            error: "Missing required street_number field",
            status: 400 
        })
    }

    if(!fiscal_code)
    {
        return res.status(400).json({
            error: "Missing required fiscal_code field",
            status: 400 
        })
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
    const fiscal_code_regex =  /^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$/; ///^[A-Z0-9]{16}$/
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
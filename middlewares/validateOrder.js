function validateOrder(req, res, next)
{
    if(!req.body)
    {
        return res.status(400).json({error: "Request body is missing"});
    }

    const {customers_id, delivery_fee, total_amount} = req.body;

    if(!customers_id || !delivery_fee || !total_amount)
    {
        return res.status(400).json({
            error: "Missing required fields",
            required: ["customers_id", "delivery_fee", "total_amount"]
        });
    }

    const customerQuery = `
    SELECT *
    FROM customers
    WHERE id = ?`;

    connection.query(customerQuery, [customers_id], (err, result) => {
        if(err) return(err);

        //No such customer
        if(result.length === 0)
        {
            return res.status(400).json({
                error: "Non-existing user",
                status: 400
            });
        }

        //total_amount
        if(typeof total_amount !== "number")
        {
            return res.status(400).json({
                error: "total_amount is not a number",
                status: 400
            });
        }
        else
        {
            if(total_amount < 0 || total_amount > 999999.99)
            {
                return res.status(400).json({
                    error: "total_amount is not a valid number",
                    status: 400
                });
            }
        }

        //delivery_fee
        if(typeof delivery_fee !== "number")
        {
            return res.status(400).json({
                error: "delivery_fee is not a number",
                status: 400
            });
        }
        else
        {
            if(delivery_fee < 0 || delivery_fee > 999999.99)
            {
                return res.status(400).json({
                    error: "delivery_fee is not a valid number",
                    status: 400
                });
            }
        }

        next();
    });
}

export default validateOrder;
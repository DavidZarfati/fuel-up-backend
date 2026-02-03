function validateOrder(req, res, next)
{
    if(!req.body)
    {
        return res.status(400).json({error: "Request body is missing"});
    }

    const {customers_id, order_number, delivery_fee, total_amount} = req.body;

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
                status: 404
            });
        }

        next();
    })
}

export default validateOrder;
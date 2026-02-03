import connection from "../database/db";

function index(req, res, next) {
  const query = `SELECT * FROM trips`;

  connection.query(query, (err, result) => {
    if (err) return next(err);
    return res.json({
      results: result,
    });
  });
}

export default { index };
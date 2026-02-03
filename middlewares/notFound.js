export default function notFound(req, res, next) {
    res.status(404)
        .json({
            error: "Not found",
            message: `Page ${req.path} was not found`
        });
    next();
} 
import express from "express";
import productsController from "../controllers/productsController.js";

const router = express.Router();

router.get("/", productsController.index);
router.get("/:slug", productsController.singleProduct)
// Endpoint per cercare prodotti (DEVE stare PRIMA di /:id)
router.get("/search", productsController.search);

// router.get("/", productsController.indexProductsPage); // Removed: handler does not exist
// Endpoint per ottenere tutti i prodotti
router.get("/", productsController.index);

// Endpoint per ottenere un singolo prodotto tramite ID
router.get("/:id", productsController.show);

export default router;
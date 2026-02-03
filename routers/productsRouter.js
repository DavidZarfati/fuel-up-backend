import express from "express";
import productsController from "../controllers/productsController.js";

const router = express.Router();

router.get("/", productsController.indexProductsPage);
// Endpoint per ottenere tutti i prodotti
router.get("/", productsController.index);

// Endpoint per ottenere un singolo prodotto tramite ID
router.get("/:id", productsController.show);

export default router;
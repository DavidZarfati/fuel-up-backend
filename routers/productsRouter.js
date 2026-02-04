import express from "express";
import productsController from "../controllers/productsController.js";

const router = express.Router();


// Endpoint per ottenere tutti i prodotti (paginati)
router.get("/", productsController.index);

// Endpoint per cercare prodotti
router.get("/search", productsController.search);


// Endpoint per ottenere un singolo prodotto tramite slug
router.get("/slug/:slug", productsController.singleProduct);

// Endpoint per trovare prodotti simili per categorie
router.get("/:id/similar-by-categories", productsController.searchByCategories);

// Endpoint per ottenere un singolo prodotto tramite ID
router.get("/:id", productsController.show);

export default router;
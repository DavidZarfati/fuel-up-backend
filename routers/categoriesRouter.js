import express from "express";
import categoriesController from "../controllers/categoriesController.js";

const router = express.Router();

// Endpoint per ottenere tutte le categorie
router.get("/", categoriesController.index);

export default router;
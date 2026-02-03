import connection from "../database/db.js";
import express from "express";
import customersController from "../controllers/customersController.js";

const router = express.Router();

// Endpoint per ottenere tutti i clienti
router.get("/", customersController.index);

export default router;
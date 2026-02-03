import express from "express";
import customersController from "../controllers/customersController.js";


const router = express.Router();

// Endpoint per ottenere tutti i clienti
router.get("/", customersController.index);
router.get("/:id", customersController.show);


export default router;
import express from "express";
import productsInvoicesController from "../controllers/productsInvoicesController.js";

const router = express.Router();

router.get("/", productsInvoicesController.index);
router.get("/:id", productsInvoicesController.show);

export default router;
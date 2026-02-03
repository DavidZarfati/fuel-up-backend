import express from "express";
import productsController from "../controllers/productsController.js";

const router = express.Router();

router.get("/", productsController.indexProductsPage);
router.get("/:slug", productsController.singleProduct)

export default router;
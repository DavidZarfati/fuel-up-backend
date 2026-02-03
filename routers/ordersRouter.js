import express from "express";
import ordersController from "../controllers/ordersController.js";
import validateOrder from "../middlewares/validateOrder.js";

const router = express.Router();

router.get("/", ordersController.index);
router.get("/:id", ordersController.show);
router.post("/", validateOrder, ordersController.store);

export default router;
import express from "express";
import ordersController from "../controllers/ordersController.js";
import validateOrderCustomer from "../middlewares/validateOrderCustomer.js";

const router = express.Router();

router.get("/", ordersController.index);
router.get("/:id", ordersController.show);
router.post("/", validateOrderCustomer, ordersController.store);

export default router;
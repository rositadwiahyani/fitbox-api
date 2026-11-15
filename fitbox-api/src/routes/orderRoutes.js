import express from "express";
import { OrderController } from "../controllers/orderController.js";

const router = express.Router();
router.get("/", OrderController.getAll);
router.post("/", OrderController.create);
router.put("/:id", OrderController.update);
router.post("/:id/pay", OrderController.pay);
router.delete("/:id", OrderController.remove);
export default router;
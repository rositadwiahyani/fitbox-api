import express from "express";
import { PackageController } from "../controllers/packageController.js";

const router = express.Router();
router.get("/", PackageController.getAll);
router.get("/:id", PackageController.getById);
router.post("/", PackageController.create);
router.put("/:id", PackageController.update);
router.delete("/:id", PackageController.remove);
export default router;
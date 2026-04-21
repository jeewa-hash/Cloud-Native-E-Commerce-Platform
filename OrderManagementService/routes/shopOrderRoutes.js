import express from "express";
import authUser from "../middleware/authUser.js";
import { updateShopOrderStatus } from "../controllers/shopOrderController.js";

const router = express.Router();

router.patch("/shop/orders/:orderId/status", authUser, updateShopOrderStatus);

export default router;
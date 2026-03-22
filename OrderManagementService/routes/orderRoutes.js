import express from "express";
import authUser from "../middleware/auth.js";
import authShop from "../middleware/authShop.js";
import { checkoutOrder, getOrders, ordersByShop, updateOrderStatusByShopOwner  } from "../controllers/orderController.js";
import { orderSuccessInterceptor } from "@notification-app/shared";


const router = express.Router();


router.post("/checkout", authUser, orderSuccessInterceptor, checkoutOrder);
router.get("/history", authUser, getOrders);


// get all orders for a shop
router.get("/shop/orders", authShop, ordersByShop);
// update order status
router.patch("/shop/orders/:orderId/status", authShop, updateOrderStatusByShopOwner);

export default router;


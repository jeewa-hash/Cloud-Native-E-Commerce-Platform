import express from "express";
import {
  createDeliveryPerson,
  getDeliveryPersons,
  getProfile,
  assignShipment,
  pickupShipment,
  addTracking,
  markDelivered,
  markFailed,
  returnToShop,
  markReturned
} from "../controllers/deliveryController.js";
import { authMiddleware, requireDeliveryRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/delivery-persons", authMiddleware, requireDeliveryRole, createDeliveryPerson);
router.get("/delivery-persons", getDeliveryPersons);
router.get("/delivery-profile", authMiddleware, requireDeliveryRole, getProfile);

router.post("/shipments/assign", assignShipment);
router.put("/shipments/:id/pickup", pickupShipment);
router.put("/shipments/:id/tracking", addTracking);
router.put("/shipments/:id/deliver", markDelivered);

// returns
router.put("/shipments/:id/fail", markFailed);
router.put("/shipments/:id/return", returnToShop);
router.put("/shipments/:id/returned", markReturned);

export default router;
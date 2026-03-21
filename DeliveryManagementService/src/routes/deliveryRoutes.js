import express from "express";
import {
  createDeliveryPerson,
  getDeliveryPersons,
  assignShipment,
  pickupShipment,
  addTracking,
  markDelivered,
  markFailed,
  returnToShop,
  markReturned
} from "../controllers/deliveryController.js";

const router = express.Router();

router.post("/delivery-persons", createDeliveryPerson);
router.get("/delivery-persons", getDeliveryPersons);

router.post("/shipments/assign", assignShipment);
router.put("/shipments/:id/pickup", pickupShipment);
router.put("/shipments/:id/tracking", addTracking);
router.put("/shipments/:id/deliver", markDelivered);

// returns
router.put("/shipments/:id/fail", markFailed);
router.put("/shipments/:id/return", returnToShop);
router.put("/shipments/:id/returned", markReturned);

export default router;
import DeliveryPerson from "../models/DeliveryPerson.js";
import Shipment from "../models/Shipment.js";
import logger from "../utils/logger.js";

export const getProfile = async (req, res) => {
  try {
    const person = await DeliveryPerson.findOne({ userId: req.user.id });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Delivery profile not found"
      });
    }

    res.json({
      success: true,
      person
    });
  } catch (err) {
    logger.error(err, "Get delivery profile failed");
    res.status(500).json({
      success: false,
      message: "Failed to load delivery profile"
    });
  }
};

export const createDeliveryPerson = async (req, res) => {
  try {
    const { phone, city, zipCode, vehicleType, vehicleNumber } = req.body;

    const existing = await DeliveryPerson.findOne({ userId: req.user.id });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Delivery profile already exists"
      });
    }

    const person = await DeliveryPerson.create({
      userId: req.user.id,
      phone,
      city,
      zipCode,
      vehicleType: vehicleType || "bike",
      vehicleNumber
    });

    res.status(201).json({
      success: true,
      person
    });
  } catch (err) {
    logger.error(err, "Create delivery person failed");
    res.status(500).json({
      success: false,
      message: "Failed to create delivery profile"
    });
  }
};

export const getDeliveryPersons = async (req, res) => {
  const persons = await DeliveryPerson.find();
  res.json({ success: true, persons });
};

export const assignShipment = async (req, res) => {
  try {
    const { orderId, zipCode, address, phone } = req.body;

    logger.info(`Assigning shipment for order ${orderId}`);

    const rider = await DeliveryPerson.findOne({
      zipCode,
      availabilityStatus: "AVAILABLE",
      isActive: true
    });

    if (!rider) {
      logger.warn("No rider available");
      return res.status(404).json({ success: false });
    }

    const shipment = await Shipment.create({
      orderId,
      deliveryPersonId: rider._id,
      zipCode,
      address,
      phone,
      trackingSteps: [{
        label: "Assigned",
        note: `${rider.name} assigned`
      }]
    });

    rider.availabilityStatus = "BUSY";
    await rider.save();

    res.status(201).json({ success: true, shipment });

  } catch (err) {
    logger.error(err, "Assignment failed");
    res.status(500).json({ success: false });
  }
};

export const pickupShipment = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  shipment.status = "PICKED_UP";
  shipment.trackingSteps.push({ label: "Picked Up", note: "Order collected" });
  await shipment.save();
  res.json({ success: true, shipment });
};

export const addTracking = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  shipment.status = "IN_TRANSIT";
  shipment.trackingSteps.push(req.body);
  await shipment.save();
  res.json({ success: true, shipment });
};

export const markDelivered = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate("deliveryPersonId");

  shipment.status = "DELIVERED";
  shipment.trackingSteps.push({ label: "Delivered", note: "Order delivered" });

  await shipment.save();

  const rider = await DeliveryPerson.findById(shipment.deliveryPersonId._id);
  rider.availabilityStatus = "AVAILABLE";
  await rider.save();

  res.json({ success: true, shipment });
};

// RETURNS

export const markFailed = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);
  shipment.status = "FAILED";
  shipment.returnReason = req.body.reason;

  shipment.trackingSteps.push({
    label: "Delivery Failed",
    note: req.body.reason
  });

  await shipment.save();

  res.json({ success: true, shipment });
};

export const returnToShop = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id);

  shipment.status = "RETURN_IN_TRANSIT";
  shipment.trackingSteps.push({
    label: "Returning",
    note: "Returning to shop"
  });

  await shipment.save();

  res.json({ success: true, shipment });
};

export const markReturned = async (req, res) => {
  const shipment = await Shipment.findById(req.params.id).populate("deliveryPersonId");

  shipment.status = "RETURNED_TO_SHOP";
  shipment.trackingSteps.push({
    label: "Returned",
    note: "Returned to shop"
  });

  await shipment.save();

  const rider = await DeliveryPerson.findById(shipment.deliveryPersonId._id);
  rider.availabilityStatus = "AVAILABLE";
  await rider.save();

  res.json({ success: true, shipment });
};
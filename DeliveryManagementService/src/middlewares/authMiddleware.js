import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logger.error("Auth failed: JWT_SECRET not configured");
      return res.status(500).json({
        success: false,
        message: "Server JWT secret not configured"
      });
    }

    logger.debug("Verifying JWT with secret:", secret);

    const decoded = jwt.verify(token, secret);

    req.user = {
      id: decoded?.user?.id,
      role: decoded?.user?.role
    };

    if (!req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    next();
  } catch (err) {
    logger.error(err, "Auth failed");
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

export const requireDeliveryRole = (req, res, next) => {
  if (!req.user || req.user.role !== "delivery") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Delivery role required"
    });
  }

  next();
};
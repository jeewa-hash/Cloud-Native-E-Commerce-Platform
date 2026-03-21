import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import deliveryRoutes from './routes/deliveryRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/delivery', deliveryRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5003; 
const MONGO_URI = process.env.MONGO_URI;
 
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    logger.info("Delivery Service DB Connected");        
    app.listen(process.env.PORT, () => {
        logger.info(`Delivery Service running on port ${PORT}`);
    });
  })
      .catch((err) => {
        logger.error("DB Connection Error:", err.message);
      });
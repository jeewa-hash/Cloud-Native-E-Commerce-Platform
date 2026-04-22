import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { swaggerUi, specs } from './swagger.config.js';

const app = express();

// Trust AWS ALB proxy
app.set('trust proxy', true);

// ✅ CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5174',
  'http://localhost:4000',
  'http://order-frontend-bucket-123.s3-website.eu-north-1.amazonaws.com',
  'http://orderservice-alb-1335748857.eu-north-1.elb.amazonaws.com',
];

// Normalize origins (remove trailing slash issues)
const normalizedAllowedOrigins = allowedOrigins.map(o => o.replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Request Origin:", origin);

      // allow Postman / mobile / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked by CORS:", origin);

      // ❗ IMPORTANT: do NOT throw error
      return callback(null, false);
    },
    credentials: true
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', ...swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Order Management Backend is WORKING✅');
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Server & DB setup
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing!');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
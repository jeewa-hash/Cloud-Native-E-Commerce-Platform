import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { swaggerUi, specs } from './swagger.config.js';
import helmet from 'helmet';

const app = express();

// Swagger Documentation Route (BEFORE helmet to avoid CSP blocking)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Security middleware (CSP disabled to allow Swagger UI)
app.use(helmet({
  contentSecurityPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://order-frontend-bucket-123.s3-website.eu-north-1.amazonaws.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('The CORS policy for this site does not allow access from the specified origin.'));
      }
    }
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/order", orderRoutes);
app.use("/api/cart", cartRoutes);

app.get('/', (req, res) => {
  res.send('Order Management Backend is WORKING✅');
});

// ✅ HEALTH CHECK (VERY IMPORTANT FOR AWS)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server and connect DB
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('Mongo URI is missing! Please add it to your .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Order Management Service Database connected successfully');
    app.listen(port, '0.0.0.0', () => console.log(`Server is running on port: ${port}`));
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
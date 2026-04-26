import 'dotenv/config';
import cors from "cors";
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { connectRabbitMQ } from './config/rabbitmqConfig.js';
import { listenOrderEvents } from './events/orderEvents.js';
import router from './routes/notificationRoutes.js';
import { swaggerUi, specs } from './swagger.js';

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: false
}));

app.use(express.json()); // ← must be before routes
app.get('/', (req, res) => {
  res.status(200).json({ service: 'Notification Service', status: 'running' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // ← swagger
app.use('/api/notifications', router); // ← your routes



const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("MongoDB Connected ✅");
    await connectRabbitMQ();
    listenOrderEvents(app);
    server.listen(port, () => {
      console.log(`Notification Service running on port: ${port} 🚀`);
    });
  })
  .catch(err => console.error("Database Connection Error:", err));
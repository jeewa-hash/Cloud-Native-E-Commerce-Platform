import 'dotenv/config'; 
import cors from "cors";
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import { connectRabbitMQ } from './config/rabbitmqConfig.js';
import { listenOrderEvents } from './events/orderEvents.js';
import router from './routes/notificationRoutes.js';

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: { origin: "*" } 
});

// 3. Set 'io' globally so app.get('socketio') works in other files
app.set('socketio', io);

app.use(express.json());
app.use('/api/notifications', router);


// 4. Socket.io Connection Logic
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

// 5. Connect Everything
mongoose.connect(mongoURI)
  .then(async () => {
    console.log("MongoDB Connected ✅");
    await connectRabbitMQ(); // Initialize RabbitMQ Connection
    
    // IMPORTANT: Pass 'app' as an argument here
    listenOrderEvents(app); 
    
    server.listen(port, () => {
      console.log(`Notification Service running on port: ${port} 🚀`);
    });
  })
  .catch(err => console.error("Database Connection Error:", err));
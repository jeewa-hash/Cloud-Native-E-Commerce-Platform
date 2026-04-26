import amqp from 'amqplib';

let connection = null;
let channel = null;

export const initRabbitMQ = async (url) => {
  if (channel) return channel;
  try {
    const rabbitUrl = url || process.env.RABBITMQ_URL || 'amqp://localhost';
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertExchange("order_events", "fanout", { durable: true });
    console.log("🚀 [Shared] RabbitMQ Auto-Initialized");
    return channel;
  } catch (error) {
    console.error("❌ [Shared] RabbitMQ Init Error:", error.message);
    throw error;
  }
};

export const getSafeChannel = async () => {
  if (!channel) {
    await initRabbitMQ();
  }
  return channel;
};
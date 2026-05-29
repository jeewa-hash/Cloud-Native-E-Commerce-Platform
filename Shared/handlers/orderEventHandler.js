import { publishInterceptor } from "../middleware/interceptor.js";
import { getSafeChannel } from "../messaging/rabbitmq.js";

export const orderSuccessInterceptor = publishInterceptor(async (data) => {
  const channel = await getSafeChannel();
  if (!channel) return;

  const orders = data.orders || (data.order ? [data.order] : []);

  orders.forEach(o => {
    const payload = {
      type: "ORDER_CREATED",
      orderId: o._id,
      shopId: o.shop?._id || o.shop
    };
    channel.publish("order_events", "", Buffer.from(JSON.stringify(payload)));
    console.log(`🚀 [Shared] Auto-published Order: ${o._id}`);
  });
});
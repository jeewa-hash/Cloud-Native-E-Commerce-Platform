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
      shopId: o.shop?._id || o.shop,
      createdAt: o.createdAt || new Date().toISOString(),
      totalAmount: o.total,
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      status: o.status,
      paymentMethod: o.paymentMethod,
      customerId: o.user,
      shop: {
        id: o.shop?._id || o.shop,
        name: o.shop?.name || "",
        logo: o.shop?.logo || "",
      },
      items: (o.items || []).map(item => ({
        productId: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      deliveryAddress: {
        street: o.address || "",
        phone: o.phone || "",
        type: o.deliveryType || "",
        instructions: o.instructions || "",
      },
    };

    channel.publish(
      "order_events", "",
      Buffer.from(JSON.stringify(payload))
    );
    console.log(`Published full order: ${o._id}`);
  });
});
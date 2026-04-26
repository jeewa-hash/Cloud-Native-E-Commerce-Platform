import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId:   { type: String, required: true },
    recipientType: { type: String, required: true },
    type:          { type: String, required: true },
    title:         String,
    message:       String,
    relatedId:     String,
    isRead:        { type: Boolean, default: false },

    // Rich order data
    totalAmount:   Number,
    subtotal:      Number,
    shippingFee:   Number,
    status:        String,
    paymentMethod: String,
    customerId:    String,

    shop: {
      id:   String,
      name: String,
      logo: String,
    },
    items: [{
      productId: String,
      name:      String,
      image:     String,
      price:     Number,
      quantity:  Number,
    }],
    deliveryAddress: {
      street:       String,
      phone:        String,
      type:         String,
      instructions: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
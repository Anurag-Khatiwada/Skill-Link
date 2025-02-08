import orderModel from "../models/orderModel.js";
import createError from "../utils/createError.js";
import serviceModel from "../models/serviceModel.js";
import userModel from "../models/userModel.js";
import { Stripe } from "stripe";
import crypto from "crypto";

export const intent = async (req, res, next) => {
  const stripe = Stripe(process.env.STRIPE);

  try {
    const service = await serviceModel.findById(req.params.id);

    // Check if an order with this payment_intent already exists
    const existingOrder = await orderModel.findOne({
      payment_intent: req.body.payment_intent,
    });

    if (existingOrder) {
      return res.status(400).send({ message: "Order already exists" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: service.price * 100*0.0072, // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new orderModel({
      serviceId: service._id,
      img: service.cover,
      title: service.title,
      price: service.price,
      freelancerId: service.userId,
      buyerId: req.userId,
      payment_intent: paymentIntent.id,
      orderStatus: "Received",
    });

    await newOrder.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
// export const intent = async (req, res, next) => {
//   const stripe = new Stripe(process.env.STRIPE);

//   try {
//     const service = await serviceModel.findById(req.params.id);
//     if (!service) return res.status(404).json({ message: "Service not found" });

//     const existingOrder = await orderModel.findOne({
//       payment_intent: req.body.payment_intent,
//     });

//     if (existingOrder) {
//       return res.status(400).json({ message: "Order already exists" });
//     }

//     const amountInCents = Math.round(service.price * 100); // Convert to cents

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     const newOrder = new orderModel({
//       serviceId: service._id,
//       img: service.cover,
//       title: service.title,
//       price: service.price,
//       freelancerId: service.userId,
//       buyerId: req.userId,
//       payment_intent: paymentIntent.id,
//       orderStatus: "Received",
//     });

//     await newOrder.save();

//     res.status(200).send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     console.error("Stripe Payment Intent Error:", err);
//     next(err); // Use next() to handle the error properly
//     res.status(500).json({ message: "Internal Server Error", error: err.message });
//   }
// };

// export const intent = async (req, res, next) => {
//   const stripe = new Stripe(process.env.STRIPE);

//   try {
//     // Find the service and validate its existence
//     const service = await serviceModel.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     // Check if an order with this payment_intent already exists
//     const existingOrder = await orderModel.findOne({
//       payment_intent: req.body.payment_intent,
//     });

//     if (existingOrder) {
//       return res.status(400).json({ message: "Order already exists" });
//     }

//     // Convert price to cents for Stripe
//     const amountInCents = Math.round(service.price * 100);

//     // Create a new payment intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     // Create a new order
//     const newOrder = new orderModel({
//       serviceId: service._id,
//       img: service.cover,
//       title: service.title,
//       price: service.price,
//       freelancerId: service.userId,
//       buyerId: req.userId,
//       payment_intent: paymentIntent.id,
//       orderStatus: "Received",
//     });

//     // Save the new order
//     await newOrder.save();

//     // Send the client secret back to the client
//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });

//   } catch (err) {
//     console.error("Stripe Payment Intent Error:", err);
    
//     // Determine if it's a Stripe error or a general error
//     if (err instanceof Stripe.errors.StripeError) {
//       return res.status(400).json({ message: "Payment processing error", error: err.message });
//     }

//     // For other types of errors, pass to the error handling middleware
//     next(err);
//   }
// };

export const getOrders = async (req, res, next) => {
  try {
    const ordersQuery = req.isFreelancer
      ? { freelancerId: req.userId, isCompleted: true }
      : { buyerId: req.userId, isCompleted: true };
    const orders = await orderModel.find(ordersQuery);


    if (!orders) {
      return next(createError(404, "no orders found"));
    }
    if (req.isFreelancer) {
      const orderWithBuyerInfo = await Promise.all(
        orders.map(async (order) => {
          const buyer = await userModel.findById(order.buyerId);
          order.buyerUsername = buyer.username;
          return order;
        })
      );
      res.status(200).send(orderWithBuyerInfo);
    } else {
      res.status(200).send(orders);
    }
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const orders = await orderModel.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("order has been confirmed");
  } catch (err) {
    next(err);
  }
};
export const checkOrderCompletion = async (req, res, next) => {
  console.log("Checking completed orders with:", {
    serviceId: req.params.serviceId,
    buyerId: req.userId,
    isCompleted: true,
  });
  try {
    const completedOrder = await orderModel.findOne({
      serviceId: req.params.serviceId,
      buyerId: req.userId,
      isCompleted: true,
    });
    if (completedOrder) {
      res.status(200).json({ canReview: true });
    } else {
      res.status(200).json({ canReview: false });
    }
  } catch (err) {
    next(err);
  }
};
export const orderStatusUpdate = async (req, res, next) => {
  console.log(req.body);

  try {
    // Update the specific order by its ID and set the new status
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: req.params.orderId },
      { orderStatus: req.body.orderStatus }, // Use only the `orderStatus` field from the request body
      { new: true } // Return the updated document
    );

    // If no order is found, return a 404 error
    if (!updatedOrder) {
      return res.status(404).send("Order not found");
    }

    res.status(200).send("Order status has been updated");
  } catch (err) {
    next(err); // Pass the error to the error-handling middleware
  }
};

export const cancelOrder = async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE);

  try {
    //find order by id
    const order = await orderModel.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send("Order not found");
    }

    //process the refund
    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent,
    });
    //update order status
    order.orderStatus = "Cancelled";
    order.refundId = refund.id;
    await order.save();

    res.status(200).send({
      message: "Order has been cancelled and refunded",
      refundId: refund.id,
    });
  } catch (err) {
    next(err);
  }
};

//////////////////////////////////////////////////////////////
//pay using esewa

// Helper function to create a signature


const createSignature = (message) => {
  const hmac = crypto.createHmac("sha256", process.env.SECRET); // Create HMAC using SHA256
  hmac.update(message); // Update HMAC with the message
  return hmac.digest("base64"); // Return Base64 encoded hash
};
// Initiate eSewa payment
const EsewaInitiatePayment = async (req, res, next) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const newOrder = new orderModel({
      serviceId: service._id,
      img: service.cover,
      title: service.title,
      price: service.price,
      freelancerId: service.userId,
      buyerId: req.userId,
      orderStatus: "Unpaid",
    });

    await newOrder.save();

    const signature = createSignature(
      `total_amount=${service.price},transaction_uuid=${newOrder._id},product_code=EPAYTEST`
    );

    const formData = {
      amount: service.price,
      product_delivery_charge: 0,
      product_service_charge: 0,
      tax_amount: 0,
      total_amount: service.price,
      product_code: "EPAYTEST",
      transaction_uuid: newOrder._id,
      failure_url: "http://localhost:5173/payment-failure",
      success_url: `http://localhost:5173/payment-success?transaction_uuid=${newOrder._id}&signature=${signature}`,
      signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    res.status(200).json({ formData });
  } catch (error) {
    console.error("Error in EsewaInitiatePayment:", error);
    res.status(400).json({ message: "Error initiating payment", error });
  }
};

// Handle eSewa payment success
const EsewaSuccess = async (req, res, next) => {
  try {
    const { transaction_uuid, signature } = req.body;
    console.log(transaction_uuid, signature);

    if (!transaction_uuid || !signature) {
      return res
        .status(400)
        .json({ message: "Missing transaction_uuid or signature" });
    }

    const order = await orderModel.findById(transaction_uuid);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const expectedSignature = createSignature(
      `total_amount=${order.price},transaction_uuid=${order._id},product_code=EPAYTEST`
    );

    console.log(signature === expectedSignature);

    console.log(expectedSignature);

    order.orderStatus = "Received";
    order.payment_intent = signature;
    order.isCompleted = true;
    await order.save();

    res
      .status(200)
      .json({ message: "Payment confirmed and order updated", redirect: true });
  } catch (error) {
    console.error("Error processing eSewa payment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export { EsewaInitiatePayment, EsewaSuccess };

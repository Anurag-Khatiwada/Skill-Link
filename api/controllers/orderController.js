import orderModel from "../models/orderModel.js"
import createError from "../utils/createError.js"
import serviceModel from "../models/serviceModel.js"
import userModel from "../models/userModel.js";
import  { Stripe } from 'stripe'

export const intent = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);

    console.log(req.body)
    
    const service = await serviceModel.findById(req.params.id);

    // Check if an order with this payment_intent already exists
    const existingOrder = await orderModel.findOne({
        payment_intent: req.body.payment_intent
    });
    console.log(existingOrder)

    if (existingOrder) {
        return res.status(400).send({ message: "Order already exists" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: service.price,
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
        orderStatus: "Received"
    });


    try {
        await newOrder.save();
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log(err);
        next(err); // Use next() to handle the error properly
    }
};


export const getOrders = async (req, res, next)=>{
    try{
        const ordersQuery = req.isFreelancer ? {freelancerId: req.userId, isCompleted: true}:{buyerId: req.userId, isCompleted: true}
        const orders = await orderModel.find(ordersQuery);

        if(!orders){
            return next(createError(404, "no orders found"))
        }
        if(req.isFreelancer){
            const orderWithBuyerInfo = await Promise.all(
                orders.map(async (order)=>{
                    const buyer = await userModel.findById(order.buyerId);
                    order.buyerUsername = buyer.username
                    return order
                })
            );
            res.status(200).send(orderWithBuyerInfo)
        }else{
            res.status(200).send(orders)
        }
    }catch(err){
        next(err)
    }
}

export const confirm = async (req, res, next)=>{
    try{
        const orders = await orderModel.findOneAndUpdate({
            payment_intent: req.body.payment_intent
        },
        {$set:{
            isCompleted: true
        }}
    )

        res.status(200).send("order has been confirmed");
    }catch(err){
        next(err)
    }
}
export const checkOrderCompletion = async (req, res, next)=>{
    console.log("Checking completed orders with:", {
        serviceId: req.params.serviceId,
        buyerId: req.userId,
        isCompleted: true
      });
    try{
        
        const completedOrder = await orderModel.findOne({
            serviceId: req.params.serviceId,
            buyerId: req.userId,
            isCompleted: true
        })
        if (completedOrder) {
            res.status(200).json({ canReview: true });
          } else {
            res.status(200).json({ canReview: false });
          }
          
    }catch(err){
        next(err)
    }
}
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

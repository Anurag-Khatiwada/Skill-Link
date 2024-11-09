import orderModel from "../models/orderModel.js"
import createError from "../utils/createError.js"
import serviceModel from "../models/serviceModel.js"
import  { Stripe } from 'stripe'

export const intent = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE);
    
    const service = await serviceModel.findById(req.params.id);

    // Check if an order with this payment_intent already exists
    const existingOrder = await orderModel.findOne({
        payment_intent: req.body.payment_intent
    });

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
    });

    console.log(newOrder);

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
        const orders = await orderModel.find({
            ...(req.isFreelance? {freelancerId: req.userId} : {buyerId: req.userId}),
            isCompleted: true,
        })
        if(!orders){
            return next(createError(404, "no orders found"))
        }
        res.status(200).send(orders);
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
        console.log(completedOrder)
        if (completedOrder) {
            console.log("Sending {canReview: true}");
            res.status(200).json({ canReview: true });
          } else {
            console.log("Sending {canReview: false}");
            res.status(200).json({ canReview: false });
          }
          
    }catch(err){
        next(err)
    }
}
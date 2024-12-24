import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    serviceId: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    freelancerId: {
        type: String,
        required: true
    },
    buyerId: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    payment_intent:{
        type: String,
        required: true
    },
    refundId: String,
    orderStatus: String,
    buyerUsername: String
        
},
    {timestamps: true}
)

export default mongoose.model("Order", orderSchema);
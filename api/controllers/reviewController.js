import createError from "../utils/createError.js";
import serviceModel from "../models/serviceModel.js";
import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";

export const createReview = async (req, res, next)=>{
    let {serviceId, star, desc} = req.body;
    let userId = req.userId
    // Check if the user is a freelancer and prevent them from reviewing their own service

    if(req.isFreelancer){
        let service = await serviceModel.findById(serviceId);
        let ownerId = service.userId
        if(req.userId === ownerId){
            return next(createError(403, "Freelancer can't create a review for your own"))

        }

    }
    try{
         // Check if the user has already reviewed the service

        const review = await reviewModel.findOne({
            serviceId: req.body.serviceId,
            userId: req.userId
        })
        if(review){
            return next(createError(403, "You have already reviewed this service"));
        }



        const newReview = new reviewModel({
            serviceId,
            userId,
            star,
            desc
        });

        const savedReview = await newReview.save();
        await serviceModel.findByIdAndUpdate(serviceId, {
            $inc: {totalStars: req.body.star, starNumber: 1}
        })
        return res.status(200).send(savedReview);

    }catch(err){
        next(err)
    }
};

export const getReviews = async (req, res, next) => {
    try {
        console.log("Service ID from params:", req.params.serviceId);

        // Fetch all reviews for debugging
        const allReviews = await reviewModel.find({});
        console.log("All reviews:", allReviews);

        // Ensure serviceId is cast as string and checked for strict equality
        const reviews = await reviewModel.find({serviceId:req.params.serviceId})

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this service" });
        }

        return res.status(200).send(reviews);
    } catch (err) {
        next(err);
    }
};


export const deleteReview = async (req, res, next)=>{
    try{
        const review = await reviewModel.findById(req.params.id);
        
    }catch(err){
        next(err)
    }
};



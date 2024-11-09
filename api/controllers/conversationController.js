import createError from "../utils/createError.js";
import conversationModel from "../models/conversationModel.js";

export const createConversation = async (req, res, next)=>{

    const newConversation = new conversationModel({
        id: req.isFreelancer? req.userId + req.body.to : req.body.to + req.userId,
        sellerId: req.isFreelancer? req.userId : req.body.to,
        buyerId: req.isFreelancer ? req.body.to : req.userId,        
        readBySeller: req.isFreelancer,
        readByBuyer: !req.isFreelancer
    })

    try{
        const savedConversation = await newConversation.save();
        res.status(200).send(savedConversation);
    }catch(err){
        next(err);
    }
}

export const updateConversation = async (req, res, next)=>{

    try{
        const updatedConversation =await conversationModel.findOneAndUpdate(
            {id: req.params.id},
            {
                $set: {
                    readBySeller: true,
                    redByBuyer: true 
            }},
            {new: true}
        )
        res.status(200).send(updatedConversation);
    }catch(err){
        next(err);
    }
}

export const getSingleConversation = async (req, res, next)=>{

    try{
        const converstaion = await conversationModel.findOne({id: req.params.id})
        if(!converstaion){
            return next(createError(404, "Conversation not found"))
        }
        res.status(200).send(converstaion);
    }catch(err){
        next(err);
    }
}
export const getConversations = async (req, res, next)=>{

    try{
        const conversations  = await conversationModel.find(req.isFreelancer? {sellerId: req.userId}: {buyerId: req.userId}).sort({updatedAt: -1})
        res.status(200).send(conversations)
    }catch(err){
        next(err);
    }
}
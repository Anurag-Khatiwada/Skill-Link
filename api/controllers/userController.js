import jwt from "jsonwebtoken";
import userModel from '../models/userModel.js'
import createError from "../utils/createError.js"

export const  deleteUser = async (req, res,next)=>{
    let user = await userModel.findById(req.params.id);
    if(user){
        if(req.userId !== user._id.toString()){
            return next((createError(403, "you can only delete your own account")));
        }
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send("user deleted");
    }else{
        return next(createError(404, "user not found"))
    }

}

export const getUser = async (req, res, next)=>{
    try{
        let user = await userModel.findById(req.params.id);
        if(user){
            return res.status(200).send(user);
        }else{
            next(createError(404, "user not found"));
        }
    }catch(err){
        next(err);
    }
}

export const updateUser = async (req, res, next)=>{
    if(req.params.id!==req.userId){
        return next(createError(403, "you can only update your own account"));
    }
    try{

        await userModel.findByIdAndUpdate(req.params.id,{
            $set: req.body
        });
        res.status(200).send("you are now a freelancer")
        
    }catch(err){
        next(err)
    }
}
export const deleteCv = async (req,res,next)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if(!user){
            return next(createError(404, "user not found"))
        }
        if(req.params.id!==req.userId){
            return next(createError(403, "you can only delete your own cv"))
        }
        user.cv=""
        await user.save()
        return res.status(200).send("cv deleted")
    }catch(err){
        next(err)
    }
}

export const deleteCertificate = async (req, res, next)=>{
    try{
        const user = await userModel.findById(req.params.id);
        if(!user){
            return next(createError(404, "user not found"))
        }
        if(req.params.id!==req.userId){
            return next(createError(403, "you can only delete your own certificate"))
        }
        user.certificates.splice(req.body.certificateIndex,1)
        await user.save()
        return res.status(200).send("certificate deleted")
    }catch(err){
        next(err)
    }
}
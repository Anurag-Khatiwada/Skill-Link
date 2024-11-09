import jwt from "jsonwebtoken";
import createError from "../utils/createError.js"

export const verifyToken =  (req, res, next)=>{
    const token = req.cookies.accessToken;
    if(!token){return next(createError(403, "you are not authenticated"))};

     jwt.verify(token, process.env.JWT_KEY, (err, playload)=>{
        req.userId = playload.id;
        req.isFreelancer = playload.isFreelancer;
        next();
    });
}

export default verifyToken;
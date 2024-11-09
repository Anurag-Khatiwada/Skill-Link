import jwt from "jsonwebtoken";

const generateToken = (newUser)=>{
    return jwt.sign({id: newUser._id, isFreelancer: newUser.isFreelancer}, process.env.JWT_KEY);
}

export default generateToken;
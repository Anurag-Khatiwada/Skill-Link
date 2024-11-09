import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import createError from "../utils/createError.js"

export const register = async (req, res, next)=>{
   try{
        console.log("req received", req.body);
        let {username, email, password, img, country, phone, desc, isFreelancer} = req.body;
        let find= await userModel.findOne({email});
        if(!find){
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(password, salt, async function(err, hash){

                    let newUser = new userModel({
                        username,
                        email,
                        password: hash,
                        img,
                        country,
                        phone,
                        desc,
                        isFreelancer
                    })
                    await newUser.save();
                    let token = generateToken(newUser);
                    res.cookie("accessToken", token, {httpOnly: true});
                    const {password, ...info} = newUser._doc;
                    res.status(200).send(info);

                })
            })
        }else{
            return next(createError(409, "user already exist"));
        }
   }catch (err){
        next(err);
    }
}

export const login = async (req, res, next)=>{
    try{
        let { username, password} = req.body;
        let user = await userModel.findOne({username});

        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(result){
                    let token = generateToken(user);
                    res.cookie("accessToken", token, {httpOnly: true});
                   
                }else{
                    return next(createError(400, "Invalid username or password"));
                }
                const {password, ...info} = user._doc;
                res.status(200).send(info);
            })
        }else{
            return next(createError(404, "User not found"));
        }
    }catch (err){
     next(err);
    }
}

export const logout = async (req, res, next)=>{
    try{
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure: true
        });

        res.status(200).send("successfully Logged out");
    }catch (err){
        return next(err);
    }
}
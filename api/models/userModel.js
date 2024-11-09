import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true

    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 8,
        max: 30
    },
    img:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: false
    },
    desc:{
        type: String,
        required: false
    },
    isFreelancer: {
        type: Boolean,
        default: false
    },
    skills: {
        type: [String], 
        required: false,
    },
    certificates: {
        type: [String], 
        required: false,
    },
    cv: {
        type: String, 
        required: false,
    },

        
},
    {timestamps: true}
)

export default mongoose.model("User", userSchema);
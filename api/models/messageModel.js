import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

    conversationId: {
        type: String,
        required: true
    },
    userId: {   
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: false
    }
        
},
    {timestamps: true}
)

export default mongoose.model("Message", messageSchema);
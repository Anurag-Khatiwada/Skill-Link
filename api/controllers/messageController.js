import createError from "../utils/createError.js";
import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js"

export const createMessage = async (req, res, next)=>{


    const newMessage = new messageModel({
        conversationId: req.body.conversationId,
        userId: req.userId,
        desc: req.body.desc,

    })
    try{
        const savedMessage = await newMessage.save();
        await conversationModel.findOneAndUpdate({
            id: req.body.conversationId},
            {
                $set: {
                    readBySeller: req.isFreelancer,
                    readByBuyer: !req.isFreelancer,
                    lastMessage: req.body.desc
                }
            },
            {new: true}
        )
       res.status(200).send(savedMessage)

    }catch(err){
        next(err);
    }
}



// export const getMessages = async (req, res, next)=>{

//     try{
//        const messages = await messageModel.find({conversationId: req.params.id});
//        res.status(200).send(messages)
//     }catch(err){
//         next(err);
//     }
// }

// export const getMessages = async (req, res, next) => {
//     try {
//       console.log(`Fetching messages for conversationId: ${req.params.id}`);
      
//       const messages = await messageModel.find({ conversationId: req.params.id });
  
//       if (!messages.length) {
//         return res.status(404).send({ message: 'No messages found for this conversation.' });
//       }
  
//       const messagesWithUser = await Promise.all(
//         messages.map(async (message) => {
//           try {
//             const user = await userModel.findById(message.userId, 'img'); // Select only the img field
//             return {
//               ...message._doc,
//               userImg: user?.img || null, // Attach the user image to the message
//             };
//           } catch (err) {
//             console.error(`Error fetching user data for userId: ${message.userId}`, err);
//             throw err;
//           }
//         })
//       );
  
//       res.status(200).send(messagesWithUser);
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//       next(err); // Send to error handler middleware
//     }
//   };

export const getMessages = async (req, res, next) => {
    try {
      console.log(`Fetching messages for conversationId: ${req.params.id}`);
  
      // Fetch messages for the given conversationId
      const messages = await messageModel.find({ conversationId: req.params.id });
  
      if (!messages.length) {
        return res.status(404).send({ message: 'No messages found for this conversation.' });
      }
  
      // Get conversation details to fetch both buyerId and sellerId
      const conversation = await conversationModel.findOne({ id: req.params.id });
      if (!conversation) {
        return res.status(404).send({ message: 'Conversation not found.' });
      }
  
      const receiverId = conversation.sellerId === req.userId ? conversation.buyerId : conversation.sellerId;
  
      // Fetch sender and receiver details
      const sender = await userModel.findById(req.userId, 'img'); // Sender is the current user (from the request)
      const receiver = await userModel.findById(receiverId, 'img'); // Receiver is based on the conversation
  
      // Map messages with sender and receiver images
      const messagesWithUsers = messages.map((message) => ({
        ...message._doc,
        senderImg: sender?.img || "/default-profile.png", // Sender image (current user)
        receiverImg: receiver?.img || "/default-profile.png", // Receiver image (other user)
      }));
  
      res.status(200).send(messagesWithUsers);
    } catch (err) {
      console.error('Error fetching messages:', err);
      next(err); // Send to error handler middleware
    }
  };
  
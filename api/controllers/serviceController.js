import serviceModel from "../models/serviceModel.js";
import userModel from "../models/userModel.js";
import createError from "../utils/createError.js";

export const createService = async (req, res, next) => {
    try {
        // Check if the user is a freelancer
        if (!req.isFreelancer) {
            return next(createError(403, "Only freelancers can create a service."));
        }

        // Create a new service instance
        const newService = new serviceModel({
            userId: req.userId,
            ...req.body
        });

        // Save the new service to the database
        const savedService = await newService.save();
        return res.status(201).json(savedService);
    } catch (err) {
        next(err); // Pass any errors to the error handling middleware
    }
};

export const deleteService = async (req, res, next) => {
    try {
        const service = await serviceModel.findById(req.params.id);
        if (!service) {
            return next(createError(404, "Service not found."));
        }

        // Check if the user is authorized to delete the service
        if (service.userId.toString() !== req.userId) {
            return next(createError(403, "You can only delete your own service."));
        }

        await serviceModel.findByIdAndDelete(req.params.id);
        return res.status(200).send("Service has been deleted.");
    } catch (err) {
        next(err);
    }
};

export const getService = async (req, res, next) => {
    try {
        const service = await serviceModel.findById(req.params.id);
        if (!service) {
            return next(createError(404, "Service not found."));
        }
        return res.status(200).send(service);
    } catch (err) {
        next(err);
    }
};

// export const getServices = async (req, res, next) => {
//     const q = req.query;
//     console.log(q)
//     const filters = {
//         ...(q.userId && { userId: q.userId }),
//         ...(q.cat && { cat: { $regex: `^${q.cat.trim()}$`, $options: "i" } }), // Case-insensitive and exact match
//         ...((q.min || q.max) && { price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) } }),
//         ...(q.search && { title: { $regex: q.search, $options: "i" } })
//       };
//     console.log(filters)

//     try {
//         const services = await serviceModel.find(filters).sort({ [q.sort]: -1 });

//         if (services.length === 0) {
//             return next(createError(404, "No services found."));
//         }
//         return res.status(200).send(services);
//     } catch (err) {
//         next(err);
//     }
// };

export const getServices = async (req, res, next) => {
    const q = req.query;
  
    const filters = {
      ...(q.userId && { userId: q.userId }),
      ...(q.cat && { cat: { $regex: `^${q.cat.trim()}$`, $options: "i" } }), // Matches category exactly (case-insensitive)
      ...(q.search && {
        $or: [
          { title: { $regex: q.search, $options: "i" } }, // Matches title (case-insensitive)
          { cat: { $regex: q.search, $options: "i" } },   // Matches category (case-insensitive)
        ] 
      }),
      ...((q.min || q.max) && { price: { ...(q.min && { $gt: q.min }), ...(q.max && { $lt: q.max }) } }),
    };
  
    try {
      const services = await serviceModel.find(filters).sort({ [q.sort]: -1 });
      if (services.length === 0) {
        return next(createError(404, "No services found."));
      }
      //Manually populating user data
      const servicesWithUserData = await Promise.all(
        services.map(async (service)=>{
            const user = await userModel.findById(service.userId);
            return{
                ...service._doc,
                user:{
                    username: user.username,
                    img: user.img,
                }
            }
        })
      )
      return res.status(200).send(servicesWithUserData);
    } catch (err) {
      next(err);
    }
  };
  




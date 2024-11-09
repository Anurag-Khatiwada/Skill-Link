// import serviceModel from "../models/serviceModel.js";
// import createError from "../utils/createError.js";


// export const createService = async (req, res, next)=>{
//     try{
//         // let {title, desc, totalStars, starNumber, cat, price, cover, images, shortTitle, shortDesc, deliveryTime, features, sales} = req.body;
//         if(!req.isFreelancer){
//             next(createError(403, "only frellencer can create service"))
//         }
//         const newService = new serviceModel({
//             userId: req.userId,
//             ...req.body
            
//         });
//         const savedService = await newService.save();
//         res.status(201).json(savedService)

//     }catch(err){
//         next(err);

//     }
// }


// export const deleteService = async (req, res, next)=>{
//     try{
//         console.log(req.params.id);
//         const service = await serviceModel.findById(req.params.id);
//         if(!service){
//             next(createError(404, "service not found"))
//         }
//         if(service.userId !== req.userId) 
//             {
//                 return next(createError(403, "you can only delete you service"));
//             }    
//         await serviceModel.findByIdAndDelete(req.params.id);
//         return res.status(200).send("service has been deleted");
//     }catch(err){
//         next(err)
//     }
// }

// export const getService = async (req, res, next)=>{
//     console.log(req)
//     try{
//         const service = await serviceModel.findById(req.params.id);

//         if(!service){
//             next(createError(404, "service not found:"));
//         };
//         res.status(200).send(service);
//     }catch (err){
//         next(err);
//     }
// }

// export const getServices = async (req, res, next)=>{
//     const q = req.query;
//     const filters = {
//         ...(q.userId && {userId: q.userId }),
//         ...(q.cat && {cat: q.cat}),
//         ...((q.min || q.max) && {price: {...(q.min && {$gt: q.min}), ...(q.max && {$lt: q.max})}}),
//         ...(q.search && {title: {$regex: q.search, $options: "i"}})
//     }
//     try{
//         const services =await serviceModel.find(filters).sort({[q.sort]: -1})
//         if(services.length  === 0){
//             next(createError(404, "no services found"));
//         }
//         res.status(200).send(services);
//     }catch (err){
//         next(err);
//     }
// }


import serviceModel from "../models/serviceModel.js";
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

export const getServices = async (req, res, next) => {
    const q = req.query;
    const filters = {
        ...(q.userId && { userId: q.userId }),
        ...(q.cat && { cat: q.cat }),
        ...((q.min || q.max) && {price: {...(q.min && {$gt: q.min}), ...(q.max && {$lt: q.max})}}),
        ...(q.search && { title: { $regex: q.search, $options: "i" } })
    };

    try {
        const services = await serviceModel.find(filters).sort({ [q.sort]: -1 });

        if (services.length === 0) {
            return next(createError(404, "No services found."));
        }
        return res.status(200).send(services);
    } catch (err) {
        next(err);
    }
};




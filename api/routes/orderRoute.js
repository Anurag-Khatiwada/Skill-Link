import express from "express";
import verifyToken from "../middleware/jwt.js";
import { getOrders, checkOrderCompletion, intent, confirm} from "../controllers/orderController.js"

const router = express.Router();


router.get('/', verifyToken, getOrders);
router.post('/create-payment-intent/:id', verifyToken, intent);
router.put('/', verifyToken, confirm);
router.get("/checkCompleted/:serviceId",verifyToken, checkOrderCompletion)



export default router;
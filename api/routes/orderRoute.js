import express from "express";
import verifyToken from "../middleware/jwt.js";
import { getOrders, checkOrderCompletion, intent, confirm, orderStatusUpdate, cancelOrder} from "../controllers/orderController.js"

const router = express.Router();


router.get('/', verifyToken, getOrders);
router.post('/create-payment-intent/:id', verifyToken, intent);
router.put('/', verifyToken, confirm);
router.get("/checkCompleted/:serviceId",verifyToken, checkOrderCompletion)
router.put("/updateOrder/:orderId", verifyToken,orderStatusUpdate)
router.put("/cancelOrder/:orderId", verifyToken, cancelOrder)



export default router;
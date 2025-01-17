import express from "express";
import { createService, deleteService, getService, getServices} from "../controllers/serviceController.js"
import { verifyToken } from "../middleware/jwt.js"

const router = express.Router();

router.post('/', verifyToken, createService);
router.delete('/:id', verifyToken, deleteService);
router.get('/single/:id', getService);
router.get('/', getServices);




export default router;
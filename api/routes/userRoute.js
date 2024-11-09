import express from "express";
import { deleteUser,deleteCv,deleteCertificate, getUser, updateUser } from "../controllers/userController.js"
import verifyToken from "../middleware/jwt.js"


const router = express.Router();

router.delete('/:id', verifyToken, deleteUser);
router.get('/:id', getUser);
router.put('/:id',verifyToken, updateUser);
router.put('/:id/deleteCertificate',verifyToken, deleteCertificate);
router.put('/:id/deleteCv',verifyToken, deleteCv);



export default router;
import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.js";


const router = Router()

router.get('/api/v1/profile', verifyToken, UserController.profile)

router.put('/api/v1/updateUser', verifyToken, UserController.updateUser)

export default router;
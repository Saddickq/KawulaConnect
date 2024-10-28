import { Router } from "express";
import MessageController from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/api/v1/get-messages", verifyToken, MessageController.getMessages)

export default router;

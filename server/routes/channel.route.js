import { Router } from "express";
import ChannelController from "../controllers/channel.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/api/channels", verifyToken, ChannelController.createNewChannel);

router.get("/api/get-user-channels", verifyToken, ChannelController.getUserChannels)

export default router;
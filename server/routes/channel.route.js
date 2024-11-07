import { Router } from "express";
import ChannelController from "../controllers/channel.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/api/channels", verifyToken, ChannelController.createNewChannel);

router.get("/api/get-user-channels", verifyToken, ChannelController.getUserChannels)

router.get("/api/get-channel-messages/:channelId", ChannelController.getChannelsMessages)

export default router;
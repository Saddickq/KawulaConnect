import { Router } from "express";
import multer from "multer";
import MessageController from "../controllers/message.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const router = Router();

const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

const uploadsDir = path.resolve(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/api/v1/upload_file",
  verifyToken,
  upload.single("file"),
  MessageController.uploadFile
);

router.post("/api/v1/get-messages", verifyToken, MessageController.getMessages);

export default router;

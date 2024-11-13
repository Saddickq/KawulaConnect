import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

class MessageController {
  static async getMessages(req, res) {
    try {
      const user1 = req.userId;
      const user2 = req.body.id;
      if (!user1 || !user2) {
        return res.status(400).json({ message: "Both user ids are required" });
      }

      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
      }).sort({ createdAt: 1 });

      return res.status(200).json({ messages });
    } catch (error) {
      console.log(error);
      return res.json(500).json({ message: "Internal Server Error" });
    }
  }

  static async uploadFile(req, res) {
    try {
      const image = req.file.path;
      const result = await cloudinary.uploader.upload(image, {
        folder: "Kawula",
      });
      fs.unlinkSync(image);
      res.json({ url: result.secure_url });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default MessageController;

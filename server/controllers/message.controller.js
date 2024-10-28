import Message from "../models/message.model.js";

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
      }).sort({ timestamp: 1 });

      return res.status(200).json({ messages });
    } catch (error) {
      console.log(error);
      return res.json(500).json({ message: "Internal Server Error" });
    }
  }
}

export default MessageController

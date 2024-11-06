import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

class ChannelController {
  static async createNewChannel(req, res) {
    try {
      const { name, members } = req.body;
      const userId = req.userId;

      const admin = await User.findById(userId);
      if (!admin) {
        return res.status(400).json({ message: "Admin user not found" });
      }
      const validMembers = await User.find({ _id: { $in: members } });
      if (validMembers.length !== members.length) {
        return res
          .status(400)
          .json({ message: "Some members are not valid users" });
      }

      const newChannel = new Channel({ name, admin: userId, members });
      await newChannel.save();

      return res.status(201).json({ channel: newChannel });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async getUserChannels(req, res) {
    try {
      const userId = req.userId;
      const channels = await Channel.find({
        $or: [{ admin: userId }, { members: userId }],
      }).sort({ updatedAt: -1 });

      return res.status(200).json({ channels });
    } catch (error) {
      return res.json(500).json({ message: "Internal Server Error" });
    }
  }
}

export default ChannelController;

import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

class ContactController {
  static async searchContact(req, res) {
    try {
      const { searchTerm } = req.body;
      const userId = req.userId;
      const regex = new RegExp(searchTerm, "i");

      const contacts = await User.find({
        $and: [
          { _id: { $ne: userId } },
          {
            $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
          },
        ],
      });
      if (contacts.length === 0) {
        return res
          .status(404)
          .json({ message: "No contact was found for your search" });
      }
      return res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({ message: "Couldn't find search results" });
    }
  }

  static async getContactFromDM(req, res) {
    try {
      let userId = req.userId;
      userId = new mongoose.Types.ObjectId(userId);
      const contacts = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { receiver: userId }],
          },
        },
        {
          $sort: { timestamp: -1 },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", userId] },
                then: "$receiver",
                else: "$sender",
              },
            },
            lastMessageTime: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "contactInfo",
          },
        },
        {
          $unwind: "$contactInfo",
        },
        {
          $project: {
            _id: 1,
            lastMessageTime: 1,
            email: "$contactInfo.email",
            firstName: "$contactInfo.firstName",
            lastName: "$contactInfo.lastName",
            image: "$contactInfo.image",
            profileSetup: "$contactInfo.profileSetup",
            color: "$contactInfo.color",
          },
        },
        {
          $sort: { lastMessageTime: -1 },
        },
      ]);
      return res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({ message: "Couldn't find search results" });
    }
  }
}

export default ContactController;

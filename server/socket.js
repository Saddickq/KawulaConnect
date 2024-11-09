import { Server } from "socket.io";
import Message from "./models/message.model.js";
import Channel from "./models/channel.model.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: ["http://localhost:5173", "https://kawulaconnect.netlify.app"],
      methods: ["GET", "POST"],
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client disconnected ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendChannelMessage = async (message) => {
    const { sender, channelId, content, messageType, fileURL } = message;

    const createdMessage = await Message.create({
      sender,
      receiver: null,
      content,
      fileURL,
      messageType,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName avatar color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveChannelMessage", finalData);
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName avatar color")
      .populate("receiver", "id email firstName lastName avatar color");

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  io.on("connect", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with ${socket.id}`);
    } else {
      console.log("userId wasn't provided during handshake");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;

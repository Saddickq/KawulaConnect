import { Server } from "socket.io";
import Message from "./models/message.model.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      credentials: true,
      origin: "http://localhost:5173",
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

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("receiver", "id email firstName lastName image color");

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
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;

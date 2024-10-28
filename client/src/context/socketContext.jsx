import { useAppStore } from "@/pages/store";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      const handleReceiveMessage = (message) => {
          const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();
          if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.receiver._id)
        ) {
            console.log(message)
            addMessage(message)
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("connect", () =>
        console.log("Connected to socket server")
      );
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

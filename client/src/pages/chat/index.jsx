import React, { useEffect } from "react";
import { useAppStore } from "../store";
import MessagesContainer from "./components/MessagesContainer";
import ChatsContainer from "./components/ChatsContainer";
import ContactsContainer from "./components/ContactsContainer";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { userInfo, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="h-screen overflow-hidden">
      <div
        className={`grid h-full "grid-cols-1 ${
          selectedChatType
            ? "grid-cols-1 md:grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-3"
        }`}
      >
        {/* Contacts Container */}
        <div className={`col-span-1 h-screen w-full bg-slate-800 ${selectedChatType ? "hidden md:block" : ""}`}>
          <ContactsContainer />
        </div>
  
        {/* Conditionally render ChatsContainer or MessagesContainer based on selectedChatType */}
        {selectedChatType ? (
          // MessagesContainer takes up 2 columns when a chat is selected
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <MessagesContainer />
          </div>
        ) : (
          // ChatsContainer takes up 2 columns if no chat is selected
          <div className="col-span-2 md:col-span-2">
            <ChatsContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

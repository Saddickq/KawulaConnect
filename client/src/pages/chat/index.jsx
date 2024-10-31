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
      <div className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <div
          className={`col-span-1 h-screen w-full bg-slate-800 ${
            selectedChatType ? "hidden md:block" : ""
          }`}
        >
          <ContactsContainer />
        </div>

        {selectedChatType ? (
          <div className="col-span-1 relative md:col-span-2 lg:col-span-3">
            <MessagesContainer />
          </div>
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <ChatsContainer />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

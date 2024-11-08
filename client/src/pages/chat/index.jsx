import React, { useEffect } from "react";
import { useAppStore } from "../store";
import MessagesContainer from "./components/MessagesContainer";
import ChatsContainer from "./components/ChatsContainer";
import ContactsContainer from "./components/ContactsContainer";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isDownloading,
    isUploading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="h-screen overflow-hidden">
      {isUploading && (
        <div className="h-full w-full text-neutral-200 fixed top-0 z-[100] left-0 bg-black/80 flex gap-4 items-center justify-center flex-col backdrop-blur-lg">
          <h3 className="text-5xl animate-pulse">Uploding File</h3>
          <h6 className="text-2xl">{fileUploadProgress}%</h6>
        </div>
      )}
      {isDownloading && (
        <div className="h-full w-full text-neutral-200 fixed top-0 z-[100] left-0 bg-black/80 flex gap-4 items-center justify-center flex-col backdrop-blur-lg">
          <h3 className="text-5xl animate-pulse">Downloading File</h3>
          <h6 className="text-2xl">{fileDownloadProgress}%</h6>
        </div>
      )}
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

import { useAppStore } from "@/pages/store";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

const MessageField = () => {
  const scrollRef = useRef();
  const {
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data, status } = await axios.post("/api/v1/get-messages", {
          id: selectedChatData._id,
        });
        if (data.messages && status === 200) {
          setSelectedChatMessages(data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const RenderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = message.createdAt ? format(new Date(message.createdAt), "yyyy-MM-dd") : "";
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      
      return (
        <div key={index} ref={scrollRef}>
          {showDate && (
            <div className="text-center text-neutral-500 my-2">
              {format(new Date(message.createdAt), "PP")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`${
          message.sender !== selectedChatData._id ? "text-right" : "text-left"
        }`}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-slate-800 text-neutral-100"
                : "bg-slate-200 text-neutral-900"
            } inline-block shadow-lg py-3 px-4 my-2 rounded-lg max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        <div className="text-xs text-gray-800">
          {format(message.createdAt, "p")}
        </div>
      </div>
    );
  };
  return (
    <div
      className="flex-1 overflow-y-auto p-4 px-8 w-full"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <RenderMessages/>
    </div>
  );
};

export default MessageField;

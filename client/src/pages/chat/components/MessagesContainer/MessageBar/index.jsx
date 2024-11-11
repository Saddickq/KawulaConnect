import { IoSend } from "react-icons/io5";
import { TiAttachmentOutline } from "react-icons/ti";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/pages/store";
import { useSocket } from "@/context/socketContext";
import axios from "axios";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [emojiRef]);

  const handleSendMessage = () => {
    if (message && selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        receiver: selectedChatData._id,
        content: message,
        messageType: "text",
        fileURL: undefined,
      });
    } else if (message && selectedChatType === "channel") {
      socket.emit("sendChannelMessage", {
        sender: userInfo._id,
        channelId: selectedChatData._id,
        content: message,
        messageType: "text",
        fileURL: undefined,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const { data, status } = await axios.post(
          "/api/v1/upload_file",
          formData,
          {
            onUploadProgress: (data) => {
              setFileUploadProgress(
                Math.round((data.loaded * 100) / data.total)
              );
            },
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (data.url && status === 200) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: userInfo._id,
              receiver: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileURL: data.url,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("sendChannelMessage", {
              sender: userInfo._id,
              channelId: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileURL: data.url,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error(error);
    }
  };
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] flex justify-center items-center w-full mb-2 md:mb-4 gap-3 md:gap-6">
      <div className="flex-1 max-w-[80%] lg:max-w-[70%] flex border border-slate-800 rounded-xl justify-center items-center gap-2 md:gap-5 pr-2 md:pr-5">
        <input
          className="flex-1 flex p-3 md:px-4 py-2 bg-transparent rounded-xl focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="text-slate-800 cursor-pointer hover:opacity-85 transition-all duration-300"
          onClick={handleAttachmentClick}
        >
          <TiAttachmentOutline className="size-5 md:size-7 " />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <MdOutlineEmojiEmotions
          onClick={() => setEmojiPickerOpen(true)}
          className="size-5 md:size-7 text-slate-800 hover:opacity-85 transition-all duration-300 cursor-pointer"
        />
        <div className="absolute right-50 bottom-20" ref={emojiRef}>
          <EmojiPicker
            theme="light"
            autoFocusSearch={false}
            open={emojiPickerOpen}
            onEmojiClick={handleAddEmoji}
          />
        </div>
      </div>
      <button
        className="bg-slate-800 p-3 rounded-xl hover:opacity-85 transition-all duration-300"
        onClick={handleSendMessage}
      >
        <IoSend className="text-neutral-100 size-5" />
      </button>
    </div>
  );
};

export default MessageBar;

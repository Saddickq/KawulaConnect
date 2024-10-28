import { IoSend } from "react-icons/io5";
import { TiAttachmentOutline } from "react-icons/ti";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/pages/store";
import { useSocket } from "@/context/socketContext";

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const emojiRef = useRef(null);

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
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        receiver: selectedChatData._id,
        content: message,
        messageType: "text",
        fileURL: undefined,
      });
      setMessage("")
    }
  };

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className="h-[10vh] flex justify-center bg-red items-center mx-16 mb-4 gap-6">
      <div className="flex-1 flex border border-slate-800 rounded-xl justify-center items-center gap-5 pr-5">
        <input
          className="flex-1 flex px-4 py-2 bg-transparent rounded-xl focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <TiAttachmentOutline className="size-7 text-slate-800 cursor-pointer hover:opacity-85 transition-all duration-300" />
        <MdOutlineEmojiEmotions
          onClick={() => setEmojiPickerOpen(true)}
          className="size-7 text-slate-800 hover:opacity-85 transition-all duration-300 cursor-pointer"
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

import { useAppStore } from "@/pages/store";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { IoArrowDownCircle, IoCloseSharp } from "react-icons/io5";
import RenderChannelMessages from "./RenderChannelMessages";
import RenderDMMessages from "./RenderDMMessages";
import { downLoadFile } from "@/pages/chat/helpers/fileHelper";

const MessageField = () => {
  const scrollRef = useRef();
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);

  const {
    selectedChatMessages,
    selectedChatData,
    selectedChatType,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
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
    const getChannelMessages = async () => {
      try {
        const { data, status } = await axios.get(
          `/api/get-channel-messages/${selectedChatData._id}`
        );
        if (data.messages && status === 200) {
          setSelectedChatMessages(data.messages);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData._id, selectedChatType]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const RenderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index} ref={scrollRef} className="mt-4">
          {showDate && (
            <div className="text-center text-neutral-500 my-2">
              {format(new Date(message.createdAt), "PP")}
            </div>
          )}
          {selectedChatType === "contact" && (
            <RenderDMMessages
              message={message}
              setShowImage={setShowImage}
              setImageURL={setImageURL}
            />
          )}
          {selectedChatType === "channel" && (
            <RenderChannelMessages
              message={message}
              setShowImage={setShowImage}
              setImageURL={setImageURL}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 md:px-8 w-full"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <RenderMessages />
      {showImage && (
        <div className="fixed flex flex-col left-0 top-0 w-full h-full z-30 items-center bg-black/50 backdrop-blur-md justify-center duration-500 transition-all">
          <div className="mb-5 flex gap-10">
            <button
              className="hover:bg-black/55 cursor-pointer rounded-full"
              onClick={() =>
                downLoadFile(
                  imageURL,
                  setIsDownloading,
                  setFileDownloadProgress,
                  setIsDownloading
                )
              }
            >
              <IoArrowDownCircle className="size-8 text-neutral-200" />
            </button>

            <button
              className="cursor-pointer hover:bg-black/55 rounded-full"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp className="size-8 text-neutral-200" />
            </button>
          </div>
          <div className="md:max-h-[70%] md:max-w-[70%]">
            <img
              className="object-cover"
              src={imageURL}
              alt="photo"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageField;

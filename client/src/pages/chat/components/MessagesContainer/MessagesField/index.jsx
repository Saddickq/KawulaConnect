import { useAppStore } from "@/pages/store";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { IoArrowDownCircle, IoCloseSharp } from "react-icons/io5";
import { MdFolderZip } from "react-icons/md";

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
    if (selectedChatData._id) {
      if (selectedChatData._id && selectedChatType === "contact") getMessages();
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

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|svg|gif|png|webp|ico|tiff|bmp)$/i;
    return imageRegex.test(filePath);
  };

  const downLoadFile = async (fileURL) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await axios.get(`/uploads/${fileURL}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const percentDownloaded = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setFileDownloadProgress(percentDownloaded);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileURL);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
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
            } inline-block shadow-lg py-3 px-4 my-2 rounded-lg max-w-[60%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-slate-800 text-slate-100"
                : "bg-slate-200 text-slate-900"
            } inline-block shadow-lg p-2 md:py-3 md:px-4 my-2 rounded-lg max-w-[70%] md:max-w-[60%] break-words`}
          >
            {checkIfImage(message.fileURL) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileURL);
                }}
              >
                <img
                  className="max-h-56 object-contain"
                  src={`http://localhost:3000/uploads/${message.fileURL}`}
                  alt="uploaded file"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span>
                  <MdFolderZip className="size-7" />
                </span>
                <span className="text-xs md:text-base">{message.fileURL}</span>
                <span
                  className="hover:bg-gray-200/55 cursor-pointer rounded-full duration-500 transition-all"
                  onClick={() => downLoadFile(message.fileURL)}
                >
                  <IoArrowDownCircle className="size-7" />
                </span>
              </div>
            )}
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
      <RenderMessages />
      {showImage && (
        <div className="fixed flex flex-col left-0 top-0 w-full h-full z-30 items-center bg-black/50 backdrop-blur-md justify-center duration-500 transition-all">
          <div className="mb-5 flex gap-10">
            <button
              className="hover:bg-black/55 cursor-pointer rounded-full"
              onClick={() => downLoadFile(imageURL)}
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

          <div>
            <img
              className="max-h-xl md:max-h-4xl object-cover"
              src={`http://localhost:3000/uploads/${imageURL}`}
              alt="photo"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageField;

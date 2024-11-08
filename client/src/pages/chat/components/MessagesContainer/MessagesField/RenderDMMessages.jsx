import { useAppStore } from "@/pages/store";
import { format } from "date-fns";
import { checkIfImage, downLoadFile } from "@/pages/chat/helpers/fileHelper";
import { MdFolderZip } from "react-icons/md";
import { IoArrowDownCircle } from "react-icons/io5";

const RenderDMMessages = ({ message, setShowImage, setImageURL }) => {
  const {
    selectedChatData,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

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
                onClick={() =>
                  downLoadFile(
                    message.fileURL,
                    setIsDownloading,
                    setFileDownloadProgress,
                    setIsDownloading
                  )
                }
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

export default RenderDMMessages;

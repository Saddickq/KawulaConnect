import { useAppStore } from "@/pages/store";
import { format } from "date-fns";
import { getColor } from "@/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { checkIfImage, downLoadFile } from "@/pages/chat/helpers/fileHelper";
import { MdFolderZip } from "react-icons/md";
import { IoArrowDownCircle } from "react-icons/io5";

const RenderChannelMessages = ({ message, setShowImage, setImageURL }) => {
  const {
    userInfo,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  return (
    <div
      className={`${
        message.sender._id !== userInfo._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender._id === userInfo._id
              ? "bg-slate-800 text-neutral-100"
              : "bg-slate-200 text-neutral-900"
          } inline-block shadow-lg text-sm md:text-base py-3 px-4 my-2 rounded-lg max-w-[60%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender._id === userInfo._id
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
                src={message.fileURL}
                alt="uploaded file"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <span>
                <MdFolderZip className="size-7" />
              </span>
              <span className="text-xs truncate md:text-base">{message.fileURL.split('/').pop()}</span>
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
      {message.sender._id !== userInfo._id ? (
        <div className="flex items-center justify-start gap-2 my-1">
          <Avatar className="w-5 h-5 overflow-hidden rounded-full">
            {message.sender.avatar ? (
              <AvatarImage src={message.sender.avatar} />
            ) : (
              <div
                className={`uppercase w-5 h-5 text-sm flex justify-center items-center rounded-full ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </div>
            )}
          </Avatar>

          <span className="text-slate-800 text-sm">
            {message.sender.firstName} {message.sender.lastName}
          </span>
          <span className="text-slate-800 text-xs">
            {format(message.createdAt, "p")}
          </span>
        </div>
      ) : (
        <div className="text-xs text-gray-800">
          {format(message.createdAt, "p")}
        </div>
      )}
    </div>
  );
};

export default RenderChannelMessages;

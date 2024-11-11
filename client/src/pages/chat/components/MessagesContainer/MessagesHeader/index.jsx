import { useAppStore } from "@/pages/store";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RiCloseFill } from "react-icons/ri";
import { getColor } from "@/utils";

const MessageHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-slate-800 flex justify-between items-center px-6 md:px-12">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-4 md:gap-8 items-center justify-center">
          {selectedChatType === "contact" ? (
            <>
              <Avatar className="w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-full">
                {selectedChatData.avatar ? (
                  <AvatarImage src={selectedChatData.avatar} />
                ) : (
                  <div
                    className={`uppercase w-12 h-12 text-lg flex justify-center items-center cursor-pointer rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              <div className="flex flex-col">
                {selectedChatData.profileSetup ? (
                  <span className="text-slate-800 text-lg md:text-xl">
                    {`${selectedChatData.firstName} ${selectedChatData.lastName}`}
                  </span>
                ) : (
                  <span className="text-xs">{selectedChatData.email}</span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-white text-xl h-12 w-12 flex items-center justify-center bg-slate-800 font-semibold rounded-full">
                #
              </div>
              <span className="text-slate-800 text-xl">
                {selectedChatData.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="focus:border-none focus:outline-none focus:text-slate-700 text-neutral-500 transition-all duration-300">
            <RiCloseFill className="text-3xl" onClick={closeChat} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
